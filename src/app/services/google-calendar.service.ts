import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { CLOUD_CONFIG } from "../app.config";

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarService {
  private cloudConfig = inject(CLOUD_CONFIG);
  private tokenClient: any;
  private accessToken: string | null = null;

  constructor(private firestore: Firestore) {}

  async initGoogleAPI(): Promise<void> {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.cloudConfig.clientId,
      scope: this.cloudConfig.scopes,
      callback: async (response: any) => {
        const { access_token, refresh_token, error } = response;

        if (error) {
          console.error('Erro na autenticação:', error);
          return;
        }

        if (refresh_token) {
          console.log('Refresh token recebido:', refresh_token);
          await this.storeToken('client', 'userId-placeholder', undefined, access_token, refresh_token);
        } else {
          console.warn('Nenhum refresh token foi retornado pela API.');
        }

        this.accessToken = access_token;
        console.log('Token de acesso recebido:', access_token);
      },
    });

    console.log('Google Identity Services inicializado.');
  }

  private async storeToken(
    userType: 'client' | 'barber',
    userId: string,
    barbeariaId?: string,
    accessToken?: string,
    refreshToken?: string
  ): Promise<void> {
    let tokenPath: string;

    if (userType === 'client') {
      tokenPath = `users/${userId}`;
    } else if (userType === 'barber' && barbeariaId) {
      tokenPath = `barbearia/${barbeariaId}/barbers/${userId}`;
    } else {
      throw new Error('Caminho inválido para salvar o token.');
    }

    const tokenDocRef = doc(this.firestore, tokenPath);

    const tokenData: any = {};
    if (accessToken) tokenData.accessToken = accessToken;
    if (refreshToken) tokenData.refreshToken = refreshToken;

    await setDoc(tokenDocRef, tokenData, { merge: true });
    console.log(`Tokens armazenados em ${tokenPath}`);
  }

  async ensureAuthenticated(
    userType: 'client' | 'barber',
    userId: string,
    barbeariaId?: string
  ): Promise<void> {
    let tokenPath: string;

    if (userType === 'client') {
      tokenPath = `users/${userId}`;
    } else if (userType === 'barber' && barbeariaId) {
      tokenPath = `barbearia/${barbeariaId}/barbers/${userId}`;
    } else {
      throw new Error('Caminho inválido para autenticação.');
    }

    const tokenDocRef = doc(this.firestore, tokenPath);
    const tokenDoc = await getDoc(tokenDocRef);

    if (tokenDoc.exists()) {
      const { refreshToken } = tokenDoc.data();
      if (refreshToken) {
        console.log('Token de atualização encontrado no Firestore.');
        this.accessToken = await this.refreshAccessToken(refreshToken);
      } else {
        console.warn('Nenhum refresh_token encontrado no Firestore.');
        await this.requestToken(userType, userId, barbeariaId, true); // Força o prompt novamente
      }
    } else {
      console.warn('Nenhum token encontrado no Firestore.');
      await this.requestToken(userType, userId, barbeariaId, true); // Força o prompt novamente
    }
  }

  private async requestToken(
    userType: 'client' | 'barber',
    id: string,
    barbeariaId?: string,
    forcePrompt: boolean = false
  ): Promise<void> {
    this.tokenClient.callback = async (response: any) => {
      const { access_token, refresh_token } = response;

      if (refresh_token) {
        console.log('Salvando refresh token no Firestore.');
        await this.storeToken(userType, id, barbeariaId, access_token, refresh_token);
      } else {
        console.warn('Nenhum refresh token foi retornado pela API.');
      }

      this.accessToken = access_token;
    };

    this.tokenClient.requestAccessToken({
      prompt: forcePrompt ? 'consent' : 'none',
      access_type: 'offline',
    });
  }

  private async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: this.cloudConfig.clientId,
          client_secret: this.cloudConfig.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Falha ao renovar token: ${error.error?.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      console.log('Novo token de acesso gerado via refresh token:', data.access_token);
      return data.access_token;
    } catch (error) {
      console.error('Erro ao renovar token de acesso:', error);
      throw new Error('Erro ao realizar a renovação do token. Verifique os logs.');
    }
  }

  async createEventForBarber(event: any, barbeariaId: string, barberId: string): Promise<any> {
    await this.ensureAuthenticated('barber', barberId, barbeariaId);

    if (!this.accessToken) {
      throw new Error('Token de acesso inválido.');
    }

    return this.executeGoogleCalendarRequest('POST', 'primary/events', event);
  }

  private async executeGoogleCalendarRequest(method: string, path: string, body?: any): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Token de acesso não encontrado.');
    }

    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro no Google Calendar: ${error.error.message}`);
    }

    return response.json();
  }

  async deleteEvent(
    eventId: string,
    userType: 'client' | 'barber',
    id: string,
    barbeariaId?: string
  ): Promise<void> {
    await this.ensureAuthenticated(userType, id, barbeariaId);

    if (!this.accessToken) {
      throw new Error('Token de acesso inválido.');
    }

    await this.executeGoogleCalendarRequest('DELETE', `primary/events/${eventId}`);
  }
}

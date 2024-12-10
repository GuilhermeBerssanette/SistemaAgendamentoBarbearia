import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarService {
  private clientId = '228837673406-hned74oa8euov22mv1tkffeuald53k7s.apps.googleusercontent.com';
  private scopes = 'https://www.googleapis.com/auth/calendar.events';
  private tokenClient: any;
  private accessToken: string | null = null;
  private clientAccessToken: string | null = null;


  constructor(private firestore: Firestore) {}

  async initGoogleAPI(): Promise<void> {
    try {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: this.scopes,
        callback: (response: any) => {
          if (response.error) {
            console.error('Erro na autenticação:', response.error);
            return;
          }
          this.accessToken = response.access_token;
          console.log('Token recebido com sucesso:', this.accessToken);
        },
      });

      console.log('Google Identity Services inicializado com sucesso.');
    } catch (error) {
      console.error('Erro ao inicializar Google Identity Services:', error);
    }
  }

  public async ensureClientAuthenticated(): Promise<void> {
    if (!this.clientAccessToken) {
      await new Promise<void>((resolve, reject) => {
        this.tokenClient.callback = async (response: any) => {
          if (response.error) {
            console.error('Erro na autenticação do cliente:', response.error);
            reject(new Error('Erro na autenticação do cliente.'));
            return;
          }

          this.clientAccessToken = response.access_token;
          console.log('Token do cliente recebido com sucesso:', this.clientAccessToken);
          resolve();
        };

        this.tokenClient.requestAccessToken();
      });
    }
  }

  public async ensureBarberAuthenticated(barbeariaId: string, barbeiroId: string): Promise<void> {
    const barberDocRef = doc(this.firestore, `barbearia/${barbeariaId}/barbers/${barbeiroId}`);
    const barberDoc = await getDoc(barberDocRef);

    if (barberDoc.exists()) {
      const barberData = barberDoc.data();
      const barberToken = barberData?.['token'];

      if (!barberToken || !(await this.isTokenValid(barberToken))) {
        console.log('Token do barbeiro inválido ou não encontrado. Solicitando novo token...');
        await this.requestBarberToken(barbeariaId, barbeiroId);
      } else {
        console.log('Token do barbeiro válido carregado:', barberToken);
      }
    } else {
      throw new Error('Documento do barbeiro não encontrado.');
    }
  }

  private async isTokenValid(token: string): Promise<boolean> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token);
      return response.ok;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  }


  private async getBarbershopAddress(barbeariaId: string): Promise<string | null> {
    const barbeariaDocRef = doc(this.firestore, `barbearia/${barbeariaId}`);
    const barbeariaDoc = await getDoc(barbeariaDocRef);
    if (barbeariaDoc.exists()) {
      const barbeariaData = barbeariaDoc.data();
      if (barbeariaData?.['estado'] && barbeariaData?.['cidade'] && barbeariaData?.['rua']) {
        const { estado, cidade, rua, numero } = barbeariaData;
        const address = numero
          ? `${rua}, ${numero}, ${cidade}, ${estado}`
          : `${rua}, ${cidade}, ${estado}`;
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      }
    }
    return null;
  }
  private async requestBarberToken(barbeariaId: string, barbeiroId: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.tokenClient.callback = async (response: any) => {
        if (response.error) {
          console.error('Erro na autenticação do barbeiro:', response.error);
          reject(new Error('Erro na autenticação do barbeiro.'));
          return;
        }

        const barberToken = response.access_token;
        console.log('Token do barbeiro recebido:', barberToken);

        try {
          const barberDocRef = doc(this.firestore, `barbearia/${barbeariaId}/barbers/${barbeiroId}`);
          await setDoc(barberDocRef, { token: barberToken }, { merge: true });
          resolve();
        } catch (error) {
          console.error('Erro ao salvar o token do barbeiro no Firestore:', error);
          reject(error);
        }
      };

      this.tokenClient.requestAccessToken();
    });
  }





  async createEvent(
    event: any,
    barbeariaId: string,
    barbeiroId: string,
    clientName: string,
    serviceOrCombo: string,
    isCombo: boolean
  ): Promise<any> {
    await this.ensureClientAuthenticated();

    if (!this.clientAccessToken) {
      throw new Error('Token de acesso do cliente está undefined ou inválido. Verifique o processo de autenticação.');
    }

    const mapsLink = await this.getBarbershopAddress(barbeariaId);
    if (mapsLink) {
      event.location = mapsLink;
    }
    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.clientAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Erro ao criar evento no Google Calendar do cliente:', error);
        throw new Error(`Erro ao criar evento: ${error.error.message}`);
      }

      const result = await response.json();
      console.log('Evento criado com sucesso no Google Calendar do cliente:', result);

      const appointmentRef = doc(
        this.firestore,
        `barbearia/${barbeariaId}/barbers/${barbeiroId}/appointments/${result.id}`
      );
      await setDoc(appointmentRef, {
        client: clientName,
        start: event.start.dateTime,
        end: event.end.dateTime,
        googleEventId: result.id,
        serviceOrCombo: serviceOrCombo,
        type: isCombo ? 'combo' : 'service',
      });

      return result;
    } catch (error) {
      console.error('Erro ao criar evento no Google Calendar do cliente:', error);
      throw error;
    }
  }


  async createEventForBarber(event: any, barberId: string, barbeariaId: string): Promise<any> {
    await this.ensureBarberAuthenticated(barbeariaId, barberId);

    const barberDocRef = doc(this.firestore, `barbearia/${barbeariaId}/barbers/${barberId}`);
    const barberDoc = await getDoc(barberDocRef);
    const barberToken = barberDoc.data()?.['token'];

    if (!barberToken) {
      throw new Error(`Token do barbeiro ${barberId} está vazio ou não encontrado.`);
    }

    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${barberToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Erro ao criar evento no Google Calendar do barbeiro:', error);
        throw new Error(`Erro ao criar evento: ${error.error.message}`);
      }

      const result = await response.json();
      console.log('Evento criado no Google Calendar do barbeiro:', result);

      return result;
    } catch (error) {
      console.error('Erro ao criar evento no Google Calendar do barbeiro:', error);
      throw error;
    }
  }


  async deleteEvent(eventId: string): Promise<void> {
    await this.ensureClientAuthenticated();

    if (!this.accessToken) {
      throw new Error('Access token não encontrado ou inválido.');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erro ao deletar evento: ${error.error.message}`);
      }

      console.log('Evento deletado com sucesso no Google Calendar.');
    } catch (error) {
      console.error('Erro ao deletar evento no Google Calendar:', error);
      throw error;
    }
  }
}

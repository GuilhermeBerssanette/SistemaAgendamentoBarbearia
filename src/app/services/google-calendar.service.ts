import {Injectable} from '@angular/core';
import {doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore';

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
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: this.scopes,
        callback: (response: any) => {
          if (response.error) {
            return;
          }
          this.accessToken = response.access_token;
        },
      })
  }

  public async ensureClientAuthenticated(): Promise<void> {
    if (!this.clientAccessToken) {
      await new Promise<void>(() => {
        this.tokenClient.callback = async (response: any) => {
          if (response.error) {
            return;
          }
          this.clientAccessToken = response.access_token;
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
        await this.requestBarberToken(barbeariaId, barbeiroId);
      } else {
        return;
      }
    }
  }

  private async isTokenValid(token: string): Promise<boolean> {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token);
      return response.ok;
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
    await new Promise<void>((resolve) => {
      this.tokenClient.callback = async (response: any) => {
        if (response.error) {
          return;
        }

        const barberToken = response.access_token;


          const barberDocRef = doc(this.firestore, `barbearia/${barbeariaId}/barbers/${barbeiroId}`);
          await setDoc(barberDocRef, { token: barberToken }, { merge: true });
          resolve();
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

      const result = await response.json();

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
    }


  async createEventForBarber(event: any, barberId: string, barbeariaId: string): Promise<any> {
    await this.ensureBarberAuthenticated(barbeariaId, barberId);

    const barberDocRef = doc(this.firestore, `barbearia/${barbeariaId}/barbers/${barberId}`);
    const barberDoc = await getDoc(barberDocRef);
    const barberToken = barberDoc.data()?.['token'];

    if (!barberToken) {
      throw new Error(`Token do barbeiro ${barberId} está vazio ou não encontrado.`);
    }


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

    return await response.json();
  }

}

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GoogleCalendarService } from '../../../../../services/google-calendar.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-modal-confirmation-order',
  templateUrl: './modal-confirmation-order.component.html',
  styleUrls: ['./modal-confirmation-order.component.scss'],
  imports: [FormsModule, DatePipe, MatIcon],
  standalone: true,
})
export class ModalConfirmationOrderComponent {
  userName: string = '';
  isProcessing: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ModalConfirmationOrderComponent>,
    private calendarService: GoogleCalendarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  async confirmOrder() {
    if (this.isProcessing) {
      console.log('Já está processando o agendamento. Aguarde...');
      return;
    }

    this.isProcessing = true;

    try {
      const localDate = new Date(this.data.date);
      localDate.setHours(0, 0, 0, 0);

      const event = {
        summary: `Agendamento: Barbearia`,
        location: 'Barbearia',
        description: `Serviço: ${this.data.serviceName}`,
        start: {
          dateTime: `${localDate.toISOString().split('T')[0]}T${this.data.time}:00`,
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: `${localDate.toISOString().split('T')[0]}T${this.addDurationToTime(
            this.data.time,
            this.data.duration
          )}:00`,
          timeZone: 'America/Sao_Paulo',
        },
      };

      const clientEvent = await this.calendarService.createEvent(
        event,
        this.data.barbeariaId,
        this.data.barberId,
        this.userName,
        this.data.serviceName,
        this.data.type === 'combo'
      );

      console.log('Evento criado no Google Calendar do cliente:', clientEvent);

      const barberEvent = await this.calendarService.createEventForBarber(
        event,
        this.data.barberId,
        this.data.barbeariaId
      );

      console.log('Evento criado no Google Calendar do barbeiro:', barberEvent);

      alert('Agendamento confirmado com sucesso!');
      this.dialogRef.close();
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      alert('Erro ao confirmar o agendamento. Verifique os logs.');
    } finally {
      this.isProcessing = false;
    }
  }

  private addDurationToTime(time: string, duration: number): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + duration);
    return date.toTimeString().slice(0, 5);
  }

  onClose(){
    this.dialogRef.close()
  }
}

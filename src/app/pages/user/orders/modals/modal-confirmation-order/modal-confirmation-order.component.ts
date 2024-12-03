import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GoogleCalendarService } from '../../../../../services/google-calendar.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modal-confirmation-order',
  templateUrl: './modal-confirmation-order.component.html',
  styleUrls: ['./modal-confirmation-order.component.scss'],
  imports: [FormsModule, DatePipe],
  standalone: true,
})
export class ModalConfirmationOrderComponent {
  userName: string = ''; // Adicionando a propriedade userName
  isProcessing: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ModalConfirmationOrderComponent>,
    private calendarService: GoogleCalendarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async confirmOrder() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const localDate = new Date(this.data.date);
      localDate.setHours(0, 0, 0, 0);

      const event = {
        summary: `Agendamento: ${this.data.serviceName}`,
        location: 'Barbearia',
        description: `Cliente: ${this.userName}`, // Incluindo o nome do usuário
        start: {
          dateTime: `${localDate.toISOString().split('T')[0]}T${this.data.time}:00`,
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: `${localDate.toISOString().split('T')[0]}T${this.addDurationToTime(this.data.time, this.data.duration)}`,
          timeZone: 'America/Sao_Paulo',
        },
      };

      await this.calendarService.createEventForBarber(event, this.data.barbeariaId, this.data.barberId);
      alert('Agendamento confirmado com sucesso!');
      this.dialogRef.close();
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      alert('Erro ao confirmar o agendamento.');
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
}

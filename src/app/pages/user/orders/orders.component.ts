import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GoogleCalendarService } from '../../../services/google-calendar.service';
import { ModalConfirmationOrderComponent } from './modals/modal-confirmation-order/modal-confirmation-order.component';
import { NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [NgIf, NgForOf],
})
export class OrdersComponent implements OnInit {
  availableSlots: string[] = [];
  selectedServiceDuration = 30;
  selectedDate: Date | null = null;
  todayString: string = '';
  serviceName!: string;
  barberName!: string;
  servicePrice!: number;
  barbeariaId!: string;
  barberId!: string;
  currentUserId!: string;

  constructor(
    private calendarService: GoogleCalendarService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private firestore: Firestore,
    private auth: Auth
  ) {}

  async ngOnInit() {
    this.barbeariaId = this.route.snapshot.paramMap.get('id')!;
    this.barberId = this.route.snapshot.paramMap.get('barberId')!;

    const queryParams = this.route.snapshot.queryParams;
    this.serviceName = queryParams['serviceName'];
    this.servicePrice = parseFloat(queryParams['price']);
    this.selectedServiceDuration = parseInt(queryParams['duration'], 10);
    this.barberName = queryParams['barberName'];

    if (!this.barbeariaId || !this.barberId) {
      console.error('IDs da barbearia ou do barbeiro não encontrados!');
      return;
    }

    const user = this.auth.currentUser;
    if (!user) {
      console.error('Usuário não autenticado!');
      return;
    }
    this.currentUserId = user.uid;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.todayString = today.toISOString().split('T')[0];
    this.selectedDate = new Date(today);

    await this.calendarService.initGoogleAPI();
    await this.calendarService.ensureClientAuthenticated();

    await this.updateAvailableSlots(this.selectedDate);
  }

  async updateAvailableSlots(date: Date) {
    const cleanDate = new Date(date);
    cleanDate.setHours(0, 0, 0, 0);
    const bookedSlots = await this.getBookedSlots(cleanDate);
    this.generateAvailableSlots(cleanDate, bookedSlots);
  }

  async getBookedSlots(date: Date): Promise<string[]> {
    const bookedSlots: string[] = [];
    const dateString = date.toISOString().split('T')[0];

    const appointmentsCollectionRef = collection(
      this.firestore,
      `barbearia/${this.barbeariaId}/barbers/${this.barberId}/appointments`
    );

    const appointmentsSnapshot = await getDocs(appointmentsCollectionRef);

    appointmentsSnapshot.forEach(doc => {
      const appointment = doc.data();
      const appointmentStart = new Date(appointment['start']);
      const appointmentDate = new Date(appointmentStart);
      appointmentDate.setHours(0, 0, 0, 0);

      if (appointmentDate.toISOString().split('T')[0] === dateString) {
        const timeString = appointmentStart.toTimeString().slice(0, 5);
        bookedSlots.push(timeString);
      }
    });

    return bookedSlots;
  }

  generateAvailableSlots(date: Date, bookedSlots: string[]) {
    this.availableSlots = [];
    const startTime = new Date(date);
    startTime.setHours(9, 0, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(17, 0, 0, 0);

    const now = new Date();
    now.setHours(now.getHours(), now.getMinutes(), 0, 0);

    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().slice(0, 5);

      if (date.getTime() === now.setHours(0, 0, 0, 0)) {
        if (currentTime < now || bookedSlots.includes(timeString)) {
          currentTime = new Date(currentTime.getTime() + this.selectedServiceDuration * 60000);
          continue;
        }
      } else if (bookedSlots.includes(timeString)) {
        currentTime = new Date(currentTime.getTime() + this.selectedServiceDuration * 60000);
        continue;
      }

      this.availableSlots.push(timeString);
      currentTime = new Date(currentTime.getTime() + this.selectedServiceDuration * 60000);
    }

    console.log(`Horários disponíveis para ${date.toDateString()}:`, this.availableSlots);
  }

  async onDateChange(event: any) {
    const selectedDate = new Date(event.target.value);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate >= new Date(this.todayString)) {
      this.selectedDate = selectedDate;
      await this.updateAvailableSlots(selectedDate);
    } else {
      alert('Não é possível selecionar uma data anterior a hoje!');
    }
  }

  openConfirmationModal(slot: string) {
    this.dialog.open(ModalConfirmationOrderComponent, {
      data: {
        date: this.selectedDate,
        time: slot,
        serviceName: this.serviceName,
        barberName: this.barberName,
        servicePrice: this.servicePrice,
        duration: this.selectedServiceDuration,
        barbeariaId: this.barbeariaId,
        barberId: this.barberId,
      },
    });
  }
}

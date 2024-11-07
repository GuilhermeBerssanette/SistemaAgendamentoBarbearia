import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { ModalConfirmationOrderComponent } from "./modals/modal-confirmation-order/modal-confirmation-order.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  selectedDate: Date | null = null;
  availableTimes: string[] = [];
  serviceDuration!: number;
  todayString: string = '';
  barberName!: string;
  serviceName!: string;
  servicePrice!: number;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.todayString = today.toISOString().split('T')[0];
    this.selectedDate = today;
    this.route.queryParams.subscribe(params => {
      this.serviceName = params['serviceName'];
      this.barberName = params['barberName'];
      this.serviceDuration = +params['duration'];
      this.servicePrice = +params['price'];
      this.generateAvailableTimes();
    });
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const dateString = input.value;
    this.selectedDate = dateString ? new Date(dateString) : null;
    if (this.selectedDate) {
      this.generateAvailableTimes();
    }
  }

  generateAvailableTimes() {
    const startHour = 9;
    const endHour = 18;
    this.availableTimes = [];

    if (!this.selectedDate) return;

    const today = new Date();
    const isToday = this.selectedDate.toDateString() === today.toDateString();

    let startTime = new Date(this.selectedDate);

    if (isToday) {
      startTime = new Date();
      startTime.setSeconds(0, 0);
      if (startTime.getMinutes() % 5 !== 0) {
        startTime.setMinutes(startTime.getMinutes() + (5 - startTime.getMinutes() % 5));
      }
    } else {
      startTime.setHours(startHour, 0, 0, 0);
    }

    const endTime = new Date(this.selectedDate);
    endTime.setHours(endHour, 0, 0, 0);

    while (startTime < endTime) {
      const endOfService = new Date(startTime);
      endOfService.setMinutes(startTime.getMinutes() + this.serviceDuration);

      if (endOfService <= endTime) {
        this.availableTimes.push(startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }

      startTime.setMinutes(startTime.getMinutes() + this.serviceDuration);
      if (!isToday || startTime > today) {
        startTime.setMinutes(Math.ceil(startTime.getMinutes() / 5) * 5);
      }
    }
  }

  openModalConfirmationOrder(time: string) {
    const dialogRef = this.dialog.open(ModalConfirmationOrderComponent, {
      width: '400px',
      data: {
        selectedTime: time,
        barberName: this.barberName,
        serviceName: this.serviceName,
        servicePrice: this.servicePrice
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmAppointment(time);
      }
    });
  }

  confirmAppointment(time: string) {
    this.availableTimes = this.availableTimes.filter(t => t !== time);
    alert(`Agendamento confirmado para ${time} com ${this.barberName} (${this.serviceName})`);
  }
}

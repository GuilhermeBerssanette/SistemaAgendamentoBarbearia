import { Component, Input, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CurrencyPipe, NgIf, NgForOf],
})
export class DashboardComponent implements OnInit {
  @Input() barbeariaId!: string;
  @Input() barbeiroId!: string;
  monthlyProfit: number | null = null;
  haircutsCompleted: number | null = null;
  appointmentsDetails: Array<{ date: string; barber: string; revenue: number }> = [];


  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    console.log('Dashboard carregado para a barbearia:', this.barbeariaId);
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    if (!this.barbeariaId) {
      console.error('ID da barbearia não encontrado!');
      return;
    }

    try {
      const barbersCollectionRef = collection(this.firestore, `barbearia/${this.barbeariaId}/barbers`);
      const barbersSnapshot = await getDocs(barbersCollectionRef);

      let totalProfit = 0;
      let totalAppointments = 0;
      const appointmentDetails: Array<{ date: string; barber: string; revenue: number }> = [];

      for (const barberDoc of barbersSnapshot.docs) {
        const barberData = barberDoc.data();
        const barberEmail = barberData['email']; // Presumindo que o email está salvo no documento do barbeiro

        const appointmentsCollectionRef = collection(
          this.firestore,
          `barbearia/${this.barbeariaId}/barbers/${barberDoc.id}/appointments`
        );
        const appointmentsSnapshot = await getDocs(appointmentsCollectionRef);

        for (const appointmentDoc of appointmentsSnapshot.docs) {
          const appointmentData = appointmentDoc.data();
          const appointmentDate = new Date(appointmentData['date']).toLocaleDateString('pt-BR');
          const appointmentRevenue = appointmentData['price'] || 0;

          totalProfit += appointmentRevenue;
          totalAppointments += 1;

          appointmentDetails.push({
            date: appointmentDate,
            barber: barberEmail,
            revenue: appointmentRevenue,
          });
        }
      }

      this.monthlyProfit = totalProfit;
      this.haircutsCompleted = totalAppointments;
      this.appointmentsDetails = appointmentDetails;
    } catch (error) {
      console.error('Erro ao carregar os dados do dashboard:', error);
    }
  }
}

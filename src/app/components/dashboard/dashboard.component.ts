import { Component, Input, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { NgIf, NgForOf, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [NgChartsModule, NgIf, NgForOf, CurrencyPipe],
})
export class DashboardComponent implements OnInit {
  @Input() barbeariaId!: string;
  @Input() barbeiroId?: string;

  // Campos de Resumo
  monthlyProfit: number | null = null;
  haircutsCompleted: number | null = null;
  appointmentsDetails: Array<{ date: string; barber?: string; client: string; revenue: number }> = [];

  // Dados do Gráfico
  groupedChartLabels: string[] = [];
  groupedChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  groupedChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: { stacked: false },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 200,
        },
        suggestedMax: 1000, // Será ajustado dinamicamente
      },
    },
  };

  constructor(private firestore: Firestore) {}

  async ngOnInit(): Promise<void> {
    console.log('Dashboard carregado.');
    await this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    if (!this.barbeariaId) {
      console.error('ID da barbearia não encontrado!');
      return;
    }

    try {
      let totalProfit = 0;
      let totalAppointments = 0;
      const labels: string[] = [];
      const revenueData: number[] = [];
      const servicesData: number[] = [];
      const appointmentDetails: Array<{ date: string; barber?: string; client: string; revenue: number }> = [];

      const barbersCollectionRef = collection(this.firestore, `barbearia/${this.barbeariaId}/barbers`);
      const barbersSnapshot = await getDocs(barbersCollectionRef);

      for (const barberDoc of barbersSnapshot.docs) {
        const barberId = barberDoc.id;
        const barberName = barberDoc.data()['email'] || 'Desconhecido';
        labels.push(barberName);

        let barberRevenue = 0;
        let barberServices = 0;

        const appointmentsCollectionRef = collection(
          this.firestore,
          `barbearia/${this.barbeariaId}/barbers/${barberId}/appointments`
        );
        const appointmentsSnapshot = await getDocs(appointmentsCollectionRef);

        for (const appointmentDoc of appointmentsSnapshot.docs) {
          const appointmentData = appointmentDoc.data();
          const serviceOrComboId = appointmentData['serviceOrCombo'];
          const clientName = appointmentData['client'] || 'Desconhecido';
          const appointmentDate = new Date(appointmentData['start']).toLocaleDateString('pt-BR');

          const revenue = await this.getServiceOrComboPrice(serviceOrComboId, barberId);
          barberRevenue += revenue;
          barberServices++;

          appointmentDetails.push({
            date: appointmentDate,
            barber: barberName,
            client: clientName,
            revenue,
          });
        }

        revenueData.push(barberRevenue);
        servicesData.push(barberServices);
        totalProfit += barberRevenue;
        totalAppointments += barberServices;
      }

      this.updateGroupedChartData(labels, revenueData, servicesData);
      this.monthlyProfit = totalProfit;
      this.haircutsCompleted = totalAppointments;
      this.appointmentsDetails = appointmentDetails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Erro ao carregar os dados do dashboard:', error);
    }
  }

  async getServiceOrComboPrice(serviceOrComboId: string, barberId: string): Promise<number> {
    try {
      const comboDocRef = doc(
        this.firestore,
        `barbearia/${this.barbeariaId}/barbers/${barberId}/combos/${serviceOrComboId}`
      );
      const comboDoc = await getDoc(comboDocRef);

      if (comboDoc.exists()) return parseFloat(comboDoc.data()['price']) || 0;

      const serviceDocRef = doc(
        this.firestore,
        `barbearia/${this.barbeariaId}/barbers/${barberId}/services/${serviceOrComboId}`
      );
      const serviceDoc = await getDoc(serviceDocRef);

      if (serviceDoc.exists()) return parseFloat(serviceDoc.data()['price']) || 0;

      return 0;
    } catch (error) {
      console.error('Erro ao buscar preço de serviço ou combo:', error);
      return 0;
    }
  }

  updateGroupedChartData(labels: string[], revenueData: number[], servicesData: number[]): void {
    const maxRevenue = Math.max(...revenueData);
    const suggestedMax = Math.ceil((maxRevenue + 400) / 200) * 200;

    this.groupedChartLabels = labels;
    this.groupedChartOptions.scales = {
      ...this.groupedChartOptions.scales,
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 200,
        },
        suggestedMax,
      },
    };
    this.groupedChartData = {
      labels: this.groupedChartLabels,
      datasets: [
        {
          label: 'Renda Gerada (R$)',
          data: revenueData,
          backgroundColor: '#028090',
        },
        {
          label: 'Serviços Realizados',
          data: servicesData,
          backgroundColor: '#05668D',
        },
      ],
    };
  }
}

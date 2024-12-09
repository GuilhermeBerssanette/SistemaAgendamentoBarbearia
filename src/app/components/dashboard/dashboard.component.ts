import { Component, Input, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { NgIf, NgForOf, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [NgChartsModule, NgIf, NgForOf, CurrencyPipe],
})
export class DashboardComponent implements OnInit {
  @Input() barbeariaId!: string;
  @Input() barbeiroId?: string;

  monthlyProfit: number | null = null;
  haircutsCompleted: number | null = null;
  appointmentsDetails: Array<{ date: string; barber?: string; client: string; revenue: number }> = [];
  barberName!: string;

  // Configurações do gráfico
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
          label: tooltipItem => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true, max: 0 },
    },
  };
  groupedChartType: ChartType = 'bar';


  constructor(private firestore: Firestore) {}

  async ngOnInit(): Promise<void> {
    await this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    if (!this.barbeariaId) {
      console.error('ID da barbearia não encontrado!');
      return;
    }

    try {
      const chartDataMap = new Map<string, { revenue: number; services: number }>();

      if (this.barbeiroId) {
        const barberDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}/barbers/${this.barbeiroId}`);
        const barberDoc = await getDoc(barberDocRef);
        this.barberName = barberDoc.exists() ? barberDoc.data()['email'] || 'Desconhecido' : 'Desconhecido';

        await this.loadBarberData(this.barbeiroId, chartDataMap);
      } else {
        const barbersCollectionRef = collection(this.firestore, `barbearia/${this.barbeariaId}/barbers`);
        const barbersSnapshot = await getDocs(barbersCollectionRef);

        for (const barberDoc of barbersSnapshot.docs) {
          const barberId = barberDoc.id;
          const barberName = barberDoc.data()['email'] || 'Desconhecido';

          await this.loadBarberData(barberId, chartDataMap, barberName);
        }
      }

      this.updateGroupedChartData(chartDataMap);
    } catch (error) {
      console.error('Erro ao carregar os dados do dashboard:', error);
    }
  }

  async loadBarberData(
    barberId: string,
    chartDataMap: Map<string, { revenue: number; services: number }>,
    barberName?: string
  ) {
    const appointmentsCollectionRef = collection(
      this.firestore,
      `barbearia/${this.barbeariaId}/barbers/${barberId}/appointments`
    );
    const appointmentsSnapshot = await getDocs(appointmentsCollectionRef);

    let totalRevenue = 0;
    let totalServices = 0;

    for (const appointmentDoc of appointmentsSnapshot.docs) {
      const appointmentData = appointmentDoc.data();
      const appointmentDate = new Date(appointmentData['start']).toLocaleDateString('pt-BR');
      const clientName = appointmentData['client'] || 'Desconhecido';
      const serviceOrComboId = appointmentData['serviceOrCombo'];

      const revenue = await this.getServiceOrComboPrice(serviceOrComboId, barberId);
      totalRevenue += revenue;
      totalServices++;

      this.appointmentsDetails.push({
        date: appointmentDate,
        barber: barberName,
        client: clientName,
        revenue,
      });

      const key = this.barbeiroId ? this.barberName : barberName || 'Desconhecido';
      const currentData = chartDataMap.get(key) || { revenue: 0, services: 0 };
      chartDataMap.set(key, {
        revenue: currentData.revenue + revenue,
        services: currentData.services + 1,
      });
    }

    this.monthlyProfit = (this.monthlyProfit || 0) + totalRevenue;
    this.haircutsCompleted = (this.haircutsCompleted || 0) + totalServices;

    this.appointmentsDetails.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }



  async getServiceOrComboPrice(serviceOrComboId: string, barberId: string): Promise<number> {
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
  }

  updateGroupedChartData(chartDataMap: Map<string, { revenue: number; services: number }>): void {
    const labels = Array.from(chartDataMap.keys());
    const revenueData: number[] = [];
    const servicesData: number[] = [];

    chartDataMap.forEach(value => {
      revenueData.push(value.revenue);
      servicesData.push(value.services);
    });

    const maxRevenue = Math.max(...revenueData);
    const maxYAxis = maxRevenue + 100;

    this.groupedChartLabels = labels;
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

    this.groupedChartOptions.scales!['y'] = { ...this.groupedChartOptions.scales!['y'], max: maxYAxis };
  }
}

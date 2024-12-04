export class AppointmentMetrics {
    totalCitas: number;
    citasCompletadas: number;
    citasPendientes: number;
  }
  
  export class AppointmentsByService {
    servicio: string;
    citasProgramadas: number;
    citasCompletadas: number;
  }
  
  export class ServiceDistribution {
    servicio: string;
    porcentaje: number;
  }
  
  export class DashboardData {
    metrics: AppointmentMetrics;
    appointmentsByService: AppointmentsByService[];
    serviceDistribution: ServiceDistribution[];
  }
  
  
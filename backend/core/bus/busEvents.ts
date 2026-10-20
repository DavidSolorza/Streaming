export interface BusEvents {
  'ORDER:CREATED': {
    orderCode: string;
    customerName: string;
    customerContact?: string;
    itemsSummary: string;
    totalCop: number;
    paymentMethod: string;
  };
  'PLATFORM:MUTATED': {
    id: string;
    nombre: string;
    precio: number;
    activo: boolean;
    accion: 'CREADA' | 'ACTUALIZADA' | 'ELIMINADA';
  };
  'SECURITY:AUDIT': {
    action: string;
    ip?: string;
    status: 'SUCCESS' | 'FAILURE';
    detail?: string;
    timestamp: string;
  };
}

export type BusEventKey = keyof BusEvents;
export type BusEventListener<K extends BusEventKey> = (data: BusEvents[K]) => void | Promise<void>;

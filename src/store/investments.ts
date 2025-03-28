import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Operacion = {
  fecha: string; // ISO string
  tipo: 'compra' | 'venta';
  monto: number;
};

export type Activo = {
  tipo: string;
  total: number;
  operaciones: Operacion[];
};

export type Broker = {
  broker: string;
  total:number;
};

type InvestmentStore = {
  brokers: Broker[];
  total: number;
  setInitialData: (total:number, brokers: Broker[]) => void;
};


export const useInvestmentStore = create<InvestmentStore>()(
  persist(
    (set) => ({
      brokers: [],
      total: 0,
      setInitialData: (total, brokers) => set( {brokers, total} ),
    }),
    {
      name: 'investment-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
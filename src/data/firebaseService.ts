import { db } from './config';
import {
    collection,
    addDoc,
    Timestamp,
    getDocs,
    query,
    where,
    DocumentData,
} from 'firebase/firestore';

export type FirebaseInversion = {
    monto: number;
    tipoActivo: string;
    broker: string;
    fecha: string;
    nombre?: string;
};

type BrokerInversiones = {
    inversiones: FirebaseInversion[];
    total: number;
};

export type BrokerResumen = {
    broker: string;
    total: number;
};

type BrokersConTotales = {
    brokers: BrokerResumen[];
    totalGlobal: number;
};

type TipoActivoResumen = {
    tipoActivo: string;
    total: number;
    inversiones: any[];
};

export type TotalesPorTipoActivo = {
    activos: TipoActivoResumen[];
    totalBroker: number;
};

export async function guardarInversion(inversion: FirebaseInversion) {
    try {
        const docRef = await addDoc(collection(db, 'inversiones'), {
            ...inversion,
            createdAt: Timestamp.now(),
        });
        console.log('Inversión guardada con ID:', docRef.id);
    } catch (error) {
        console.error('Error al guardar inversión en Firestore:', error);
        throw error;
    }
}

export async function getBrokerInversiones(brokerId: string): Promise<BrokerInversiones> {
    try {
        const q = query(collection(db, 'inversiones'), where('broker', '==', brokerId));
        const querySnapshot = await getDocs(q);

        const inversiones: FirebaseInversion[] = [];
        let total = 0;

        querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;

            const inversion: FirebaseInversion = {
                monto: data.monto,
                tipoActivo: data.tipoActivo,
                broker: data.broker,
                fecha: data.fecha,
            };

            inversiones.push(inversion);
            total += data.monto;
        });

        return { inversiones, total };
    } catch (error) {
        console.error('Error al obtener inversiones del broker:', error);
        return { inversiones: [], total: 0 };
    }
}

export async function getBrokersTotales(): Promise<BrokersConTotales> {
    try {
        const snapshot = await getDocs(collection(db, 'inversiones'));
        const resumenMap = new Map<string, number>();
        let totalGlobal = 0;

        snapshot.forEach((doc) => {
            const data = doc.data();
            const broker = data.broker;
            const monto = data.monto;

            totalGlobal += monto;

            if (resumenMap.has(broker)) {
                resumenMap.set(broker, resumenMap.get(broker)! + monto);
            } else {
                resumenMap.set(broker, monto);
            }
        });

        const brokers: BrokerResumen[] = [];
        resumenMap.forEach((total, broker) => {
            brokers.push({ broker, total });
        });

        return { brokers, totalGlobal };
    } catch (error) {
        console.error('Error al obtener resumen global:', error);
        return { brokers: [], totalGlobal: 0 };
    }
}

export async function getTotalesPorTipoActivoDeBroker(
    brokerId: string
): Promise<TotalesPorTipoActivo> {
    try {
        const q = query(collection(db, 'inversiones'), where('broker', '==', brokerId));
        const snapshot = await getDocs(q);

        const resumenMap = new Map<string, { monto: number, inversiones: any[] }>();
        let totalBroker = 0;

        snapshot.forEach((doc) => {
            const data = doc.data();
            const tipo = data.tipoActivo;
            const monto = data.monto;

            totalBroker += monto;

            if (data.nombre) {
                if (resumenMap.has(data.nombre)) {
                    resumenMap.set(
                        data.nombre,
                        {
                            monto: resumenMap.get(data.nombre)!.monto + monto,
                            inversiones: [...resumenMap.get(data.nombre)!.inversiones, { monto, fecha: data.fecha }]
                        }
                    );
                } else {
                    resumenMap.set(
                        data.nombre,
                        {
                            monto,
                            inversiones: [{ monto, fecha: data.fecha }]
                        }
                    );
                }
                return 
            }

            if (resumenMap.has(tipo)) {
                resumenMap.set(
                    tipo,
                    {
                        monto: resumenMap.get(tipo)!.monto + monto,
                        inversiones: [...resumenMap.get(tipo)!.inversiones, { monto, fecha: data.fecha }]
                    }
                );
            } else {
                resumenMap.set(
                    tipo,
                    {
                        monto,
                        inversiones: [{ monto, fecha: data.fecha }]
                    }
                );
            }
        });

        const activos: TipoActivoResumen[] = [];
        resumenMap.forEach((data, tipo) => {
            activos.push({ tipoActivo: tipo, total: data.monto, inversiones: data.inversiones });
        });

        return { activos, totalBroker };
    } catch (error) {
        console.error('Error al obtener totales por tipo de activo del broker:', error);
        return { activos: [], totalBroker: 0 };
    }
}
import { db } from './config';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    Timestamp,
} from 'firebase/firestore';

type Consumo = {
    monto: number;
    categoria: string;
    descripcion: string;
    esCredito: boolean;
    cuotas: number;
    medio: string;
    esIngreso: boolean;
    esApertura: boolean;
};

export async function guardarConsumo(consumo: Consumo, idConsumo = "") {
    const fecha = new Date().toISOString().split('T')[0];
    const tipo = consumo.esCredito ? 'creditos' : 'debitos';
    const monto = consumo.esIngreso ? consumo.monto : -consumo.monto;

    // 1. Guardar en la colección correspondiente
    await addDoc(collection(db, tipo), {
        ...consumo,
        fecha,
        createdAt: Timestamp.now(),
    });

    if (tipo === "debitos") {
        if (consumo.esApertura) {
            await iniciarConsumos(monto)
        } else {
            await actualizarTotalDiario(monto, idConsumo);
        }
    }
}

function formatearFechaParaId(fecha: Date): string {
    const dd = String(fecha.getDate()).padStart(2, '0');
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const yyyy = fecha.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

export async function actualizarTotalDiario(monto: number, idConsumo: string) {
    //const hoy = new Date();
    const id = idConsumo//formatearFechaParaId(hoy);
    const docRef = doc(db, 'totales', id);
    const snap = await getDoc(docRef);

    const ahora = Timestamp.now();

    if (snap.exists()) {
        const anterior = snap.data().monto || 0;
        await setDoc(docRef, {
            ...snap.data(),
            monto: anterior + monto,
            fin: ahora,
        });
    } else {
        await setDoc(docRef, {
            inicio: ahora,
            fin: ahora,
            monto: monto,
        });
    }
}

export async function getIdConsumosActivo() {
    const docRef = doc(db, 'totales', "activo");
    const snap = await getDoc(docRef);

    if (snap.exists()) {
        return {
            ok: true,
            id: snap.data().idConsumo
        }
    }
    return {
        ok: false
    }
}

export async function setearConsumoActivo(idConsumo: string) {
    const docRef = doc(db, 'totales', "activo");
    await setDoc(docRef, {
        idConsumo
    });
}

export async function iniciarConsumos(montoInicial: number) {
    const hoy = new Date();
    const id = formatearFechaParaId(hoy);
    const ahora = Timestamp.now();

    const docRef = doc(db, 'totales', id);
    await setDoc(docRef, {
        inicio: ahora,
        fin: ahora,
        monto: montoInicial,
        montoInicio: montoInicial,
    });

    await setearConsumoActivo(id)

    console.log('Inicio de consumos registrado:', id);
}

export async function borrarConsumosDelMes() {
    const docRef = doc(db, 'totales', "activo");
    await setDoc(docRef, {
        idConsumo: ""
    });
    for (const tipo of ['creditos', 'debitos']) {
        const snap = await getDocs(collection(db, tipo));
        const deletions = snap.docs.map((docu) => deleteDoc(docu.ref));
        await Promise.all(deletions);
    }
    console.log('Consumos del mes eliminados.');
}


export async function obtenerOperaciones(
    tipo: 'debitos' | 'creditos'
): Promise<DocumentData[]> {
    try {
        const q = query(
            collection(db, tipo),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error(`Error al obtener operaciones de ${tipo}:`, error);
        return [];
    }
}

export interface OperacionConsumo {
    id: string;
    fecha: string; // formato 'YYYY-MM-DD'
    esIngreso: boolean;
    descripcion: string;
    medio: string;
    createdAt: Timestamp;
    esCredito: boolean;
    categoria: string;
    esApertura?: boolean;
    monto: number;
    cuotas: number;
}

export interface TotalesConsumos {
    id: string; // formato 'dd-mm-aaaa'
    inicio: Timestamp;
    fin: Timestamp;
    montoInicio: number;
    monto: number;
}

type OperacionesConTotales = {
    operaciones: OperacionConsumo[];
    total: TotalesConsumos | null;
};

export async function obtenerOperacionesConTotales(
    tipo: 'debitos' | 'creditos',
    idTotal: string // ej. '01/04/2025'
): Promise<OperacionesConTotales> {
    try {
        // 1. Obtener operaciones ordenadas por fecha descendente
        const q = query(collection(db, tipo), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const operaciones: any = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // 2. Obtener documento de totales por ID
        const totalSnap = await getDoc(doc(db, 'totales', idTotal));
        const total:any = totalSnap.exists()
            ? {
                id: totalSnap.id,
                ...totalSnap.data()
            }
            : null;

        return { operaciones, total };
    } catch (error) {
        console.error(`Error al obtener datos de ${tipo} y totales:`, error);
        return { operaciones: [], total: null };
    }
}
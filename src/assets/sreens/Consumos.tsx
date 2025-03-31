import { useEffect, useState } from 'react';
import { borrarConsumosDelMes, getIdConsumosActivo, obtenerOperacionesConTotales, OperacionConsumo, TotalesConsumos } from '../../data/consumosService';
import { OperacionConsumoCard } from '../components/OperacionConsumoCard';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { TiPlus } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const tabs = ["Debitos", "Creditos"];

export const Consumos = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Debitos");

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <p className="mr-1 text-5xl font-bold mb-6">Consumos</p>

      <div className="flex justify-center bg-white p-1 w-fit rounded-xl mb-4">
        <nav
          className="flex overflow-x-auto items-center p-1 space-x-1 rtl:space-x-reverse text-sm text-gray-600 rounded-xl bg-gray-500/20">
          {tabs.map((tab) => (
            <button
              className={`flex whitespace-nowrap items-center h-8 px-5 font-medium text-md rounded-lg outline-none focus:ring-2
              ${activeTab === tab ? "shadow bg-white text-black" : "text-gray-400"}`}
              key={tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          )
          )}


        </nav>
      </div>

      {activeTab === "Debitos" ? <DebitosView /> : <CreditosView />}
      <button
        onClick={() => navigate('/consumos/agregar')}
        className="fixed h-14 w-14 bottom-6 right-4 bg-gradient-to-r from-blue-500 
      to-purple-500 text-white font-bold text-xl hover:shadow-lg rounded-full flex items-center justify-center
      hover:scale-110 shadow-xl"
      >
        <TiPlus />
      </button>
    </div>
  );
}

function DebitosView() {

  const [isLoading, setisLoading] = useState(false);
  const [totalesConsumo, setTotalesConsumo] = useState<TotalesConsumos>();
  const [operaciones, setOperaciones] = useState<OperacionConsumo[]>([]);

  useEffect(() => {
    getData();
  }, [])


  const getData = async () => {

    setisLoading(true)
    const { ok, id } = await getIdConsumosActivo();

    if (ok) {
      const { operaciones, total } = await obtenerOperacionesConTotales("debitos", id)

      setTotalesConsumo(total!);
      setOperaciones(operaciones)
    }

    setisLoading(false)
  }

  const calcularPorcentaje = (montoInicial: number, montoActual: number): number => {
    if (montoActual > montoActual) return 100;
    const porcentaje = ((montoActual * 100) / montoInicial).toPrecision(2);
    return 100 - Number.parseInt(porcentaje)
  }

  const resetear = async() => {
    return Swal.fire({
      text: "¿Seguro querés resetear la cartera?",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        borrarConsumosDelMes().then(() => {
          setOperaciones([])
          setTotalesConsumo(undefined)
          Swal.fire("Borrado!", "", "success");
        });
      } 
    });
  }

  return (
    <div>
      {/*<p className="text-sm mb-2">Creado: {totalesConsumo?.inicio && format(totalesConsumo!.inicio.toDate(), "dd/MM")}</p>*/}
      {totalesConsumo?.inicio &&
        <div className='flex justify-between items-center mb-2'>
          <p className='text-sm'>
            {"Creado " + formatDistanceToNow(totalesConsumo!.inicio.toDate(), {
              addSuffix: true,
              locale: es,
            })}
          </p>
          <button 
          onClick={resetear}
          className='border border-red-500 px-2 py-1 rounded-xl text-red-500 text-sm' >
            Resetear
          </button>
        </div>
      }
      {
        isLoading ?
          <div
            className="animate-pulse bg-white h-[110px] rounded-lg mb-4 p-4"
          />
          :
          <div className="bg-white text-black p-4 rounded-lg mb-4">
            <div className="flex justify-between mb-2 text-sm">
              <span>Disponible</span>
              <span className='font-semibold'>Total: ${totalesConsumo?.montoInicio.toLocaleString() || 0}</span>
            </div>
            <div className="text-2xl font-bold">${totalesConsumo?.monto.toLocaleString() || 0}</div>
            {totalesConsumo &&
              <div className="w-full bg-gray-300 h-4 rounded mt-2 overflow-hidden relative">
                <div className="bg-green-500 h-full" style={{ width: calcularPorcentaje(totalesConsumo!.montoInicio, totalesConsumo!.monto) + "%" }}></div>
              </div>
            }
          </div>
      }

      <p className="text-xl mb-2 font-semibold">Actividad</p>

      <div className="space-y-2">
        {
          isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white h-[64px] rounded-xl"
              />
            ))
            :

            operaciones.map(op => (
              <OperacionConsumoCard
                key={op.id}
                texto={op.descripcion}
                monto={op.monto}
                tipo={op.esCredito ? "credito" : "debito"}
                cuotas={op.cuotas}
                esIngreso={op.esIngreso}
                fecha={format(op.createdAt.toDate(), "dd/mm/yyyy")}
              />
            ))
        }
      </div>

    </div>
  );
}

function CreditosView() {
  return (
    <div>
      <p className="text-sm mb-2">Desde: 01/04/2025</p>

      <div className="bg-white text-black p-4 rounded-lg mb-4">
        <div className="text-sm">Total</div>
        <div className="text-2xl font-bold">$315.000</div>
      </div>

      <p className="text-sm mb-2">Actividad</p>

      <div className="space-y-2">
        <Movimiento
          texto="Zapatillas Jordan.."
          monto={315000}
          cuotas="3 cuotas de $105.000"
          tipo="debito"
        />
      </div>

    </div>
  );
}

function Movimiento({ texto, monto, tipo, cuotas }: { texto: string; monto: number; tipo: 'debito' | 'ingreso'; cuotas?: string }) {
  return (
    <div className="bg-gray-200 text-black rounded-lg p-3 text-sm flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-lg ${tipo === 'debito' ? 'text-red-600' : 'text-green-600'}`}>
            {tipo === 'debito' ? '↓' : '↑'}
          </span>
          <span className="truncate max-w-[180px]">{texto}</span>
        </div>
        {cuotas && <div className="text-xs text-gray-600 mt-1">{cuotas}</div>}
      </div>
      <div className="font-semibold text-sm">${monto.toLocaleString('es-AR')}</div>
    </div>
  );
}
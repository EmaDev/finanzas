import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FirebaseInversion, guardarInversion } from '../../data/firebaseService';

const tipoActivoOptions = [
  'CEDEAR',
  'Accion',
  'FCI',
  'Obligacion negociable',
  'bonos',
  'cauciones',
  'cripto',
  'Billete'
];

const brokerOptions = ['IOL', 'COCOS', 'BINANCE', 'LEMON', 'BBVA', 'BILLETE'];

export default function AddInvestment() {
  const navigate = useNavigate();
  const [monto, setMonto] = useState<string>('');
  const [nombreActivo, setNombreActivo] = useState<string>('');
  const [tipoActivo, setTipoActivo] = useState('');
  const [broker, setBroker] = useState('');
  const [esEspecifico, setEsEspecifico] = useState<boolean>(false);
  const [esDolar, setEsDolar] = useState<boolean>(false);

  const formatNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, ""); // solo números
    if (!cleanValue) return "";
    return parseInt(cleanValue, 10).toLocaleString("es-ES");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatNumber(inputValue);
    setMonto(formatted);
  };

  const handleGuardar = async () => {

    const montoDolar = esDolar ? Number.parseFloat(monto.replace(/\D/g, "")) : await getCotizacion(Number.parseFloat(monto.replace(/\D/g, "")));

    const inversion: FirebaseInversion = {
      monto: montoDolar,
      tipoActivo,
      broker,
      fecha: new Date().toISOString().split('T')[0],
    };

    if (esEspecifico) {
      inversion.nombre = nombreActivo
    }
    try {
      await guardarInversion(inversion);
      // También podés guardar en el store si querés:
      // addOperacion(broker, tipoActivo, { fecha: inversion.fecha, tipo: 'compra', monto: inversion.monto });
      navigate('/inversiones');
    } catch (err) {
      alert('Error guardando la inversión');
    }
  };

  const getCotizacion = async (monto: number): Promise<number> => {
    const resp = await fetch(`https://dolarapi.com/v1/dolares/contadoconliqui`, {
      method: "GET"
    });
    const data = await resp.json();
    const valorUsd = monto / data.venta;
    return Number.parseFloat(valorUsd.toFixed(2));
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold mb-6">Agregar</h1>
      <div className="mb-4">
        <div className='flex justify-between items-center'>
          <label className="block mb-1">Monto</label>
          <div className='mb-4 flex gap-2 items-center'>
            <input id="checkbox2" type="checkbox" className="w-4 h-4 accent-purple-500"
              onChange={(e) => setEsDolar(e.target.checked)}
            />
            <label className="block" htmlFor='checkbox2'>¿Es dolar?</label>
          </div>
        </div>
        <input
          type="text"
          value={monto}
          //onChange={(e) => setMonto(e.target.value)}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 text-white rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Tipo activo</label>
        <select
          value={tipoActivo}
          onChange={(e) => setTipoActivo(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white rounded"
        >
          <option value="">Seleccionar</option>
          {tipoActivoOptions.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-1">Broker</label>
        <select
          value={broker}
          onChange={(e) => setBroker(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white rounded"
        >
          <option value="">Seleccionar</option>
          {brokerOptions.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      </div>

      <div className='mb-4 flex gap-4 items-center'>
        <input id="checkbox" type="checkbox" className="w-4 h-4 accent-purple-500"
          onChange={(e) => setEsEspecifico(e.target.checked)}
        />
        <label className="block" htmlFor='checkbox'>{"Especificar "}<span className='text-sm text-gray-400'>{"(Nombre exacto del activo)"}</span></label>
      </div>
      {
        esEspecifico &&

        <div className="mb-6">
          <label className="block mb-1">Nombre activo</label>
          <input
            type="text"
            value={nombreActivo}
            onChange={(e) => setNombreActivo(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>
      }

      <button
        onClick={handleGuardar}
        className="w-full py-2 bg-gradient-to-r from-blue-500 
        to-purple-500 text-white font-bold text-xl hover:shadow-lg rounded-xl flex items-center justify-center
        hover:scale-110"
      >
        Guardar
      </button>
    </div>
  );
}
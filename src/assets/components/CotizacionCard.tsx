import { useEffect, useState } from 'react';

interface Props {
  type: "Cripto" | "Dolar"
}
type CotizacionTipo =
  | 'mep' | 'contadoconliqui' | 'blue' | 'oficial'
  | "btc/usd" | "eth/usd" | "usd/usd" | "ars/btc";

type CotizacionData = {
  compra: number;
  venta: number;
};

const tiposDolar: { label: string; value: CotizacionTipo }[] = [
  //{ label: 'Dólar MEP', value: 'mep' },
  { label: 'Dólar Blue', value: 'blue' },
  { label: 'Dólar CCL', value: 'contadoconliqui' },
  { label: 'Dólar Oficial', value: 'oficial' },
];

const tiposCripto: { label: string; value: CotizacionTipo }[] = [
  { label: 'BTC/USD', value: 'btc/usd' },
  { label: 'ETH/USD', value: 'eth/usd' },
  { label: 'USDT/USD', value: 'usd/usd' },
  { label: 'ARS/BTC', value: 'ars/btc' },
]

export default function CotizacionCard({ type }: Props) {
  const [tipo, setTipo] = useState<CotizacionTipo>(type === "Cripto" ? "btc/usd" : 'blue');
  const [data, setData] = useState<CotizacionData | null>(null);
  const [loading, setLoading] = useState(true);

  const tipos = type === "Cripto" ? tiposCripto : tiposDolar;

  useEffect(() => {
    getData();
  }, [tipo]);


  const getData = async () => {
    setLoading(true);
    const resp = await fetch(`https://dolarapi.com/v1/${type === "Cripto" ? "exchanges/monedas" : "dolares"}/${tipo}`, {
      method: "GET"
    });
    const data = await resp.json();

    if (type === "Cripto") {
      setData({
        compra: data[0].compra,
        venta: data[0].venta
      })
    } else {
      setData({
        compra: data.compra,
        venta: data.venta
      })
    }

    setLoading(false)
  }


  return (
    <div className="bg-white rounded-xl shadow p-4 w-full max-w-sm mx-auto mt-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img
            src="https://flagcdn.com/w40/us.png"
            alt="USA flag"
            className="w-5 h-5 rounded"
          />
          <span className="font-semibold text-lg text-gray-700">
            {tipos.find((t) => t.value === tipo)?.label}
          </span>
        </div>

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as CotizacionTipo)}
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 w-fit"
        >
          {tipos.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      ) : data ? (
        <div className="flex justify-between text-sm text-gray-600">
          <div>
            <p className="text-xs">Venta</p>
            <p className="text-lg font-bold">
              ${' '}
              {data.venta.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="border-l px-4">
            <p className="text-xs">Compra</p>
            <p className="text-lg font-bold">
              ${' '}
              {data.compra.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-red-500 text-sm mt-2">Error al cargar cotización</p>
      )}
    </div>
  );
}

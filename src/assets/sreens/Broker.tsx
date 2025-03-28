import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTotalesPorTipoActivoDeBroker, TotalesPorTipoActivo } from '../../data/firebaseService';
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

export default function Broker() {
  const { id } = useParams();
  //const brokers = useInvestmentStore((state) => state.brokers);
  const [brokerData, setBrokerData] = useState<TotalesPorTipoActivo>();
  //const broker = brokers.find((b) => b.id === id);
  const [openActivo, setOpenActivo] = useState<string | null>(null);

  //if (!brokerData) return <div className="p-6 text-white">Broker no encontrado</div>;


  useEffect(() => {
    if (id) {
      getBrokerData();
    }
  }, [id])

  const getBrokerData = async () => {
    const resp = await getTotalesPorTipoActivoDeBroker(id?.toLocaleUpperCase() || "") //await getBrokerInversiones(id?.toUpperCase() || "")
    setBrokerData(resp);
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">{id?.toUpperCase()}</h1>
      <p className="text-xl mb-6">Total: $ {brokerData?.totalBroker.toLocaleString()}</p>
      <div className="space-y-4">
        {brokerData?.activos.map((activo) => (
          <div key={activo.tipoActivo} className="border border-gray-700 rounded-lg bg-white text-black">
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() =>
                setOpenActivo(openActivo === activo.tipoActivo ? null : activo.tipoActivo)
              }
            >
              <span><b>{activo.tipoActivo}:</b> $ {activo.total.toLocaleString()}</span>
              {/*<span>{openActivo === activo.tipo ? '▲' : '▼'}</span>*/}
              {(openActivo === activo.tipoActivo) ?
                <FaCaretUp />
                :
                <FaCaretDown />
              }
            </div>
            {openActivo === activo.tipoActivo && (
              <div className="px-4 pb-4">
                {activo.inversiones.map((op, idx) => (
                  <div key={idx} className="text-sm text-gray-700">
                    {op.fecha} - {"Compra"} - $ {op.monto.toLocaleString()}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
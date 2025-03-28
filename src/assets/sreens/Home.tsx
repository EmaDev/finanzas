import { useNavigate } from "react-router-dom";
import { useInvestmentStore } from "../../store/investments";
import { TiPlus } from "react-icons/ti";
import CotizacionCard from "../components/CotizacionCard";
import BrokerCard from "../components/BrokerCard";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { total, brokers } = useInvestmentStore();
  const [isLoading, setLoading] = useState<boolean>(true);

  /*const totalInversiones = brokers.reduce((acc, broker) => {
    const totalBroker = broker.activos.reduce((sum, activo) => sum + activo.total, 0);
    return acc + totalBroker;
  }, 0);*/

  useEffect(() => {
    if (brokers.length > 0) {
      setLoading(false);
    }
  }, [brokers])

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      <h1 className="text-2xl font-bold mb-4">Inversiones</h1>
      <p className="text-xl mb-6">Total: $ {total.toLocaleString()}</p>
      <div className="border-t border-gray-700 pt-2">

        <CotizacionCard type="Dolar" />
        <CotizacionCard type="Cripto" />
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Mis Brokers</h2>

          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-800 h-[72px] rounded-xl"
                />
              ))
              : brokers.map((broker) => (
                <BrokerCard
                  key={broker.broker}
                  nombre={broker.broker}
                  total={broker.total}
                  onClick={() => navigate(`/broker/${broker.broker.toLowerCase()}`)}
                />
              ))}
          </div>
        </div>
      </div>
      <div
        onClick={() => navigate('/add')}
        className="fixed h-12 w-12 bottom-6 right-6 bg-gradient-to-r from-blue-500 
          to-purple-500 text-white font-bold text-xl hover:shadow-lg rounded-full flex items-center justify-center
          hover:scale-110"
      >
        <TiPlus />
      </div>
    </div>
  );
}


import { useNavigate } from "react-router-dom";
import { TiPlus } from "react-icons/ti";
import CotizacionCard from "../components/CotizacionCard";
import BrokerCard from "../components/BrokerCard";
import { useEffect, useState } from "react";
import { BrokerResumen, getBrokersTotales } from "../../data/firebaseService";
import { FaCaretDown } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [brokers, setBrokers] = useState<BrokerResumen[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getInversiones();
  }, [])

  const getInversiones = async () => {
    setLoading(true);
    const { totalGlobal, brokers } = await getBrokersTotales();
    setTotal(totalGlobal)
    setBrokers(brokers);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      <h1 className="font-bold mb-4 flex gap-3 items-end">
        <span className="text-5xl ">Inversiones</span>
        <FaCaretDown className="text-3xl"/>
      </h1>
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
                  className="animate-pulse bg-white h-[72px] rounded-xl"
                />
              ))
              : brokers.map((broker) => (
                <BrokerCard
                  key={broker.broker}
                  nombre={broker.broker}
                  total={broker.total}
                  onClick={() => navigate(`/inversiones/broker/${broker.broker.toLowerCase()}`)}
                />
              ))}
          </div>
        </div>
      </div>
      <div
        onClick={() => navigate('/inversiones/add')}
        className="fixed h-14 w-14 bottom-6 right-4 bg-gradient-to-r from-blue-500 
          to-purple-500 text-white font-bold text-xl hover:shadow-lg rounded-full flex items-center justify-center
          hover:scale-110 shadow-xl"
      >
        <TiPlus />
      </div>
    </div>
  );
}


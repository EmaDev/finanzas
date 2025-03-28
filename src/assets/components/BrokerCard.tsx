type BrokerCardProps = {
    nombre: string;
    total: number;
    onClick: () => void;
  };
  
  export default function BrokerCard({ nombre, total, onClick }: BrokerCardProps) {
    return (
      <div
        onClick={onClick}
        className="bg-white text-gray-800 p-4 rounded-xl shadow-sm flex justify-between items-center cursor-pointer hover:shadow transition"
      >
        <div>
          <div className="flex items-center gap-2 font-medium text-base">
            <span className="text-blue-500">↩</span>
            <span>{nombre}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">{nombre.toUpperCase()}</div>
        </div>
  
        <div className="text-lg font-bold text-right text-gray-900">
          ${' '}
          {total.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
    );
  }
  
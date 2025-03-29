import { IoIosArrowRoundUp } from "react-icons/io";
import Swal from 'sweetalert2'
interface Props {
    texto: string;
    monto: number;
    fecha: string;
    tipo: 'debito' | 'credito';
    esIngreso: boolean;
    cuotas?: number
}

export const OperacionConsumoCard = ({ texto, monto, esIngreso, fecha }: Props) => {

    const verMasInfo = () => {
        return Swal.fire({
            showCancelButton: false,
            showConfirmButton: false,
            html: `
            <div class="text-black text-sm font-medium w-full text-start">
                <p>Fecha: ${fecha}</p>
                <p>Descripcion: ${texto}</p>
                <p>Monto: <span class="font-bold">$${monto.toLocaleString('es-AR')}</span></p>
            </div>
            `
        });
    }

    return (
        <div 
        onClick={verMasInfo}
        className="bg-gray-200 text-black rounded-lg p-3 text-sm flex justify-between items-center">
            <div>
                <div className="flex items-center gap-2">
                    <span className={`text-lg ${esIngreso ? 'text-green-600' : 'text-red-600'}`}>
                        {esIngreso ?

                            <IoIosArrowRoundUp size={"28px"}
                                className="rotate-45"
                            />
                            :
                            <IoIosArrowRoundUp size={"28px"}
                                className="-rotate-135"
                            />
                        }
                    </span>
                    <span className="truncate max-w-[180px] font-medium"
                    >{texto}</span>
                </div>
                {/*cuotas && <div className="text-xs text-gray-600 mt-1">{cuotas}</div>*/}
            </div>
            <div className="font-bold text-md">${monto.toLocaleString('es-AR')}</div>
        </div>
    )
}

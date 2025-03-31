import { useEffect, useState } from 'react';
import { FaCaretRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import { getIdConsumosActivo, obtenerOperacionesConTotales } from '../../data/consumosService';

export const Home = () => {

    //const [isLoading, setisLoading] = useState(false);
    const [totales, setTotal] = useState<{ inicio: number; actual: number }>();
    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, [])


    const getData = async () => {

        //setisLoading(true)
        const { ok, id } = await getIdConsumosActivo();

        if (ok) {
            const { total } = await obtenerOperacionesConTotales("debitos", id)

            setTotal({
                inicio: total?.montoInicio || 0,
                actual: total?.monto || 0
            })
        }

        //setisLoading(false)
    }


    return (
        <div className='min-h-screen bg-black text-white p-6'>
            <h3 className='font-medium text-lg mb-6'>¿A qué modulo querés ingresar?</h3>

            <div className='w-full bg-white p-3 rounded-lg text-black' >
                <div className='flex justify-between items-center'
                    onClick={() => navigate("/consumos")}
                >
                    <p className='font-bold'>Consumos</p>
                    <FaCaretRight className='text-xl' />
                </div>
                <div className='bg-gray-100 p-3 rounded-lg'>
                    <div className='pb-3 border-b'>
                        <p>Disponible</p>
                        <p className='text-2xl font-bold'>$ {totales?.actual.toLocaleString()}</p>
                    </div>
                    <div className='flex justify-between items-center font-semibold'>
                        <p>Total:</p>
                        <p>$ {totales?.inicio.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className='mt-6 w-full bg-white p-3 rounded-lg text-black' >
                <div className='flex justify-between items-center'
                    onClick={() => navigate("/inversiones")}
                >
                    <p className='font-bold'>Inversiones</p>
                    <FaCaretRight className='text-xl' />
                </div>
                <div className='bg-gray-100 p-3 rounded-lg'>
                    <div className='pb-3 border-b'>
                        <p>Total</p>
                        <p className='text-2xl font-bold'>******</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

import { useState } from 'react';
import { MdAttachMoney } from "react-icons/md";
import { guardarConsumo } from '../../data/consumosService';

const categorias = [
    'Transporte', 'Servicios', 'Entrenimiento', 'Viajes', 'Deportes', 'Comida',
    'Regalos', 'Educacion', 'Salud', 'Otros', 'Apertura'
];
const cuotasDisponibles = [1, 2, 3, 4, 6, 12, 18];
const medios = ['Mercado Pago', 'Go Cuotas', 'Bancario', 'Otro'];

export const AddConsumo = () => {
    const [monto, setMonto] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [esCredito, setEsCredito] = useState(false);
    const [cuotas, setCuotas] = useState(1);
    const [medio, setMedio] = useState('');
    const [esIngreso, setEsIngreso] = useState(false);

    const formatNumber = (value: string) => {
        const cleanValue = value.replace(/\D/g, ""); // solo números
        if (!cleanValue) return "";

        const number = parseInt(cleanValue, 10);

        return number.toLocaleString("es-ES", {
            minimumFractionDigits: 0,
            useGrouping: true, // ✅ fuerza el separador
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const formatted = formatNumber(inputValue);
        setMonto(formatted);
    };

    const handleGuardar = async () => {
        const data = {
            monto: Number.parseFloat(monto.replace(/\D/g, "")),
            categoria: categoria.toLowerCase(),
            descripcion,
            esCredito,
            cuotas: esCredito ? cuotas : 1,
            medio: medio.toLowerCase(),
            esIngreso,
            esApertura: esIngreso && categoria === "Apertura" && !esCredito
        };

        await guardarConsumo(data, "28-03-2025");

    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h1 className="text-5xl font-bold mb-6">Agregar</h1>
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="checkbox"
                    id='esingreso'
                    checked={esIngreso}
                    onChange={() => setEsIngreso(!esIngreso)}
                />
                <label className="text-sm" htmlFor='esingreso'>¿Es ingreso?</label>
            </div>
            <div className="mb-4">
                <label className="text-sm block mb-1">Importe</label>
                <div className="flex items-center gap-1">
                    <span className="text-4xl font-medium bg-white py-2 px-1 rounded-l-lg text-black h-16 flex justify-center items-center">
                        <MdAttachMoney />
                    </span>
                    <input
                        type="text"
                        inputMode='numeric'
                        value={monto}
                        onChange={handleChange}
                        className="text-black p-2 rounded-r-lg w-full bg-white h-16 text-3xl font-medium"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="text-sm block mb-1">Categoría</label>
                <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full text-black p-2 rounded bg-white"
                >
                    <option value="">Seleccionar</option>
                    {categorias.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="text-sm block mb-1">Descripción</label>
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full text-black p-2 rounded bg-white"
                />
            </div>

            <div className="flex items-center gap-2 mb-2">
                <input
                    type="checkbox"
                    id='escredito'
                    checked={esCredito}
                    onChange={() => setEsCredito(!esCredito)}
                />
                <label className="text-sm" htmlFor='escredito'>¿Es crédito?</label>
            </div>

            {esCredito && (
                <>
                    <div className="mb-4">
                        <label className="text-sm block mb-1">Cuotas</label>
                        <select
                            value={cuotas}
                            onChange={(e) => setCuotas(Number(e.target.value))}
                            className="w-full text-black p-2 rounded bg-white"
                        >
                            {cuotasDisponibles.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="text-sm block mb-1">Medio</label>
                        <select
                            value={medio}
                            onChange={(e) => setMedio(e.target.value)}
                            className="w-full text-black p-2 rounded bg-white"
                        >
                            <option value="">Seleccionar</option>
                            {medios.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </>
            )}

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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Broker from './assets/sreens/Broker';
import AddInvestment from './assets/sreens/AddInvestent';
import { Consumos } from './assets/sreens/Consumos';
import { AddConsumo } from './assets/sreens/AddConsumo';
import Investent from './assets/sreens/Investent';
import { Home } from './assets/sreens/Home';

function App() {

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/consumos" element={<Consumos />} />
        <Route path="/consumos/agregar" element={<AddConsumo />} />
        <Route path="/inversiones" element={<Investent />} />
        <Route path="/inversiones/broker/:id" element={<Broker />} />
        <Route path="/inversiones/add" element={<AddInvestment />} />
      </Routes>
    </Router>
  )
}

export default App

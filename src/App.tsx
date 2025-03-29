import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './assets/sreens/Home';
import Broker from './assets/sreens/Broker';
import AddInvestment from './assets/sreens/AddInvestent';
import { Consumos } from './assets/sreens/Consumos';
import { AddConsumo } from './assets/sreens/AddConsumo';

function App() {

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Consumos />} />
        <Route path="/agregar" element={<AddConsumo/>} />
        <Route path="/inversiones" element={<Home />} />
        <Route path="/inversiones/broker/:id" element={<Broker/>} />
        <Route path="/inversiones/add" element={<AddInvestment/>} />
      </Routes>
    </Router>
  )
}

export default App

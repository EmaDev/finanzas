import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './assets/sreens/Home';
import Broker from './assets/sreens/Broker';
import AddInvestment from './assets/sreens/AddInvestent';
import { useEffect } from 'react';
import { useInvestmentStore } from './store/investments';
import { getBrokersTotales } from './data/firebaseService';

function App() {

  const setInitialData = useInvestmentStore((state) => state.setInitialData);

  useEffect(() => {
    getInversiones();
  }, [setInitialData]);

  const getInversiones = async() => {
    const {totalGlobal, brokers} = await getBrokersTotales();
    setInitialData(totalGlobal, brokers);
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/broker/:id" element={<Broker/>} />
        <Route path="/add" element={<AddInvestment/>} />
      </Routes>
    </Router>
  )
}

export default App

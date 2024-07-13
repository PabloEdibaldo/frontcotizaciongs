import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Products from './views/Products/Index';
import Rate from './views/Rate/Index';
import SearchProducts from './views/Products/SearchQuote';

function App() {
  return (
    <Router>
      <div className="card">
        <div className="card-body">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link className="nav-link" to="/productsView">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/rateView">Tarifas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/searchView">Buscar Productos</Link>
            </li>
          </ul>

          <div className="mt-3">
            <Routes>
              <Route path="/productsView" element={<Products />} />
              <Route path="/rateView" element={<Rate />} />
              <Route path="/searchView" element={<SearchProducts />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
import React, { useState } from 'react';
import Modal from '../../components/Modal/Index';
import ApiService from '../../api/ApiService';
import EndpointRate from "../../api/endpoint/RateEndpoint";
import Select from 'react-select';

const ProductSearchView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [quoteResponse, setQuoteResponse] = useState([]);

  const handleModalClose = () => setIsModalOpen(false);

  const rates = ApiService(
    EndpointRate.endpoints.addRate.get,
    "GET",
    null,
    null,
    null
  );
 

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/product/search?query=${searchQuery}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al buscar productos:', error);
    }
  };

  const consultQuote = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const fetchQuote = async () => {
    if (!selectedRate || !selectedProduct) {
      console.error('Por favor, selecciona un producto y un rate');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/quote?productId=${selectedProduct.id}&rateId=${selectedRate.value}`);
      if (response.ok) {
        const data = await response.json();
        setQuoteResponse(data);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al consultar la cotización:', error);
      setQuoteResponse('Error al consultar la cotización');
    }
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedRate(selectedOption);
  };

  let rateOptions = rates.data.map(option => ({ value: option.id, label: `Semanas: ${option.name} | Plasa normal: ${option.normalRate} | tasa puntual: ${option.spotRate}` }));

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="searchInput" className="form-label">Buscar producto:</label>
        <input
          type="text"
          className="form-control"
          id="searchInput"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>Buscar</button>
      </div>

      {products.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>SKU</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={() => consultQuote(product)}
                  >
                    Cotizar crédito
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Cotizar crédito"
        content={
          selectedProduct && (
            <div>
              <p>Producto nombre: {selectedProduct.name}</p>
              <p>Producto Sku: {selectedProduct.sku}</p>
              <p>Producto Precio: {selectedProduct.price}</p>
              <div className="form-group row m-b-10">
                <label className="col-lg-3 text-lg-right col-form-label">Selecciona plazo para cotizar:</label>
                <div className="col-lg-11 col-xl-9">
                  <Select
                    options={rateOptions}
                    onChange={handleSelectChange}
                    name="pon_type"
                    value={selectedRate}
                  />
                </div>
              </div>
              <button 
                className="btn btn-primary mt-2" 
                onClick={fetchQuote}
                disabled={!selectedRate}
              >
                Obtener Cotización
              </button>
              <div className="form-floating mt-3">
                
              <div class="mb-3">
  <label  className="form-label">Tasa norma</label>
  <input type="text" className="form-control" value={quoteResponse.abonoNormal} />
</div>

<div class="mb-3">
  <label class="form-label">Tasa puntual</label>
  <input type="text" className="form-control" value={quoteResponse.abonoPuntual} />
</div>

              </div>
            </div>
          )
        }
      />
    </div>
  );
};

export default ProductSearchView;
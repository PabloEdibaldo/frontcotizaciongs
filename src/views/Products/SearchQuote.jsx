import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Index';
import Select from 'react-select';
import { RateEndpoint } from '../../api/endpoint/RateEndpoint';
import { ProductEndpoint } from '../../api/endpoint/ProductEndpoint';
import { QuoteEndpoint } from '../../api/endpoint/QuoteEndpoint';

/**
 * Componente para buscar productos y cotizar créditos
 */
const ProductSearchView = () => {
  // Estados para manejar la interfaz y los datos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [quoteResponse, setQuoteResponse] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Cierra el modal de cotización
   */
  const handleModalClose = () => setIsModalOpen(false);

  // Carga las tasas al montar el componente
  useEffect(() => {
    fetchRates();
  }, []);

  /**
   * Obtiene las tasas disponibles desde la API
   */
  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await RateEndpoint.getRate();
      setRates(response.data);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
    setLoading(false);
  };

  /**
   * Busca productos basados en la consulta de búsqueda
   */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductEndpoint.searchProduct(searchQuery);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  /**
   * Prepara la consulta de cotización para un producto
   * @param {Object} product - El producto seleccionado
   */
  const consultQuote = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  /**
   * Obtiene la cotización para el producto y tasa seleccionados
   */
  const fetchQuote = async () => {
    if (!selectedRate || !selectedProduct) {
      console.error('Por favor, selecciona un producto y un rate');
      return;
    }
    try {
      const response = await QuoteEndpoint.getCalculateCote(selectedProduct.id, selectedRate.value);
      setQuoteResponse(response.data);
    } catch (error) {
      console.error('Error al consultar la cotización:', error);
    }
  };

  /**
   * Maneja el cambio de selección de tasa
   * @param {Object} selectedOption - La opción de tasa seleccionada
   */
  const handleSelectChange = (selectedOption) => {
    setSelectedRate(selectedOption);
  };

  // Prepara las opciones de tasas para el selector
  let rateOptions = rates.map(option => ({
    value: option.id,
    label: `Semanas: ${option.weeks} | Tasa normal: ${option.normalRate} | Tasa puntual: ${option.spotRate}`
  }));

  return (
    <div>
      {/* Barra de búsqueda de productos */}
      <div className="mb-3">
        <label htmlFor="searchInput" className="form-label">Buscar producto:</label>
        <input
          type="text"
          className="form-control"
          id="searchInput"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={fetchProducts}>Buscar</button>
      </div>

      {/* Tabla de resultados de búsqueda */}
      {products.length > 0 && (
        <table className="table">
          {/* ... (contenido de la tabla) ... */}
        </table>
      )}

      {/* Modal para cotizar crédito */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Cotizar crédito"
        content={
          selectedProduct && (
            <div>
              {/* Detalles del producto seleccionado */}
              <p>Producto nombre: {selectedProduct.name}</p>
              <p>Producto Sku: {selectedProduct.sku}</p>
              <p>Producto Precio: {selectedProduct.price}</p>
              
              {/* Selector de tasa */}
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
              
              {/* Botón para obtener cotización */}
              <button 
                className="btn btn-primary mt-2" 
                onClick={fetchQuote}
                disabled={!selectedRate}
              >
                Obtener Cotización
              </button>
              
              {/* Resultados de la cotización */}
              <div className="form-floating mt-3">
                <div className="mb-3">
                  <label className="form-label">Tasa normal</label>
                  <input type="text" className="form-control" value={quoteResponse.abonoNormal} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tasa puntual</label>
                  <input type="text" className="form-control" value={quoteResponse.abonoPuntual} readOnly />
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
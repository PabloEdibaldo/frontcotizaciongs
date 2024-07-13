import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Tooltip } from 'bootstrap';

const TableComponent = ({ columns, data = [], buttonAct, isProductTable }) => {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState(columns.map(col => col.accessor));
  const [isActivo, setIsActivo] = useState(false);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [clave, setClave] = useState(null);
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    let newData = data;

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        newData = newData.filter((item) =>
          item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
        );
      }
    });

    if (searchTerm) {
      newData = newData.filter((item) =>
        Object.values(item).some(
          (val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredData(newData);
  }, [filters, data, searchTerm]);

  useEffect(() => {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);
    });
  }, [filteredData, page, rowsPerPage]);

  const handleFilterChange = (busqueda) => {
    if(clave){
      const newFilters = { ...filters, [clave]: busqueda };      
    
    if (busqueda === '') {
      delete newFilters[clave];
    }

    setFilters(newFilters);

    const filtered = data.filter(item =>
      Object.keys(newFilters).every(key =>
        String(item[key]).toLowerCase().includes(String(newFilters[key]).toLowerCase())
      )
    );
    setFilteredData(filtered);
    }
  }

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1); // Reset to first page
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page
  };

  const handleColumnVisibilityChange = (selectedOptions) => {
    setVisibleColumns(selectedOptions.map(option => option.value));
  };

  const paginatedData = Array.isArray(filteredData) ? filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage) : [];
  const totalPages = Math.ceil(Array.isArray(filteredData) ? filteredData.length / rowsPerPage : 0);

  useEffect(() => {
    if (isProductTable) {
      const productsWithLowStock = Array.isArray(filteredData) ? filteredData.filter(item => item.stock === item.stock_minimo) : [];
      if (productsWithLowStock.length > 0) {
        //alert(`Alerta: Hay ${productsWithLowStock.length} productos con stock mínimo.`);
      }
    }
  }, [filteredData, isProductTable]);

  
  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, page - halfVisiblePages);
    let endPage = Math.min(totalPages, page + halfVisiblePages);

    if (page - halfVisiblePages <= 0) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }

    if (page + halfVisiblePages >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${i === page ? 'active' : ''} bg-light`}>
          <a className="page-link" href="#" onClick={() => handleChangePage(i)}>
            {i}
          </a>
        </li>
      );
    }

    if (startPage > 1) {
      pageNumbers.unshift(
        <li key="start-ellipsis" className="page-item disabled bg-light">
          <span className="page-link">...</span>
        </li>
      );
      pageNumbers.unshift(
        <li key={1} className={`page-item ${1 === page ? 'active' : ''} bg-light`}>
          <a className="page-link" href="#" onClick={() => handleChangePage(1)}>
            1
          </a>
        </li>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <li key="end-ellipsis" className="page-item disabled bg-light">
          <span className="page-link">...</span>
        </li>
      );
      pageNumbers.push(
        <li key={totalPages} className={`page-item ${totalPages === page ? 'active' : ''} bg-light`}>
          <a className="page-link" href="#" onClick={() => handleChangePage(totalPages)}>
            {totalPages}
          </a>
        </li>
      );
    }

    return pageNumbers;
  };

  const columnOptions = columns.map(col => ({ value: col.accessor, label: col.Header }));

  return (
    <>
      <div className="d-flex justify-content-between mb-2">
        <div>
          <div className="form-check">
            <input className="form-check-input bg-pink" type="checkbox" value="" onClick={() => { setIsActivo(!isActivo) }} />
            <label className="form-check-label">
              Mostrar columnas.
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input bg-pink" type="checkbox" value="" onClick={() => { setMostrarOpciones(!mostrarOpciones) }} />
            <label className="form-check-label">
              Mostrar opciones de busqueda.
            </label>
          </div>
        </div>
        <div>
          {buttonAct}
        </div>
      </div>
      {isActivo && (
          <Select
            className='mb-3'
            isMulti
            options={columnOptions}
            value={columnOptions.filter(option => visibleColumns.includes(option.value))}
            onChange={handleColumnVisibilityChange}
            closeMenuOnSelect={false}
          />)}
      <div className="table-responsive bg-light table table-bordered">
       

        {mostrarOpciones && (
          <div className="d-flex justify-content-between p-3 gap-4">
            <div>
              <div className='bg-light'>
                <label className="">Busqueda por columna:</label>
                <Select
                  className='mb-2'
                  placeholder="Selecciona una columna..."
                  options={columnOptions}
                  onChange={(select) => setClave(select.value)}
                />
                
                  <input type="text" className="form-control"
                    placeholder='Buscar...'
                    onChange={(e) => handleFilterChange(e.target.value)}
                  />
                
              </div>
            </div>

            <div>
              <div className="input-group mb-2 bg-light" >
                <label className="input-group-text">Ver</label>
                <select className="form-select" value={rowsPerPage} onChange={handleRowsPerPageChange}>
                  {[10, 25, 50, 100].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div className="bg-light">
                <div className="input-group mb-3">
                  <span className="input-group-text">Busqueda</span>
                  <input
                    type="text"
                    className="form-control"
                    aria-describedby="basic-addon1"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder='Buscar...'
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        <table className="table table-hover table-light table-responsive-sm mb-2">
          <thead>
            <tr className='text-center'>
              {columns.map((col) => (
                visibleColumns.includes(col.accessor) && (
                  <th key={col.accessor}>
                    {col.Header}
                  </th>
                )))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={index} className={isProductTable && item.stock === item.stock_minimo ? 'table-danger' : ''}>
                  {columns.map((col) => (
                    visibleColumns.includes(col.accessor) && (
                      <td key={col.accessor} style={{ wordBreak: 'break-word', padding: '0px', textAlign: 'center' }}>
                        <p className='text-lowercase text-truncate'>
                          {col.accessor === 'actions' || col.accessor === 'info' ? col.Cell({ row: { original: item } }) :
                               item[col.accessor]
                          }
                        </p>
                      </td>
                    )))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="d-flex justify-content-between align-items-center p-3">
          <span className="text-muted">
            Mostrando de {(page - 1) * rowsPerPage + 1} a {Math.min(page * rowsPerPage, filteredData.length)} de {filteredData.length} registros
          </span>
          <ul className="pagination mb-0">
            <li className={`page-item ${page === 1 ? 'disabled' : ''} bg-light`}>
              <a className="page-link" href="#" onClick={() => handleChangePage(page - 1)}>
                &laquo;
              </a>
            </li>
            {renderPagination()}
            <li className={`page-item ${page === totalPages ? 'disabled' : ''} bg-light`}>
              <a className="page-link" href="#" onClick={() => handleChangePage(page + 1)}>
                &raquo;
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
export default TableComponent;
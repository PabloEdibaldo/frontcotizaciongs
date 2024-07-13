import React, { useState, useEffect } from 'react';
import Table from '../../components/Table/Index';
import ApiService from '../../api/ApiService';
import EndpointProduct from "../../api/endpoint/productEndpoint";
import Modal from "../../components/Modal/Index";
import InputsData from '../../components/Inputs/Index';
import Spinner from '../../components/Spinner/Index'
const Index = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [dataEdit, setDataEdit] = useState({});
    const [idEliminar, setIdEliminar] = useState(null);
    const [metodoCrud, setMetodoCrud] = useState("GET");

    const fetchData = () => {
        setMetodoCrud("GET");
    };

    const product = ApiService(
        EndpointProduct.endpoints.addProduct.get,
        metodoCrud,
        dataEdit,
        idEliminar,
        null
    );

    useEffect(() => {
        if (metodoCrud !== "GET") {
            fetchData();
        }
    }, [metodoCrud]);

    const columns = [
        { Header: 'Id', accessor: 'id' },
        { Header: 'sku', accessor: 'sku' },
        { Header: 'Nombre del producto', accessor: 'name' },
        { Header: 'Precio', accessor: 'price' },
        {
            Header: 'Acciones',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className="btn-group" role="group">
                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleEdit(row.original, row.original.id)}
                        title="Editar"
                    >
                        Editar
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(row.original.id)}
                        title="Eliminar"
                    >
                        Eliminar
                    </button>
                </div>
            )
        }
    ];

    const formFields = [
        { label: "SKU", type: "text", name: "sku", isRequired: true, placeholder: "ingresar SKU" },
        { label: "Nombre del producto", type: "text", name: "name", isRequired: true, placeholder: "Ingresar el nombre" },
        { label: "Precio", type: "number", name: "price", isRequired: true, placeholder: "Ingresa el precio" },
    ];

    const handleModalOpen = () => {
        setIsModalOpen(true);
        setIsEditMode(false);
        setDataEdit({});
    };

    const handleEdit = (data, id) => {
        setIsModalOpen(true);
        setIsEditMode(true);
        setIdEliminar(id);
        setDataEdit(data);
    };

    const handleDelete = (id) => {
        setIdEliminar(id);
        setMetodoCrud("DELETE");
        
    };

    const handleModalClose = () => setIsModalOpen(false);

    const handleDataReceived = (data) => {
        if (isEditMode) {
            setMetodoCrud("PUT");
        } else {
            setMetodoCrud("POST");
        }
        setDataEdit(data);
        setIsModalOpen(false);
    };

    const handleOkOrNot = (response) => {
        if (response) {
            handleModalClose();
        }
    };

    return (
        <>
        {product.loading ? (<Spinner/>):(
            <Table
                columns={columns}
                data={product.data}
                isProductTable={true}
                buttonAct={
                    <div className="btn-group" role="group">
                        <button
                            type="button"
                            className="btn btn-outline-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Opciones
                        </button>
                        <ul className="dropdown-menu">
                            <div className=''>
                                <li className="dropdown-item d-flex justify-content-between" onClick={handleModalOpen}>
                                    Crear Producto <i className="fa fa-plus" />
                                </li>
                            </div>
                        </ul>
                    </div>
                }
            />
        )}
            

            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={isEditMode ? "Editar Producto" : "Crear Producto"}
                content={
                    <InputsData
                        fields={formFields}
                        onDataReceived={handleDataReceived}
                        dataToEdit={dataEdit || {}}
                        okOrNot={handleOkOrNot}
                    />
                }
            />
        </>
    );
};

export default Index;

    
    
  
   
  
  
import React, { useState, useEffect } from 'react';
import Table from '../../components/Table/Index';
import Modal from "../../components/Modal/Index";
import InputsData from '../../components/Inputs/Index';
import Spinner from '../../components/Spinner/Index';
import { ProductEndpoint } from '../../api/endpoint/ProductEndpoint';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Componente principal para la gestión de productos
 */
const Index = () => {
    // Estados para manejar el modal, modo de edición, datos de edición, productos, carga y mensajes
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [dataEdit, setDataEdit] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    // Efecto para cargar los productos al montar el componente
    useEffect(() => {
        fetchProducts();
    }, []);
    
    /**
     * Función para obtener los productos de la API
     */
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await ProductEndpoint.getProduct();
            setProducts(response.data);
            setMessage("Productos cargados correctamente");
        } catch (error) {
            console.error('Error fetching products:', error);
            setMessage("Error al cargar los productos");
        }
        setLoading(false);
    };

    /**
     * Función para crear un nuevo producto
     * @param {Object} productData - Datos del nuevo producto
     */
    const handleCreate = async (productData) => {
        try {
            await ProductEndpoint.createProduct(productData);
            fetchProducts();
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    /**
     * Función para actualizar un producto existente
     * @param {number} id - ID del producto a actualizar
     * @param {Object} productData - Nuevos datos del producto
     */
    const handleUpdate = async (id, productData) => {
        try {
            await ProductEndpoint.updateProduct(id, productData);
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    /**
     * Función para eliminar un producto
     * @param {number} id - ID del producto a eliminar
     */
    const handleDelete = async (id) => {
        try {
            await ProductEndpoint.deleteProduct(id);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Definición de las columnas para la tabla de productos
    const columns = [
        { Header: 'Id', accessor: 'id' },
        { Header: 'SKU', accessor: 'sku' },
        { Header: 'Nombre del producto', accessor: 'name' },
        { Header: 'Precio', accessor: 'price' },
        {
            Header: 'Acciones',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className="btn-group" role="group">
                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleEdit(row.original)}
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

    // Definición de los campos del formulario para crear/editar productos
    const formFields = [
        { label: "SKU", type: "text", name: "sku", isRequired: true, placeholder: "Ingresar SKU" },
        { label: "Nombre del producto", type: "text", name: "name", isRequired: true, placeholder: "Ingresar el nombre" },
        { label: "Precio", type: "number", name: "price", isRequired: true, placeholder: "Ingresa el precio" },
    ];

    /**
     * Función para abrir el modal de creación de producto
     */
    const handleModalOpen = () => {
        setIsModalOpen(true);
        setIsEditMode(false);
        setDataEdit({});
    };

    /**
     * Función para cerrar el modal
     */
    const handleModalClose = () => setIsModalOpen(false);

    /**
     * Función para manejar la edición de un producto
     * @param {Object} product - Producto a editar
     */
    const handleEdit = (product) => {
        setIsEditMode(true);
        setDataEdit(product);
        setIsModalOpen(true);
    };

    /**
     * Función para manejar los datos recibidos del formulario
     * @param {Object} data - Datos del producto a crear o actualizar
     */
    const handleDataReceived = (data) => {
        if (isEditMode) {
            handleUpdate(dataEdit.id, data);
        } else {
            handleCreate(data);
        }
        setIsModalOpen(false);
    };

    return (
        <>
            {loading ? (<Spinner />) : (
                <Table
                    columns={columns}
                    data={products}
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
                        dataToEdit={dataEdit}
                        okOrNot={handleModalClose}
                    />
                }
            />
        </>
    );
};

export default Index;
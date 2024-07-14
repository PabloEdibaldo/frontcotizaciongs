import React, { useState, useEffect } from 'react';
import Table from '../../components/Table/Index';
import Modal from "../../components/Modal/Index";
import InputsData from '../../components/Inputs/Index';
import Spinner from '../../components/Spinner/Index';
import { RateEndpoint } from '../../api/endpoint/RateEndpoint';

/**
 * Componente principal para la gestión de tasas
 */
const Index = () => {
    // Estado para controlar la apertura/cierre del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para almacenar los datos de edición
    const [dataEdit, setDataEdit] = useState({});
    // Estado para almacenar las tasas
    const [rates, setRates] = useState([]);
    // Estado para controlar la visualización del spinner de carga
    const [loading, setLoading] = useState(true);

    // Efecto para cargar las tasas al montar el componente
    useEffect(() => {
        fetchRates();
    }, []);

    /**
     * Función para obtener las tasas desde la API
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
     * Función para crear una nueva tasa
     * @param {Object} rateData - Datos de la nueva tasa
     */
    const handleCreate = async (rateData) => {
        try {
            await RateEndpoint.postRate(rateData);
            fetchRates();
        } catch (error) {
            console.error('Error creating rate:', error);
        }
    };

    // Definición de las columnas para la tabla de tasas
    const columns = [
        { Header: 'Id', accessor: 'id' },
        { Header: 'Semanas', accessor: 'weeks' },
        { Header: 'Tasa normal', accessor: 'normalRate' },
        { Header: 'Tasa puntual', accessor: 'spotRate' },
    ];

    // Definición de los campos del formulario para crear/editar tasas
    const formFields = [
        { label: "Semanas:", type: "number", name: "weeks", isRequired: true, placeholder: "...." },
        { label: "Tasa normal", type: "number", name: "normalRate", isRequired: true, placeholder: "..." },
        { label: "Tasa puntual", type: "number", name: "spotRate", isRequired: true, placeholder: "..." },
    ];

    /**
     * Función para abrir el modal de creación de tasa
     */
    const handleModalOpen = () => {
        setIsModalOpen(true);
        setDataEdit({});
    };

    /**
     * Función para cerrar el modal
     */
    const handleModalClose = () => setIsModalOpen(false);

    /**
     * Función para manejar los datos recibidos del formulario
     * @param {Object} data - Datos de la tasa a crear
     */
    const handleDataReceived = async (data) => {
        await handleCreate(data);
        setIsModalOpen(false);
    };

    /**
     * Función para manejar la respuesta del modal
     * @param {boolean} response - Respuesta del modal
     */
    const handleOkOrNot = (response) => {
        if (response) {
            handleModalClose();
        }
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <Table
                    columns={columns}
                    data={rates}
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
                                        Crear Tasa <i className="fa fa-plus" />
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
                title="Crear Tasa"
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
import React, { useState, useEffect } from 'react';
import Table from '../../components/Table/Index';
import ApiService from '../../api/ApiService';
import EndpointRate from "../../api/endpoint/RateEndpoint";
import Modal from "../../components/Modal/Index";
import InputsData from '../../components/Inputs/Index';
import Spinner from '../../components/Spinner/Index';

const Index = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataEdit, setDataEdit] = useState({});
    const [metodoCrud, setMetodoCrud] = useState("GET");
    const [reloadData, setReloadData] = useState(false);

    const fetchData = () => {
        setMetodoCrud("GET");
    };

    const product = ApiService(
        EndpointRate.endpoints.addRate.get,
        metodoCrud,
        dataEdit,
        null,
        null
    );

    useEffect(() => {
        if (reloadData) {
            fetchData();
            setReloadData(false);
        }
    }, [reloadData]);

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { Header: 'Id', accessor: 'id' },
        { Header: 'Semanas', accessor: 'weeks' },
        { Header: 'Tasa normal', accessor: 'normalRate' },
        { Header: 'Tasa puntual', accessor: 'spotRate' },
    ];

    const formFields = [
        { label: "Semanas:", type: "text", name: "weeks", isRequired: true, placeholder: "...." },
        { label: "Tasa normal", type: "number", name: "normalRate", isRequired: true, placeholder: "..." },
        { label: "Tasa puntual", type: "number", name: "spotRate", isRequired: true, placeholder: "..." },
    ];

    const handleModalOpen = () => {
        setIsModalOpen(true);
        setDataEdit({});
    };

    const handleModalClose = () => setIsModalOpen(false);

    const handleDataReceived = (data) => {
        setMetodoCrud("POST");
        setDataEdit(data);
        setReloadData(true);
        setIsModalOpen(false);
    };

    const handleOkOrNot = (response) => {
        if (response) {
            handleModalClose();
        }
    };

    return (
        <>
            {product.loading ? (
                <Spinner />
            ) : (
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
                title="Crear Producto"
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

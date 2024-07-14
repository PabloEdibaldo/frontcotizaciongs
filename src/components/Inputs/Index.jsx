import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

/**
 * Componente CreateEdit para generar formularios dinámicos de creación y edición
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.fields - Array de objetos que definen los campos del formulario
 * @param {Function} props.onDataReceived - Función que se llama al enviar el formulario
 * @param {Object} props.dataToEdit - Datos pre-existentes para edición (opcional)
 * @param {Function} props.okOrNot - Función de callback para confirmar la acción
 */
const CreateEdit = ({ fields, onDataReceived, dataToEdit = {}, okOrNot }) => {
  // Inicializa los valores del formulario
  const initialValues = fields.reduce((acc, field) => {
    if (field.type === 'checkbox') {
      acc[field.name] = dataToEdit[field.name] || field.initialValue || false;
    } else {
      acc[field.name] = dataToEdit[field.name] || field.initialValue || '';
    }
    return acc;
  }, {});

  // Estados para manejar los valores del formulario y el estado del checkbox
  const [values, setValues] = useState(initialValues);
  const [isChecked, setIsChecked] = useState(false);

  // Actualiza los valores cuando cambian los datos de edición
  useEffect(() => {
    setValues(initialValues);
  }, [dataToEdit]);

  /**
   * Maneja los cambios en los campos de entrada
   * @param {Event} event - Evento de cambio
   */
  const handleChange = (event) => {
    const { name, value, type } = event.target;
    let newValue = value;
    if (type === 'number') {
      newValue = parseFloat(value) || '';
    }
    setValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  /**
   * Maneja los cambios en los campos de selección
   * @param {Object} selectedOption - Opción seleccionada
   * @param {string} fieldName - Nombre del campo
   */
  const handleSelectChange = (selectedOption, fieldName) => {
    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: selectedOption ? selectedOption.value : '',
    }));
  };

  /**
   * Maneja los cambios en los campos de checkbox
   * @param {Event} event - Evento de cambio
   */
  const handleCheckChange = (event) => {
    setIsChecked(event.target.checked);
    handleChange(event);
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} event - Evento de envío
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    onDataReceived(values);
    okOrNot(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group row">
        {fields.map((field) => (
          <div key={field.name} className="">
            {/* Renderiza diferentes tipos de campos basados en field.type */}
            {field.type === 'select' ? (
              // Campo de selección
              <div className="form-group row">
                <label className="col-sm-4 col-form-label" htmlFor={field.name}>
                  {field.label}
                </label>
                <div className="col-sm-8">
                  <Select
                    placeholder="Selecciona una opción..."
                    id={field.name}
                    value={field.options.find((option) => option.value === values[field.name])}
                    onChange={(selectedOption) => handleSelectChange(selectedOption, field.name)}
                    options={field.options.map((opcion) => ({
                      value: opcion.value,
                      label: opcion.label,
                    }))}
                    name={field.name}
                  />
                </div>
              </div>
            ) : field.type === 'file' ? (
              // Campo de archivo
              <div className="">
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  type="file"
                  className="form-control-file"
                  id={field.name}
                  name={field.name}
                  onChange={handleChange}
                  required={field.isRequired || false}
                />
              </div>
            ) : field.type === 'checkbox' ? (
              // Campo de checkbox
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id={field.name}
                  name={field.name}
                  value={!isChecked || false}
                  checked={isChecked}
                  onChange={handleCheckChange}
                  disabled={field.isDisabled || false}
                  required={field.isRequired || false}
                />
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                  {field.label}
                </label>
              </div>
            ) : field.type === 'number' ? (
              // Campo numérico
              <div className="form-group row">
                <label className="col-sm-4 col-form-label" htmlFor={field.name}>
                  {field.label}
                </label>
                <div className="col-sm-8">
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id={field.name}
                    name={field.name}
                    value={values[field.name]}
                    onChange={handleChange}
                    disabled={field.isDisabled || false}
                    required={field.isRequired || false}
                    placeholder={field.placeholder}
                    min={field.min || ''}
                    max={field.max || ''}
                  />
                </div>
              </div>
            ) : (
              // Campo de texto por defecto
              <div className="form-group row">
                <label className="col-sm-4 col-form-label" htmlFor={field.name}>
                  {field.label}
                </label>
                <div className="col-sm-8">
                  <input
                    type={field.type}
                    className="form-control"
                    id={field.name}
                    name={field.name}
                    value={values[field.name]}
                    onChange={handleChange}
                    disabled={field.isDisabled || false}
                    required={field.isRequired || false}
                    placeholder={field.placeholder}
                    min="0"
                    maxLength={field.maxleng}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-primary">
          {dataToEdit.id ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

// Propiedades esperadas por el componente
CreateEdit.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      isRequired: PropTypes.bool,
      isDisabled: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          nombre: PropTypes.string,
        })
      ),
      initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  onDataReceived: PropTypes.func.isRequired,
  dataToEdit: PropTypes.object,
  okOrNot: PropTypes.func.isRequired,
};

export default CreateEdit;
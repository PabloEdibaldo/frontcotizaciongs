import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const CreateEdit = ({ fields, onDataReceived, dataToEdit = {}, okOrNot }) => {
  const initialValues = fields.reduce((acc, field) => {
    if (field.type === 'checkbox') {
      acc[field.name] = dataToEdit[field.name] || field.initialValue || false;
    } else {
      acc[field.name] = dataToEdit[field.name] || field.initialValue || '';
    }
    return acc;
  }, {});

  const [values, setValues] = useState(initialValues);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [dataToEdit]);

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

  const handleSelectChange = (selectedOption, fieldName) => {
    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleCheckChange = (event) => {
    if (event.target.checked) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
    handleChange(event);
  };

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
            {field.type === 'select' ? (
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
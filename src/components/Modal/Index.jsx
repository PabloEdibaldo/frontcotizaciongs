/**
 * Componente Modal personalizado
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Determina si el modal está abierto o cerrado
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {string} props.title - Título del modal
 * @param {React.ReactNode} props.content - Contenido del cuerpo del modal
 * @param {React.ReactNode} props.footer - Contenido opcional del pie del modal
 */
const Index = ({ isOpen, onClose, title, content, footer }) => {
  // Clases CSS para los diferentes elementos del modal
  let headerClass = 'modal-header bg-light text-capitalize';
  let footerClass = 'modal-footer bg-light text-capitalize';
  let bodyClass = 'modal-body text-capitalize';

  return (
    <>
      {isOpen && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
              {/* Encabezado del modal */}
              <div className={headerClass}>
                <h5 className="modal-title">{title}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  data-bs-dismiss="modal" 
                  aria-label="Close" 
                  onClick={onClose}
                ></button>
              </div>
              {/* Cuerpo del modal */}
              <div className={bodyClass}>
                {content}
              </div>
              {/* Pie del modal (opcional) */}
              {footer && (
                <div className={footerClass}>
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
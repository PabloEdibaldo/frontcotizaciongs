
const Index = ({ isOpen, onClose, title, content, footer }) => {

    let headerClass = 'modal-header bg-light text-capitalize';
    let footerClass = 'modal-footer bg-light text-capitalize';
    let bodyClass = 'modal-body text-capitalize';
  
    return (
      <>
        {isOpen && (
          <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content ">
                <div className={headerClass}>
                  <h5 className="modal-title">{title}</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                </div>
                <div className={bodyClass}>
                  {content}
                </div>
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
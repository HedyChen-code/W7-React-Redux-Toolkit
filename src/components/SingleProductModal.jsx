import { useState } from "react"

function SingleProductModal ( { 
  productModalRef, 
  tempProduct,
  closeModal,
  addCart
} ) {
  const [ cartQty, setCartQty ] = useState(1);

  const handleAddCart = () => {
    addCart(tempProduct.id, cartQty);
    closeModal();
  }

  return(<>
    <div 
        className="modal fade text-center" 
        id="productModal" 
        tabIndex="-1" 
        aria-labelledby="productModalLabel" 
        aria-hidden="true"
        ref={ productModalRef }>
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div 
              className="modal-header bg-dark text-white">
              <h5 className="modal-title fs-5" id="productModalLabel">
                <span>
                  產品詳細資訊
                </span>
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                  <div className="col-md-4">
                    <div className="mb-2">
                      {/* 有圖片才顯示 */}
                      {
                        tempProduct.imageUrl && (
                          <img 
                            className="img-fluid"
                            src={ tempProduct.imageUrl }
                            alt="主圖" 
                          />
                        )
                      }
                    </div>
                    <hr />
                    <div className="row">
                      { tempProduct.imagesUrl?.map( (url, index) => (
                        <div key={ index } className="mb-2 col-md-6">
                          { url && (
                            <img 
                              src={ url }
                              alt={`副圖 ${index + 1}`}
                              className="img-fluid mb-2"
                              style={{width: "100%", height: "200px", objectFit: "cover"}}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">標題</label>
                      <input 
                        id="title"
                        name="title"
                        type="text"
                        className="form-control bg-white"
                        placeholder="產品標題"
                        value={ tempProduct.title }
                        disabled
                      />
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="category" className="form-label">分類</label>
                        <input 
                          id="category" 
                          name="category"
                          type="text"
                          className="form-control bg-white"
                          placeholder="產品分類"
                          value={ tempProduct.category }
                          disabled
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="unit" className="form-label">單位</label>
                        <input 
                          id="unit"
                          name="unit"
                          type="text" 
                          className="form-control bg-white"
                          placeholder="產品單位"
                          value={ tempProduct.unit }
                          disabled
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="origin_price" className="form-label">原價</label>
                        <input 
                          id="origin_price"
                          name="origin_price"
                          type="number"
                          className="form-control bg-white"
                          min="0"
                          placeholder="產品原價" 
                          value={ tempProduct.origin_price }
                          disabled
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="price" className="form-label">售價</label>
                        <input 
                          id="price"
                          name="price"
                          type="number"
                          className="form-control bg-white"
                          min="0"
                          placeholder="產品售價"
                          value={ tempProduct.price }
                          disabled
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">產品描述</label>
                      <textarea 
                        id="description"
                        name="description"
                        type="text" 
                        className="form-control bg-white"
                        placeholder="產品描述"
                        value={ tempProduct.description }
                        disabled
                      ></textarea>
                    </div>
                    <hr />
                    <h5 className="h6 fw-normal mb-3">商品故事</h5>
                    <div className="mb-3">
                      <p className="text-start form-control">
                        { tempProduct.content?.story_content || " "}
                      </p>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-end align-items-center flex-nowrap w-100">
                      <label  className="h5" style={{ width: "150px"}}>購買數量：</label>
                      <div className="input-group flex-nowrap" style={{ width: "200px" }}>
                        <button
                          className="btn btn-outline-info"
                          type="button"
                          id="button-addon1"
                          aria-label="decrease quantity"
                          onClick={ () => setCartQty((prev) => Math.max(1, prev -1)) }
                        >
                          <i className="fa-solid fa-minus"></i>
                        </button>
                        <input 
                          className="form-control bg-white text-center"
                          type="text" 
                          min="1"
                          max="10"
                          value={ cartQty }
                          disabled
                        />
                        <button
                          className="btn btn-outline-danger"
                          type="button"
                          id="button addon2"
                          arial-label="increase quantity"
                          onClick={ () => setCartQty((prev) => prev + 1) }
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                      
                    </div>

                  </div>
                </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-primary" data-bs-dismiss="modal"
                onClick={ () => handleAddCart() }
              >加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
  </>)
}

export default SingleProductModal
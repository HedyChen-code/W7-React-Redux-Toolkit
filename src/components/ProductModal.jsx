import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal ( { 
  templateProduct, 
  productModalRef, 
  modalType, 
  closeModal,
  getProducts
} ) {
  // 避免污染到根元件中的原始資料
  const [ tempProduct, setTempProduct ] = useState(templateProduct);
  // 參考檔案上傳 input，好在需要時能夠清空其值
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTempProduct(templateProduct);
  }, [templateProduct])

  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // 當使用者清空主圖的網址時，同步清除檔案上傳 input 的檔名/值
    if (name === "imageUrl" && value === "") {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    setTempProduct( prevData => {
      if ( name === "story_title" || name === "story_content") {
        return {
          ...prevData,
          content: {
            ...(prevData.content || {}),
            [name]: value,
          }
        }
      }
      return{
        ...prevData,
      [name]: type === "checkbox" ? checked :  value,
      }
    });
  };

  const handleModalImageChange = (index, value) => {
    // React 不能直接修改 state -> 先將原陣列複製，並在新陣列上修改值，最後使用新陣列覆蓋原陣列內容，以達到修改狀態的目的
    setTempProduct( prevData => {
      const newImages = [ ...prevData.imagesUrl ]; // 複製原陣列
      newImages[index] = value; // 更新特定索引

      // 填寫最後一個空輸入框時，自動新增空白輸入框
      if (
        value !== "" && 
        index === newImages.length - 1 &&
        newImages.length < 5
      ) {
        newImages.push("");
      }

      // 清空輸入框時，移除最後的空白輸入框
      if (
        value === "" && 
        newImages.length > 1 &&
        newImages[newImages.length - 1] === ""
      ) {
        newImages.pop();
      }

      return { ...prevData, imagesUrl: newImages }; // 回傳新狀態
    })
  };

  const handleAddImage = () => {
    setTempProduct( prevData => {
      return {
        ...prevData,
        imagesUrl: [ ...prevData.imagesUrl, ""]
      };
    });
  };

  const handleRemoveImage = () => {
    setTempProduct( prevData => {
      const newImages = [ ...prevData.imagesUrl];
      newImages.pop();
      return { ...prevData, imagesUrl: newImages };
    });
  };

  const uploadImage = async (e) => {
    const url = `${API_BASE}/api/${API_PATH}/admin/upload`;
    const file = e.target.files?.[0];
    if (!file) {
      return
    }

    try {
      const formData = new FormData();
      formData.append('file-to-upload', file);
      
      const response = await axios.post(url, formData);
      const uploadImageUrl = response.data.imageUrl;

      setTempProduct((prev) => ({
        ...prev,
        imageUrl:uploadImageUrl
      }))
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  }

  const updateProduct = async (id) => {
    // 新增產品
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = 'post';

    // 編輯產品
    if (modalType === 'edit') {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = 'put';
    }

    const productData = {
      data: {
        ...tempProduct,
        origin_price: Number(tempProduct.origin_price),
        price: Number(tempProduct.price),
        is_enabled: tempProduct.is_enabled ? 1 : 0,
        imagesUrl: [ ...tempProduct.imagesUrl.filter( url => url !== "") ],
      }
    }

    try {
      const response = await axios[method](url, productData);
      getProducts();
      closeModal();
    } catch (error) {
      alert(error?.response?.data?.message);
    }
  }

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      getProducts();
      closeModal();
    } catch (error) {
      alert(error?.response?.data?.message);
    }
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
              className={`modal-header ${ modalType === "delete" ? "bg-danger" : "bg-dark" } text-white`}>
              <h5 className="modal-title fs-5" id="productModalLabel">
                <span>
                  {/* modalType === "delete" ? "刪除產品" : (後續判斷) */}
                  { modalType === "delete" 
                  ? "刪除產品" : modalType === "edit" 
                  ? "編輯產品" 
                  : "新增產品"}
                </span>
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              { modalType === "delete" ? (
                <p className="h4">確定要刪除
                <span className="text-danger"> { tempProduct.title } </span>嗎？
                </p>
              ) : (
                <div className="row">
                  <div className="col-sm-4">
                    <div className="mb-2">
                      <div className="mb">
                        <label htmlFor="fileUpload" className="form-label">圖片上傳</label>
                        <input 
                          type="file" 
                          accept=".jpg, .jpeg, .png"
                          className="form-control"
                          name="fileUpload" 
                          id="fileUpload"
                          ref={fileInputRef}
                          onChange={ (e) => uploadImage(e) }
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="imageUrl" className="form-label">主圖 | 輸入圖片網址</label>
                        <input 
                          type="text"
                          className="form-control"
                          id="imageUrl"
                          name="imageUrl"
                          placeholder="請輸入圖片連結"
                          value={ tempProduct.imageUrl }
                          onChange={ handleModalInputChange }
                        />
                      </div>
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
                    <p className="mb-2 fs-6">副圖</p>
                    <div>
                      { tempProduct.imagesUrl.map( (url, index) => (
                        <div key={ index } className="mb-2">
                          <label htmlFor="imageUrl" className="form-label">輸入圖片網址</label>
                          <input 
                            type="text"
                            value={ url }
                            placeholder={`圖片網址 ${index + 1}`}
                            className="form-control mb-2"
                            onChange={ (e) => handleModalImageChange(index, e.target.value)}
                          />
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
                    <div>
                      { tempProduct.imagesUrl.length < 5 &&
                        tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !== "" &&
                        <button 
                        className="btn btn-outline-info btn-sm w-100 mb-2"
                        onClick={ () => handleAddImage() }>新增圖片</button>
                      }
                      {
                        tempProduct.imagesUrl.length >= 1 &&
                        <button
                        className="btn btn-outline-danger btn-sm w-100"
                        onClick={ () => handleRemoveImage() }>刪除圖片</button>
                      }
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">標題</label>
                      <input 
                        id="title"
                        name="title"
                        type="text"
                        className="form-control"
                        placeholder="請輸入標題"
                        value={ tempProduct.title }
                        onChange={ handleModalInputChange }
                      />
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="category" className="form-label">分類</label>
                        <input 
                          id="category" 
                          name="category"
                          type="text"
                          className="form-control"
                          placeholder="請輸入分類"
                          value={ tempProduct.category }
                          onChange={ handleModalInputChange }
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="unit" className="form-label">單位</label>
                        <input 
                          id="unit"
                          name="unit"
                          type="text" 
                          className="form-control"
                          placeholder="請輸入單位"
                          value={ tempProduct.unit }
                          onChange={ handleModalInputChange }
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
                          className="form-control"
                          min="0"
                          placeholder="請輸入原價" 
                          value={ tempProduct.origin_price }
                          onChange={ handleModalInputChange }
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="price" className="form-label">售價</label>
                        <input 
                          id="price"
                          name="price"
                          type="number"
                          className="form-control"
                          min="0"
                          placeholder="請輸入售價"
                          value={ tempProduct.price }
                          onChange={ handleModalInputChange }
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
                        className="form-control"
                        placeholder="請輸入產品描述"
                        value={ tempProduct.description }
                        onChange={ handleModalInputChange }
                      ></textarea>
                    </div>
                    <hr />
                    <h5 className="h6 mb-3">商品故事</h5>
                    <div className="mb-3">
                      <label htmlFor="story_title" className="form-label">故事標題</label>
                      <input 
                        id="story_title"
                        name="story_title"
                        type="text"
                        className="form-control"
                        placeholder="請輸入商品故事的標題"
                        value={ tempProduct.content.story_title}
                        onChange={ handleModalInputChange } />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="story_content" className="form-label">故事內容</label>
                      <textarea
                        id="story_content"
                        name="story_content"
                        type="text" 
                        className="form-control"
                        placeholder="請輸入說明內容"
                        value={ tempProduct.content.story_content }
                        onChange={ handleModalInputChange }
                      ></textarea>
                    </div>
                    <hr />
                    <div className="mb-3">
                      <div className="form-check text-start">
                        <input 
                          id="is_enabled"
                          name="is_enabled"
                          type="checkbox" 
                          className="form-check-input"
                          checked={ tempProduct.is_enabled }
                          onChange={ handleModalInputChange }
                        />
                        <label htmlFor="is_enabled" className="form-check-label">是否啟用</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" data-bs-dismiss="modal"
                onClick={ () => closeModal() }
              >取消
              </button>
              { modalType === "delete" ? (
                <>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={ () => deleteProduct( tempProduct.id) }
                  >刪除
                  </button>
                </>
              ) : (
                <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={ () => updateProduct(tempProduct.id) }
                >確認</button>
                </>
              ) }
            </div>
          </div>
        </div>
      </div>
  </>)
}

export default ProductModal
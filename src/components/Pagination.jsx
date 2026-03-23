function Pagination ( { pagination, onChangePage } ) {
  const handleClick = (e, page) => {
    e.preventDefault();
    onChangePage(page);
  }
  
  return (<>
    <div className="container">
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className={ `page-item ${!pagination.has_pre && 'disabled'}` }>
              <a className="page-link" href="#" 
                onClick={ (e) => handleClick(e, pagination.current_page - 1)}
              >
                上一頁
              </a>
            </li>
            { Array.from( { length: pagination.total_pages }, (_, index ) => (
              <li className={ `page-item ${pagination.current_page === index + 1 && 'active'}` } key={ `${index}_page` }>
                <a className="page-link" href="#" onClick={ (e) => handleClick(e, index +1)}>{ index + 1 }</a>
              </li>
            ) ) }
            
            <li className={ `page-item ${!pagination.has_next && 'disabled'}` }>
              <a className="page-link" href="#"
                onClick={ (e) => handleClick(e, pagination.current_page + 1) }>
                下一頁
              </a>
            </li>
          </ul>
        </nav>
      </div>
  </>)
}

export default Pagination
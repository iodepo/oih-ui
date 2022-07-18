import React from "react";
import ReactPaginate from "react-paginate";

export const ITEMS_PER_PAGE = 10;

export default function Pagination({searchType, resultCount, setPage, page}) {
    const pageCount = Math.ceil(resultCount / ITEMS_PER_PAGE);
    const handlePageClick = (event) => {
        setPage(event.selected);
  };

    return (
        <div id='resultsPaginate'>
            <ReactPaginate
                key={searchType}
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                containerClassName={'pagination'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                activeClassName={'active'}
                id='pagination results'
                />
            </div>
    )
}
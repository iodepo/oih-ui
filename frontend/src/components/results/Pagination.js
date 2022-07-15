import React, {useEffect, useState} from "react";
import ReactPaginate from "react-paginate";

export default function Pagination({resultCount, pageCount, setPageCount, setItemOffset}) {
    const rows = 10;

    useEffect(() => {
        const btns = [];
        for (let i=0; i < Math.ceil(resultCount / rows); i++) {
            btns.push(i)
        }
        setPageCount(Math.ceil(resultCount / rows));
        console.log(pageCount)

    }, [resultCount]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * rows);
        setItemOffset(newOffset);
        console.log(
            document.get
        )
  };

    return (
        <div id='resultsPaginate'>
            <ReactPaginate
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
                forcePage={0}
                id='pagination results'
                />
            </div>
    )
}
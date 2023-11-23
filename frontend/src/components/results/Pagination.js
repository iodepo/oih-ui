import React from "react";
import ReactPaginate from "react-paginate";
import PaginationMUI from "@mui/material/Pagination";

export const ITEMS_PER_PAGE = 10;

export default function Pagination({ searchType, resultCount, setPage, page }) {
  const pageCount = Math.ceil(resultCount / ITEMS_PER_PAGE);
  const handlePageClick = (event, value) => {
    setPage(value - 1);
  };

  return (
    <PaginationMUI
      key={`${searchType}-${pageCount}`}
      siblingCount={4}
      count={pageCount}
      shape="rounded"
      size="large"
      onChange={handlePageClick}
      defaultPage={Number(page) + 1}
      sx={{
        display: { xs: "none", lg: "flex" },
        justifyContent: "center",
        my: 2,
        "& .MuiPaginationItem-root": {
          color: "#2B498C",
          "&.Mui-selected": {
            background: "#2B498C",
            color: "white",
          },
        },
      }}
    />
  );
  {
    /* <div id='resultsPaginate'>
            <ReactPaginate
                key={`${searchType}-${pageCount}`}
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
                initialPage={Number(page)}
                />
            </div> */
  }
}

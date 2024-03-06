import React from "react";
import PaginationMUI from "@mui/material/Pagination";
import { ITEMS_PER_PAGE } from "portability/configuration";

export default function Pagination({
  searchType,
  resultCount,
  setPage,
  page,
  showMorePages,
}) {
  const pageCount = Math.ceil(resultCount / (ITEMS_PER_PAGE + showMorePages));
  const handlePageClick = (event, value) => {
    setPage(value - 1);
  };

  const palette = "custom.resultPage.pagination.";
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
          color: palette + "colorItem",
          "&.Mui-selected": {
            backgroundColor: palette + "colorItem",
            color: "white",
          },
        },
      }}
    />
  );
}

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import CircleIcon from "@mui/icons-material/Circle";
import Tooltip from "@mui/material/Tooltip";
import { cutWithDots } from "components/results/ResultDetails";
import InfiniteScroll from "react-infinite-scroll-component";
import { ITEMS_PER_PAGE } from "portability/configuration";
import CircularProgress from "@mui/material/CircularProgress";

const TableDrawer = (props) => {
  const {
    isLoading,
    visibleRows,
    resultsCount,
    setPage,
    page,
    mainBoxHeight,
    headCells,
    order,
    orderBy,
    handleRequestSort,
    setSelectedResult,
    results,
  } = props;

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ boxShadow: 0, height: mainBoxHeight - 20 }}
      >
        {isLoading && (
          <CircularProgress sx={{ display: "flex", margin: "0 auto" }} />
        )}
        {!isLoading && (
          <InfiniteScroll
            dataLength={visibleRows.length}
            next={() => {
              setPage(page + 1);
            }}
            height={mainBoxHeight - 20}
            hasMore={(ITEMS_PER_PAGE + 5) * page < parseInt(resultsCount)}
            loader={<h4></h4>}
            endMessage={<p>No more items</p>}
          >
            <Table>
              <TableHead>
                <TableHeader
                  headCells={headCells}
                  order={order}
                  orderBy={orderBy}
                  handleRequestSort={handleRequestSort}
                />
              </TableHead>
              <TableBody>
                {visibleRows.map((row, u) => {
                  return (
                    <RowData
                      key={u}
                      i={u}
                      row={row}
                      results={results}
                      setSelectedResult={setSelectedResult}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </InfiniteScroll>
        )}
      </TableContainer>
    </>
  );
};

export default TableDrawer;

const TableHeader = (props) => {
  const { headCells, orderBy, order, handleRequestSort } = props;
  const palette = "custom.mapView.desktop.drawer.";
  return (
    <TableRow
      sx={{
        backgroundColor: palette + "bgHeaderTable",
        ".MuiTableCell-root": {
          border: 0,
        },
      }}
    >
      {headCells.map((headCell, j) => (
        <TableCell
          key={j}
          sortDirection={orderBy === headCell.id ? order : false}
          sx={{
            fontSize: "12px",
            paddingTop: 0,
            paddingBottom: 0,
          }}
          size="small"
        >
          <TableSortLabel
            active={orderBy === headCell.id}
            direction={orderBy === headCell.id ? order : "asc"}
            onClick={handleRequestSort(headCell.id)}
          >
            {headCell.label}
            {orderBy === headCell.id ? (
              <Box component="span" sx={visuallyHidden}>
                {order === "desc" ? "sorted descending" : "sorted ascending"}
              </Box>
            ) : null}
          </TableSortLabel>
        </TableCell>
      ))}
    </TableRow>
  );
};

const RowData = (props) => {
  const { results, setSelectedResult, row, i } = props;
  const palette = "custom.mapView.desktop.drawer.";
  return (
    <TableRow
      hover
      onClick={() => {
        const response = results.find((x) => x.index_id === row.id);
        response && setSelectedResult(response);
      }}
      role="checkbox"
      tabIndex={-1}
      key={row.id}
      sx={{
        cursor: "pointer",
        background:
          i % 2 === 0 ? palette + "bgTableNeutral" : palette + "bgTable",
        ".MuiTableCell-root": {
          border: 0,
        },
      }}
    >
      <TableCell sx={{ fontSize: "16px" }}>
        <Box display={"flex"} sx={{ flexDirection: "column", gap: 1 }}>
          {row.name}
          <Box display={"flex"} sx={{ flexDirection: "row", gap: 1 }}>
            {row.provider.map((r, index) => {
              return (
                <Tooltip key={index} title={r} arrow>
                  <Typography
                    variant="body2"
                    component="span"
                    display={"flex"}
                    alignItems={"center"}
                    sx={{ fontSize: "10px", gap: 1 }}
                  >
                    <CircleIcon
                      fontSize="small"
                      sx={{
                        fontSize: "10px",
                        color: palette + "bgButton",
                      }}
                    />
                    <Box sx={{ fontSize: "10px", gap: 1 }}>
                      {cutWithDots(r, 20)}
                    </Box>
                  </Typography>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );
};

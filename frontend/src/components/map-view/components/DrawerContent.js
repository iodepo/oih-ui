import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const DrawerContent = (props) => {
  const {
    results,
    setSearchText,
    resultsCount,
    mapBounds,
    getDataSpatialSearch,
  } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [dataTable, setDataTable] = useState([]);

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  useEffect(() => {
    setDataTable(
      results.map((r) => {
        return { name: r.name, id: r.index_id };
      })
    );
  }, [results]);

  const handleRequestSort = (property) => (event) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const headCells = [
    {
      id: "name",
      label: "Title",
    },
  ];

  const visibleRows = React.useMemo(
    () => stableSort(dataTable, getComparator(order, orderBy)),
    [order, orderBy, dataTable]
  );

  return (
    <Box>
      <Grid container spacing={2} sx={{ padding: "16px" }}>
        <Grid item xs={12}>
          <Typography
            variant="subtitle"
            sx={{ color: "#0F1A31", fontSize: "14px", fontWeight: 700 }}
          >
            {resultsCount + " results"}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", gap: "12px" }}>
          <Button
            variant="outlined"
            sx={{ height: "18px", fontSize: "12px" }}
            endIcon={<CloseIcon sx={{ fontSize: "16px" }} />}
          >
            Send
          </Button>
          <Button
            variant="outlined"
            sx={{ height: "18px", fontSize: "12px" }}
            endIcon={<CloseIcon sx={{ fontSize: "16px" }} />}
          >
            Send
          </Button>
          <Divider orientation="vertical" flexItem />
          <Button variant="text" sx={{ height: "18px", fontSize: "12px" }}>
            Send
          </Button>
        </Grid>
        <Grid item xs={9}>
          <TextField
            fullWidth
            sx={{
              color: "#7B8FB7",
              backgroundColor: "#E8EDF266",
              borderRadius: "4px",
              ".MuiInputBase-root": {
                height: "30px",
                fontWeight: 700,
              },
              "& .MuiFormLabel-root": {
                fontSize: { xs: "14px", lg: "16px" },
              },
              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            placeholder={"Search"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: "#7B8FB7",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            name="search"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                getDataSpatialSearch();
              }
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: "#40AAD3",
              height: "30px",
              borderRadius: { xs: 2, lg: 1 },
              width: { xs: "100%", lg: "auto" },
              textTransform: "none",
            }}
            onClick={() => {
              /* sendMatomoEvent(region);
              handleSubmit(); */
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} mt={2}>
          <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
            <Table sx={{ minWidth: 450 }} aria-label="simple table">
              <TableHead>
                <TableRow
                  sx={{
                    background: "#F8FAFB",
                    ".MuiTableCell-root": {
                      border: 0,
                    },
                  }}
                >
                  {headCells.map((headCell, index) => (
                    <TableCell
                      key={index}
                      sortDirection={orderBy === headCell.id ? order : false}
                      sx={{ fontSize: "12px" }}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={handleRequestSort(headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((row, index) => {
                  debugger;
                  return (
                    <TableRow
                      key={index}
                      hover
                      onClick={(event) => {}}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      sx={{
                        cursor: "pointer",
                        background: index % 2 === 0 ? "#FFFFFF" : "#E8EDF2",
                        ".MuiTableCell-root": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell sx={{ fontSize: "13px" }}>
                        <Box display={"flex"} sx={{ flexDirection: "row" }}>
                          {row.name}
                          <Box
                            display={"flex"}
                            sx={{ flexDirection: "column" }}
                          >
                            {row["txt_provider"].map((r) => {
                              return (
                                <>
                                  <Tooltip key={r} title={r} arrow>
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
                                          color: "#40AAD3",
                                        }}
                                      />
                                      <Box sx={{ fontSize: "10px", gap: 1 }}>
                                        {cutWithDots(r, 20)}
                                      </Box>
                                    </Typography>
                                  </Tooltip>
                                </>
                              );
                            })}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DrawerContent;

import React, { useState, useEffect, useRef } from "react";
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
import { cutWithDots } from "components/results/ResultDetails";
import InfiniteScroll from "react-infinite-scroll-component";
import { ITEMS_PER_PAGE } from "portability/configuration";
import { Export } from "components/search-hub/Export";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import useCookies from "context/useCookies";
import { SupportedLangugesEnum } from "context/AppTranslationProvider";
import FrenchFlag from "../../../../resources/svg/FrenchFlag.svg";
import RussianFlag from "../../../../resources/svg/RussianFlag.svg";
import EnglishFlag from "../../../../resources/svg/EnglishFlag.svg";
import SpanishFlag from "../../../../resources/svg/SpanishFlag.svg";
import { useAppTranslation } from "context/context/AppTranslation";
import ResultValue from "components/search-hub/ResultValue";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import IconButton from "@mui/material/IconButton";

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
    searchText,
    resultsCount,
    mapBounds,
    getDataSpatialSearch,
    isLoading,
    handleSubmit,
    setSelectedFacets,
    selectedFacets,
    facetSearch,
    clear,
  } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const mainBoxRef = useRef(null);
  const [mainBoxHeight, setMainBoxHeight] = useState(0);
  const [languageIcon, setLanguageIcon] = useState(EnglishFlag);
  const [selectedResult, setSelectedResult] = useState(undefined);

  useEffect(() => {
    changeLanguageIcon(translationState.getTranslationKey());
  }, []);

  const changeLanguageIcon = (languageCode) => {
    switch (languageCode) {
      case SupportedLangugesEnum.En:
        setLanguageIcon(EnglishFlag);
        break;
      case SupportedLangugesEnum.Fr:
        setLanguageIcon(FrenchFlag);
        break;
      case SupportedLangugesEnum.Es:
        setLanguageIcon(SpanishFlag);
        break;
      case SupportedLangugesEnum.Ru:
        setLanguageIcon(RussianFlag);
        break;
    }
  };
  useEffect(() => {
    !selectedResult &&
      setDataTable(
        results.map((r) => {
          return { name: r.name, id: r.index_id, provider: r.txt_provider };
        })
      );
  }, [results, selectedResult]);

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

  const changeTranslation = (languageCode) => {
    translationState.updateTranslation(languageCode);
    changeLanguageIcon(languageCode);
  };

  useEffect(() => {
    getDataSpatialSearch(page);
  }, [page]);

  useEffect(() => {
    const mainBox = mainBoxRef.current;
    if (mainBox === null) return;

    const mainBoxObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === mainBox) {
          setMainBoxHeight(entry.target.clientHeight);
        }
      }
    });

    mainBoxObserver.observe(mainBox);

    return () => mainBoxObserver.unobserve(mainBox);
  }, [selectedResult]);

  const translationState = useAppTranslation();
  const palette = "custom.mapView.desktop.drawer.";
  return (
    <Box sx={{ height: "100%" }}>
      {selectedResult === undefined && (
        <Stack sx={{ height: "100%" }}>
          <Box
            sx={{
              width: "100px",
              display: "flex",
              paddingTop: "8px",
              marginLeft: "auto",
              marginRight: "8px",
            }}
          >
            <Select
              defaultValue={"EN"}
              value={
                useCookies.getCookie("language")
                  ? useCookies.getCookie("language")
                  : SupportedLangugesEnum.En
              }
              name="languageChoice"
              onChange={(e) => changeTranslation(e.target.value)}
              sx={{
                backgroundColor: palette + "bgLanguage",
                color: palette + "colorLanguage",
                fontWeight: 600,
                borderRadius: 1,
                height: "34px",
                width: "70px",
                ".MuiSelect-outlined": {
                  textOverflow: "initial !important",
                },
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: palette + "borderColorLanguage",
                  borderRight: 0,
                },
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                ".MuiSelect-icon": {
                  color: palette + "colorLanguage",
                },
              }}
            >
              <MenuItem
                key={SupportedLangugesEnum.En}
                value={SupportedLangugesEnum.En}
              >
                {SupportedLangugesEnum.En}
              </MenuItem>
              <MenuItem
                key={SupportedLangugesEnum.Es}
                value={SupportedLangugesEnum.Es}
              >
                {SupportedLangugesEnum.Es}
              </MenuItem>
              <MenuItem
                key={SupportedLangugesEnum.Ru}
                value={SupportedLangugesEnum.Ru}
              >
                {SupportedLangugesEnum.Ru}
              </MenuItem>
              <MenuItem
                key={SupportedLangugesEnum.Fr}
                value={SupportedLangugesEnum.Fr}
              >
                {SupportedLangugesEnum.Fr}
              </MenuItem>
            </Select>
            <Box
              sx={{
                width: "30px",
                border: "1px solid",
                borderColor: palette + "borderColorLanguage",
                borderTopRightRadius: 3,
                borderBottomRightRadius: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar src={languageIcon} sx={{ width: 20, height: 20 }} />
            </Box>
          </Box>
          <Box p={"10px 20px 40px 20px"}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack direction={"row"} spacing={1} useFlexGap flexWrap="wrap">
                  {selectedFacets.length > 0 &&
                    selectedFacets.map((s, index) => {
                      return (
                        <Button
                          key={index}
                          variant="contained"
                          sx={{
                            height: "18px",
                            fontSize: "12px",
                            minWidth: 0,
                            boxShadow: 0,
                            flex: "0 0 auto",
                            backgroundColor: palette + "bgSelectedFilter",
                            color: palette + "colorSelectedFilter",
                            textTransform: "none",
                            "&:hover": {
                              color: palette + "bgSelectedFilter",
                              backgroundColor: palette + "colorSelectedFilter",
                            },
                          }}
                          endIcon={
                            <CloseIcon
                              sx={{
                                fontSize: "16px",
                                color: palette + "colorIcon",
                              }}
                            />
                          }
                          onClick={() => {
                            setSelectedFacets(
                              selectedFacets.filter(
                                (x) => x.name !== s.name && x.value !== s.value
                              )
                            );
                            facetSearch(s.name, s.value, false);
                          }}
                        >
                          {cutWithDots(s.value, 10)}
                        </Button>
                      );
                    })}

                  {selectedFacets.length > 0 && (
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        borderColor: palette + "colorDivider",
                        borderWidth: 1,
                      }}
                    />
                  )}
                  {selectedFacets.length > 0 && (
                    <Button
                      variant="text"
                      sx={{
                        height: "18px",
                        fontSize: "14px",
                        color: palette + "bgButton",
                        fontWeight: 700,
                        textTransform: "none",
                      }}
                      onClick={() => clear()}
                    >
                      {translationState.translation["Clear filters"]}
                    </Button>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  sx={{
                    color: "#7B8FB7",
                    backgroundColor: palette + "bgTextfield",
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
                  value={searchText}
                  placeholder={translationState.translation["Search"]}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={{
                            color: palette + "colorIcon",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  onInput={(e) => {
                    setSearchText(e.target.value);
                  }}
                  name="search"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    backgroundColor: palette + "bgButton",
                    height: "30px",
                    borderRadius: { xs: 2, lg: 1 },
                    width: { xs: "100%", lg: "auto" },
                    textTransform: "none",
                  }}
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  {translationState.translation["Search"]}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ height: "inherit" }} ref={mainBoxRef}>
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
                  hasMore={ITEMS_PER_PAGE * page < parseInt(resultsCount)}
                  loader={<h4></h4>}
                  endMessage={<p>No more items</p>}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: palette + "bgHeaderTable",
                          ".MuiTableCell-root": {
                            border: 0,
                          },
                        }}
                      >
                        {headCells.map((headCell, index) => (
                          <TableCell
                            key={index}
                            sortDirection={
                              orderBy === headCell.id ? order : false
                            }
                            sx={{
                              fontSize: "12px",
                              paddingTop: 0,
                              paddingBottom: 0,
                            }}
                            size="small"
                          >
                            <TableSortLabel
                              active={orderBy === headCell.id}
                              direction={
                                orderBy === headCell.id ? order : "asc"
                              }
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
                      {visibleRows.map((row, index2) => {
                        return (
                          <TableRow
                            key={index2}
                            hover
                            onClick={() => {
                              const response = results.find(
                                (x) => x.index_id === row.id
                              );
                              response && setSelectedResult(response);
                            }}
                            role="checkbox"
                            tabIndex={-1}
                            key={row.id}
                            sx={{
                              cursor: "pointer",
                              background:
                                index2 % 2 === 0 ? "#FFFFFF" : "#E8EDF2",
                              ".MuiTableCell-root": {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell sx={{ fontSize: "16px" }}>
                              <Box
                                display={"flex"}
                                sx={{ flexDirection: "column", gap: 1 }}
                              >
                                {row.name}
                                <Box
                                  display={"flex"}
                                  sx={{ flexDirection: "row", gap: 1 }}
                                >
                                  {row.provider.map((r) => {
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
                                                color: palette + "bgButton",
                                              }}
                                            />
                                            <Box
                                              sx={{ fontSize: "10px", gap: 1 }}
                                            >
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
                </InfiniteScroll>
              )}
            </TableContainer>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px",
            }}
          >
            <Export
              palette={"custom.resultPage.searchBar."}
              uri={"uri"}
              searchType={""}
              resultCount={resultsCount}
            />
            <Typography
              variant="subtitle"
              sx={{ color: "#0F1A31", fontSize: "14px", fontWeight: 700 }}
            >
              {resultsCount +
                " " +
                translationState.translation["Results"].toLowerCase()}
            </Typography>
          </Box>
        </Stack>
      )}
      {selectedResult && (
        <ResultDetails
          result={selectedResult}
          setSelectedResult={setSelectedResult}
          changeTranslation={changeTranslation}
          languageIcon={languageIcon}
        />
      )}
    </Box>
  );
};

const ResultDetails = (props) => {
  const { result, setSelectedResult, changeTranslation, languageIcon } = props;

  return (
    <Stack sx={{ height: "100%", ".MuiPaper-root": { border: 0 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <IconButton
          aria-label="goBack"
          onClick={() => setSelectedResult(undefined)}
        >
          <KeyboardBackspaceIcon
            sx={{
              color: "grey",
            }}
          />
        </IconButton>
        <Box
          sx={{
            width: "100px",
            display: "flex",
            paddingTop: "8px",
            marginLeft: "auto",
            marginRight: "8px",
          }}
        >
          <Select
            defaultValue={"EN"}
            value={
              useCookies.getCookie("language")
                ? useCookies.getCookie("language")
                : SupportedLangugesEnum.En
            }
            name="languageChoice"
            onChange={(e) => changeTranslation(e.target.value)}
            sx={{
              backgroundColor: {
                xs: "transparent",
                lg: "#FFFFFF",
              },
              color: "#1A2C54",
              fontWeight: 600,
              borderRadius: 1,
              height: "34px",
              width: "70px",
              ".MuiSelect-outlined": {
                textOverflow: "initial !important",
              },
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#BDC7DB",
                borderRight: 0,
              },
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              ".MuiSelect-icon": {
                color: "#1A2C54",
              },
            }}
          >
            <MenuItem
              key={SupportedLangugesEnum.En}
              value={SupportedLangugesEnum.En}
            >
              {SupportedLangugesEnum.En}
            </MenuItem>
            <MenuItem
              key={SupportedLangugesEnum.Es}
              value={SupportedLangugesEnum.Es}
            >
              {SupportedLangugesEnum.Es}
            </MenuItem>
            <MenuItem
              key={SupportedLangugesEnum.Ru}
              value={SupportedLangugesEnum.Ru}
            >
              {SupportedLangugesEnum.Ru}
            </MenuItem>
            <MenuItem
              key={SupportedLangugesEnum.Fr}
              value={SupportedLangugesEnum.Fr}
            >
              {SupportedLangugesEnum.Fr}
            </MenuItem>
          </Select>
          <Box
            sx={{
              width: "30px",
              border: "1px solid",
              borderColor: "#BDC7DB",
              borderTopRightRadius: 3,
              borderBottomRightRadius: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar src={languageIcon} sx={{ width: 20, height: 20 }} />
          </Box>
        </Box>
      </Box>
      <ResultValue result={result} />
    </Stack>
  );
};
export default DrawerContent;

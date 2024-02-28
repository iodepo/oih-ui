import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useAppTranslation } from "context/context/AppTranslation";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import { cutWithDots } from "components/results/ResultDetails";
import CircleIcon from "@mui/icons-material/Circle";
import Tooltip from "@mui/material/Tooltip";
import InfiniteScroll from "react-infinite-scroll-component";
import { ITEMS_PER_PAGE } from "portability/configuration";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ResultValue from "components/search-hub/ResultValue";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const StyledBox = styled("div")(() => ({
  backgroundColor: "white",
  height: "100%",
}));

const Puller = styled("div")(() => ({
  width: 30,
  height: 6,
  backgroundColor: "grey",
  borderRadius: 3,
  position: "absolute",
  top: 14,
  left: "calc(50% - 15px)",
}));

const ResultsMapMobile = (props) => {
  const {
    openSwipeDrawer,
    setOpenSwipeDrawer,
    selectedFacets,
    setSelectedFacets,
    facetSearch,
    clear,
    resultsCount,
    isLoading,
    results,
    getDataSpatialSearch,
  } = props;

  const [page, setPage] = useState(1);

  const [selectedResult, setSelectedResult] = useState(undefined);

  useEffect(() => {
    getDataSpatialSearch(page);
  }, [page]);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={openSwipeDrawer}
      onClose={() => setOpenSwipeDrawer(false)}
      onOpen={() => setOpenSwipeDrawer(true)}
      swipeAreaWidth={56}
      disableSwipeToOpen={false}
      allowSwipeInChildren
      sx={{
        ".MuiPaper-root": {
          height: `calc(60% - ${56}px)`,
          overflow: "visible",
        },
      }}
    >
      <StyledBox
        sx={{
          position: "absolute",
          top: -56,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          visibility: "visible",
          right: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <Puller />
      </StyledBox>
      <StyledBox>
        {selectedResult === undefined && (
          <Stack spacing={2} sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: "#0F1A31",
                  fontSize: "14px",
                  zIndex: 1,
                }}
              >
                Results
              </Typography>
              <IconButton
                sx={{ color: "#0F1A31" }}
                onClick={() => setOpenSwipeDrawer(false)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box>
              <Stack
                direction={"row"}
                sx={{ display: "flex", gap: 1, overflowX: "auto" }}
              >
                {selectedFacets.length > 0 &&
                  selectedFacets.map((s, index) => {
                    return (
                      <Button
                        key={index}
                        variant="contained"
                        sx={{
                          height: "24px",
                          fontSize: "12px",
                          minWidth: 0,
                          boxShadow: 0,
                          flex: "0 0 auto",
                          background: "#F6F8FA",
                          color: "#1A2C54",
                          textTransform: "none",
                          "&:hover": {
                            background: "#1A2C54",
                            color: "#F6F8FA",
                          },
                          marginBottom: 2,
                        }}
                        endIcon={
                          <CloseIcon
                            sx={{ fontSize: "16px", color: "#7B8FB7" }}
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
                  <Button
                    variant="text"
                    sx={{
                      height: "18px",
                      fontSize: "14px",
                      color: "#40AAD3",
                      fontWeight: 700,
                      textTransform: "none",
                      whiteSpace: "noWrap",
                    }}
                    onClick={() => clear()}
                  >
                    Clear filters
                  </Button>
                )}
              </Stack>
            </Box>
            <Typography
              variant="subtitle"
              sx={{
                color: "#0F1A31",
                fontSize: "14px",
                fontWeight: 700,
                zIndex: 1,
              }}
            >
              {resultsCount + " results"}
            </Typography>
            <Divider sx={{ zIndex: 1 }} />
            <Box sx={{ zIndex: 1, height: "inherit" }}>
              <TableContainer
                component={Paper}
                sx={{ boxShadow: 0, height: 300 }}
              >
                {isLoading && (
                  <CircularProgress
                    sx={{ display: "flex", margin: "0 auto" }}
                  />
                )}
                {!isLoading && (
                  <InfiniteScroll
                    dataLength={results.length}
                    next={() => {
                      setPage(page + 1);
                    }}
                    height={300}
                    hasMore={ITEMS_PER_PAGE * page < parseInt(resultsCount)}
                    loader={<h4></h4>}
                    endMessage={<p>No more items</p>}
                  >
                    <Table>
                      <TableBody>
                        {results.map((row, index2) => {
                          return (
                            <TableRow
                              key={index2}
                              hover
                              onClick={() => {
                                const response = results.find(
                                  (x) => x.index_id === row.index_id
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
                                  key={index2}
                                  display={"flex"}
                                  sx={{ flexDirection: "column", gap: 1 }}
                                >
                                  {row.name}
                                  <Box
                                    display={"flex"}
                                    sx={{ flexDirection: "row", gap: 1 }}
                                  >
                                    {row.txt_provider.map((r) => {
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
                                              <Box
                                                sx={{
                                                  fontSize: "10px",
                                                  gap: 1,
                                                }}
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
          </Stack>
        )}
        {selectedResult && (
          <ResultDetails
            result={selectedResult}
            setSelectedResult={setSelectedResult}
          />
        )}
      </StyledBox>
    </SwipeableDrawer>
  );
};

const ResultDetails = (props) => {
  const { result, setSelectedResult } = props;

  return (
    <Stack
      sx={{
        height: "100%",
        ".MuiPaper-root": { border: 0, minHeight: "400px", overflowY: "auto" },
      }}
    >
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
      </Box>
      <ResultValue result={result} />
    </Stack>
  );
};

export default ResultsMapMobile;

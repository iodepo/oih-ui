import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import OutlinedInput from "@mui/material/OutlinedInput";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppTranslation } from "ContextManagers/context/AppTranslation";
import Alert from "@mui/material/Alert";

const AdvancedSearch = (props) => {
  const { setSearchQuery, searchQuery } = props;

  const translationState = useAppTranslation();
  const [counter, setCounter] = useState(1);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchAdvancedQuery, setSearchAdvancedQuery] = useState({
    0: {
      category: "Topic",
      subCategory: "Documents",
      operator: "Contains",
      textfield: "",
    },
  });

  const createSearchQuery = () => {
    const keys = Object.keys(searchAdvancedQuery);

    keys.forEach((k) => {});
  };
  return (
    <>
      <Grid item container gap={1}>
        <Grid item xs={12} lg={7}>
          <Typography
            variant="body2"
            alignItems={"start"}
            display={{ xs: "none", lg: "flex" }}
            sx={{ color: "#BDC7DB" }}
          >
            <LightbulbOutlinedIcon sx={{ color: "#F8BB27" }} />
            {translationState.translation["Pro Tip"]}
          </Typography>
        </Grid>
        <Grid item lg={12} />
        <Grid item lg={12}>
          <Typography
            variant="body1"
            alignItems={"start"}
            sx={{ color: "#1A2C54", fontWeight: 700, fontSize: "16px" }}
          >
            Filter
          </Typography>
        </Grid>
        <Grid
          item
          container
          columnGap={1}
          rowGap={1}
          lg={8}
          display={{ xs: "flex", lg: "flex" }}
        >
          {Object.keys(searchAdvancedQuery).map((key) => {
            return (
              <Grid item xs={12} lg={12} key={key}>
                <Box display={{ lg: "none" }} sx={{ marginBottom: 1 }}>
                  <Grid container display={"flex"} spacing={1}>
                    <Grid item xs={10}>
                      <Select
                        defaultValue="Topic"
                        sx={{
                          color: "#1A2C54",
                          fontWeight: 600,
                          borderRadius: 1,
                          height: "40px",
                          width: "100%",
                        }}
                        onChange={(e) => {
                          const obj = {
                            ...searchAdvancedQuery[key],
                            category: e.target.value,
                          };
                          setSearchAdvancedQuery({
                            ...searchAdvancedQuery,
                            [key]: obj,
                          });
                        }}
                      >
                        <MenuItem value="Topic">
                          {translationState.translation["Topic"]}
                        </MenuItem>
                        <MenuItem value="Provider">
                          {translationState.translation["Provider"]}
                        </MenuItem>
                        <MenuItem value="Authors">
                          {translationState.translation["Authors"]}
                        </MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton
                        aria-label="add"
                        sx={{
                          border: " 1px solid #aaa",
                          borderRadius: "6px",
                          backgroundColor: "#D8EEDE",
                          marginRight: 1,
                        }}
                        onClick={() => {
                          const obj = {
                            category: "Topic",
                            subCategory: "Documents",
                            operator: "Contains",
                            textfield: "",
                          };
                          setSearchAdvancedQuery({
                            ...searchAdvancedQuery,
                            [counter]: obj,
                          });
                          setCounter(counter + 1);
                        }}
                      >
                        <AddIcon sx={{ color: "#2DA44E" }} />
                      </IconButton>
                      {Object.keys(searchAdvancedQuery).length > 1 && (
                        <IconButton
                          aria-label="remove"
                          sx={{
                            border: " 1px solid #aaa",
                            borderRadius: "6px",
                            backgroundColor: "#FBE5E6",
                          }}
                          onClick={(e) => {
                            const updatedSearchAdvancedQuery = {
                              ...searchAdvancedQuery,
                            };

                            delete updatedSearchAdvancedQuery[key];

                            /* const sortedKeys = Object.keys(
                          updatedSearchAdvancedQuery
                        ).sort();

                        const newSearchAdvancedQuery = {};
                        sortedKeys.forEach((sortedKey, index) => {
                          newSearchAdvancedQuery[index] =
                            updatedSearchAdvancedQuery[sortedKey];
                        });
 */
                            setSearchAdvancedQuery(updatedSearchAdvancedQuery);
                          }}
                        >
                          <DeleteIcon sx={{ color: "#CC0000" }} />
                        </IconButton>
                      )}
                    </Grid>
                    {searchAdvancedQuery[key].category === "Topic" && (
                      <Grid item xs={12}>
                        <Select
                          defaultValue="Documents"
                          sx={{
                            color: "#1A2C54",
                            fontWeight: 600,
                            borderRadius: 1,
                            height: "40px",
                            width: "100%",
                          }}
                          onChange={(e) => {
                            const obj = {
                              ...searchAdvancedQuery[key],
                              subCategory: e.target.value,
                            };
                            setSearchAdvancedQuery({
                              ...searchAdvancedQuery,
                              [key]: obj,
                            });
                          }}
                        >
                          <MenuItem value="Documents">
                            {translationState.translation["Documents"]}
                          </MenuItem>
                        </Select>
                      </Grid>
                    )}
                    {searchAdvancedQuery[key].category === "Provider" && (
                      <Grid item xs={12}>
                        <Select
                          defaultValue="Aquadocs"
                          sx={{
                            color: "#1A2C54",
                            fontWeight: 600,
                            borderRadius: 1,
                            height: "40px",
                            width: "100%",
                          }}
                          onChange={(e) => {
                            const obj = {
                              ...searchAdvancedQuery[key],
                              subCategory: e.target.value,
                            };
                            setSearchAdvancedQuery({
                              ...searchAdvancedQuery,
                              [key]: obj,
                            });
                          }}
                        >
                          <MenuItem value="Aquadocs">Aquadocs</MenuItem>
                        </Select>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Select
                        defaultValue="Contains"
                        sx={{
                          color: "#1A2C54",
                          fontWeight: 600,
                          borderRadius: 1,
                          height: "40px",
                          width: "100%",
                        }}
                      >
                        <MenuItem value="Contains">Contains</MenuItem>
                        <MenuItem value="NotContains">Not Contains</MenuItem>
                        <MenuItem value="Equals">Equals</MenuItem>
                        <MenuItem value="Not Equals">Not Equals</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12}>
                      <OutlinedInput
                        sx={{ height: "40px", marginRight: 4, width: "100%" }}
                        onInput={(e) => {
                          const obj = {
                            ...searchAdvancedQuery[key],
                            textfield: e.target.value,
                          };
                          setSearchAdvancedQuery({
                            ...searchAdvancedQuery,
                            [key]: obj,
                          });
                        }}
                        value={_.textfield}
                        placeholder="Please enter text"
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box
                  display={{ xs: "none", lg: "flex" }}
                  alignItems={"center"}
                  columnGap={1}
                >
                  <Select
                    defaultValue="Topic"
                    sx={{
                      color: "#1A2C54",
                      fontWeight: 600,
                      borderRadius: 1,
                      height: "40px",
                    }}
                    onChange={(e) => {
                      const obj = {
                        ...searchAdvancedQuery[key],
                        category: e.target.value,
                      };
                      setSearchAdvancedQuery({
                        ...searchAdvancedQuery,
                        [key]: obj,
                      });
                    }}
                  >
                    <MenuItem value="Topic">
                      {translationState.translation["Topic"]}
                    </MenuItem>
                    <MenuItem value="Provider">
                      {translationState.translation["Provider"]}
                    </MenuItem>
                    <MenuItem value="Authors">
                      {translationState.translation["Authors"]}
                    </MenuItem>
                  </Select>

                  {searchAdvancedQuery[key].category === "Topic" && (
                    <Select
                      defaultValue="Documents"
                      sx={{
                        color: "#1A2C54",
                        fontWeight: 600,
                        borderRadius: 1,
                        height: "40px",
                      }}
                      onChange={(e) => {
                        const obj = {
                          ...searchAdvancedQuery[key],
                          subCategory: e.target.value,
                        };
                        setSearchAdvancedQuery({
                          ...searchAdvancedQuery,
                          [key]: obj,
                        });
                      }}
                    >
                      <MenuItem value="Documents">
                        {translationState.translation["Documents"]}
                      </MenuItem>
                    </Select>
                  )}

                  {searchAdvancedQuery[key].category === "Provider" && (
                    <Select
                      defaultValue="Aquadocs"
                      sx={{
                        color: "#1A2C54",
                        fontWeight: 600,
                        borderRadius: 1,
                        height: "40px",
                      }}
                      onChange={(e) => {
                        const obj = {
                          ...searchAdvancedQuery[key],
                          subCategory: e.target.value,
                        };
                        setSearchAdvancedQuery({
                          ...searchAdvancedQuery,
                          [key]: obj,
                        });
                      }}
                    >
                      <MenuItem value="Aquadocs">Aquadocs</MenuItem>
                    </Select>
                  )}

                  <Select
                    defaultValue="Contains"
                    sx={{
                      color: "#1A2C54",
                      fontWeight: 600,
                      borderRadius: 1,
                      height: "40px",
                    }}
                  >
                    <MenuItem value="Contains">Contains</MenuItem>
                    <MenuItem value="NotContains">Not Contains</MenuItem>
                    <MenuItem value="Equals">Equals</MenuItem>
                    <MenuItem value="Not Equals">Not Equals</MenuItem>
                  </Select>

                  <OutlinedInput
                    sx={{ height: "40px", marginRight: 4, width: "250px" }}
                    onInput={(e) => {
                      const obj = {
                        ...searchAdvancedQuery[key],
                        textfield: e.target.value,
                      };
                      setSearchAdvancedQuery({
                        ...searchAdvancedQuery,
                        [key]: obj,
                      });
                    }}
                    value={_.textfield}
                    placeholder="Please enter text"
                  />

                  <IconButton
                    aria-label="add"
                    sx={{
                      border: " 1px solid #aaa",
                      borderRadius: "6px",
                      backgroundColor: "#D8EEDE",
                    }}
                    onClick={() => {
                      const obj = {
                        category: "Topic",
                        subCategory: "Documents",
                        operator: "Contains",
                        textfield: "",
                      };
                      setSearchAdvancedQuery({
                        ...searchAdvancedQuery,
                        [counter]: obj,
                      });
                      setCounter(counter + 1);
                    }}
                  >
                    <AddIcon sx={{ color: "#2DA44E" }} />
                  </IconButton>
                  {Object.keys(searchAdvancedQuery).length > 1 && (
                    <IconButton
                      aria-label="remove"
                      sx={{
                        border: " 1px solid #aaa",
                        borderRadius: "6px",
                        backgroundColor: "#FBE5E6",
                      }}
                      onClick={(e) => {
                        debugger;
                        const updatedSearchAdvancedQuery = {
                          ...searchAdvancedQuery,
                        };

                        delete updatedSearchAdvancedQuery[key];

                        /* const sortedKeys = Object.keys(
                          updatedSearchAdvancedQuery
                        ).sort();

                        const newSearchAdvancedQuery = {};
                        sortedKeys.forEach((sortedKey, index) => {
                          newSearchAdvancedQuery[index] =
                            updatedSearchAdvancedQuery[sortedKey];
                        });
 */
                        setSearchAdvancedQuery(updatedSearchAdvancedQuery);
                      }}
                    >
                      <DeleteIcon sx={{ color: "#CC0000" }} />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            );
          })}
          {alertMessage && (
            <Grid item xs={12}>
              <Alert severity="error">{alertMessage}</Alert>
            </Grid>
          )}
          <Grid
            item
            xs={12}
            display={"flex"}
            flexDirection={{ xs: "column", lg: "row" }}
            sx={{ width: "100%" }}
          >
            <Button
              variant="contained"
              disableElevation
              sx={{
                borderRadius: 2,
                backgroundColor: "#40AAD3",
                textTransform: "none",
              }}
            >
              {translationState.translation["Apply"]}
            </Button>
            <Button
              variant="text"
              disableElevation
              onClick={() =>
                setSearchAdvancedQuery([
                  {
                    id: 0,
                    category: "Topic",
                    subCategory: "Documents",
                    operator: "Contains",
                    textfield: "",
                  },
                ])
              }
              sx={{
                color: "#2B498C",
                textTransform: "none",
                fontSize: "14px",
                padding: 0,
              }}
            >
              {translationState.translation["Clear"]}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default AdvancedSearch;

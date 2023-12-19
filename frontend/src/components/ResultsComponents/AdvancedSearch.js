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
import RemoveIcon from "@mui/icons-material/Remove";

const AdvancedSearch = (props) => {
  const { setSearchQuery, searchQuery } = props;

  const [counter, setCounter] = useState(1);
  const [searchAdvancedQuery, setSearchAdvancedQuery] = useState({
    0: {
      category: "Topic",
      subCategory: "Documents",
      operator: "Contains",
      textfield: "",
    },
  });
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
            ProTip! Enhance your search precision with AND, OR, and XOR
            operators, and filter results using 'contains' and 'not contains.'
            Specify 'all' or 'any' to fine-tune your query.
          </Typography>
        </Grid>
        <Grid item lg={12} />
        <Grid item lg={12}>
          <Typography
            variant="body1"
            alignItems={"start"}
            sx={{ color: "#1A2C54", fontWeight: 700 }}
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
          display={{ xs: "none", lg: "flex" }}
        >
          {Object.keys(searchAdvancedQuery).map((key) => {
            console.log(key);
            return (
              <Grid item lg={12}>
                <Box display="flex" alignItems={"center"} columnGap={1}>
                  <Select
                    defaultValue="Topic"
                    sx={{
                      color: "#1A2C54",
                      fontWeight: 600,
                      borderRadius: 1,
                      height: "40px",
                    }}
                  >
                    <MenuItem value="Topic">Topic</MenuItem>
                    <MenuItem value="Provider">Provider</MenuItem>
                  </Select>

                  <Select
                    defaultValue="Documents"
                    sx={{
                      color: "#1A2C54",
                      fontWeight: 600,
                      borderRadius: 1,
                      height: "40px",
                    }}
                  >
                    <MenuItem value="Documents">Documents</MenuItem>
                  </Select>

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

                  <ButtonGroup
                    disableElevation
                    variant="contained"
                    aria-label="Disabled elevation buttons"
                  >
                    <IconButton
                      aria-label="add"
                      sx={{
                        border: " 1px solid #aaa",
                        borderRadius: "6px 0 0 6px",
                      }}
                      onClick={() => {
                        setCounter((c) => c + 1);
                        const obj = {
                          id: counter,
                          category: "Topic",
                          subCategory: "Documents",
                          operator: "Contains",
                          textfield: "",
                        };
                        setSearchAdvancedQuery({ ...searchAdvancedQuery, obj });
                      }}
                    >
                      <AddIcon sx={{ color: "#1A2C54" }} />
                    </IconButton>
                    <IconButton
                      aria-label="remove"
                      sx={{
                        border: " 1px solid #aaa",
                        borderLeft: "none",
                        borderRadius: "0 6px 6px 0",
                      }}
                      disabled={searchAdvancedQuery.length === 1}
                      onClick={(e) => {
                        const updatedSearchAdvancedQuery = {
                          ...searchAdvancedQuery,
                        };

                        delete updatedSearchAdvancedQuery[key];

                        setSearchAdvancedQuery(updatedSearchAdvancedQuery);
                      }}
                    >
                      <RemoveIcon sx={{ color: "#1A2C54" }} />
                    </IconButton>
                  </ButtonGroup>
                </Box>
              </Grid>
            );
          })}
          <Grid item lg={12}>
            <Button
              variant="contained"
              disableElevation
              sx={{
                borderRadius: 2,
                backgroundColor: "#40AAD3",
                textTransform: "none",
              }}
            >
              Apply
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
              Clear
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default AdvancedSearch;

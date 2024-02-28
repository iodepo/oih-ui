import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";

const SearchMapMobile = (props) => {
  const { searchText, setSearchText, handleSubmit } = props;
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        padding: "6px",
        borderRadius: "8px",
        boxShadow: 3,
        display: "flex",
        gap: "6px",
      }}
    >
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
        value={searchText}
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
      <Button
        variant="contained"
        disableElevation
        sx={{
          backgroundColor: "#40AAD3",
          height: "32px",
          borderRadius: 2,
          width: "auto",
          textTransform: "none",
        }}
        onClick={() => {
          handleSubmit();
        }}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchMapMobile;

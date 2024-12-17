import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { cutWithDots } from "components/results/ResultDetails";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import useCookies from "context/useCookies";
import { SupportedLangugesEnum } from "context/AppTranslationProvider";
import { useAppTranslation } from "context/context/AppTranslation";
import TranslateIcon from "@mui/icons-material/Translate";

const HeaderDrawer = (props) => {
  const {
    changeTranslation,
    
    selectedFacets,
    facetSearch,
    searchText,
    setSearchText,
    handleSubmit,
    setSelectedFacets,
    clear,
  } = props;

  const translationState = useAppTranslation();
  const palette = "custom.mapView.desktop.drawer.";
  return (
    <>
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
          <TranslateIcon sx={{ width: 20, height: 20 }} />
        </Box>
      </Box>
      <Box p={"10px 20px 40px 20px"}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction={"row"} spacing={1} useFlexGap flexWrap="wrap">
              {selectedFacets.length > 0 &&
                selectedFacets.map((s, i) => {
                  return (
                    <Button
                      key={i}
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
                color: palette + "colorTypography",
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
    </>
  );
};

export default HeaderDrawer;

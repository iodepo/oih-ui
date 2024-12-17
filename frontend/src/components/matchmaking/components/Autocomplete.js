import { SITE_KEY_AUTOCOMPLETE } from "portability/configuration";
import React from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import TextField from "@mui/material/TextField";

const AutocompleteGoogle = (props) => {
  const { onSelectPlace } = props;
  const { ref } = usePlacesWidget({
    apiKey: SITE_KEY_AUTOCOMPLETE,
    onPlaceSelected: (place) => {
      onSelectPlace(place);
    },
  });
  return (
    <TextField fullWidth label="Address" variant="outlined" inputRef={ref} />
  );
};

export default AutocompleteGoogle;

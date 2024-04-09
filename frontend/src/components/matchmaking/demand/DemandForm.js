import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import schemaValidation from "../schemaValidation";
import Box from "@mui/material/Box";
import SendIcon from "@mui/icons-material/Send";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextField from "@mui/material/TextField";
import DrawPolygonMap from "../DrawPolygonMap";
import Autocomplete from "@mui/material/Autocomplete";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const DemandForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const [itemRequested, setItemRequested] = useState("creative-work");
  const [areaServed, setAreaServed] = useState("admin");
  const [eligibleRegion, setEligibleRegion] = useState("geo");
  const [imageProduct, setImageProduct] = useState(null);
  const [fileNameProduct, setFileNameProduct] = useState("");
  const [imageSection, setImageSection] = useState(null);
  const [fileNameSection, setFileNameSection] = useState("");
  const [geoJsonAreaServed, setGeoJsonAreaServed] = useState();
  const [geoJsonEligibleRegion, setGeoJsonEligibleRegion] = useState();
  const onSubmit = (data) => console.log(data);

  const handleFileChangeProduct = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setImageProduct(imageUrl);
        setFileNameProduct(file.name);
      } else {
        alert("Please select an image file.");
      }
    }
  };

  const handleFileChangeSection = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setImageSection(imageUrl);
        setFileNameSection(file.name);
      } else {
        alert("Please select an image file.");
      }
    }
  };
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          padding: "10px",
          mt: "40px",
          mb: 2,
        }}
      >
        <Typography
          variant="body1"
          alignItems={"start"}
          textAlign="center"
          sx={{
            color: "grey",
            fontWeight: 700,
            fontSize: "22px",
          }}
        >
          Demand Form
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            padding: "40px",
            background: "#E8EDF27F",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid container rowSpacing={4} columnSpacing={2}>
            <Grid item xs={12} lg={6}>
              <TextField
                {...register("email")}
                fullWidth
                error={errors.email ? true : false}
                label="Email"
                variant="outlined"
                helperText={errors.email?.message || ""}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                {...register("name")}
                error={errors.name ? true : false}
                label="Name"
                variant="outlined"
                helperText={errors.name?.message || ""}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                {...register("description")}
                fullWidth
                error={errors.description ? true : false}
                label="Description"
                multiline
                minRows={4}
                helperText={errors.description?.message || ""}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                {...register("disDescription")}
                fullWidth
                error={errors.disDescription ? true : false}
                label="Disambiguating Description"
                multiline
                minRows={4}
                helperText={errors.disDescription?.message || ""}
              />
            </Grid>
            {/* IDENTIFIER */}
            <Grid
              item
              container
              xs={12}
              lg={12}
              rowSpacing={2}
              columnSpacing={2}
            >
              <Grid item xs={12} lg={12}>
                <Divider textAlign="left" sx={{ fontWeight: 700 }}>
                  IDENTIFIER
                </Divider>
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  {...register("identifierUrl")}
                  fullWidth
                  error={errors.identifierUrl ? true : false}
                  label="URL"
                  variant="outlined"
                  helperText={errors.identifierUrl?.message || ""}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  {...register("identifierDescription")}
                  fullWidth
                  error={errors.identifierDescription ? true : false}
                  label="Description"
                  variant="outlined"
                  multiline
                  minRows={4}
                  helperText={errors.identifierDescription?.message || ""}
                />
              </Grid>
            </Grid>
            {/* ITEM REQUESTED */}
            <Grid
              item
              container
              xs={12}
              lg={12}
              rowSpacing={2}
              columnSpacing={2}
            >
              <Grid item xs={12} lg={12}>
                <Divider textAlign="left" sx={{ fontWeight: 700 }}>
                  ITEM REQUESTED
                </Divider>
              </Grid>
              <Grid item xs={12} lg={12}>
                <RadioGroup
                  row
                  name="row-radio-item-requested"
                  sx={{ display: "flex", justifyContent: "space-between" }}
                  value={itemRequested}
                  onChange={(e) => setItemRequested(e.target.value)}
                >
                  <FormControlLabel
                    value="creative-work"
                    control={<Radio />}
                    label="Creative Work"
                  />
                  <FormControlLabel
                    value="event"
                    control={<Radio />}
                    label="Event"
                  />
                  <FormControlLabel
                    value="product"
                    control={<Radio />}
                    label="Product"
                  />
                  <FormControlLabel
                    value="service"
                    control={<Radio />}
                    label="Service"
                  />
                </RadioGroup>
              </Grid>
              {/* CREATIVE WORK */}
              {itemRequested === "creative-work" && (
                <>
                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("creativeName")}
                      fullWidth
                      error={errors.creativeName ? true : false}
                      label="Name"
                      variant="outlined"
                      helperText={errors.creativeName?.message || ""}
                    />
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("creativeURL")}
                      fullWidth
                      error={errors.creativeURL ? true : false}
                      label="URL"
                      variant="outlined"
                      helperText={errors.creativeURL?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("creativeDescription")}
                      fullWidth
                      error={errors.creativeDescription ? true : false}
                      label="Description"
                      multiline
                      minRows={4}
                      variant="outlined"
                      helperText={errors.creativeDescription?.message || ""}
                    />
                  </Grid>
                </>
              )}

              {/* EVENT */}
              {itemRequested === "event" && (
                <>
                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("eventName")}
                      fullWidth
                      error={errors.eventName ? true : false}
                      label="Name"
                      variant="outlined"
                      helperText={errors.eventName?.message || ""}
                    />
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("eventURL")}
                      fullWidth
                      error={errors.eventURL ? true : false}
                      label="URL"
                      variant="outlined"
                      helperText={errors.eventURL?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("eventDescription")}
                      fullWidth
                      error={errors.eventDescription ? true : false}
                      label="Description"
                      multiline
                      minRows={4}
                      variant="outlined"
                      helperText={errors.eventDescription?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        onChange={(value) => setValue("eventStartDate", value)}
                        value={getValues().eventStartDate}
                        label="Start Date"
                        renderInput={(params) => (
                          <TextField
                            error={errors.eventStartDate ? true : false}
                            helperText={errors.eventStartDate?.message || ""}
                            margin="normal"
                            name="startDate"
                            variant="standard"
                            fullWidth
                            {...params}
                          />
                        )}
                        defaultValue={dayjs("2022-04-17")}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        onChange={(value) => setValue("eventEndDate", value)}
                        value={getValues().eventEndDate}
                        label="End Date"
                        renderInput={(params) => (
                          <TextField
                            error={errors.eventEndDate ? true : false}
                            helperText={errors.eventEndDate?.message || ""}
                            margin="normal"
                            name="endDate"
                            variant="standard"
                            fullWidth
                            {...params}
                          />
                        )}
                        defaultValue={dayjs("2022-04-17")}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("eventLocation")}
                      fullWidth
                      error={errors.eventLocation ? true : false}
                      label="Location"
                      variant="outlined"
                      helperText={errors.eventLocation?.message || ""}
                    />
                  </Grid>
                </>
              )}

              {/* PRODUCT */}
              {itemRequested === "product" && (
                <>
                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("productName")}
                      fullWidth
                      error={errors.productName ? true : false}
                      label="Name"
                      variant="outlined"
                      helperText={errors.productName?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("productURL")}
                      fullWidth
                      error={errors.productURL ? true : false}
                      label="URL"
                      variant="outlined"
                      helperText={errors.productURL?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("productDescription")}
                      fullWidth
                      error={errors.productDescription ? true : false}
                      label="Description"
                      multiline
                      minRows={4}
                      variant="outlined"
                      helperText={errors.productDescription?.message || ""}
                    />
                  </Grid>
                  <Grid
                    item
                    container
                    xs={12}
                    lg={12}
                    rowSpacing={2}
                    columnSpacing={2}
                    sx={{ padding: "24px" }}
                  >
                    <Grid item xs={12} lg={12}>
                      <Divider textAlign="left" sx={{ fontWeight: 700 }}>
                        IMAGE
                      </Divider>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <TextField
                        {...register("productImageExternalURL")}
                        fullWidth
                        error={errors.productImageExternalURL ? true : false}
                        label="External URL"
                        variant="outlined"
                        helperText={
                          errors.productImageExternalURL?.message || ""
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      lg={6}
                      display={"flex"}
                      alignItems={"center"}
                      gap={"24px"}
                    >
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload file
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          onChange={handleFileChangeProduct}
                        />
                      </Button>
                      {imageProduct && (
                        <Typography variant="body1">
                          File name: <b>{fileNameProduct}</b>
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <TextField
                        {...register("productImageName")}
                        fullWidth
                        error={errors.productImageName ? true : false}
                        label="Name"
                        variant="outlined"
                        helperText={errors.productImageName?.message || ""}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <TextField
                        {...register("productImageDescription")}
                        fullWidth
                        error={errors.productImageDescription ? true : false}
                        label="Description"
                        variant="outlined"
                        multiline
                        minRows={4}
                        helperText={
                          errors.productImageDescription?.message || ""
                        }
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              {/* SERVICE */}
              {itemRequested === "service" && (
                <>
                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("serviceName")}
                      fullWidth
                      error={errors.serviceName ? true : false}
                      label="Name"
                      variant="outlined"
                      helperText={errors.serviceName?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("serviceURL")}
                      fullWidth
                      error={errors.serviceURL ? true : false}
                      label="URL"
                      variant="outlined"
                      helperText={errors.serviceURL?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("serviceProvider")}
                      fullWidth
                      error={errors.serviceProvider ? true : false}
                      label="Provider"
                      variant="outlined"
                      helperText={errors.serviceProvider?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <TextField
                      {...register("serviceType")}
                      fullWidth
                      error={errors.serviceType ? true : false}
                      label="Service Type"
                      variant="outlined"
                      helperText={errors.serviceType?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <TextField
                      {...register("serviceDescription")}
                      fullWidth
                      error={errors.serviceDescription ? true : false}
                      label="Description"
                      variant="outlined"
                      multiline
                      minRows={4}
                      helperText={errors.serviceDescription?.message || ""}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            {/* IMAGE */}
            <Grid
              item
              container
              xs={12}
              lg={12}
              rowSpacing={2}
              columnSpacing={2}
            >
              <Grid item xs={12} lg={12}>
                <Divider textAlign="left" sx={{ fontWeight: 700 }}>
                  IMAGE
                </Divider>
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  {...register("imageExternalURL")}
                  fullWidth
                  error={errors.imageExternalURL ? true : false}
                  label="External URL"
                  variant="outlined"
                  helperText={errors.imageExternalURL?.message || ""}
                />
              </Grid>
              <Grid
                item
                xs={12}
                lg={6}
                display={"flex"}
                alignItems={"center"}
                gap={"24px"}
              >
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload file
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChangeSection}
                  />
                </Button>
                {imageSection && (
                  <Typography variant="body1">
                    File name: <b>{fileNameSection}</b>
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  {...register("imageName")}
                  fullWidth
                  error={errors.imageName ? true : false}
                  label="Name"
                  variant="outlined"
                  helperText={errors.imageName?.message || ""}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  {...register("imageDescription")}
                  fullWidth
                  error={errors.imageDescription ? true : false}
                  label="Description"
                  variant="outlined"
                  multiline
                  minRows={4}
                  helperText={errors.imageDescription?.message || ""}
                />
              </Grid>
            </Grid>
            {/* MAIN ENTITY OF THE PAGE */}
            <Grid
              item
              container
              xs={12}
              lg={12}
              rowSpacing={2}
              columnSpacing={2}
            >
              <Grid item xs={12} lg={12}>
                <Divider textAlign="left" sx={{ fontWeight: 700 }}>
                  MAIN ENTITY OF THE PAGE
                </Divider>
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  {...register("mainUrl")}
                  fullWidth
                  error={errors.mainUrl ? true : false}
                  label="URL"
                  variant="outlined"
                  helperText={errors.mainUrl?.message || ""}
                />
              </Grid>
            </Grid>
            {/* AREA SERVED */}
            <Grid
              item
              container
              xs={12}
              lg={12}
              rowSpacing={2}
              columnSpacing={2}
            >
              <Grid item xs={12} lg={12}>
                <Divider textAlign="left" sx={{ fontWeight: 700 }}>
                  AREA SERVED
                </Divider>
              </Grid>
              <Grid item xs={12} lg={12}>
                <RadioGroup
                  row
                  name="row-radio-item-requested"
                  sx={{ display: "flex", justifyContent: "space-between" }}
                  value={areaServed}
                  onChange={(e) => setAreaServed(e.target.value)}
                >
                  <FormControlLabel
                    value="admin"
                    control={<Radio />}
                    label="Administrative Area"
                  />
                  <FormControlLabel
                    value="geo"
                    control={<Radio />}
                    label="Geo Shape"
                  />
                  <FormControlLabel
                    value="place"
                    control={<Radio />}
                    label="Place"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </Grid>
              {/* ADMINISTRATIVE AREA */}
              {areaServed === "admin" && (
                <>
                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("adminName")}
                      fullWidth
                      error={errors.adminName ? true : false}
                      label="Name"
                      variant="outlined"
                      helperText={errors.adminName?.message || ""}
                    />
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("adminAddress")}
                      fullWidth
                      error={errors.adminAddress ? true : false}
                      label="Address"
                      variant="outlined"
                      helperText={errors.adminAddress?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <TextField
                      {...register("adminDescription")}
                      fullWidth
                      error={errors.adminDescription ? true : false}
                      label="Description"
                      multiline
                      minRows={4}
                      variant="outlined"
                      helperText={errors.adminDescription?.message || ""}
                    />
                  </Grid>
                </>
              )}

              {/* GEO SHAPE */}
              {areaServed === "geo" && (
                <>
                  <Grid item xs={12} lg={12}>
                    <DrawPolygonMap
                      setGeoJson={setGeoJsonAreaServed}
                      id={"area_served_map"}
                    />
                  </Grid>
                </>
              )}
              {/* PLACE */}

              {areaServed === "place" && (
                <>
                  <Grid item xs={12} lg={12}>
                    <Autocomplete
                      disablePortal
                      options={[]}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...register("areaServedPlace")}
                          error={errors.areaServedPlace ? true : false}
                          helperText={errors.areaServedPlace?.message || ""}
                          label="Place"
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

              {areaServed === "other" && (
                <>
                  <Grid item xs={12} lg={12}>
                    <TextField
                      {...register("areaServedOther")}
                      fullWidth
                      error={errors.areaServedOther ? true : false}
                      label="Other"
                      variant="outlined"
                      helperText={errors.areaServedOther?.message || ""}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            {/* ELIGIBLE REGION */}
            <Grid
              item
              container
              xs={12}
              lg={12}
              rowSpacing={2}
              columnSpacing={2}
            >
              <Grid item xs={12} lg={12}>
                <Divider textAlign="left" sx={{ fontWeight: 700 }}>
                  ELIGIBLE REGION
                </Divider>
              </Grid>
              <Grid item xs={12} lg={12}>
                <RadioGroup
                  row
                  name="row-radio-item-requested"
                  sx={{ display: "flex", justifyContent: "space-between" }}
                  value={eligibleRegion}
                  onChange={(e) => setEligibleRegion(e.target.value)}
                >
                  <FormControlLabel
                    value="geo"
                    control={<Radio />}
                    label="Geo Shape"
                  />
                  <FormControlLabel
                    value="place"
                    control={<Radio />}
                    label="Place"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </Grid>

              {/* GEO SHAPE */}
              {eligibleRegion === "geo" && (
                <>
                  <Grid item xs={12} lg={12}>
                    <DrawPolygonMap
                      setGeoJson={setGeoJsonEligibleRegion}
                      id={"eligible_region_map"}
                    />
                  </Grid>
                </>
              )}

              {/* PLACE */}

              {eligibleRegion === "place" && (
                <>
                  <Grid item xs={12} lg={12}>
                    <Autocomplete
                      disablePortal
                      options={[]}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...register("eligiblePlace")}
                          error={errors.eligiblePlace ? true : false}
                          helperText={errors.eligiblePlace?.message || ""}
                          label="Place"
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

              {eligibleRegion === "other" && (
                <>
                  <Grid item xs={12} lg={12}>
                    <TextField
                      {...register("eligibleOther")}
                      fullWidth
                      error={errors.eligibleOther ? true : false}
                      label="Other"
                      variant="outlined"
                      helperText={errors.eligibleOther?.message || ""}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12} lg={12}>
                <Divider />
              </Grid>
            </Grid>
            <Grid item xs={12} lg={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  onChange={(value) => setValue("validFrom", value)}
                  value={getValues().validFrom}
                  label="Valid From"
                  renderInput={(params) => (
                    <TextField
                      error={errors.validFrom ? true : false}
                      helperText={errors.validFrom?.message || ""}
                      margin="normal"
                      name="validFrom"
                      variant="standard"
                      fullWidth
                      {...params}
                    />
                  )}
                  defaultValue={dayjs("2022-04-17")}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} lg={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  onChange={(value) => setValue("validThrough", value)}
                  value={getValues().validThrough}
                  label="Valid Through"
                  renderInput={(params) => (
                    <TextField
                      error={errors.validThrough ? true : false}
                      helperText={errors.validThrough?.message || ""}
                      margin="normal"
                      name="validThrough"
                      variant="standard"
                      fullWidth
                      {...params}
                    />
                  )}
                  defaultValue={dayjs("2022-04-17")}
                />
              </LocalizationProvider>
            </Grid>
            {/* PRICE SPECIFICATION */}
            <Grid
              item
              container
              xs={12}
              lg={12}
              rowSpacing={2}
              columnSpacing={2}
            >
              <Grid item xs={12} lg={12}>
                <Divider textAlign="left" sx={{ fontWeight: 700 }}>
                  PRICE SPECIFICATION
                </Divider>
              </Grid>
              <Grid item xs={12} lg={3}>
                <TextField
                  {...register("minPrice")}
                  fullWidth
                  error={errors.minPrice ? true : false}
                  variant="outlined"
                  helperText={errors.minPrice?.message || ""}
                  label="Min Price"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} lg={3}>
                <TextField
                  {...register("maxPrice")}
                  fullWidth
                  error={errors.maxPrice ? true : false}
                  variant="outlined"
                  helperText={errors.maxPrice?.message || ""}
                  label="Max Price"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} lg={3}>
                <TextField
                  {...register("price")}
                  fullWidth
                  error={errors.price ? true : false}
                  variant="outlined"
                  helperText={errors.price?.message || ""}
                  label="Price"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} lg={3}>
                <TextField
                  {...register("priceCurrency")}
                  fullWidth
                  error={errors.priceCurrency ? true : false}
                  variant="outlined"
                  helperText={errors.priceCurrency?.message || ""}
                  label="Price Currency"
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12} lg={12}>
                <Divider />
              </Grid>
            </Grid>
            <Grid item xs={12} lg={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  onChange={(value) => setValue("availabilityStarts", value)}
                  value={getValues().availabilityStarts}
                  label="Availability Starts"
                  renderInput={(params) => (
                    <TextField
                      error={errors.availabilityStarts ? true : false}
                      helperText={errors.availabilityStarts?.message || ""}
                      margin="normal"
                      name="availabilityStarts"
                      variant="standard"
                      fullWidth
                      {...params}
                    />
                  )}
                  defaultValue={dayjs("2022-04-17")}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} lg={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  onChange={(value) => setValue("availabilityEnds", value)}
                  value={getValues().availabilityEnds}
                  label="Availability Ends"
                  renderInput={(params) => (
                    <TextField
                      error={errors.availabilityEnds ? true : false}
                      helperText={errors.availabilityEnds?.message || ""}
                      margin="normal"
                      name="availabilityEnds"
                      variant="standard"
                      fullWidth
                      {...params}
                    />
                  )}
                  defaultValue={dayjs("2022-04-17")}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" endIcon={<SendIcon />}>
                Send
              </Button>
            </Grid>
          </Grid>

          {/*  <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker defaultValue={dayjs("2022-04-17")} />
          </LocalizationProvider> */}
        </Box>
      </form>
    </Container>
  );
};

export default DemandForm;

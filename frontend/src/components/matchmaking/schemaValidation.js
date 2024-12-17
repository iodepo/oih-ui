import * as yup from "yup";

const schemaValidation = yup
  .object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    name: yup.string().required("Name is required"),
    description: yup.string().notRequired(),
    disDescription: yup.string().notRequired(),
    identifierDescription: yup.string().notRequired(),
    identifierUrl: yup.string().url("Invalid URL format").notRequired(),
    creativeName: yup.string().notRequired(),
    creativeDescription: yup.string().notRequired(),
    creativeURL: yup.string().url("Invalid URL format").notRequired(),
    eventName: yup.string().notRequired(),
    eventDescription: yup.string().notRequired(),
    eventURL: yup.string().url("Invalid URL format").notRequired(),
    eventStartDate: yup.date().typeError("Invalid date format").notRequired(),
    eventEndDate: yup.date().typeError("Invalid date format").notRequired(),
    eventLocation: yup.string().notRequired(),
    productName: yup.string().notRequired(),
    productDescription: yup.string().notRequired(),
    productURL: yup.string().url("Invalid URL format").notRequired(),
    productImageExternalURL: yup
      .string()
      .url("Invalid URL format")
      .notRequired(),
    productImageName: yup.string().notRequired(),
    productImageDescription: yup.string().notRequired(),
    serviceName: yup.string().notRequired(),
    serviceDescription: yup.string().notRequired(),
    serviceURL: yup.string().url("Invalid URL format").notRequired(),
    serviceProvider: yup.string().notRequired(),
    serviceType: yup.string().notRequired(),
    imageExternalURL: yup.string().url("Invalid URL format").notRequired(),
    imageName: yup.string().notRequired(),
    imageDescription: yup.string().notRequired(),
    mainUrl: yup.string().url("Invalid URL format").notRequired(),
    adminName: yup.string().notRequired(),
    adminDescription: yup.string().notRequired(),
    adminAddress: yup.string().notRequired(),
    areaServedPlace: yup.string().notRequired(),
    areaServedOther: yup.string().notRequired(),
    eligiblePlace: yup.string().notRequired(),
    eligibleOther: yup.string().notRequired(),
    ineligiblePlace: yup.string().notRequired(),
    ineligibleOther: yup.string().notRequired(),
    validFrom: yup.date().typeError("Invalid date format").notRequired(),
    validThrough: yup.date().typeError("Invalid date format").notRequired(),
    minPrice: yup.number().positive("Price must be positive").notRequired(),
    maxPrice: yup.number().positive("Price must be positive").notRequired(),
    price: yup.number().positive("Price must be positive").notRequired(),
    priceCurrency: yup.string().notRequired(),
    availabilityStarts: yup
      .date()
      .typeError("Invalid date format")
      .notRequired(),
    availabilityEnds: yup.date().typeError("Invalid date format").notRequired(),
    serialNumber: yup.string().notRequired(),
    gtin: yup.string().notRequired(),
    gtinURL: yup.string().url("Invalid URL format").notRequired(),
    mpn: yup.string().notRequired(),
    givenName: yup.string().notRequired(),
    familyName: yup.string().notRequired(),
    personEmail: yup.string().email("Invalid email format").notRequired(),
    affiliation: yup.string().notRequired(),
    organName: yup.string().notRequired(),
    organEmail: yup.string().email("Invalid email format").notRequired(),
    organAddress: yup.string().notRequired(),
    durationValue: yup.string().notRequired(),
    unitCode: yup.string().notRequired(),
    unitText: yup.string().notRequired(),
  })
  .required();

export default schemaValidation;

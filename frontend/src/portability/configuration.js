import experts from "../resources/svg/experts.svg";
import institution from "../resources/svg/institution.svg";
import training from "../resources/svg/training.svg";
import documents from "../resources/svg/documents.svg";
import spatial from "../resources/svg/spatial.svg";
import vessels from "../resources/svg/vessels.svg";
import projects from "../resources/svg/projects.svg";
import datasets from "../resources/svg/datasets.svg";
/* import ReactGA from "react-ga4";

ReactGA.initialize([
  {
    trackingId: "G-QJ5XJMZFXW",
  },
]); */

export const ITEMS_PER_PAGE = 10;
/*
Field name -> Title mapping for facets.

Note that this does not include the type_ prefix, so that it will be
used for any of the dt_ or txt_ or n_ fields, if available.
*/
const fieldNameMap = {
  includedindatacatalog: "Catalog",
  jobtitle: "Job Title",
  knowsabout: "Knows About",
  knowslanguage: "Language",
  memberof: "Within Directory",
  variablemeasured: "Variable Measured",
  educationalcredentialawarded: "Credential Awarded",
  vehiclespecialusage: "Vehicle Usage",
  areaserved: "Area",
  startyear: "Starting Between",
  endyear: "Ending Between",
};

/* Name: title mapping of the regions that show up in the search bar.
  Add more items here to search different regions.
*/
const PROMOTED_REGIONS = {
  Global: "Global",
  //        'Atlantic Ocean': 'Atlantic Ocean',
  "Latin America and the Caribbean": "Latin America & the Caribbean",
  Africa: "Africa",
  Oceania: "Pacific Small Island Developing States",
  Europe: "Europe",
  Americas: "North & South America",
  Asia: "Asia",
};

/* Sample queries for the home page. 4 random items from this list will be added
   on each view/session
*/
const SAMPLE_QUERIES = [
  "Coral Reef",
  "Rare Species",
  "Pelagic",
  "Bathymetric",
  "Whale",
  "Shark",
  "Hydrothermal Vent",
  "Tidal",
  "Heavy Metals",
];

//  --  START CATEGORIES REGION --

const CATEGORIES = [
  {
    id: "CreativeWork",
    text: "Documents",
    icon: documents,
  },
  {
    id: "Person",
    text: "Experts",
    icon: experts,
  },

  {
    id: "Course",
    text: "Training",
    icon: training,
  },
  {
    id: "Dataset",
    text: "Datasets",
    icon: datasets,
  },
  {
    id: "Vehicle",
    text: "Vessels",
    icon: vessels,
  },
  {
    id: "ResearchProject",
    text: "Projects",
    icon: projects,
  },
  {
    id: "Organization",
    text: "Institutions",
    icon: institution,
  },
  {
    id: "SpatialData",
    text: "Spatial Search",
    icon: spatial,
  },
];
//  --  END CATEGORIES REGION --

// -- START REGION PALETTE --

// COLORS

const colors = {
  primaryColor: {
    main: "#2B498C",
    light: "#DEE2ED",
    light1: "#DFE4EE",
    light2: "#BDC7DB",
    dark2: "#1A2C54",
    dark1: "#13213F",
    darker: "#0F1A31",
    darker3: "#7B8FB7",
  },
  accentColor: {
    main: "#40AAD3",
  },
  brightLight: {
    main: "#E8EDF2",
  },
  neutral: {
    main: "#FFFFFF",
  },
};
const primaryPalette = {
  homepage: {
    searchBar: {
      iconsColor: colors.primaryColor.dark2,
      bgColor: colors.primaryColor.light,
      searchIcon: colors.primaryColor.light2,
      bgColorButton: colors.accentColor.main,
      colorLink: colors.primaryColor.light,
    },
    tabs: {
      bgColorBox: colors.primaryColor.darker,
      cards: {
        bgColor: colors.primaryColor.dark1,
        borderColor: colors.primaryColor.dark2,
        bgColorAvatar: colors.primaryColor.dark2,
        bgColorChip: colors.primaryColor.light1,
        labelColor: colors.primaryColor.light1,
      },
    },
    mapViewerEntrypoint: {
      colorTypography: colors.neutral.main,
      buttonBgColor: colors.accentColor.main,
    },
    searchHubEntrypoint: {
      colorTypography: colors.neutral.main,
      buttonBgColor: colors.accentColor.main,
    },
  },
  resultPage: {
    searchBar: {
      iconsColor: colors.primaryColor.dark2,
      bgColorSelectDesktop: colors.neutral.main,
      bgColorTextfieldMobile: colors.primaryColor.light,
      colorTextfield: colors.primaryColor.main,
      searchIcon: colors.primaryColor.darker3,
      iconProtip: "#F8BB27",
      bgColorButton: colors.accentColor.main,
      bgExportButton: colors.primaryColor.light,
      borderColorSelect: colors.primaryColor.light2,
      colorTextProTip: colors.primaryColor.light2,
      advancedSearch: {
        iconProtip: "#F8BB27",
        colorTextProTip: colors.primaryColor.light2,
        colorTypography: colors.primaryColor.dark2,
        dividerColor: colors.primaryColor.darker3,
        borderColor: colors.primaryColor.light,
        andOrColor: colors.primaryColor.light,
        buttonBgColor: colors.accentColor.main,
        clearButtonColor: colors.primaryColor.main,
      },
    },
    filters: {
      textFilter: colors.primaryColor.dark2,
      categoryColor: colors.primaryColor.darker3,
      categorySelectedBgColor: colors.primaryColor.brightLight,
      topicSelectedBorderColor: colors.primaryColor.main,
      providerSelectedBorderColor: colors.accentColor.main,
      bgColorChip: colors.primaryColor.light1,
      labelChipColor: colors.primaryColor.darker,
      colorButtonMobile: colors.primaryColor.light,
      colorButtonDesktop: colors.accentColor.main,
      borderColorFilterMobile: colors.primaryColor.light2,
    },
  },
  map: {
    container: {
      openBgArrow: colors.neutral.main,
      openBgArrowHover: colors.primaryColor.main,
    },
  },
};
// -- END REGION PALETTE --

// -- START REGION BACKGROUND IMAGE --

// Just change the relative path of the image
import backgroundImageUrl from "../resources/landing-bg_1400.jpeg";
const backgroundImage = `
  #home {
    flex-direction: column;
    display: flex;
    position: relative;
    min-height: 100vh;
    background: url(${backgroundImageUrl});
    background-size: 100%;
    background-position-y: -40vw;
  }

  #home::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;
// -- END REGION BACKGROUND IMAGE --

export {
  CATEGORIES,
  primaryPalette,
  backgroundImage,
  PROMOTED_REGIONS,
  fieldNameMap,
  SAMPLE_QUERIES,
};

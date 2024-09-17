import experts from "../resources/svg/experts.svg";
import institution from "../resources/svg/institution.svg";
import training from "../resources/svg/training.svg";
import documents from "../resources/svg/documents.svg";
import spatial from "../resources/svg/spatial.svg";
import vessels from "../resources/svg/vessels.svg";
import projects from "../resources/svg/projects.svg";
import datasets from "../resources/svg/datasets.svg";
import examplePartner from "../resources/partners/example.png";
import backgroundImageUrl from "../resources/landing-bg_1400.jpeg";
import { color } from "@mui/system";
/* import ReactGA from "react-ga4";

ReactGA.initialize([
  {
    trackingId: "G-QJ5XJMZFXW",
  },
]); */

export const SITE_KEY_RECAPTCHA = "6LfIRQYqAAAAAMyNprNBdj35HqjvaUpn82es5p_G";
export const SITE_KEY_AUTOCOMPLETE = "AIzaSyAn9_ET2uS44M9LkkT4q6xNqxmEGpC_1wo";

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

const idFacets = {
  keywords: "txt_keywords",
  provider: "txt_provider",
  "variable measured": "txt_variableMeasured",
  type: "type",
  "within directory": "txt_memberOf",
  language: "txt_knowsLanguage",
  "job title": "txt_jobTitle",
  "knows about": "txt_knowsAbout",
  affiliation: "txt_affiliation",
  contributor: "txt_contributor",
  author: "txt_author",
  "credential awarded": "txt_educationalCredentialAwarded",
  "vehicle usage": "txt_vehicleSpecialUsage",
  area: "txt_areaServed",
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

// -- START PARTNERS REGION --

const PARTNERS = [
  [
    { icon: examplePartner, url: "#" },
    { icon: examplePartner, url: "#" },
    { icon: examplePartner, url: "#" },
    { icon: examplePartner, url: "#" },
  ],
  [
    { icon: examplePartner, url: "#" },
    { icon: examplePartner, url: "#" },
    { icon: examplePartner, url: "#" },
    { icon: examplePartner, url: "#" },
  ],
];

// -- END PARTNERS REGION --

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
  secondaryColor: {
    lightYellow: "#F8BB27",
    lightGreen: "#1A7F37",
    darkGreen: "#2DA44E",
    lightGrey: "#EAEDF4",
    darkerGrey: "#DFE1E6",
    lightRed: "#FBE5E6",
    darkRed: "#CC0000",
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
      bgColorSelectDesktop: colors.neutral.main,
      borderColorSelect: colors.primaryColor.light2,
      colorLink: colors.primaryColor.light,
      colorIconNeutral: colors.neutral.main,
      bgTextfieldMobile: colors.secondaryColor.darkerGrey,
      colorOutlined: colors.primaryColor.darker3,
      colorUnderline: colors.neutral.main,
      colorTypography: colors.primaryColor.light2,
      iconProtip: colors.secondaryColor.lightYellow
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
    carouselPortals: {
      colorTypography: colors.neutral.main,
      colorArrows: colors.neutral.main,
    },
  },
  resultPage: {
    searchBar: {
      iconsColor: colors.primaryColor.dark2,
      bgColorSelectDesktop: colors.neutral.main,
      bgColorSelectMobile: colors.neutral.main,
      bgColorTextfieldMobile: colors.primaryColor.light,
      colorTextfield: colors.primaryColor.main,
      searchIcon: colors.primaryColor.darker3,
      iconProtip: colors.secondaryColor.lightYellow,
      bgColorButton: colors.accentColor.main,
      bgExportButton: colors.primaryColor.light,
      borderColorSelect: colors.primaryColor.light2,
      colorTextProTip: colors.primaryColor.light2,
      advancedSearch: {
        iconProtip: colors.secondaryColor.lightYellow,
        colorTextProTip: colors.primaryColor.light2,
        colorTypography: colors.primaryColor.dark2,
        dividerColor: colors.primaryColor.darker3,
        borderColor: colors.primaryColor.light,
        andOrColor: colors.primaryColor.light,
        buttonBgColor: colors.accentColor.main,
        clearButtonColor: colors.primaryColor.main,
        bgBox: colors.brightLight.main,
        bgIconDelete: colors.secondaryColor.lightRed,
        colorIconRed: colors.secondaryColor.darkRed
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
      bgTextfield: colors.neutral.main,
    },
    resultsDetails: {
      chipBorder: colors.primaryColor.darker3,
      keywordsColor: colors.primaryColor.darker3,
      keywordsBorderColor: colors.primaryColor.light2,
      topicColor: colors.primaryColor.main,
      providerColor: colors.accentColor.main,
      colorChipVerified: colors.secondaryColor.lightGreen,
      colorVerifiedAvatar: colors.secondaryColor.darkGreen,
      colorTypography: colors.primaryColor.darker,
      completenessColor: colors.secondaryColor.lightGreen,
      contributorColor: colors.secondaryColor.lightGreen,
      bgContributor: colors.secondaryColor.darkerGrey,
      bgViewJson: colors.secondaryColor.lightGrey,
      colorViewJson: colors.primaryColor.dark2,
    },
    support: {
      bgIconSupport: colors.primaryColor.main,
      colorIconSupport: colors.neutral.main,
      iconColor: colors.primaryColor.dark2,
      colorTypography: colors.primaryColor.dark2,
      colorSubTypography: colors.primaryColor.light2,
      colorLink: colors.accentColor.main,
    },
    pagination: {
      colorItem: colors.primaryColor.main,
    },
    recordMetadata: {
      colorTypography: colors.primaryColor.light2,
      bgBox: colors.brightLight.main
    },
  },
  mapView: {
    toolbarHome: {
      bgButton: colors.neutral.main,
      colorLayerButton: colors.primaryColor.main,
      bgLayerButtonHover: colors.primaryColor.light,
      bgGoToMapHover: colors.primaryColor.main,
      colorIconGoTo: colors.primaryColor.main,
      colorIconGoToHover: colors.neutral.main,
    },
    desktop: {
      bgIconHandleDrawer: colors.neutral.main,
      bgIconHandleDrawerHover: colors.primaryColor.main,
      colorIconHandleDrawerHover: colors.neutral.main,
      drawer: {
        bgLanguage: colors.neutral.main,
        colorLanguage: colors.primaryColor.dark2,
        borderColorLanguage: colors.primaryColor.light2,
        colorSelectedFilter: colors.primaryColor.dark2,
        bgSelectedFilter: colors.secondaryColor.lightGrey,
        colorIcon: colors.primaryColor.darker3,
        bgTableNeutral: colors.neutral.main,
        bgTable: colors.brightLight.main,
        colorTypography: colors.primaryColor.darker3,
        colorDivider: colors.primaryColor.dark2,
        bgButton: colors.accentColor.main,
        bgTextfield: colors.secondaryColor.lightGrey,
        bgHeaderTable: colors.secondaryColor.lightGrey,
      },
      toolbar: {
        bgButton: colors.neutral.main,
        colorButton: colors.primaryColor.dark2,
        colorIcon: colors.primaryColor.dark2,
        colorBox: colors.neutral.main,
        bgBox: colors.primaryColor.dark2,
        bgBox2: colors.neutral.main,
        borderColor: colors.primaryColor.light,
        colorTypographyLight: colors.primaryColor.light,
        sliderDisabled: colors.primaryColor.light,
        sliderColor: colors.primaryColor.main,
        checkedColor: colors.primaryColor.main,
        colorTypography: colors.primaryColor.dark2,
        colorTypographyLayer: colors.primaryColor.darker,
        colorSelectedLayer: colors.accentColor.main,
      },
      resultsDetails: {
        bgSelectNeutral: colors.neutral.main,
        iconKeyboardColor: colors.secondaryColor.darkerGrey,
        colorSelect: colors.primaryColor.dark2,
        borderOutlineSelect: colors.primaryColor.light2,
      },
    },
    mobile: {
      filterMap: {
        bgButton: colors.neutral.main,
        colorButton: colors.primaryColor.dark2,
        iconColor: colors.primaryColor.dark2,
        colorBox: colors.neutral.main,
        bgBox: colors.primaryColor.dark2,
        colorTypography: colors.primaryColor.dark2,
      },
      layerMap: {
        bgButton: colors.neutral.main,
        iconColor: colors.primaryColor.dark2,
        colorCloseIconTypo: colors.primaryColor.darker,
        colorSelectedLayer: colors.accentColor.main,
        colorTypography: colors.primaryColor.dark2,
        colorSlider: colors.primaryColor.main,
        checkedColor: colors.primaryColor.main,
      },
      resultsMap: {
        colorTypography: colors.primaryColor.darker,
        bgButton: colors.secondaryColor.lightGrey,
        colorButton: colors.primaryColor.dark2,
        colorButtonClear: colors.accentColor.main,
        colorProvider: colors.accentColor.main,
        bgTableNeutral: colors.neutral.main,
        bgTable: colors.brightLight.main,
      },
      searchMap: {
        bgBox: colors.neutral.main,
        colorTextfield: colors.primaryColor.darker3,
        bgButton: colors.accentColor.main,
        bgTextfield: colors.secondaryColor.lightGrey,
      },
      toolbar: {
        colorButton: colors.primaryColor.dark2,
        bgButton: colors.neutral.main,
      },
    },
  },
  matchmaking: {
    demand: {
      bgBox: "#E8EDF27F",
    },
    offer: {
      bgBox: "#E8EDF27F",
    },
  },
};
// -- END REGION PALETTE --

// -- START REGION BACKGROUND IMAGE --

// Just change the relative path of the image

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

  @media screen and (max-width: 600px) {
    #home{
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    }
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

// -- START REGION MAP CONFIG --

const centerMap = [0, 0];
const initZoom = 2;
// -- END REGION MAP CONFIG --
export {
  CATEGORIES,
  primaryPalette,
  backgroundImage,
  PROMOTED_REGIONS,
  fieldNameMap,
  SAMPLE_QUERIES,
  idFacets,
  PARTNERS,
  centerMap,
  initZoom,
};

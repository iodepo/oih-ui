# Change Site Palette

Difficulty level: ⭐

To customize the site palette, follow these steps:

1. Open the `configuration.js` file in your project.

2. Look for the section marked as "-- START REGION PALETTE --". This comment indicates the beginning of the primary site palette definition.

3. Below this comment, you'll find the definition of the colors and of primary palette divided into its components, allowing easy manipulation of colors.

Example section in the `configuration.js` file:

```javascript
// -- START REGION PALETTE --

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
  ........
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
    .....
    }
};

// -- END REGION PALETTE --
```

# Modify Tab Icons on Homepage

Difficulty level: ⭐⭐

To customize the icons associated with the tabs on the homepage, follow these steps:

1. Open the `configuration.js` file in your project.

2. Look for the section marked as "-- START CATEGORIES REGION --". This comment indicates the beginning of the categories definition for each tab.

3. Below this comment, you'll find an object containing the categories for each tab. Each tab has a property called `icon` associated with the URL of its icon.

Example section in the `configuration.js` file:

```javascript
// -- START CATEGORIES REGION --

const CATEGORIES = [
  {
    id: "CreativeWork",
    text: "Documents",
    icon: documents,  /* <----Icon */
  },
  ......
]

// -- END CATEGORIES REGION --

All icon URLs are located at the beginning of the file. If you want to use different icons, follow these additional steps:

1. Import the new icons into the /resources/svg/ folder.

2. Update the configuration.js file by importing the new icons and replacing the existing icon URLs within the category object.
```

# Adding a New Search Tab:

Difficulty level: ⭐⭐⭐

1. Open the configuration.js file and locate the section marked -- START CATEGORIES REGION --. Below this section, you'll find an object containing the categories for each tab. Add the desired new tab by providing all the necessary data, following the pattern used for other categories.Remember to set a unique ID that will be used by the application to identify the new tab:

```javascript
const CATEGORIES = [
  ......
  {
    id: "SpatialData",
    text: "Spatial Search",
    icon: spatial,
  },
  {
    id: "NewTab",
    text: "New Tab",
    icon: newIconTab,
  }

]
2. After updating configuration.js, navigate to the types folder. Create a new JSON file similar to the existing ones (you can copy and paste an existing file). Remember to rename it with the ID name entered in the `configuration.js` file. Include in the JSON file the fields that will be displayed in the search results on the Result Page.

Example:

[
  {
    "key": "txt_provider",
    "type": "circle"
  },
  {
    "key": "id",
    "type": ["truncated", "link"]
  },

  {
    "key": "txt_author",
    "type": "list",
    "label": "Author(s)"
  },
  "txt_identifier",
  {
    "key": "txt_keywords",
    "type": "keywords"
  }
]

3. In the `typesMap.js` file, add a new object to the TypesMap object at the end. Following the same logic, import the JSON related to the new tab and always use the same ID as a name.


const TypesMap = {
  ......
  ResearchProject: {
    Component: Result(ResearchProject),
  },
  NewTab:{
    Component: Result(NewTab),
  }
};
```

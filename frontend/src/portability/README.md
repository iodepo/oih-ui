# Change Site Palette

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

# Modifying Site Labels in Various Languages

To modify the labels of the site in different languages, follow these steps:

1. Search through the project files for a folder named "context".

2. Inside this folder, you'll find another folder named "stores" containing four JSON files, one for each language used on the site.

3. Starting with "en.json", you can easily locate the labels you're looking for along with their associated keys, which remain the same for every language.

4. Example:
   Let's say I'm searching for the label "Search". In the file en.json, I find:
   `"Search": "Search"`,
   In this case, the first string indicates the key, and the second one indicates its value.

So, if I want to change the translation of "Search" to Spanish, I would go to the file es.json, find the key "Search", and then change its value.

# Modifying the Homepage Carousel

To modify the carousel on the homepage, follow these simple steps:

1. Open the `configuration.js` file.

2. Look for the beginning of the section "-- START PARTNERS REGION --".

3. Under this comment, you will find an array like this:
   ```javascript
   [
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
   ```
4. Each array within the main array is a group of icons that will be displayed in the carousel. From here, you can modify, remove, and add groups or elements as desired. The important thing is to maintain the structure, meaning it should always remain as an array of arrays of objects.

# Modify Tab Icons on Homepage

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
2. After updating configuration.js, navigate to the types folder. Create a new object in the `typesResult.js` file similar to the others. Remember to name it with the ID name entered in the `configuration.js` file. Include in the object the fields that will be displayed in the search results on the Result Page. Be sure to export this new object.

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
```

3. In the `typesMap.js` file, add a new object to the TypesMap object at the end. Following the same logic, import the new object like related to the new tab and always use the same ID as a name.

```javascript
const TypesMap = {
  ......
  ResearchProject: {
    Component: ResultDetails(ResearchProject),
  },
  NewTab:{
    Component: ResultDetails(NewTab),
  }
};
```

4. In the `typesMap.js` file, you will also find another object called "createObjectExport," which is used to automate the Export functionality.

Here, too, you will need to add a new object within it, following the logic of the others.

```javascript
const createObjectExport = (docs, searchType) => {
  switch (searchType) {
  ......
  case "Organization":
      return {
        data: docs.map((d) => {
          return extractInfo(Organization, d, searchType);
        }),
        title: "Institutions",
      };
  case "NewTap":
      return {
        data: docs.map((d) => {
          return extractInfo(NewTabObj, d, searchType);
        }),
        title: "NameNewTab",
      };
  }
};
```

## Customization

### Change Site Palette

To customize the site palette, follow these steps:

1. Open the `[INSTALLDIR]/frontend/frontend/src/portability/configuration.js` file in your frontend project.

2. Look for the section marked as "-- START REGION PALETTE --". This comment indicates the beginning of the primary site palette definition.

3. Below this comment, you'll find the definition of the colors and of primary palette divided into its components, allowing easy manipulation of colors.

Example section in the `[INSTALLDIR]/frontend/frontend/src/portability/configuration.js`file:

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

### Modifying Site Labels in Various Languages

To modify the labels of the site in different languages, follow these steps:

1. Search through the project files for a dir named "context". 
Should be something like `[INSTALLDIR]/frontend/frontend/src/context/`

2. Inside this dir, you'll find another dir named "stores" containing four JSON files, one for each language used on the site. 
Should be something like `[INSTALLDIR]/frontend/frontend/src/context/stores/`

3. Starting with "en.json", you can easily locate the labels you're looking for along with their associated keys, which remain the same for every language.

4. Example:
   Let's say I'm searching for the label "Search". In the file en.json, I find:
   `"Search": "Search"`,
   In this case, the first string indicates the key, and the second one indicates its value.

So, if I want to change the translation of "Search" to Spanish, I would go to the file es.json, find the key "Search", and then change its value.

***WARNING*** changes will not be reflected in other/new installations if they are not committed in this repository and if the linke between oih-ui-docker is not update!

### Modifying the Homepage Carousel

To modify the carousel on the homepage, follow these simple steps:

1. Open the `[INSTALLDIR]/frontend/frontend/src/portability/configuration.js` file.

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
4. Each array within the main array is a group of icons that will be displayed in the carousel. From here, you can modify, remove, and add groups or elements as desired. 
The important thing is to maintain the structure, meaning it should always remain as an array of arrays of objects.
5. Upload the new image you want to see in the carousel to the `[INSTALLDIR]/frontend/frontend/src/resources/partners/` dir.
6. Update the configuration.js file and import the new image at the top of the page (e.g. 'import newIcon from "../resources/partners/newIcon.jpg";')
7. Replace the existing icon ('examplePartner') URL within the object (e.g. { icon: newIcon, url: "#" }).
8. Replace the URL with the desired link for the image (e.g. { icon: newIcon, url: "https://www.example.com" }).

### Modify Tab Icons on Homepage

To customize the icons associated with the tabs on the homepage, follow these steps:

1. Open the `[INSTALLDIR]/frontend/frontend/src/portability/configuration.js`file in your project.

2. Look for the section marked as "-- START CATEGORIES REGION --". This comment indicates the beginning of the categories definition for each tab.

3. Below this comment, you'll find an object containing the categories for each tab. Each tab has a property called `icon` associated with the URL of its icon.

Example section in the `[INSTALLDIR]/frontend/frontend/src/portability/configuration.js`file:

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
```

All icon URLs are located at the beginning of the file. If you want to use different icons, follow these additional steps:

1. Import the new icons into the `[INSTALLDIR]/frontend/frontend/src/resources/svg/` dir.

2. Update the configuration.js file by importing the new icons and replacing the existing icon URLs within the category object.
```javascript
import documentstest from "../resources/svg/documentstest.svg";
```

```javascript
const CATEGORIES = [
  {
    id: "CreativeWork",
    text: "Documents",
    icon: documentstest,
  },
```

### Adding a New Search Tab:

1. Open the configuration.js file and locate the section marked -- START CATEGORIES REGION --. 
Below this section, you'll find an object containing the categories for each tab. 
Add the desired new tab by providing all the necessary data, following the pattern used for other categories.
Add the icon URL at the top of the configuration.js file (see higher up).
Remember to set a unique ID that will be used by the application to identify the new tab:

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
```
2. After updating `configuration.js`, navigate to the `[INSTALLDIR]/frontend/frontend/src/portability/types` dir.
Create a new object in the `typesResult.js` file similar to the others. 
Remember to name it with the ID name entered in the `[INSTALLDIR]/frontend/frontend/src/portability/configuration.js`file. 
Include in the object the fields that will be displayed in the search results on the Result Page. 
Be sure to export this new object.

Example:
```javascript
const newSearchTab = [
  {
    key: "txt_provider",
    type: "circle"
  },
  {
    key: "id",
    type: ["truncated", "link"]
  },

  {
    key: "txt_author",
    type: "list",
    label: "Author(s)"
  },
  "txt_identifier",
  {
    key: "txt_keywords",
    type: "keywords"
  }
];

.....


export {
  ....,
  ResearchProject,
  Vehicle,
  newSearchTab
};
```

3. In the `[INSTALLDIR]/frontend/frontend/src/portability/typesMap.js` file, add a new object to the TypesMap object at the end. Following the same logic, import the new object like related to the new tab and always use the same ID as a name.

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

4. In the`[INSTALLDIR]/frontend/frontend/src/portability/typesMap.js` file, you will also find another object called "createObjectExport," which is used to automate the Export functionality.

Here, too, you will need to add a new case to the switch condition, following the logic of the others.

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
  case "NewTab":
      return {
        data: docs.map((d) => {
          return extractInfo(NewTabObj, d, searchType);
        }),
        title: "NameNewTab",
      };
  }
};
```

5. Now you need to navigate to the sub-module 'api', following this path:
   api\api\config.json

Within this JSON file, you'll find various editable configurations, such as:
"facet_fields", where all the currently set tabs on the site and their associated facets are listed.

```javascript
 "facet_fields": {
    "Spatial": [ "txt_keywords", "txt_provider", "txt_variableMeasured", "type"],
    "Person":  [ "txt_memberOf", "txt_knowsLanguage", "txt_jobTitle", "txt_knowsAbout", "txt_affiliation", "txt_provider"],
    "Organization":  [ "txt_memberOf", "txt_provider"],
    "Dataset": [ "txt_keywords", "txt_provider", "txt_variableMeasured"],
    "CreativeWork": ["txt_keywords", "txt_provider", "txt_contributor"],
    "Course": ["txt_keywords", "txt_provider", "txt_author", "txt_educationalCredentialAwarded"],
    "Vehicle": ["txt_keywords", "txt_provider", "txt_vehicleSpecialUsage"],
    "ResearchProject":  [ "txt_keywords",  "txt_provider", "txt_areaServed"],
    "NewSearchTab": [ "txt_keywords", "txt_provider", "txt_variableMeasured"],
  },
```

So, just as done for point 2, you need to follow the same logic as the others and add the facets to associate with the new tab.

Within this file, it's also possible to modify the facets associated with other searchTabs, as well as the available_facets.

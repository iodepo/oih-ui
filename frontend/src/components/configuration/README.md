# Change Site Palette

Difficulty level: ⭐

To customize the site palette, follow these steps:

1. Open the `constants.js` file in your project.

2. Look for the section marked as "-- START REGION PALETTE --". This comment indicates the beginning of the primary site palette definition.

3. Below this comment, you'll find the definition of the primary palette divided into its components, allowing easy manipulation of colors.

Example section in the `constants.js` file:

```javascript
// -- START REGION PALETTE --

const primaryPalette = {
  homepage: {
    searchBar: {
      iconsColor: "#1A2C54",
      bgColor: "#FFFFFF",
      searchIcon: "#BDC7DB",
      bgColorButton: "#40AAD3",
      colorLink: "#FFFFFF",
    },
    .....
    }
};

// -- END REGION PALETTE --
```

# Modify Tab Icons on Homepage

Difficulty level: ⭐⭐

To customize the icons associated with the tabs on the homepage, follow these steps:

1. Open the `constants.js` file in your project.

2. Look for the section marked as "-- START CATEGORIES REGION --". This comment indicates the beginning of the categories definition for each tab.

3. Below this comment, you'll find an object containing the categories for each tab. Each tab has a property called `icon` associated with the URL of its icon.

Example section in the `constants.js` file:

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

2. Update the constants.js file by importing the new icons and replacing the existing icon URLs within the category object.
```

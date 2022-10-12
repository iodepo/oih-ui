# Web Frontend

## Running in Development

A docker-compose service like this is sufficient for running the app in development mode:
```
  web:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - REACT_APP_DATA_SERVICE_URL=https://api.${HOST}
      - VIRTUAL_HOST=${HOST}
      - VIRTUAL_PROTO=http
      - VIRTUAL_PORT=3000
    volumes:
      - "./public:/app/public"
      - "./src:/app/src"
```
(Note, adjust path prefixes to the relative path between the dockerfile and this directory

## Production Build

Run `REACT_APP_DATA_SERVICE=https://api.url.com ./build.sh` from this directory -- the production version will be added produced in `./build`. The contents can be hosted anywhere there is a static web server.

## Customization

* There are several places where there are placeholders for links to be added later:
  - `src/components/Footer.js`: The "Get In Touch" button
  - `src/components/Header.js`: "Become a partner", About, and FAQ links.

* The API url is set via an environment variable `REACT_APP_DATA_SERVICE` -- as it is the most likely thing to need to change.

* See `src/constants.js` for customization of some of the defaults:
  - The initial bounds of the map per region
  - The promoted regions (popup next to the search bar)
  - The list of possible sample queries
  - Field name -> title for the facets. (the facets themselves are added in the API)
  - The icons and names for the home page count/categories

* Configuration for app-wide defaults are in `src/config/defaults.js`, including the app title and other meta information, and the mapbox basemap and key for altering the spatial search basemap.

* All of the image assets are in `src/resources`

* The front page categories with the icons are defined in `src/components/TypesCount.js`

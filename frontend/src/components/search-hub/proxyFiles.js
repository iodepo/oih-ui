/* const mapSearch = useCallback(
    throttle((mapBounds, page) => {
      let URI = `${dataServiceUrl}/search?`;
      const params = new URLSearchParams({
        ...(searchType !== "SpatialData" ? { document_type: searchType } : {}),
        facetType: "the_geom",
        facetName: mapLibreBounds_toQuery(mapBounds, region),
        rows: ITEMS_PER_PAGE + showMorePages,
        start: page * (ITEMS_PER_PAGE + showMorePages),
      });
      if (searchText !== "") {
        params.append("search_text", searchText);
      }
      if (region && region.toUpperCase() !== "GLOBAL") {
        params.append("region", region);
      }

      URI += [params.toString(), facetQuery].filter((e) => e).join("&");
      setCurrentURI(URI);

      fetch(URI)
        .then((response) => response.json())
        .then((json) => {
          setResults(json.docs);
          setFacets(json.facets.filter((facet) => facet.counts.length > 0));
          const count = json.count;
          setResultCount(count);
          setCounts((prev) => ({ ...prev, [searchType]: count }));
        });
    }, 1000),
    [dataServiceUrl, searchText, searchType, region, facetQuery]
  ); */

/*  const [expandedMapBounds, setExpandedMapBounds] = useState(false);
  const [allowSetMapBounds] = useState(true);
  const [viewport, setViewport] = useState({});

  const updateMapBounds = useCallback(
    (bounds, viewport) => {
      setViewport(viewport);
      if (allowSetMapBounds) {
        setMapBounds(bounds);
        if (
          !expandedMapBounds ||
          !containsMapBounds(expandedMapBounds, bounds)
        ) {
          setExpandedMapBounds(expandMapBounds(bounds));
        }
      }
    },
    [expandedMapBounds, setMapBounds, setExpandedMapBounds, allowSetMapBounds]
  ); */

/*  const geoJsonUrl = useMemo(() => {
     if (showMap) {
       let geoJsonUrl = `${dataServiceUrl}/spatial.geojson?`;
       const params = new URLSearchParams({
         ...(searchType !== "SpatialData" ? { document_type: searchType } : {}),
         search_text: searchText,
         facetType: "the_geom",
         facetName: mapLibreBounds_toQuery(expandedMapBounds, region),
       });
       if (region !== "" && region.toUpperCase() !== "GLOBAL") {
         params.append("region", region);
       }
       geoJsonUrl += [params.toString(), facetQuery].filter((e) => e).join("&");
       return geoJsonUrl;
     }
     return null;
   }, [
     showMap,
     dataServiceUrl,
     searchType,
     searchText,
     region,
     expandedMapBounds,
     facetQuery,
   ]);

   const layers = useMemo(() => {
     return [
       {
         id: "search_results_layer",
         label: "Search Results",
         type: "geojson",
         url: geoJsonUrl,
         cluster: true,
       },
     ];
   }, [geoJsonUrl]);

   const [mousePos, setMousePos] = useState(undefined);
   const [selectedElem, setSelectedElem] = useState(undefined);
   const [selectedDetails, setSelectedDetails] = useState(undefined);
   const [selectHold, setSelectHold] = useState(false);
   useEffect(() => {
     if (selectedElem == undefined) {
       setSelectedDetails(undefined);
       return;
     }
     fetchDetail(selectedElem.properties.id).then((d) => {
       if (!d) {
         setSelectedDetails(undefined);
         return;
       }
       let position;
       switch (selectedElem.layer.type) {
         case "circle":
           position = /POINT +\((-?\d+\.\d+) +(-?\d+\.\d+)\)/g
             .exec(d.the_geom)
             ?.map((i) => parseFloat(i))
             ?.slice(1);
           if (position == undefined) {
             console.log(d.the_geom);
           }
           break;
         case "line":
           position = undefined;
           break;
       }
       setSelectedDetails({ detail: d, position });
     });
   }, [selectedElem?.properties?.id]);

   const tooltip = (() => {
     if (!selectedDetails || !selectedElem) return null;
     let [lng, lat] = selectedDetails.position ?? mousePos;
     while (lng - mousePos[0] > +180) {
       lng -= 360.0;
     }
     while (lng - mousePos[0] < -180) {
       lng += 360.0;
     }
     return (
       <Popup
         latitude={lat}
         longitude={lng}
         dynamicPosition={true}
         closeButton={false}
         className="w-25"
       >
         {selectedDetails.detail.name}
       </Popup>
     );
   })();

   const get_region_bounds = () => {
     const bounds = regionBoundsMap[region.replaceAll(" ", "_")];
     if (bounds) return bounds;
     else return boundsToQuery(INITIAL_BOUNDS);
   }; */

/* Inside UseEffect search */
/* const geoParams = new URLSearchParams({
        facetType: "the_geom",
        facetName: get_region_bounds(),
        include_facets: false,
        rows: 0,
      });
      if (region && region.toUpperCase() !== "GLOBAL") {
        geoParams.append("region", region);
      }
      if (searchText) {
        geoParams.append("search_text", searchText);
      }
      fetch(`${dataServiceUrl}/search?${geoParams.toString()}`)
        .then((response) => response.json())
        .then((json) =>
          setCounts((prev) => ({
            ...prev,
            SpatialData: Object.values(json.counts).reduce((x, y) => x + y, 0),
          }))
        ); */

/*  const [mapBounds, setMapBounds] = useState(false);

         const fetchDetail = (id) =>
           fetch(`${dataServiceUrl}/detail?id=${id}`).then((r) => r.json());
           
  const showMap = searchType === "SpatialData"; */

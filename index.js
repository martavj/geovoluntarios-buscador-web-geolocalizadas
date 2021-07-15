require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Locate",
  "esri/widgets/BasemapToggle",
  "esri/layers/FeatureLayer",
  "esri/widgets/Search",
  "esri/layers/GraphicsLayer",
  "esri/layers/GeoJSONLayer",
  "esri/Graphic",
], function (
  esriConfig,
  Map,
  MapView,
  Locate,
  BasemapToggle,
  FeatureLayer,
  Search,
  GraphicsLayer,
  GeoJSONLayer,
  Graphic
) {
  esriConfig.apiKey =
    "AAPK2ca6b7846e0841c8bcba6dd9cf360db76sr1bqGdjj7ZVHDmq4NhYQke3_PojP3lBlybETdhqNgGAfpz65XQA6YxpnfKGaVr";

  const map = new Map({
    basemap: "arcgis-navigation",
    // basemap: "arcgis-topographic", // Basemap layer service
  });

  const view = new MapView({
    map: map,
    center: [-3.600833, 37.178055], // Longitude, latitude
    zoom: 13, // Zoom level
    container: "mapDiv", // Div element
  });

  console.log(view.locate);
  console.log(view.center.latitude);
  console.log(view.center.longitude);

  const locationLatitude = null;
  const locationLongitude = null;

  const locate = new Locate({
    view: view,
    useHeadingEnabled: false,
    goToOverride: function (view, options) {
      options.target.scale = 1500;
      console.log(options.target);
      return view.goTo(options.target);
    },
  });

  view.ui.add(locate, "top-left");

  const basemapToggle = new BasemapToggle({
    view: view,
    basemap: "arcgis-imagery",
  });

  view.ui.add(basemapToggle, "bottom-right");

  const search = new Search({
    //Add Search widget
    view: view,
  });

  view.ui.add(search, "top-right");

  // const graphicsLayer = new GraphicsLayer();
  // map.add(graphicsLayer);

  // const point = {
  //   type: "point",
  //   longitude: view.center.longitude,
  //   latitude: view.center.latitude,
  // };

  // const simpleMarkerSymbol = {
  //   type: "simple-marker",
  //   color: [226, 119, 40],
  //   outline: {
  //     color: [255, 255, 255],
  //     width: 1,
  //   },
  // };

  // const pointGraphic = new Graphic({
  //   geometry: point,
  //   symbol: simpleMarkerSymbol,
  // });

  // graphicsLayer.add(pointGraphic);

  const geoJSONLayer = new GeoJSONLayer({
    url: "data/test.json",
  });
  geoJSONLayer.when((l) => {
    debugger;
    geoJSONLayer // queries all features in the layer
      .queryFeatures((f) => {
        debugger;
      }); // queries features and returns a FeatureSet
    // .queryExtent() // queries features returns extent of features that satisfy query
    // .queryFeatureCount() // queries features and returns count of features
    // .queryObjectIds(); // queries features and returns objectIds array of features
  });

  /*
    1. Cargar geojson (queryFeatures o fetch?)
    2. Mostrar caja de búsqueda
      2.1 Cuando se obtenga localización (location / extent)
      2.2 Intersect ubicación usando GeometryEngine.inserct(geometriasGeoJSON, localizacion)
      2.3 Devolver <ul> con los resultado
  */
});

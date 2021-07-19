require([
  "esri/config",
  "esri/geometry/Point",
  "esri/widgets/Search",
  "esri/layers/FeatureLayer",
  "esri/layers/GeoJSONLayer",
  "esri/tasks/Locator",
  "esri/geometry/geometryEngine",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
], function (
  esriConfig,
  Point,
  Search,
  FeatureLayer,
  GeoJSONLayer,
  Locator,
  geometryEngine,
  Graphic,
  GraphicsLayer
) {
  esriConfig.apiKey =
    "AAPKa5449aa4a0d744d9b96fc88d66315135gkeU8rbnhTg-U5B43hD8zxCCHXy87VQpKCjGTJeGLAC6v5aP8GPYc-BXc1YOdDsI";

  //Search widget which includes the locator. We will get the location from the results.
  const search = new Search({
    container: document.getElementById("search-box"),
    sources: [
      {
        locator: new Locator({
          url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
        }),
        singleLineFieldName: "SingleLine",
        outFields: ["Addr_type"],
        name: "ArcGIS World Geocoding Service",
        placeholder: "Address",
      },
    ],
  });

  //Use the event select results to get the coordinates
  //https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html#event-select-result

  let latitudeLocation;
  let longitudeLocation;
  let location;
  let feature;

  search.on("select-result", function (event) {
    console.log(event);
    feature = event.result.feature.geometry;
    console.log(feature);
    latitudeLocation = feature.latitude;
    longitudeLocation = feature.longitude;
    console.log(latitudeLocation);
    console.log(longitudeLocation);
    // location = {
    //   type: "point",
    //   longitude: longitudeLocation,
    //   latitude: latitudeLocation,
    // };
    // console.log(Location);
  });

  location = {
    //Create a point
    type: "point",
    longitude: longitudeLocation,
    latitude: longitudeLocation,
  };

  const simpleMarkerSymbol = {
    type: "simple-marker",
    color: [226, 119, 40], // Orange
    outline: {
      color: [255, 255, 255], // White
      width: 1,
    },
  };

  const graphicsLayer = new GraphicsLayer();

  const locationGraphic = new Graphic({
    geometry: location,
    symbol: simpleMarkerSymbol,
  });
  graphicsLayer.add(locationGraphic);

  //load the data as a new layer
  let database;

  const layer = new GeoJSONLayer({
    url: "data/test.json",
  });

  layer.queryFeatures().then(function (results) {
    console.log(results.features);
    database = results.features;
  });

  console.log(locationGraphic);
  if (locationGraphic) {
    //Use the geometry Engine to check if the location intersects the layer.
    //Intersects returns true if there is intersection
    var intersects = geometryEngine.intersects(layer, locationGraphic);
    if (intersects) {
      console.log("there is intersection!!!!");
      document.getElementById("results-box").innerHTML =
        "There is intersection";
    } else {
      console.log("there is NO intersection!!!!");
      document.getElementById("results-box").innerHTML =
        "There is NO intersection";
    }
  }
  /*
    2. Mostrar caja de búsqueda
      2.1 Cuando se obtenga localización (location / extent)
      2.2 Intersect ubicación usando GeometryEngine.inserct(geometriasGeoJSON, localizacion)
      2.3 Devolver <ul> con los resultado
  */
  //TODO
  //1. Fix intersect .
  //2. Print ul with the results.
});

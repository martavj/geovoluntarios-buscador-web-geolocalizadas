require([
  "esri/config",
  "esri/widgets/Search",
  "esri/layers/GeoJSONLayer",
  "esri/tasks/Locator",
  "esri/geometry/geometryEngine",
], function (esriConfig, Search, GeoJSONLayer, Locator, geometryEngine) {
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
    location = {
      type: "point",
      longitude: longitudeLocation,
      latitude: latitudeLocation,
    };
  });

  //load the data as a new layer
  let database;

  const layer = new GeoJSONLayer({
    url: "data/test.json",
  });

  layer.queryFeatures().then(function (results) {
    console.log(results.features);
    database = results.features;
  });

  //Use the geometry Engine to check if the location intersects the layer.
  //Intersects returns true if there is intersection
  var intersects = geometryEngine.intersects(layer, location);
  if (intersects) {
    console.log("there is intersection!!!!");
    document.getElementById("results-box").innerHTML = "There is intersection";
  }

  /*
    2. Mostrar caja de búsqueda
      2.1 Cuando se obtenga localización (location / extent)
      2.2 Intersect ubicación usando GeometryEngine.inserct(geometriasGeoJSON, localizacion)
      2.3 Devolver <ul> con los resultado
  */
});

require([
  "esri/config",
  "esri/widgets/Search",
  "esri/layers/GeoJSONLayer",
  "esri/tasks/Locator",
  "esri/geometry/geometryEngine",
], function (esriConfig, Search, GeoJSONLayer, Locator, geometryEngine) {
  esriConfig.apiKey =
    "AAPK2ca6b7846e0841c8bcba6dd9cf360db76sr1bqGdjj7ZVHDmq4NhYQke3_PojP3lBlybETdhqNgGAfpz65XQA6YxpnfKGaVr";

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
    feature = event.results.feature;
    latitudeLocation = feature.latitude;
    longitudeLocation = feature.longitude;
    location = {
      type: "point",
      longitude: longitudeLocation,
      latitude: latitudeLocation,
    };
    console.log(feature);
    console.log(location);
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

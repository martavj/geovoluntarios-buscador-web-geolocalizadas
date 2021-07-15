require([
  "esri/config",
  "esri/widgets/Search",
  "esri/layers/GeoJSONLayer",
  "esri/tasks/Locator",
], function (esriConfig, Search, GeoJSONLayer, Locator) {
  esriConfig.apiKey =
    "AAPK2ca6b7846e0841c8bcba6dd9cf360db76sr1bqGdjj7ZVHDmq4NhYQke3_PojP3lBlybETdhqNgGAfpz65XQA6YxpnfKGaVr";

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

  let database;

  const layer = new GeoJSONLayer({
    url: "data/test.json",
  });

  layer.queryFeatures().then(function (results) {
    console.log(results.features);
    database = results.features;
  });

  /*
    2. Mostrar caja de búsqueda
      2.1 Cuando se obtenga localización (location / extent)
      2.2 Intersect ubicación usando GeometryEngine.inserct(geometriasGeoJSON, localizacion)
      2.3 Devolver <ul> con los resultado
  */
});

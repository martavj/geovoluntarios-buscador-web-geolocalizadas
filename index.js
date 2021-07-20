require([
  "esri/config",
  "esri/widgets/Search",
  "esri/layers/GeoJSONLayer",
  "esri/tasks/Locator",
], function (esriConfig, Search, GeoJSONLayer, Locator) {
  esriConfig.apiKey =
    "AAPKa5449aa4a0d744d9b96fc88d66315135gkeU8rbnhTg-U5B43hD8zxCCHXy87VQpKCjGTJeGLAC6v5aP8GPYc-BXc1YOdDsI";

  //Search widget which includes the locator. We will get the location from the results.
  const search = new Search({
    container: document.getElementById("search-box"),
  });

  const watcher = search.watch("activeSource", (source) => {
    source.placeholder = "Introduce tu dirección";
    watcher.remove();
  });

  //Use the event select results to get the coordinates
  //https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html#event-select-result

  const database = new GeoJSONLayer({
    url: "data/test.json",
    // url: "data/spain-provincias.json",
  });

  const resultsBoxEl = document.getElementById("results-box");

  search.on("select-result", function (event) {
    database
      .queryFeatures({
        geometry: event.result.feature.geometry,
        spatialRelationship: "intersects",
        outFields: ["*"],
      })
      .then((res) => {
        if (res.features.length > 0) {
          resultsBoxEl.innerHTML = "";

          res.features.forEach((el) => {
            const listEl = document.createElement("li");

            listEl.innerHTML = JSON.stringify(el.attributes);
            resultsBoxEl.appendChild(listEl);
          });
        } else {
          resultsBoxEl.innerHTML = "<li>No hay resultados</li>";
        }
      })
      .catch(function (e) {
        resultsBoxEl.innerHTML =
          "<li>No se ha podido consultar la base de datos, por favor inténtelo más tarde</li>";
        console.error("query failed: ", e);
      });
  });
});

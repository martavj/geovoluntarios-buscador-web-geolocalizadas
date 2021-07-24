require([
  "esri/config",
  "esri/widgets/Search",
  "esri/layers/GeoJSONLayer",
  "esri/tasks/Locator",
], function (esriConfig, Search, GeoJSONLayer, Locator) {
  // esriConfig.apiKey =
  //   "AAPKa5449aa4a0d744d9b96fc88d66315135gkeU8rbnhTg-U5B43hD8zxCCHXy87VQpKCjGTJeGLAC6v5aP8GPYc-BXc1YOdDsI";

  esriConfig.apiKey =
    "AAPKe354c005fa8d472e87247458291f36f2PozSnMSRbTdahr63Z7a6Scx6GnwUuPUgxOlnNrId6EUOrMevHbpf6T7PuC9NVZwF";

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
            //List the results
            const listEl = document.createElement("li");

            listEl.innerHTML = JSON.stringify(el.attributes);
            resultsBoxEl.appendChild(listEl);

            //Add a button to show the location on the map
            const buttonShowMap = document.createElement("button");

            buttonShowMap.innerHTML = "Ver Localización";
            resultsBoxEl.appendChild(buttonShowMap);

            buttonShowMap.onclick = function () {
              console.log("Show map");
            };
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

//TODO

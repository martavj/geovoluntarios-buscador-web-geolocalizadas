require([
  "esri/config",
  "esri/widgets/Search",
  "esri/layers/GeoJSONLayer",
], function (esriConfig, Search, GeoJSONLayer) {
  esriConfig.apiKey = apiKey;

  // Search widget which includes the locator. We will get the location from the results.
  const search = new Search({
    container: document.getElementById("search-box"),
  });

  const watcher = search.watch("activeSource", (source) => {
    source.placeholder = "Introduce tu dirección";
    watcher.remove();
  });

  // Use the event select results to get the coordinates
  // https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html#event-select-result

  const database = new GeoJSONLayer({
    url: "data/test.json",
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
            const searchPanel = document.getElementById("search-panel");
            searchPanel.classList.remove("h-screen");
            searchPanel.classList.add("mt-10");

            const listEl = document.createElement("div");
            listEl.className = "listEl sm:flex p-2 my-5";
            const noLogo = "geosearch.png";

            listEl.innerHTML = `
              <div class="w-32 p-4">
                <img src=${
                  el.attributes.logo ? el.attributes.logo : noLogo
                }></img>
              </div>
              <div class="ml-5">
                <h1 class="name">${el.attributes.name}</h1>
                <ul class="features">
                  <li><strong>Riesgo: </strong>${
                    el.attributes.riesgo ? el.attributes.riesgo : ""
                  }</li>
                  <li><strong>Información: </strong>${
                    el.attributes.info ? el.attributes.info : ""
                  }</li>
                  <li><strong>Ámbito territorial: </strong>${
                    el.attributes.territorio ? el.attributes.territorio : ""
                  }</li>
                  <li><strong>Idiomas: </strong>${
                    el.attributes.idiomas ? el.attributes.idiomas : ""
                  }</li>
                  <li><strong>Descripción: </strong>${
                    el.attributes.descripcion ? el.attributes.descripcion : ""
                  }</li>
                </ul>
                <a class="url" href="${el.attributes.url}" target="_blank">${
              el.attributes.url
            }</a>
              </div>
            `;

            resultsBoxEl.appendChild(listEl);
          });
        } else {
          resultsBoxEl.innerHTML = "<p>No hay resultados</p>";
        }
      })
      .catch(function (e) {
        resultsBoxEl.innerHTML =
          "<p>No se ha podido consultar la base de datos, por favor inténtelo más tarde</p>";
        console.error("query failed: ", e);
      });
  });
});

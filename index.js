require([
  "esri/config",
  "esri/widgets/Search",
  "esri/layers/GeoJSONLayer",
  "esri/tasks/Locator",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
], function (
  esriConfig,
  Search,
  GeoJSONLayer,
  Locator,
  Map,
  MapView,
  GraphicsLayer,
  Graphic
) {
  esriConfig.apiKey =
    "AAPKa5449aa4a0d744d9b96fc88d66315135gkeU8rbnhTg-U5B43hD8zxCCHXy87VQpKCjGTJeGLAC6v5aP8GPYc-BXc1YOdDsI";

  //Search widget which includes the locator. We will get the location from the results.
  const search = new Search({
    container: document.getElementById("search-box"),
  });

  const watcher = search.watch("activeSource", (source) => {
    source.placeholder = "Introduce la dirección";
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
            //Add a button to show the location on the map
            const buttonsDiv = document.getElementById("buttons-box");
            const buttonShowMap = document.createElement("button");

            buttonShowMap.className = "btn btn-outline-dark m-2";
            buttonShowMap.innerHTML = "Ver Localización";
            buttonsDiv.appendChild(buttonShowMap);

            //List the results
            const listEl = document.createElement("li");
            listEl.innerHTML = JSON.stringify(el.attributes);
            //listEl.className = "card-body";
            resultsBoxEl.appendChild(listEl);

            //When we click on the ver localizacion button, a map is created plotting the location
            buttonShowMap.onclick = function () {
              const map = new Map({
                basemap: "arcgis-navigation",
              });

              const view = new MapView({
                map: map,
                container: "map",
                center: [
                  event.result.feature.geometry.longitude,
                  event.result.feature.geometry.latitude,
                ],
                zoom: 16,
              });

              const graphicsLayer = new GraphicsLayer();
              map.add(graphicsLayer);

              const point = {
                type: "point",
                longitude: event.result.feature.geometry.longitude,
                latitude: event.result.feature.geometry.latitude,
              };

              const simpleMarkerSymbol = {
                type: "simple-marker",
                color: [226, 119, 40],
                outline: {
                  color: [255, 255, 255],
                  width: 1,
                },
              };

              const pointGraphic = new Graphic({
                geometry: point,
                symbol: simpleMarkerSymbol,
              });

              graphicsLayer.add(pointGraphic);

              //remove the VerLocalizacion button.
              buttonsDiv.removeChild(buttonShowMap);

              //Add a button to show change the location on the map
              const buttonChangeLocation = document.createElement("button");
              buttonChangeLocation.className = "btn btn-outline-dark m-5";
              buttonChangeLocation.innerHTML = "Cambiar localización";
              buttonsDiv.appendChild(buttonChangeLocation);

              //TODO Crear función para cambiar la localización
            };
          });
        } else {
          resultsBoxEl.innerHTML =
            "<div class='alert alert-danger text-center bold' role='alert'> <button type='button' class='close' data-dismiss='alert'>&times;</button>No se han encontrado resultados para la localización elegida.</div>";
        }
      })
      .catch(function (e) {
        resultsBoxEl.innerHTML =
          "<div class='alert alert-danger text-center bold' role='alert'> <button type='button' class='close' data-dismiss='alert'>&times;</button>No se ha podido consultar la base de datos, por favor inténtelo más tarde.</div>";
        console.error("query failed: ", e);
      });
  });
  //TODO Separar funciones para hacer el código más claro.
});

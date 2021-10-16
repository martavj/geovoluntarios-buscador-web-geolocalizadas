require([
  "esri/config",
  "esri/widgets/Search",
  "esri/layers/GeoJSONLayer",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
], function (
  esriConfig,
  Search,
  GeoJSONLayer,
  Map,
  MapView,
  GraphicsLayer,
  Graphic
) {
  //esriConfig.apiKey = apiKey;
  esriConfig.apiKey =
    "AAPK87580e590af24ff4a112832c43dbb704_CtPugq6Hs7TGTKzl-hgwybVFmduOYi9arnEQy3D2VJdsZz0Qns4n6tlJRIhtAcE";

  // Search widget which includes the locator. We will get the location from the results.
  const search = new Search({
    container: document.getElementById("search-box"),
  });

  const watcher = search.watch("activeSource", (source) => {
    source.placeholder = "Introduce tu dirección";
    watcher.remove();
  });

  const database = new GeoJSONLayer({
    url: "data/data.json",
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
        const locationLatitude = event.result.feature.geometry.latitude;
        const locationLongitude = event.result.feature.geometry.longitude;

        if (res.features.length > 0) {
          resultsBoxEl.innerHTML = "";
          //Add map
          showMap(locationLongitude, locationLatitude);
          //Get info list
          getList(res, locationLatitude, locationLongitude);
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

  //Get list of results
  getList = (res, locationLongitude, locationLatitude) => {
    console.log("Getting list...");
    res.features.forEach((el) => {
      const searchPanel = document.getElementById("search-panel");
      searchPanel.classList.remove("h-screen");
      searchPanel.classList.add("mt-10");

      const listEl = document.createElement("div");
      listEl.className = "listEl sm:flex p-2 my-5";
      const noLogo = "geosearch.png";
      listEl.innerHTML = `
        <div class="w-32 p-4">
          <img src=${el.attributes.logo ? el.attributes.logo : noLogo}></img>
        </div>
        <div class="ml-5">
          <h1 class="name">${el.attributes.name}</h1>
          <ul class="features">
            <li><strong>Riesgo: </strong>${
              el.attributes.hazardType ? el.attributes.hazardType : ""
            }</li>
            <li><strong>Información: </strong>${
              el.attributes.infoCategory ? el.attributes.infoCategory : ""
            }</li>
            <li><strong>Ámbito territorial: </strong>${
              el.attributes.territorialScope
                ? el.attributes.territorialScope
                : ""
            }</li>
            <li><strong>Idiomas: </strong>${
              el.attributes.languages ? el.attributes.languages : ""
            }</li>
            <li><strong>Descripción: </strong>${
              el.attributes.description ? el.attributes.description : ""
            }</li>
          </ul>
          <a class="url" href="${el.attributes.url}" target="_blank">${
        el.attributes.url
      }</a>
        </div>
      `;

      resultsBoxEl.appendChild(listEl);
    });
  };

  showMap = (locationLongitude, locationLatitude) => {
    const map = new Map({
      basemap: "arcgis-navigation",
    });

    const view = new MapView({
      map: map,
      container: "map",
      center: [locationLongitude, locationLatitude],
      zoom: 16,
    });

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    const point = {
      type: "point",
      longitude: locationLongitude,
      latitude: locationLatitude,
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
  };
});

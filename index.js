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
        resultsBoxEl.innerHTML = "";

        const locationLatitude = event.result.feature.geometry.latitude;
        const locationLongitude = event.result.feature.geometry.longitude;

        if (res.features.length > 0) {
          getList(res, locationLatitude, locationLongitude);
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

  getList = (res, locationLongitude, locationLatitude) => {
    console.log("Getting list...");
    res.features.forEach((el) => {
      //Add a button to show the location on the map
      const buttonsDiv = document.getElementById("buttons-box");
      const buttonShowMap = document.createElement("button");

      buttonShowMap.className = "btn btn-outline-dark m-2";
      buttonShowMap.innerHTML = "Ver Localización";
      buttonsDiv.appendChild(buttonShowMap);

      //List the results
      const listEl = document.createElement("li");
      listEl.className = "card bg-light mb-5";
      console.log(el.attributes);
      const descripcion = JSON.stringify(el.attributes.descripcion);
      const nombre = JSON.stringify(el.attributes.name);
      const ambito = JSON.stringify(el.attributes.ambito);
      const idioma = JSON.stringify(el.attributes.idioma);
      const logo = JSON.stringify(el.attributes.logo);
      const informacion = JSON.stringify(el.attributes.informacion);
      const riesgo = JSON.stringify(el.attributes.riesgo);
      const url = JSON.stringify(el.attributes.url);

      //TODO Style the list
      listEl.innerHTML =
        "<div class='card-body'><h4 class='card-title'>" +
        logo +
        nombre +
        "</h4>" +
        "<br>" +
        descripcion +
        "<br><br>" +
        "Web: " +
        "<a href='" +
        url +
        "'" +
        " >" +
        url +
        "</a><br><br>" +
        "Tipo de información: " +
        "<p class='badge badge-warning'> " +
        informacion +
        "</p>" +
        "<br>" +
        "Riesgo: " +
        "<p class='badge badge-danger'> " +
        riesgo +
        "</p>" +
        "<br>" +
        "Idioma: " +
        "<p class='badge badge-secondary'> " +
        idioma +
        "</p>" +
        "<br>" +
        "Ámbito: " +
        "<p class='badge badge-info'> " +
        ambito +
        "</p>" +
        "</div></div>";

      //listEl.innerHTML = JSON.stringify(el.attributes);
      //listEl.className = "card-body";
      resultsBoxEl.appendChild(listEl);

      //When we click on the ver localizacion button, a map is created plotting the location
      buttonShowMap.onclick = function () {
        showMap(locationLongitude, locationLatitude, buttonsDiv, buttonShowMap);
      };
    });
  };

  showMap = (
    locationLongitude,
    locationLatitude,
    buttonsDiv,
    buttonShowMap
  ) => {
    console.log("ShowMap");
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

    //remove the VerLocalizacion button.
    buttonsDiv.removeChild(buttonShowMap);

    //Add a button to show change the location on the map
    const buttonChangeLocation = document.createElement("button");
    buttonChangeLocation.className = "btn btn-outline-dark m-5";
    buttonChangeLocation.innerHTML = "Cambiar localización";
    buttonsDiv.appendChild(buttonChangeLocation);
    //If we click on 'Cambiar localización', the text changes giving the instructions: click on the map to change the location.
    buttonChangeLocation.onclick = function () {
      changeLocation(
        graphicsLayer,
        pointGraphic,
        buttonChangeLocation,
        view,
        simpleMarkerSymbol
      );
    };
  };

  changeLocation = (
    graphicsLayer,
    pointGraphic,
    buttonChangeLocation,
    view,
    simpleMarkerSymbol
  ) => {
    console.log("ChangeLocation");
    graphicsLayer.remove(pointGraphic);
    buttonChangeLocation.innerHTML =
      "Haz click en el mapa para cambiar la localización.";
    //If we click on the map, we capture the coordinates and do the reserve geocoding.
    view.on("click", function (event) {
      // Get the coordinates of the click on the view
      //Create a new point using the new coordinates
      const point = {
        type: "point",
        longitude: event.mapPoint.longitude,
        latitude: event.mapPoint.latitude,
      };
      //Create the graphic for the point
      const pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol,
      });
      //Add new graphic to the map
      graphicsLayer.add(pointGraphic);
      //TODO Hacer query con la nueva localizacion.
    });
  };
});

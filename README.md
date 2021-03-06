# GeoSearch

<img src="geosearch.png" align="right" width="100">

This web application allow anyone to provide a search experience of geolocated elements. It could be phisical elements, websites focus on an specific area, etc.

Use cases:

- Portal which goal is to allow users to find information about which websites can provide information or services about an specific hazard like a fire, flood or an earthquake near to you.
- Website to allow users to identify Open Data portals containing data from an specific location.
- etc.

## Requirements

This is a client-side application and you will need:

- A web server need to be installed, for example [Vscode live](https://www.youtube.com/watch?v=eM2xzvUTasQ) , python simple httpserver ( `python3 -m http.server` ) or npx (`npx http-server`) .
- A free ArcGIS Developer account ([Sign-up](https://developers.arcgis.com/sign-up) - [how-to video](https://www.youtube.com/watch?v=bhPmRr7OH8k))
- Create an API key ([how-to video](https://www.youtube.com/watch?v=Q1x4NZPK8Ws&t=8s) - [docs](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/api-keys/))

## Add new data
1. Copy the data of the [data file](https://github.com/GeoVoluntarios/geosearch/blob/master/data/data.json?short_path=39e5186)
2. Open [geojson.io](https://geojson.io) and paste the data
3. Draw the area of the hazard
4. Go to the code area and fill the properties (`name`,`url`,`logo`,`hazardType`,`territorialScope`,`languages`,`infoCategory`,`contentType`)
5. Copy the code of geojson.io and paste on the data.json

## Development setup

1. Clone this repo: `$git clone git@github.com:GeoVoluntarios/geovoluntarios-buscador-web-geolocalizadas.git`
2. Create a `config.js` file using the [config_template.js](./config_template.js) and replace the placeholder with a valid API key.
3. Open the `index.html` file from your web server.

## Contributing

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

Please check the [issues](https://github.com/GeoVoluntarios/geovoluntarios-buscador-web-geolocalizadas/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) to find a task that you feel like doing and that you think you can contribute to.

## Mockups

![](https://cloud.githubusercontent.com/assets/826965/14766094/2b014dc8-09fe-11e6-8f7e-5b2d147c14ab.png)
![](https://cloud.githubusercontent.com/assets/826965/14766095/34186504-09fe-11e6-8ef7-90f3e4cfb390.png)
![](https://cloud.githubusercontent.com/assets/826965/14766096/38366410-09fe-11e6-919f-a08ccaec4192.png)

  var map = new maplibregl.Map({
        container: 'map', // container id
        style: 'style@440_theme@light_lang@en.json', // style URL
        zoom: 6 // starting zoom
    });

map.addControl(new maplibregl.NavigationControl());

map.on("load", () => {
  fetch("https://data.cityofnewyork.us/resource/43nn-pn8j.geojson?cuisine_description=Pizza")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      data.features.forEach((feature) => {
        feature.geometry = {
          type: "Point",
          coordinates: [
            Number(feature.properties.longitude),
            Number(feature.properties.latitude)
          ]
        };
      });

      map.addSource("restaurants", {
        type: "geojson",
        data: data
      });

      map.addLayer({
        id: "restaurants-layer",
        type: "circle",
        source: "restaurants",
        paint: {
          "circle-radius": 5,
          "circle-color": "#111"
        }
      });

    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

    map.on("click", "restaurants-layer", (e) => {
      console.log(e.features[0]);
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.dba;
      new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML('<strong>' + description + '</strong>')
        .addTo(map);
    });
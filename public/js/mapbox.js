/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoianNvbWV0aGluZyIsImEiOiJjbTB2cnprcWkxbWgxMmlvaDA3aTdjdXNoIn0.7MlpMDuHOxZlNshymatM5g';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/jsomething/cm0w321du007k01p45jkmc2e4',
  scrollZoom: false,
  // center: [-118.113491, 34.111745], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  // zoom: 9, // starting zoom
  // interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  //creates marker pin
  const el = document.createElement('div');
  el.className = 'marker';
  //adds marker
  new mapboxgl.Marker({
    element: el,
    //bottom of pin at precise location
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  //add popup
  new mapboxgl.Popup({
    offset: 30,
    focusAfterOpen: false,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);
  //extends map bounds to include location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});

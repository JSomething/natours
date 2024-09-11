(() => {
  // public/js/mapbox.js
  var displayMap = (locations) => {
    mapboxgl.accessToken = "pk.eyJ1IjoianNvbWV0aGluZyIsImEiOiJjbTB2cnprcWkxbWgxMmlvaDA3aTdjdXNoIn0.7MlpMDuHOxZlNshymatM5g";
    const map = new mapboxgl.Map({
      container: "map",
      // container ID
      style: "mapbox://styles/jsomething/cm0w321du007k01p45jkmc2e4",
      scrollZoom: false
      // center: [-118.113491, 34.111745], // starting position [lng, lat]. Note that lat must be set between -90 and 90
      // zoom: 9, // starting zoom
      // interactive: false,
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc) => {
      const el = document.createElement("div");
      el.className = "marker";
      new mapboxgl.Marker({
        element: el,
        //bottom of pin at precise location
        anchor: "bottom"
      }).setLngLat(loc.coordinates).addTo(map);
      new mapboxgl.Popup({
        offset: 30,
        focusAfterOpen: false
      }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
      bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
      }
    });
  };

  // public/js/alerts.js
  var hideAlert = () => {
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
  };
  var showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout(hideAlert, 5e3);
  };

  // public/js/login.js
  var login = async (email, password) => {
    try {
      const res = await axios({
        method: "POST",
        url: "http://localhost:3000/api/v1/users/login",
        data: {
          email,
          password
        }
      });
      if (res.data.status === "success") {
        showAlert("success", "Logged in successfully!"), window.setTimeout(() => {
          location.assign("/");
        }, 1500);
      }
    } catch (err) {
      showAlert("error", err.response.data.message);
    }
  };
  var logout = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: "http://localhost:3000/api/v1/users/logout"
      });
      if (res.data.status = "success") location.reload(true);
    } catch (err) {
      console.log(err.response);
      showAlert("error", "Error logging out, try again");
    }
  };

  // public/js/index.js
  var mapBox = document.getElementById("map");
  var loginForm = document.querySelector(".form");
  var logOutBtn = document.querySelector(".nav__el--logout");
  if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
  }
  if (loginForm)
    document.querySelector(".form").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      login(email, password);
    });
  if (logOutBtn) logOutBtn.addEventListener("click", logout);
})();


/* =========================================================
   GEOWORLD ULTIMATE — WORLD MAP
   No API key required
   Map: Leaflet + OpenStreetMap
========================================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  /* ---------- NAVIGATION ---------- */

  const menuButton = $("menuButton");
  const navLinks = $("navLinks");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- NOTIFICATIONS ---------- */

  function notify(message) {
    const toast = $("toast");

    if (!toast) {
      console.log("[GEOWORLD]", message);
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  /* ---------- MAP ELEMENTS ---------- */

  const mapElement = $("worldMap");

  if (!mapElement) {
    console.error('GEOWORLD: Missing element with id="worldMap".');
    return;
  }

  if (typeof L === "undefined") {
    console.error("Leaflet failed to load. Check your internet connection.");
    notify("Map library failed to load. Refresh the page.");
    return;
  }

  /* ---------- MAP INITIALIZATION ---------- */

  const streetLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }
  );

  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles &copy; Esri",
      maxZoom: 19
    }
  );

  const map = L.map(mapElement, {
    center: [20, 0],
    zoom: 2,
    layers: [streetLayer],
    zoomControl: false,
    worldCopyJump: true
  });

  L.control.zoom({ position: "bottomright" }).addTo(map);

  L.control.layers(
    {
      "Street Map": streetLayer,
      "Satellite": satelliteLayer
    },
    null,
    { position: "topright" }
  ).addTo(map);

  const markerLayer = L.layerGroup().addTo(map);

  let selectedMarker = null;
  let currentPlace = null;

  /* ---------- MAP STATUS ---------- */

  const statusElement = $("mapStatus");
  const loadingElement = $("mapLoading");

  function setStatus(message) {
    if (statusElement) statusElement.textContent = message;
  }

  function hideLoading() {
    if (loadingElement) loadingElement.classList.add("hidden");
  }

  streetLayer.on("load", () => {
    setStatus("MAP ONLINE");
    hideLoading();
  });

  streetLayer.on("tileerror", () => {
    setStatus("TILE ERROR — CHECK INTERNET");
    hideLoading();
  });

  setTimeout(hideLoading, 8000);

  /* ---------- CUSTOM MARKER ---------- */

  const markerIcon = L.divIcon({
    className: "geoworld-map-marker",
    html: '<span style="display:block;width:16px;height:16px;background:#65eaff;border:3px solid #ffffff;border-radius:50%;box-shadow:0 0 18px #65eaff;"></span>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  function updateCoordinates(lat, lng) {
    if ($("latitude")) {
      $("latitude").textContent = Number(lat).toFixed(5) + "°";
    }

    if ($("longitude")) {
      $("longitude").textContent = Number(lng).toFixed(5) + "°";
    }
  }

  function showPlaceDetails(name, lat, lng, description) {
    currentPlace = {
      name,
      lat: Number(lat),
      lng: Number(lng)
    };

    updateCoordinates(lat, lng);

    if ($("selectedPlace")) {
      $("selectedPlace").textContent = name;
    }

    if ($("selectedDetails")) {
      $("selectedDetails").textContent =
        description || "Selected geographic location.";
    }

    const externalLink = $("openExternalMap");

    if (externalLink) {
      externalLink.href =
        "https://www.openstreetmap.org/?mlat=" +
        encodeURIComponent(lat) +
        "&mlon=" +
        encodeURIComponent(lng) +
        "#map=10/" +
        encodeURIComponent(lat) +
        "/" +
        encodeURIComponent(lng);

      externalLink.target = "_blank";
      externalLink.rel = "noopener noreferrer";
    }
  }

  function selectLocation(name, lat, lng, zoom = 7, description = "") {
    lat = Number(lat);
    lng = Number(lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      notify("Invalid location coordinates.");
      return;
    }

    map.flyTo([lat, lng], zoom, { duration: 1.2 });

    if (selectedMarker) {
      map.removeLayer(selectedMarker);
    }

    selectedMarker = L.marker([lat, lng], {
      icon: markerIcon
    }).addTo(map);

    selectedMarker.bindPopup(
      "<strong>" + escapeHTML(name) + "</strong>"
    ).openPopup();

    showPlaceDetails(name, lat, lng, description);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  /* ---------- CLICK MAP TO SELECT ---------- */

  map.on("click", (event) => {
    selectLocation(
      "Selected Location",
      event.latlng.lat,
      event.latlng.lng,
      Math.max(map.getZoom(), 5),
      "Coordinates selected directly on the world map."
    );
  });

  /* ---------- FEATURED LOCATIONS ---------- */

  const destinations = {
    "new delhi": {
      name: "New Delhi, India",
      lat: 28.6139,
      lng: 77.2090,
      zoom: 8,
      description: "India's capital city."
    },
    "tokyo": {
      name: "Tokyo, Japan",
      lat: 35.6762,
      lng: 139.6503,
      zoom: 9,
      description: "Japan's capital and a major global city."
    },
    "cairo": {
      name: "Cairo, Egypt",
      lat: 30.0444,
      lng: 31.2357,
      zoom: 9,
      description: "Egypt's capital near the Nile River."
    },
    "london": {
      name: "London, United Kingdom",
      lat: 51.5072,
      lng: -0.1276,
      zoom: 9,
      description: "A historic capital on the River Thames."
    },
    "new york city": {
      name: "New York City, USA",
      lat: 40.7128,
      lng: -74.0060,
      zoom: 9,
      description: "A major city in the United States."
    },
    "sydney": {
      name: "Sydney, Australia",
      lat: -33.8688,
      lng: 151.2093,
      zoom: 9,
      description: "A coastal city in southeastern Australia."
    },
    "taj mahal": {
      name: "Taj Mahal, India",
      lat: 27.1751,
      lng: 78.0421,
      zoom: 14,
      description: "The famous marble mausoleum in Agra."
    },
    "mount everest": {
      name: "Mount Everest",
      lat: 27.9881,
      lng: 86.9250,
      zoom: 10,
      description: "The world's highest mountain above sea level."
    },
    "paris": {
      name: "Paris, France",
      lat: 48.8566,
      lng: 2.3522,
      zoom: 10,
      description: "The capital of France."
    },
    "mumbai": {
      name: "Mumbai, India",
      lat: 19.0760,
      lng: 72.8777,
      zoom: 9,
      description: "A major coastal city in western India."
    }
  };

  document.querySelectorAll("[data-place]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = String(button.dataset.place || "")
        .trim()
        .toLowerCase();

      const place = destinations[key];

      if (!place) {
        notify("This featured location is not configured yet.");
        return;
      }

      selectLocation(
        place.name,
        place.lat,
        place.lng,
        place.zoom,
        place.description
      );
    });
  });

  /* ---------- SEARCH A PLACE ---------- */

  const searchForm = $("placeSearchForm");
  const searchInput = $("placeSearch");
  const searchButton = $("searchButton");

  async function searchPlace(query) {
    if (!query.trim()) {
      notify("Enter a place name first.");
      return;
    }

    const knownPlace = destinations[query.trim().toLowerCase()];

    if (knownPlace) {
      selectLocation(
        knownPlace.name,
        knownPlace.lat,
        knownPlace.lng,
        knownPlace.zoom,
        knownPlace.description
      );
      return;
    }

    if (searchButton) {
      searchButton.disabled = true;
      searchButton.textContent = "SEARCHING...";
    }

    try {
      // Public geocoder: no API key, no autocomplete.
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("q", query.trim());
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("limit", "1");

      const response = await fetch(url.toString(), {
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("Geographic search is temporarily unavailable.");
      }

      const results = await response.json();

      if (!results.length) {
        notify("Location not found. Try another name.");
        return;
      }

      const result = results[0];

      selectLocation(
        result.display_name.split(",").slice(0, 3).join(","),
        Number(result.lat),
        Number(result.lon),
        10,
        result.display_name
      );
    } catch (error) {
      console.error("GEOWORLD place search:", error);
      notify("Search failed. Check your internet and try again.");
    } finally {
      if (searchButton) {
        searchButton.disabled = false;
        searchButton.textContent = "SEARCH";
      }
    }
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      searchPlace(searchInput ? searchInput.value : "");
    });
  } else if (searchButton) {
    searchButton.addEventListener("click", () => {
      searchPlace(searchInput ? searchInput.value : "");
    });
  }

  /* ---------- MAP BUTTONS ---------- */

  if ($("zoomIn")) {
    $("zoomIn").addEventListener("click", () => map.zoomIn());
  }

  if ($("zoomOut")) {
    $("zoomOut").addEventListener("click", () => map.zoomOut());
  }

  if ($("resetMap")) {
    $("resetMap").addEventListener("click", () => {
      map.flyTo([20, 0], 2);
      notify("World view restored.");
    });
  }

  if ($("clearMarker")) {
    $("clearMarker").addEventListener("click", () => {
      if (selectedMarker) {
        map.removeLayer(selectedMarker);
        selectedMarker = null;
      }

      currentPlace = null;

      if ($("selectedPlace")) {
        $("selectedPlace").textContent = "No location selected";
      }

      if ($("selectedDetails")) {
        $("selectedDetails").textContent =
          "Search for a place or click anywhere on the map.";
      }

      if ($("latitude")) $("latitude").textContent = "—";
      if ($("longitude")) $("longitude").textContent = "—";

      notify("Selection cleared.");
    });
  }

  if ($("locateMe")) {
    $("locateMe").addEventListener("click", () => {
      if (!navigator.geolocation) {
        notify("Geolocation is not supported by this browser.");
        return;
      }

      notify("Requesting your location...");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          selectLocation(
            "Your Location",
            position.coords.latitude,
            position.coords.longitude,
            13,
            "Your current device location."
          );
        },
        (error) => {
          console.warn("Geolocation:", error.message);
          notify("Location unavailable. Allow location access in your browser.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  /* ---------- LAYER SELECTOR COMPATIBILITY ---------- */

  const mapLayer = $("mapLayer");

  if (mapLayer) {
    mapLayer.addEventListener("change", () => {
      const value = mapLayer.value.toLowerCase();

      if (value.includes("satellite")) {
        if (map.hasLayer(streetLayer)) map.removeLayer(streetLayer);
        if (!map.hasLayer(satelliteLayer)) satelliteLayer.addTo(map);
      } else {
        if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
        if (!map.hasLayer(streetLayer)) streetLayer.addTo(map);
      }
    });
  }

  /* ---------- LOG OUT (OPTIONAL FIREBASE) ---------- */

  const logoutButton = $("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        if (window.firebase && window.firebase.auth) {
          await window.firebase.auth().signOut();
        }

        window.location.href = "login.html";
      } catch (error) {
        console.error("Logout failed:", error);
        notify("Unable to log out. Please try again.");
      }
    });
  }

  /* ---------- RESPONSIVE MAP ---------- */

  setTimeout(() => map.invalidateSize(), 300);
  window.addEventListener("resize", () => map.invalidateSize());

  console.log("GEOWORLD World Map initialized without a Google Maps API key.");
})();

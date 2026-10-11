
/* ======================================================
   GEOWORLD — CLIMATE INTELLIGENCE
   Weather: Open-Meteo
   Database: Not required
====================================================== */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  /* ================= NAVBAR ================= */

  const menuButton = $("menuButton");
  const navLinks = $("navLinks");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
      }
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
      }
    });
  }

  /* ================= SCROLL REVEAL ================= */

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  /* ================= WEATHER ELEMENTS ================= */

  const form = $("weatherForm");
  const cityInput = $("cityInput");
  const checkButton = $("checkButton");
  const buttonText = $("buttonText");
  const locationStatus = $("locationStatus");
  const weatherResult = $("weatherResult");
  const forecastGrid = $("forecastGrid");

  if (!form || !cityInput || !weatherResult) {
    console.error("GEOWORLD Climate: Required HTML elements are missing.");
    return;
  }

  let activeRequest = 0;

  /* ================= WEATHER INTERPRETER ================= */

  function getWeatherInfo(code) {
    const conditions = {
      0: ["Clear sky", "☀️"],
      1: ["Mainly clear", "🌤️"],
      2: ["Partly cloudy", "⛅"],
      3: ["Overcast", "☁️"],
      45: ["Fog", "🌫️"],
      48: ["Rime fog", "🌫️"],
      51: ["Light drizzle", "🌦️"],
      53: ["Moderate drizzle", "🌦️"],
      55: ["Dense drizzle", "🌧️"],
      56: ["Light freezing drizzle", "🌧️"],
      57: ["Dense freezing drizzle", "🌧️"],
      61: ["Slight rain", "🌦️"],
      63: ["Moderate rain", "🌧️"],
      65: ["Heavy rain", "🌧️"],
      66: ["Light freezing rain", "🌧️"],
      67: ["Heavy freezing rain", "🌧️"],
      71: ["Slight snow", "🌨️"],
      73: ["Moderate snow", "❄️"],
      75: ["Heavy snow", "❄️"],
      77: ["Snow grains", "❄️"],
      80: ["Slight rain showers", "🌦️"],
      81: ["Moderate rain showers", "🌧️"],
      82: ["Violent rain showers", "⛈️"],
      85: ["Snow showers", "🌨️"],
      86: ["Heavy snow showers", "❄️"],
      95: ["Thunderstorm", "⛈️"],
      96: ["Thunderstorm with hail", "⛈️"],
      99: ["Thunderstorm with heavy hail", "⛈️"]
    };

    const result = conditions[Number(code)];

    return result
      ? { text: result[0], icon: result[1] }
      : { text: "Unknown conditions", icon: "🌍" };
  }

  /* ================= FORMATTING ================= */

  function setStatus(message, type = "") {
    locationStatus.textContent = message;
    locationStatus.className =
      "location-status" + (type ? " " + type : "");
  }

  function safeNumber(value, decimals = 0) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "--";
    }

    return number.toFixed(decimals);
  }

  function formatClock(value) {
    if (!value) return "--";

    const match = String(value).match(/T(\d{2}):(\d{2})/);

    if (!match) return "--";

    let hour = Number(match[1]);
    const minute = match[2];
    const suffix = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${suffix}`;
  }

  function getDayName(dateString) {
    const date = new Date(dateString + "T12:00:00Z");

    if (Number.isNaN(date.getTime())) return "--";

    return new Intl.DateTimeFormat("en", {
      weekday: "short",
      timeZone: "UTC"
    }).format(date).toUpperCase();
  }

  function getWindDirection(degrees) {
    const directions = [
      "N", "NE", "E", "SE",
      "S", "SW", "W", "NW"
    ];

    const value = Number(degrees);

    if (!Number.isFinite(value)) return "--";

    const index = Math.round(((value % 360) + 360) % 360 / 45) % 8;

    return directions[index];
  }

  function setText(id, value) {
    const element = $(id);

    if (element) {
      element.textContent = value;
    }
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
  }

  /* ================= FETCH HELPER ================= */

  async function fetchJSON(url, signal) {
    const response = await fetch(url, {
      signal,
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Too many requests. Wait a moment and retry.");
      }

      if (response.status >= 500) {
        throw new Error("Weather service is temporarily unavailable.");
      }

      throw new Error(`Service request failed (${response.status}).`);
    }

    return response.json();
  }

  /* ================= LOCATION SEARCH ================= */

  async function findLocation(city, signal) {
    const url = new URL(
      "https://geocoding-api.open-meteo.com/v1/search"
    );

    url.searchParams.set("name", city);
    url.searchParams.set("count", "10");
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");

    const data = await fetchJSON(url, signal);

    if (!Array.isArray(data.results) || data.results.length === 0) {
      throw new Error(
        "Location not found. Try a city name with its country."
      );
    }

    /* Prefer an exact city-name match where available. */
    const query = city.trim().toLowerCase();

    const place =
      data.results.find(
        (item) => item.name.toLowerCase() === query
      ) || data.results[0];

    if (
      !Number.isFinite(Number(place.latitude)) ||
      !Number.isFinite(Number(place.longitude))
    ) {
      throw new Error("The selected location has invalid coordinates.");
    }

    return place;
  }

  /* ================= WEATHER REQUEST ================= */

  async function getWeather(latitude, longitude, signal) {
    const url = new URL("https://api.open-meteo.com/v1/forecast");

    url.searchParams.set("latitude", latitude);
    url.searchParams.set("longitude", longitude);

    url.searchParams.set(
      "current",
      [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "precipitation",
        "weather_code",
        "cloud_cover",
        "wind_speed_10m",
        "wind_direction_10m"
      ].join(",")
    );

    url.searchParams.set(
      "daily",
      [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
        "sunrise",
        "sunset"
      ].join(",")
    );

    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("temperature_unit", "celsius");
    url.searchParams.set("wind_speed_unit", "kmh");
    url.searchParams.set("precipitation_unit", "mm");

    return fetchJSON(url, signal);
  }

  /* ================= DISPLAY CURRENT WEATHER ================= */

  function renderCurrentWeather(place, data) {
    const current = data.current;

    if (!current || current.temperature_2m == null) {
      throw new Error("Current weather data is unavailable.");
    }

    const info = getWeatherInfo(current.weather_code);

    setText("locationName", place.name);

    const details = [
      place.admin1,
      place.country
    ].filter(Boolean);

    setText(
      "locationDetail",
      details.join(" · ") +
      ` · ${Number(place.latitude).toFixed(2)}°, ` +
      `${Number(place.longitude).toFixed(2)}°`
    );

    setText("currentIcon", info.icon);
    setText(
      "currentTemperature",
      `${Math.round(Number(current.temperature_2m))}°C`
    );
    setText("conditionText", info.text);

    setText(
      "feelsLike",
      `${safeNumber(current.apparent_temperature)}°C`
    );

    setText(
      "humidity",
      `${safeNumber(current.relative_humidity_2m)}%`
    );

    setText(
      "wind",
      `${safeNumber(current.wind_speed_10m)} km/h`
    );

    setText(
      "windDirection",
      `Direction: ${getWindDirection(current.wind_direction_10m)} · ` +
      `${safeNumber(current.wind_direction_10m)}°`
    );

    setText("cloud", `${safeNumber(current.cloud_cover)}%`);

    setText(
      "precipitation",
      `${safeNumber(current.precipitation, 1)} mm`
    );

    const daily = data.daily || {};

    setText(
      "sunrise",
      formatClock(daily.sunrise?.[0])
    );

    setText(
      "sunset",
      formatClock(daily.sunset?.[0])
    );

    setText(
      "coordinates",
      `${Number(place.latitude).toFixed(2)}, ${Number(place.longitude).toFixed(2)}`
    );

    setText(
      "localTime",
      formatClock(current.time)
    );

    setText("heroWeatherIcon", info.icon);
    setText("heroSignal", info.text.toUpperCase());

    renderForecast(daily);
  }

  /* ================= SEVEN-DAY FORECAST ================= */

  function renderForecast(daily) {
    forecastGrid.replaceChildren();

    const dates = daily.time || [];
    const highs = daily.temperature_2m_max || [];
    const lows = daily.temperature_2m_min || [];
    const codes = daily.weather_code || [];
    const rainValues = daily.precipitation_sum || [];

    if (!dates.length) {
      forecastGrid.appendChild(
        createElement(
          "p",
          "data-note",
          "The forecast is not available for this location."
        )
      );
      return;
    }

    dates.forEach((date, index) => {
      const info = getWeatherInfo(codes[index]);

      const card = createElement("article", "forecast-card");

      card.appendChild(
        createElement(
          "div",
          "forecast-day",
          index === 0 ? "TODAY" : getDayName(date)
        )
      );

      card.appendChild(
        createElement("div", "forecast-icon", info.icon)
      );

      card.appendChild(
        createElement("div", "forecast-condition", info.text)
      );

      const temperatures = createElement("div", "forecast-temp");

      const high = safeNumber(highs[index]);
      const low = safeNumber(lows[index]);

      temperatures.appendChild(
        document.createTextNode(`${high}° `)
      );

      temperatures.appendChild(
        createElement("span", "", `${low}°`)
      );

      card.appendChild(temperatures);

      card.appendChild(
        createElement(
          "div",
          "forecast-rain",
          `${safeNumber(rainValues[index], 1)} MM`
        )
      );

      forecastGrid.appendChild(card);
    });
  }

  /* ================= MAIN CLIMATE SCAN ================= */

  async function checkClimate(cityOverride) {
    const city = String(cityOverride || cityInput.value).trim();

    if (!city) {
      setStatus("ERROR — ENTER A CITY OR LOCATION", "error");
      cityInput.focus();
      return;
    }

    if (city.length > 100) {
      setStatus("ERROR — LOCATION NAME IS TOO LONG", "error");
      return;
    }

    cityInput.value = city;

    const requestId = ++activeRequest;
    const controller = new AbortController();

    /*
      New searches cancel older requests so an earlier result
      cannot overwrite the latest search.
    */
    if (checkClimate.controller) {
      checkClimate.controller.abort();
    }

    checkClimate.controller = controller;

    checkButton.disabled = true;
    buttonText.textContent = "SCANNING...";
    weatherResult.hidden = true;

    setStatus("LOCATING — SEARCHING THE GLOBAL LOCATION DATABASE...");

    try {
      const place = await findLocation(city, controller.signal);

      if (requestId !== activeRequest) return;

      setStatus("LOCATION FOUND — RETRIEVING WEATHER DATA...");

      const data = await getWeather(
        place.latitude,
        place.longitude,
        controller.signal
      );

      if (requestId !== activeRequest) return;

      renderCurrentWeather(place, data);

      weatherResult.hidden = false;

      setStatus(
        `SCAN COMPLETE — ${place.name.toUpperCase()}`,
        "success"
      );

    } catch (error) {
      if (error.name === "AbortError") return;

      console.error("GEOWORLD Climate:", error);

      weatherResult.hidden = true;

      let message = error.message || "Unable to load weather data.";

      if (error instanceof TypeError) {
        message =
          "Network error. Check your internet connection and try again.";
      }

      setStatus(`ERROR — ${message.toUpperCase()}`, "error");

    } finally {
      if (requestId === activeRequest) {
        checkButton.disabled = false;
        buttonText.textContent = "SCAN CLIMATE";
      }
    }
  }

  /* ================= SEARCH EVENTS ================= */

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    checkClimate();
  });

  document.querySelectorAll("[data-city]").forEach((button) => {
    button.addEventListener("click", () => {
      checkClimate(button.dataset.city);
    });
  });

  /* ================= DEFAULT LOCATION ================= */

  cityInput.value = "Chennai";
  checkClimate("Chennai");

})();
/* GEOWORLD — CLIMATE NAVBAR */

(() => {
  "use strict";

  const menuButton = document.getElementById("menuButton");
  const navLinks = document.getElementById("navLinks");

  if (!menuButton || !navLinks) return;

  const closeMenu = () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  };

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";

    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation"
    );

    navLinks.classList.toggle("open", open);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
})();
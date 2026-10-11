
/* =========================================================
   GEOWORLD — COUNTRY INTELLIGENCE ENGINE
   No database • No Firebase • No favorites
   ========================================================= */

const $ = selector => document.querySelector(selector);

const DATA_URL =
  "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";

const grid = $("#countryGrid");
const searchInput = $("#countrySearch");
const regionFilter = $("#regionFilter");
const totalEl = $("#totalCountries");
const stateEl = $("#connectionState");
const messageEl = $("#connectionMessage");
const resultEl = $("#resultCount");
const loadMoreButton = $("#loadMoreButton");
const dialog = $("#countryDialog");
const details = $("#countryDetails");
const toast = $("#toast");

let countries = [];
let map;
let marker;
let visibleLimit = 24;
let toastTimer;

/* Safe text for HTML templates */
function safe(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function notify(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function number(value) {
  return Number.isFinite(Number(value))
    ? Number(value).toLocaleString("en-US")
    : "Not available";
}

function area(value) {
  return Number.isFinite(Number(value))
    ? `${Number(value).toLocaleString("en-US", {
        maximumFractionDigits: 2
      })} km²`
    : "Not available";
}

function objectValues(value) {
  return value && typeof value === "object"
    ? Object.values(value).filter(Boolean)
    : [];
}

function capital(country) {
  return Array.isArray(country.capital) && country.capital.length
    ? country.capital.join(", ")
    : "Not listed";
}

function currency(country) {
  const values = Object.values(country.currencies || {});
  return values.map(item =>
    item?.name
      ? `${item.name}${item.symbol ? ` (${item.symbol})` : ""}`
      : ""
  ).filter(Boolean).join(", ") || "Not available";
}

function languages(country) {
  return objectValues(country.languages).join(", ") || "Not available";
}

function coordinates(country) {
  if (!Array.isArray(country.latlng) || country.latlng.length !== 2) {
    return "Not available";
  }

  return country.latlng
    .map(value => Number(value).toFixed(4))
    .join(", ");
}

function timeZones(country) {
  // This reference dataset does not include timezone lists.
  return "Not included in this dataset";
}

function flagURL(country) {
  const code = country.cca2?.toLowerCase();

  return code && /^[a-z]{2}$/.test(code)
    ? `https://flagcdn.com/w160/${code}.png`
    : "";
}

function getNeighbors(country) {
  if (!country.borders?.length) {
    return "No land borders listed";
  }

  return country.borders.map(code => {
    const match = countries.find(item => item.cca3 === code);
    return match?.name?.common || code;
  }).join(", ");
}

/* Original navbar mobile toggle */
const menuButton = $("#menuButton");
const navLinks = $("#navLinks");

menuButton?.addEventListener("click", () => {
  const open = navLinks?.classList.toggle("open") ?? false;
  menuButton.setAttribute("aria-expanded", String(open));
});

navLinks?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

/* Preserve homepage navigation; do not sign out from this page.
   Logout remains handled by your existing authentication setup. */

/* Load public country data */
async function loadCountries() {
  stateEl.textContent = "LOAD";
  messageEl.textContent = "FETCHING PUBLIC COUNTRY DATA";
  resultEl.textContent = "LOADING COUNTRY RECORDS...";
  grid.innerHTML = `
    <div class="ci-loading">
      <span class="ci-loader"></span>
      <strong>INITIALIZING ATLAS</strong>
      <span>Connecting to public country dataset...</span>
    </div>`;

  try {
    const response = await fetch(DATA_URL, { cache: "no-cache" });

    if (!response.ok) {
      throw new Error(`Country dataset returned HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("The country dataset has an unexpected format.");
    }

    countries = data
      .filter(country =>
        country.unMember === true ||
        ["VAT", "PSE"].includes(country.cca3)
      )
      .sort((a, b) =>
        (a.name?.common || "").localeCompare(b.name?.common || "")
      );

    if (!countries.length) {
      throw new Error("No country records were found.");
    }

    totalEl.textContent = String(countries.length).padStart(3, "0");
    stateEl.textContent = "LIVE";
    messageEl.textContent = "COUNTRY DATA LOADED";
    renderCountries();

  } catch (error) {
    console.error("GEOWORLD country data error:", error);

    stateEl.textContent = "ERROR";
    messageEl.textContent = "DATA CONNECTION FAILED";
    resultEl.textContent = "COUNTRY DATA COULD NOT LOAD";

    grid.innerHTML = `
      <div class="ci-empty">
        <strong>GLOBAL ATLAS UNAVAILABLE</strong>
        <span>${safe(error.message)}</span>
        <button id="retryCountries" class="ci-details-button">
          RETRY CONNECTION ↻
        </button>
      </div>`;

    $("#retryCountries")?.addEventListener("click", loadCountries);
  }
}

/* Search and region filter */
function filteredCountries() {
  const query = searchInput.value.trim().toLowerCase();
  const region = regionFilter.value;

  return countries.filter(country => {
    const text = [
      country.name?.common,
      country.name?.official,
      ...(country.capital || []),
      country.region,
      country.subregion,
      ...objectValues(country.currencies),
      ...objectValues(country.languages),
      country.cca2,
      country.cca3
    ].join(" ").toLowerCase();

    return (!query || text.includes(query)) &&
      (region === "all" || country.region === region);
  });
}

/* Build a country card */
function card(country, index) {
  const code = safe(country.cca3 || "");
  const name = safe(country.name?.common || "Unknown country");
  const official = safe(country.name?.official || name);
  const flag = safe(flagURL(country));
  const region = safe(country.region || "Other");
  const coords = safe(coordinates(country));

  return `
    <article class="ci-country-card" style="animation-delay:${Math.min(index, 12) * 35}ms">
      <div class="ci-card-top">
        <img
          class="ci-flag"
          src="${flag}"
          alt="${name} flag"
          loading="lazy"
          onerror="this.style.visibility='hidden'">
        <span class="ci-code">${code}</span>
        <span class="ci-region-chip">${region.toUpperCase()}</span>
      </div>

      <h3>${name}</h3>
      <p class="ci-official">${official}</p>

      <div class="ci-card-divider"></div>

      <div class="ci-card-facts">
        <div class="ci-fact">
          <span>CAPITAL</span>
          <strong>${safe(capital(country))}</strong>
        </div>
        <div class="ci-fact">
          <span>LAND AREA</span>
          <strong>${safe(area(country.area))}</strong>
        </div>
        <div class="ci-fact">
          <span>CURRENCY</span>
          <strong>${safe(currency(country))}</strong>
        </div>
        <div class="ci-fact">
          <span>LANGUAGES</span>
          <strong>${safe(languages(country))}</strong>
        </div>
      </div>

      <div class="ci-card-bottom">
        <span class="ci-coordinates">${coords}</span>
        <button class="ci-details-button" data-country="${code}">
          INTEL <span>↗</span>
        </button>
      </div>
    </article>`;
}

/* Render results */
function renderCountries() {
  const filtered = filteredCountries();
  const visible = filtered.slice(0, visibleLimit);

  grid.innerHTML = visible.length
    ? visible.map(card).join("")
    : `<div class="ci-empty">
        <strong>NO MATCHING COUNTRIES</strong>
        <span>Try another country name, language or region.</span>
      </div>`;

  resultEl.textContent =
    `SHOWING ${visible.length} OF ${filtered.length} COUNTRIES`;

  loadMoreButton.hidden = visible.length >= filtered.length;

  grid.querySelectorAll("[data-country]").forEach(button => {
    button.addEventListener("click", () => {
      const country = countries.find(
        item => item.cca3 === button.dataset.country
      );

      if (country) openDetails(country);
    });
  });
}

searchInput.addEventListener("input", () => {
  visibleLimit = 24;
  renderCountries();
});

regionFilter.addEventListener("change", () => {
  visibleLimit = 24;
  renderCountries();
});

loadMoreButton.addEventListener("click", () => {
  visibleLimit += 24;
  renderCountries();
});

/* Country intelligence dialog */
function openDetails(country) {
  const name = safe(country.name?.common || "Unknown country");
  const official = safe(country.name?.official || name);
  const flag = safe(flagURL(country));
  const region = safe(country.region || "Not listed");
  const subregion = safe(country.subregion || "Not listed");
  const borders = safe(getNeighbors(country));

  const callingCode = safe(
    country.idd?.root
      ? country.idd.root +
        (country.idd.suffixes?.length === 1
          ? country.idd.suffixes[0]
          : "")
      : "Not listed"
  );

  const domains = safe(country.tld?.join(", ") || "Not listed");
  const continent = safe(country.region || "Not listed");
  const latlng = country.latlng;

  details.innerHTML = `
    <div class="ci-detail-content">
      <span class="ci-detail-kicker">COUNTRY RECORD / ${safe(country.cca3 || "")}</span>

      <div class="ci-detail-header">
        <img class="ci-detail-flag" src="${flag}" alt="${name} flag">
        <div>
          <h2>${name}</h2>
          <p>${official}</p>
          <p>${region} / ${subregion}</p>
        </div>
      </div>

      <div class="ci-detail-grid">
        <div class="ci-detail-item">
          <span>CAPITAL CITY</span><strong>${safe(capital(country))}</strong>
        </div>
        <div class="ci-detail-item">
          <span>LAND AREA</span><strong>${safe(area(country.area))}</strong>
        </div>
        <div class="ci-detail-item">
          <span>CURRENCY</span><strong>${safe(currency(country))}</strong>
        </div>
        <div class="ci-detail-item">
          <span>OFFICIAL LANGUAGES</span><strong>${safe(languages(country))}</strong>
        </div>
        <div class="ci-detail-item">
          <span>REGION</span><strong>${continent}</strong>
        </div>
        <div class="ci-detail-item">
          <span>SUBREGION</span><strong>${subregion}</strong>
        </div>
        <div class="ci-detail-item">
          <span>COORDINATES</span><strong>${safe(coordinates(country))}</strong>
        </div>
        <div class="ci-detail-item">
          <span>CALLING CODE</span><strong>${callingCode}</strong>
        </div>
        <div class="ci-detail-item">
          <span>INTERNET DOMAIN</span><strong>${domains}</strong>
        </div>
        <div class="ci-detail-item">
          <span>LANDLOCKED</span><strong>${country.landlocked ? "Yes" : "No"}</strong>
        </div>
        <div class="ci-detail-item">
          <span>TIME ZONES</span><strong>${timeZones(country)}</strong>
        </div>
        <div class="ci-detail-item">
          <span>NEIGHBORING COUNTRIES</span><strong>${borders}</strong>
        </div>
      </div>

      <div class="ci-detail-actions">
        <button id="locateCountry" class="ci-details-button">
          LOCATE ON WORLD MAP ↗
        </button>
        <a class="ci-details-button"
          href="https://www.google.com/search?q=${encodeURIComponent(name + " country geography")}"
          target="_blank" rel="noopener noreferrer">
          MORE RESEARCH ↗
        </a>
      </div>
    </div>`;

  dialog.showModal();

  $("#locateCountry").addEventListener("click", () => {
    dialog.close();
    locateCountry(country);
    $("#worldMapSection").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
}

$("#closeDialog").addEventListener("click", () => dialog.close());

dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

/* Leaflet map */
function initializeMap() {
  if (!window.L) {
    setTimeout(() => {
      if (window.L) initializeMap();
      else console.error("Leaflet did not load. Check internet access.");
    }, 1000);
    return;
  }

  map = L.map("countryMap", {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    worldCopyJump: true
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">' +
      "OpenStreetMap</a> contributors"
  }).addTo(map);

  marker = L.marker([20, 0]).addTo(map);
  marker.bindPopup("GEOWORLD — Select a country to locate it.");
}

function locateCountry(country) {
  if (!map || !Array.isArray(country.latlng) || country.latlng.length !== 2) {
    notify("Coordinates are not available for this country.");
    return;
  }

  const [lat, lng] = country.latlng;

  map.setView([lat, lng], 5, { animate: true });

  marker.setLatLng([lat, lng]);
  marker.bindPopup(
    `<strong>${safe(country.name?.common || "Country")}</strong><br>` +
    `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`
  ).openPopup();

  notify(`Map focused on ${country.name?.common || "selected country"}.`);
}

/* Start the atlas */
initializeMap();
loadCountries();

/* =========================================================
   GEOWORLD — STATISTICS INTELLIGENCE
   Standalone module. Does not modify homepage files.
========================================================= */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const API_URL =
    "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,region,subregion,population,area,flags,capital";

  const PAGE_SIZE = 10;
  let countries = [];
  let filteredCountries = [];
  let currentPage = 1;
  let usingFallback = false;
  let toastTimer;

  const fallbackCountries = [
    { name: "India", code: "IN", region: "Asia", capital: "New Delhi", population: 1428627663, area: 3287590 },
    { name: "China", code: "CN", region: "Asia", capital: "Beijing", population: 1409670000, area: 9706961 },
    { name: "United States", code: "US", region: "Americas", capital: "Washington, D.C.", population: 340110988, area: 9372610 },
    { name: "Indonesia", code: "ID", region: "Asia", capital: "Jakarta", population: 277534122, area: 1904569 },
    { name: "Pakistan", code: "PK", region: "Asia", capital: "Islamabad", population: 240485658, area: 881912 },
    { name: "Nigeria", code: "NG", region: "Africa", capital: "Abuja", population: 223800000, area: 923768 },
    { name: "Brazil", code: "BR", region: "Americas", capital: "Brasília", population: 211998573, area: 8515767 },
    { name: "Bangladesh", code: "BD", region: "Asia", capital: "Dhaka", population: 171466990, area: 147570 },
    { name: "Russia", code: "RU", region: "Europe", capital: "Moscow", population: 146150789, area: 17098242 },
    { name: "Ethiopia", code: "ET", region: "Africa", capital: "Addis Ababa", population: 126527060, area: 1104300 },
    { name: "Mexico", code: "MX", region: "Americas", capital: "Mexico City", population: 128455567, area: 1964375 },
    { name: "Japan", code: "JP", region: "Asia", capital: "Tokyo", population: 124516650, area: 377930 },
    { name: "Egypt", code: "EG", region: "Africa", capital: "Cairo", population: 112716598, area: 1002450 },
    { name: "Germany", code: "DE", region: "Europe", capital: "Berlin", population: 83294633, area: 357114 },
    { name: "United Kingdom", code: "GB", region: "Europe", capital: "London", population: 68350000, area: 242900 },
    { name: "France", code: "FR", region: "Europe", capital: "Paris", population: 68373433, area: 551695 },
    { name: "Canada", code: "CA", region: "Americas", capital: "Ottawa", population: 40097761, area: 9984670 },
    { name: "Australia", code: "AU", region: "Oceania", capital: "Canberra", population: 26439111, area: 7692024 },
    { name: "South Africa", code: "ZA", region: "Africa", capital: "Pretoria", population: 62300000, area: 1221037 },
    { name: "Argentina", code: "AR", region: "Americas", capital: "Buenos Aires", population: 46044703, area: 2780400 },
    { name: "Saudi Arabia", code: "SA", region: "Asia", capital: "Riyadh", population: 32175224, area: 2149690 },
    { name: "South Korea", code: "KR", region: "Asia", capital: "Seoul", population: 51784059, area: 100210 },
    { name: "Spain", code: "ES", region: "Europe", capital: "Madrid", population: 48592909, area: 505992 },
    { name: "Italy", code: "IT", region: "Europe", capital: "Rome", population: 58989749, area: 301336 },
    { name: "Turkey", code: "TR", region: "Asia", capital: "Ankara", population: 85326000, area: 783562 },
    { name: "Kenya", code: "KE", region: "Africa", capital: "Nairobi", population: 55100586, area: 580367 },
    { name: "Colombia", code: "CO", region: "Americas", capital: "Bogotá", population: 52321152, area: 1141748 },
    { name: "Ukraine", code: "UA", region: "Europe", capital: "Kyiv", population: 37000000, area: 603500 },
    { name: "New Zealand", code: "NZ", region: "Oceania", capital: "Wellington", population: 5228100, area: 270467 },
    { name: "Norway", code: "NO", region: "Europe", capital: "Oslo", population: 5500000, area: 323802 }
  ];

  const numberFormat = new Intl.NumberFormat("en-US");

  function formatNumber(value) {
    return numberFormat.format(Math.round(Number(value) || 0));
  }

  function compactNumber(value) {
    const n = Number(value) || 0;

    if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";

    return formatNumber(n);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  function normalizeCountry(country) {
    return {
      name: country?.name?.common || country?.name || "Unknown",
      code: country?.cca2 || country?.code || "",
      region: country?.region || "Other",
      capital: Array.isArray(country?.capital)
        ? country.capital.join(", ")
        : (country?.capital || "—"),
      population: Math.max(0, Number(country?.population) || 0),
      area: Math.max(0, Number(country?.area) || 0),
      flag: country?.flags?.svg || country?.flags?.png || ""
    };
  }

  function setStatus(message, online = true) {
    const status = $("dataStatus");
    if (status) status.textContent = message;

    const led = document.querySelector(".status-led");
    if (led) {
      led.style.background = online ? "#72f0bd" : "#ffbd69";
      led.style.boxShadow = online
        ? "0 0 12px #72f0bd"
        : "0 0 12px #ffbd69";
    }
  }

  function setUpdatedLabel() {
    const label = $("lastUpdated");
    if (!label) return;

    label.textContent = "UPDATED " + new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function loadFallback() {
    usingFallback = true;
    countries = fallbackCountries.map(normalizeCountry);
    setStatus("DEMO DATA · API UNAVAILABLE", false);
    setUpdatedLabel();
    renderDashboard();
  }

  async function loadCountries() {
    setStatus("CONNECTING TO COUNTRY DATABASE...");

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-cache",
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error("Country API returned HTTP " + response.status);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Country API returned no records");
      }

      countries = data.map(normalizeCountry)
        .filter(country => country.name !== "Unknown")
        .sort((a, b) => a.name.localeCompare(b.name));

      if (!countries.length) {
        throw new Error("No usable country records");
      }

      usingFallback = false;
      setStatus("LIVE COUNTRY DATA CONNECTED");
      setUpdatedLabel();
      renderDashboard();

    } catch (error) {
      console.warn("GEOWORLD Statistics: API unavailable; using demo records.", error);
      loadFallback();
    }
  }

  function renderDashboard() {
    renderMetrics();
    populateRegionFilter();
    applyFilters();
    renderCharts();
    renderInsights();
  }

  function renderMetrics() {
    const population = countries.reduce((sum, country) => sum + country.population, 0);
    const area = countries.reduce((sum, country) => sum + country.area, 0);
    const regions = new Set(
      countries.map(country => country.region).filter(Boolean)
    );

    $("populationMetric").textContent = compactNumber(population);
    $("countriesMetric").textContent = formatNumber(countries.length);
    $("areaMetric").textContent = compactNumber(area) + " km²";
    $("regionsMetric").textContent = formatNumber(regions.size);
  }

  function populateRegionFilter() {
    const select = $("regionFilter");
    if (!select) return;

    const previousValue = select.value || "all";
    const regions = [...new Set(countries.map(c => c.region).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b));

    select.innerHTML =
      '<option value="all">All regions</option>' +
      regions.map(region =>
        `<option value="${escapeHTML(region)}">${escapeHTML(region)}</option>`
      ).join("");

    select.value = regions.includes(previousValue) ? previousValue : "all";
  }

  function applyFilters() {
    const query = ($("countrySearch")?.value || "").trim().toLowerCase();
    const selectedRegion = $("regionFilter")?.value || "all";
    const sort = $("sortFilter")?.value || "population";

    filteredCountries = countries.filter(country => {
      const matchesName =
        country.name.toLowerCase().includes(query) ||
        country.capital.toLowerCase().includes(query);

      const matchesRegion =
        selectedRegion === "all" || country.region === selectedRegion;

      return matchesName && matchesRegion;
    });

    if (sort === "name") {
      filteredCountries.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "area") {
      filteredCountries.sort((a, b) => b.area - a.area);
    } else {
      filteredCountries.sort((a, b) => b.population - a.population);
    }

    currentPage = 1;
    renderTable();
  }

  function renderTable() {
    const body = $("countryTableBody");
    if (!body) return;

    const totalPages = Math.max(1, Math.ceil(filteredCountries.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageRows = filteredCountries.slice(start, start + PAGE_SIZE);

    if (!pageRows.length) {
      body.innerHTML = `
        <tr>
          <td colspan="5" class="table-message">
            No countries match your search. Try a different name or region.
          </td>
        </tr>`;
    } else {
      body.innerHTML = pageRows.map(country => {
        const flag = country.flag
          ? `<img class="flag" src="${escapeHTML(country.flag)}" alt="" loading="lazy" referrerpolicy="no-referrer">`
          : `<span class="flag" aria-hidden="true"></span>`;

        return `
          <tr>
            <td>
              <div class="country-cell">
                ${flag}
                <span>${escapeHTML(country.name)}</span>
              </div>
            </td>
            <td><span class="region-pill">${escapeHTML(country.region)}</span></td>
            <td>${escapeHTML(country.capital)}</td>
            <td class="population-cell">${formatNumber(country.population)}</td>
            <td>${formatNumber(country.area)}</td>
          </tr>`;
      }).join("");
    }

    $("resultCount").textContent =
      `${formatNumber(filteredCountries.length)} RECORDS FOUND`;

    $("tableSummary").textContent = filteredCountries.length
      ? `SHOWING ${start + 1}–${Math.min(start + PAGE_SIZE, filteredCountries.length)} OF ${formatNumber(filteredCountries.length)}`
      : "NO RECORDS TO DISPLAY";

    $("pageNumber").textContent =
      `${String(currentPage).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`;

    $("prevPage").disabled = currentPage <= 1;
    $("nextPage").disabled = currentPage >= totalPages;
  }

  function renderCharts() {
    renderPopulationChart();
    renderRegionChart();
  }

  function renderPopulationChart() {
    const canvas = $("leadersChart");
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, rect.width || 500);
    const height = Math.max(220, rect.height || 290);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const leaders = [...countries]
      .sort((a, b) => b.population - a.population)
      .slice(0, 10);

    if (!leaders.length) return;

    const left = width < 360 ? 100 : 118;
    const right = 45;
    const top = 13;
    const bottom = 10;
    const rowHeight = (height - top - bottom) / leaders.length;
    const barWidth = Math.max(20, width - left - right);
    const maxPopulation = Math.max(...leaders.map(c => c.population), 1);

    context.font = "10px Manrope, Arial, sans-serif";
    context.textBaseline = "middle";

    leaders.forEach((country, index) => {
      const y = top + index * rowHeight;
      const barY = y + rowHeight * .3;
      const barHeight = Math.max(5, rowHeight * .43);
      const barLength = Math.max(2, (country.population / maxPopulation) * barWidth);

      context.fillStyle = "#9aafbf";
      let label = country.name;
      while (context.measureText(label).width > left - 12 && label.length > 5) {
        label = label.slice(0, -2) + "…";
      }
      context.fillText(label, 0, y + rowHeight * .52);

      context.fillStyle = "#132532";
      context.fillRect(left, barY, barWidth, barHeight);

      const gradient = context.createLinearGradient(left, 0, left + barLength, 0);
      gradient.addColorStop(0, "#3978ff");
      gradient.addColorStop(1, "#65eaff");
      context.fillStyle = gradient;
      context.fillRect(left, barY, barLength, barHeight);

      context.fillStyle = "#65eaff";
      context.font = "9px 'DM Mono', monospace";
      context.textAlign = "right";
      context.fillText(compactNumber(country.population), width - 1, y + rowHeight * .52);
      context.textAlign = "left";
      context.font = "10px Manrope, Arial, sans-serif";
    });
  }

  function renderRegionChart() {
    const chart = $("regionChart");
    const legend = $("regionLegend");
    if (!chart || !legend) return;

    const regionCounts = {};

    countries.forEach(country => {
      const region = country.region || "Other";
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });

    const entries = Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1]);

    const maxCount = Math.max(1, ...entries.map(entry => entry[1]));

    if (!entries.length) {
      chart.innerHTML = '<div class="chart-empty">No regional data available.</div>';
      legend.innerHTML = "";
      return;
    }

    chart.innerHTML = entries.map(([region, count]) => `
      <div class="region-row">
        <span class="region-name">${escapeHTML(region)}</span>
        <div class="region-track">
          <div class="region-fill" style="width:${(count / maxCount) * 100}%"></div>
        </div>
        <span class="region-count">${count}</span>
      </div>
    `).join("");

    legend.innerHTML = entries.map(([region]) =>
      `<span>${escapeHTML(region)}</span>`
    ).join("");
  }

  function renderInsights() {
    const leaders = [...countries].sort((a, b) => b.population - a.population);
    const largest = [...countries].sort((a, b) => b.area - a.area);

    $("populationInsight").textContent = leaders.length
      ? `${leaders[0].name} has the largest reported population in this dataset (${formatNumber(leaders[0].population)}).`
      : "Population information is unavailable.";

    $("areaInsight").textContent = largest.length
      ? `${largest[0].name} has the largest reported area in this dataset (${formatNumber(largest[0].area)} km²).`
      : "Area information is unavailable.";
  }

  function setupNavbar() {
    const button = $("menuButton");
    const nav = $("navLinks");

    if (!button || !nav) return;

    button.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !button.contains(event.target)) {
        nav.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
      }
    });
  }

  function setupControls() {
    $("countrySearch")?.addEventListener("input", applyFilters);
    $("regionFilter")?.addEventListener("change", applyFilters);
    $("sortFilter")?.addEventListener("change", applyFilters);

    $("resetFilters")?.addEventListener("click", () => {
      $("countrySearch").value = "";
      $("regionFilter").value = "all";
      $("sortFilter").value = "population";
      applyFilters();
    });

    $("prevPage")?.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });

    $("nextPage")?.addEventListener("click", () => {
      const totalPages = Math.max(1, Math.ceil(filteredCountries.length / PAGE_SIZE));
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });

    window.addEventListener("resize", renderPopulationChart);
  }

  function setupLogout() {
    $("logoutButton")?.addEventListener("click", async () => {
      try {
        if (window.firebase?.auth) {
          await window.firebase.auth().signOut();
          window.location.href = "./login.html";
        } else {
          showToast("No Firebase authentication is connected to this page.");
        }
      } catch (error) {
        console.error("Logout failed:", error);
        showToast("Logout failed. Check your authentication setup.");
      }
    });
  }

  function init() {
    setupNavbar();
    setupControls();
    setupLogout();

    // Render immediately. The API is not required for the page to appear.
    loadFallback();

    // Replace demo data with live records when the API succeeds.
    loadCountries();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
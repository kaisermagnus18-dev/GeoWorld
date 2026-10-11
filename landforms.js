
"use strict";

const landforms = [
  {
    id: 1, name: "Mount Everest", category: "Mountains", group: "Fold mountain",
    location: "Nepal / China · Himalayas", country: "Nepal and China",
    elevation: 8848.86, elevationLabel: "8,848.86 m",
    coordinates: [27.9881, 86.9250],
    image: "photo-1464822759023-fed622ff2c3b",
    summary: "The highest mountain summit above mean sea level, situated in the Himalayan range.",
    formation: "The Himalayas rose as the Indian Plate converged with the Eurasian Plate. Compression, folding, thrust faulting and continuing uplift have shaped the range.",
    geology: "The summit region contains sedimentary and metamorphic rocks, with complex structures created by long-term tectonic collision.",
    environment: "High altitude produces thin air, extreme cold, powerful winds and extensive snow and ice. Conditions change sharply with elevation.",
    importance: "Everest is central to Himalayan research, mountaineering, regional tourism and studies of glaciers and high-altitude environments.",
    fact: "Its commonly cited height of 8,848.86 metres was announced jointly by Nepal and China in 2020.",
    process: "Plate collision and uplift",
    reference: "https://en.wikipedia.org/wiki/Mount_Everest"
  },
  {
    id: 2, name: "Himalayas", category: "Mountains", group: "Fold mountain range",
    location: "South Asia", country: "India, Nepal, Bhutan, China and Pakistan",
    elevation: 8848.86, elevationLabel: "Up to 8,848.86 m",
    coordinates: [28.0, 84.0],
    image: "photo-1464278533981-50106e6176b1",
    summary: "A vast mountain system containing many of Earth's highest peaks and extensive glacier systems.",
    formation: "Continental collision between India and Eurasia continues to deform and uplift the crust. Rivers and glaciers carve the rising mountains.",
    geology: "Folded sedimentary rocks, metamorphic rocks, faults and thrust sheets record a long history of tectonic convergence.",
    environment: "Elevation, monsoon exposure and latitude produce environments ranging from subtropical forests to alpine meadows, glaciers and permanent snow.",
    importance: "The Himalayas influence regional water supplies, biodiversity, hazards, climate patterns and the headwaters of major Asian rivers.",
    fact: "The mountain system is geologically active; earthquakes and landslides are important regional hazards.",
    process: "Continental collision",
    reference: "https://en.wikipedia.org/wiki/Himalayas"
  },
  {
    id: 3, name: "Andes Mountains", category: "Mountains", group: "Fold and volcanic mountain range",
    location: "Western South America", country: "Venezuela to Chile and Argentina",
    elevation: 6961, elevationLabel: "Aconcagua: 6,961 m",
    coordinates: [-32.6532, -70.0109],
    image: "photo-1464278533981-50106e6176b1",
    summary: "The world's longest continental mountain range, extending along the western edge of South America.",
    formation: "Much of the range is associated with subduction of oceanic plates beneath South America, producing uplift, earthquakes and extensive volcanism.",
    geology: "The Andes contain folded and faulted rocks, uplifted plateaus, volcanic arcs and mineral-rich geological zones.",
    environment: "The range spans tropical mountains, dry deserts, temperate forests, grasslands and high-altitude puna landscapes.",
    importance: "The Andes influence water resources, agriculture, mining, transport and the distribution of ecosystems across South America.",
    fact: "Aconcagua is the highest peak in the Andes and outside Asia.",
    process: "Subduction and uplift",
    reference: "https://en.wikipedia.org/wiki/Andes"
  },
  {
    id: 4, name: "Mount Fuji", category: "Mountains", group: "Volcanic mountain",
    location: "Honshu, Japan", country: "Japan",
    elevation: 3776, elevationLabel: "3,776 m",
    coordinates: [35.3606, 138.7274],
    image: "photo-1493976040374-85c8e12f0c0e",
    summary: "A prominent, near-symmetrical volcanic cone and one of Japan's most recognisable landscapes.",
    formation: "Repeated volcanic eruptions built layers of lava and fragmented volcanic material into the mountain's cone.",
    geology: "Mount Fuji is part of a complex volcanic region where tectonic plate interactions influence magma generation.",
    environment: "Its slopes transition through forests, volcanic terrain and alpine environments, with snow often visible near the summit in colder months.",
    importance: "Fuji has cultural, spiritual, scientific and tourism significance and is monitored as an active volcano.",
    fact: "Its most recent confirmed major eruption began in 1707, known as the Hōei eruption.",
    process: "Volcanic accumulation",
    reference: "https://en.wikipedia.org/wiki/Mount_Fuji"
  },
  {
    id: 5, name: "Tibetan Plateau", category: "Plateaus", group: "Tectonic plateau",
    location: "Central and East Asia", country: "China and surrounding Himalayan region",
    elevation: 4500, elevationLabel: "Average roughly 4,500 m",
    coordinates: [33.0, 88.0],
    image: "photo-1464278533981-50106e6176b1",
    summary: "An immense, high-elevation region often called the Roof of the World.",
    formation: "The plateau developed through continental collision, crustal shortening, thickening and uplift associated with the India–Eurasia collision.",
    geology: "Its broad elevated surface contains mountain ranges, sedimentary basins, volcanic features and extensive fault systems.",
    environment: "Cold, thin air and strong solar radiation shape alpine grasslands, wetlands, lakes and glacier-fed watersheds.",
    importance: "The plateau stores snow and ice and feeds major river systems that support large populations downstream.",
    fact: "It is among the largest and highest plateau regions on Earth.",
    process: "Crustal thickening and uplift",
    reference: "https://en.wikipedia.org/wiki/Tibetan_Plateau"
  },
  {
    id: 6, name: "Deccan Plateau", category: "Plateaus", group: "Volcanic and ancient plateau",
    location: "Peninsular India", country: "India",
    elevation: 1000, elevationLabel: "Varies widely; commonly hundreds of metres",
    coordinates: [17.5, 77.5],
    image: "photo-1519681393784-d120267933ba",
    summary: "A large elevated region of peninsular India with ancient rocks and extensive basaltic terrain.",
    formation: "Its landscape reflects ancient geological structures, long-term erosion and major basalt lava flows associated with the Deccan Traps.",
    geology: "Basalt dominates large parts of the northwest, while older crystalline rocks and other geological units occur across the plateau.",
    environment: "Rainfall varies from relatively dry interiors to wetter margins. Rivers, black soils and seasonal vegetation are important landscape features.",
    importance: "The plateau supports major agricultural regions, cities, mineral resources and diverse river basins.",
    fact: "The Deccan Traps preserve evidence of enormous volcanic eruptions near the end of the Cretaceous Period.",
    process: "Lava flows and long-term erosion",
    reference: "https://en.wikipedia.org/wiki/Deccan_Plateau"
  },
  {
    id: 7, name: "Colorado Plateau", category: "Plateaus", group: "Uplifted plateau",
    location: "Southwestern United States", country: "United States",
    elevation: 2000, elevationLabel: "Broadly 1,500–3,000 m",
    coordinates: [36.1, -111.8],
    image: "photo-1473448912268-2022ce9509d8",
    summary: "An elevated region known for colourful rock layers, mesas, canyons and dramatic desert scenery.",
    formation: "Regional uplift raised the plateau, while rivers and weathering carved deeply into the rock layers.",
    geology: "The region exposes sedimentary rocks of different ages, allowing geologists to examine a long record of environmental change.",
    environment: "Arid and semi-arid conditions dominate, with vegetation varying by elevation and water availability.",
    importance: "Its national parks, fossil sites, Indigenous cultural landscapes and water systems are internationally significant.",
    fact: "The Grand Canyon cuts through part of the Colorado Plateau.",
    process: "Regional uplift and river incision",
    reference: "https://en.wikipedia.org/wiki/Colorado_Plateau"
  },
  {
    id: 8, name: "Indo-Gangetic Plain", category: "Plains", group: "Alluvial plain",
    location: "Northern Indian subcontinent", country: "India, Pakistan, Nepal and Bangladesh",
    elevation: 300, elevationLabel: "Generally low elevation",
    coordinates: [27.0, 80.0],
    image: "photo-1500382017468-9049fed747ef",
    summary: "A broad, fertile lowland built largely from sediments deposited by major Himalayan river systems.",
    formation: "Rivers carry sand, silt and clay from surrounding highlands and repeatedly deposit these materials across the lowland.",
    geology: "Thick alluvial deposits overlie a subsiding foreland basin associated with Himalayan mountain building.",
    environment: "Monsoon rainfall, river flooding and fertile soils support intensive agriculture and dense settlement.",
    importance: "The plain is a major agricultural, transport and population corridor across South Asia.",
    fact: "Its landscapes are continually modified by river migration, sediment deposition and flooding.",
    process: "Fluvial deposition",
    reference: "https://en.wikipedia.org/wiki/Indo-Gangetic_Plain"
  },
  {
    id: 9, name: "Great Plains", category: "Plains", group: "Interior plain",
    location: "Central North America", country: "United States and Canada",
    elevation: 1200, elevationLabel: "Rises westward; varies by region",
    coordinates: [41.5, -101.0],
    image: "photo-1500530855697-b586d89ba3ee",
    summary: "A broad grassland region east of the Rocky Mountains, with gently rolling terrain and extensive sedimentary deposits.",
    formation: "Long-term erosion, sediment accumulation and regional geological history shaped the plains; glaciation modified parts of the north.",
    geology: "Sedimentary bedrock, river deposits, windblown silt and glacial sediments occur in different areas.",
    environment: "Grasslands, continental climate, seasonal rainfall and strong winds define many parts of the region.",
    importance: "The Great Plains are important for grain production, cattle ranching, energy resources and grassland ecology.",
    fact: "The region is not perfectly flat; elevation generally increases toward the Rocky Mountains.",
    process: "Erosion, deposition and regional uplift",
    reference: "https://en.wikipedia.org/wiki/Great_Plains"
  },
  {
    id: 10, name: "Sahara Desert", category: "Deserts", group: "Hot desert",
    location: "North Africa", country: "Multiple North African countries",
    elevation: 1000, elevationLabel: "From low basins to high mountains",
    coordinates: [23.0, 13.0],
    image: "photo-1509316785289-025f5b846b35",
    summary: "The world's largest hot desert, featuring sand seas, rocky plateaus, mountains and gravel plains.",
    formation: "Long-term aridity, wind erosion, weathering and episodic water flow have shaped the desert's varied terrain.",
    geology: "The Sahara includes ancient basement rocks, sedimentary basins, exposed rock surfaces and extensive windblown deposits.",
    environment: "Very low and irregular rainfall creates strong constraints on vegetation and surface water, while mountain regions can have different local climates.",
    importance: "The Sahara contains important fossil records, mineral resources, cultural routes and specialised desert ecosystems.",
    fact: "The Sahara is not entirely sand-covered; extensive rocky and gravelly surfaces occur across it.",
    process: "Arid weathering and wind action",
    reference: "https://en.wikipedia.org/wiki/Sahara"
  },
  {
    id: 11, name: "Atacama Desert", category: "Deserts", group: "Hyperarid desert",
    location: "Northern Chile", country: "Chile",
    elevation: 2500, elevationLabel: "Includes lowlands and high plateaus",
    coordinates: [-23.5, -68.0],
    image: "photo-1469854523086-cc02fe5d8800",
    summary: "An exceptionally dry region between the Pacific coast and the Andes.",
    formation: "Its aridity is associated with the cold Humboldt Current, subtropical atmospheric conditions and rain-shadow effects from the Andes.",
    geology: "Salt flats, volcanic terrain, sedimentary basins and mineral deposits occur throughout the region.",
    environment: "Some locations receive extremely little measurable rainfall. Life often concentrates around specialised microhabitats and water sources.",
    importance: "The desert is important for mineral extraction and astronomical observatories because of its dry climate and clear skies.",
    fact: "Conditions vary significantly across the desert, from coastal fog zones to high Andean terrain.",
    process: "Arid climate, salt accumulation and erosion",
    reference: "https://en.wikipedia.org/wiki/Atacama_Desert"
  },
  {
    id: 12, name: "Namib Sand Sea", category: "Deserts", group: "Coastal dune field",
    location: "Namibia", country: "Namibia",
    elevation: 500, elevationLabel: "Dune heights vary considerably",
    coordinates: [-24.8, 15.3],
    image: "photo-1509316785289-025f5b846b35",
    summary: "A vast coastal dune landscape where wind transports and deposits sand into large dune forms.",
    formation: "Persistent winds, available sediment and coastal aridity combine to create extensive mobile and stabilised dunes.",
    geology: "The landscape contains windblown sand, gravel plains and older sedimentary surfaces.",
    environment: "Fog can provide moisture despite scarce rainfall, supporting specialised desert plants and animals.",
    importance: "The sand sea is a globally notable example of large-scale aeolian processes and desert ecology.",
    fact: "The Namib Sand Sea is recognised as a UNESCO World Heritage property.",
    process: "Wind transport and deposition",
    reference: "https://whc.unesco.org/en/list/1430/"
  },
  {
    id: 13, name: "Grand Canyon", category: "Valleys", group: "River canyon",
    location: "Arizona, United States", country: "United States",
    elevation: 2400, elevationLabel: "Rim elevation varies by location",
    coordinates: [36.1069, -112.1129],
    image: "photo-1473448912268-2022ce9509d8",
    summary: "A deep canyon system revealing layered rocks exposed by incision of the Colorado River and related processes.",
    formation: "River erosion, tributary incision, weathering, mass wasting and regional uplift all contributed to canyon development.",
    geology: "Its walls expose a sequence of rock units recording environments and geological events over a vast span of time.",
    environment: "Elevation, exposure and water availability produce ecosystems ranging from desert scrub to forested rims.",
    importance: "The canyon is a major geological research site, protected landscape and destination with deep Indigenous cultural significance.",
    fact: "The visible rock layers are much older than the modern canyon itself.",
    process: "River incision and erosion",
    reference: "https://www.nps.gov/grca/learn/nature/grand-canyon-geology.htm"
  },
  {
    id: 14, name: "Great Rift Valley", category: "Valleys", group: "Rift valley system",
    location: "Eastern Africa", country: "Multiple East African countries",
    elevation: 2000, elevationLabel: "Elevation varies across the rift",
    coordinates: [-2.0, 36.0],
    image: "photo-1516026672322-bc52d61a55d5",
    summary: "A broad geological region of rift basins, escarpments, volcanoes and lakes extending through eastern Africa.",
    formation: "Tensional forces stretch and thin the crust, producing faults, subsiding basins, volcanic activity and changing drainage patterns.",
    geology: "Normal faults, volcanic rocks, sedimentary basin deposits and geothermal systems are common features.",
    environment: "The rift contains savannas, forests, highlands, lakes and arid zones, with strong ecological variation.",
    importance: "It is significant for tectonic research, fossil discoveries, biodiversity, agriculture and geothermal energy.",
    fact: "The East African Rift is an active continental rifting system, not one single uniform valley.",
    process: "Continental rifting",
    reference: "https://en.wikipedia.org/wiki/East_African_Rift"
  },
  {
    id: 15, name: "Yarlung Tsangpo Gorge", category: "Valleys", group: "River gorge",
    location: "Tibet, China", country: "China",
    elevation: 3000, elevationLabel: "River and surrounding elevations vary",
    coordinates: [29.7, 94.9],
    image: "photo-1464278533981-50106e6176b1",
    summary: "A spectacular gorge carved by the Yarlung Tsangpo River around the eastern Himalayan region.",
    formation: "River incision interacts with active uplift, steep topography and landslides to shape the gorge.",
    geology: "The region contains complex tectonic structures and steep relief near the eastern Himalayan syntaxis.",
    environment: "Heavy rainfall in parts of the region supports forests, while elevation and exposure create sharp ecological transitions.",
    importance: "The gorge is important for river geomorphology, biodiversity and understanding how rivers respond to active mountain building.",
    fact: "The river continues into India, where it becomes the Brahmaputra.",
    process: "River incision and tectonic uplift",
    reference: "https://en.wikipedia.org/wiki/Yarlung_Tsangpo_Grand_Canyon"
  },
  {
    id: 16, name: "Amazon Basin", category: "Other", group: "River basin",
    location: "Northern South America", country: "Brazil and neighbouring countries",
    elevation: 300, elevationLabel: "Mostly lowland terrain",
    coordinates: [-3.4653, -62.2159],
    image: "photo-1448375240586-882707db888b",
    summary: "A vast drainage basin dominated by the Amazon River and extensive tropical rainforest.",
    formation: "Long-term drainage development and sediment transport created extensive floodplains and lowland surfaces.",
    geology: "The basin contains sedimentary deposits, ancient geological provinces and river systems that continually redistribute material.",
    environment: "High rainfall, warm temperatures, flood pulses and complex river networks sustain extraordinary biodiversity.",
    importance: "The basin matters for biodiversity, carbon storage, freshwater, Indigenous communities and regional climate systems.",
    fact: "A river basin is defined by the land drained toward a river network, rather than by a single elevation or shape.",
    process: "River erosion and sediment deposition",
    reference: "https://en.wikipedia.org/wiki/Amazon_basin"
  },
  {
    id: 17, name: "Ganges–Brahmaputra Delta", category: "Coastal", group: "River delta",
    location: "Bangladesh and eastern India", country: "Bangladesh and India",
    elevation: 10, elevationLabel: "Extensive low-lying terrain",
    coordinates: [22.2, 90.0],
    image: "photo-1500382017468-9049fed747ef",
    summary: "A huge delta where sediment from major rivers builds and reshapes low-lying coastal land.",
    formation: "Rivers deliver sediment to the Bay of Bengal, where deposition, tidal processes, waves and channel migration reshape the delta.",
    geology: "Thick alluvial and deltaic sediments form a dynamic landscape of channels, mudflats, islands and floodplains.",
    environment: "Monsoon floods, cyclones, tidal flows and salinity influence its wetlands and settlements.",
    importance: "The delta supports agriculture, fisheries and large populations, while facing major flood and coastal risks.",
    fact: "The Sundarbans mangrove ecosystem occupies part of this delta.",
    process: "Fluvial and marine deposition",
    reference: "https://en.wikipedia.org/wiki/Ganges_Delta"
  },
  {
    id: 18, name: "Sundarbans", category: "Coastal", group: "Tidal mangrove delta",
    location: "Bay of Bengal", country: "India and Bangladesh",
    elevation: 5, elevationLabel: "Predominantly low-lying",
    coordinates: [21.95, 89.18],
    image: "photo-1448375240586-882707db888b",
    summary: "A vast mangrove landscape of tidal creeks, muddy islands and coastal wetlands.",
    formation: "River sediment, tides, waves and changing sea levels continually build and erode the deltaic landscape.",
    geology: "Fine-grained mud, silt and sand form channels, tidal flats and low-lying islands.",
    environment: "Salt-tolerant mangroves thrive in tidal conditions. Cyclones, salinity changes and erosion affect the ecosystem.",
    importance: "The Sundarbans provide habitat, support fisheries and help buffer parts of the coast from waves and storm impacts.",
    fact: "It is one of the world's best-known mangrove forest regions.",
    process: "Tidal processes and sediment deposition",
    reference: "https://whc.unesco.org/en/list/798/"
  },
  {
    id: 19, name: "Norwegian Fjords", category: "Glacial", group: "Glacially carved coastal valley",
    location: "Western Norway", country: "Norway",
    elevation: 1000, elevationLabel: "Steep relief; varies by fjord",
    coordinates: [61.0, 6.8],
    image: "photo-1518837695005-2083093ee35b",
    summary: "Long, narrow sea inlets bordered by steep mountain walls and shaped largely by past glaciers.",
    formation: "Glaciers widened and deepened pre-existing valleys; after ice retreated, seawater flooded many of these overdeepened valleys.",
    geology: "Hard bedrock, steep valley walls, hanging valleys and glacial deposits occur across the fjord region.",
    environment: "Maritime conditions, steep slopes and deep water create distinctive ecosystems and settlement patterns.",
    importance: "Fjords are significant for tourism, fisheries, transport and glacial landscape research.",
    fact: "A fjord is typically a sea-filled glacial valley, not simply any narrow coastal inlet.",
    process: "Glacial erosion and marine flooding",
    reference: "https://en.wikipedia.org/wiki/Fjord"
  },
  {
    id: 20, name: "Aletsch Glacier", category: "Glacial", group: "Valley glacier",
    location: "Swiss Alps", country: "Switzerland",
    elevation: 3000, elevationLabel: "Elevation varies along the glacier",
    coordinates: [46.48, 8.03],
    image: "photo-1464278533981-50106e6176b1",
    summary: "A major Alpine glacier whose flowing ice shapes mountain valleys and transports rock debris.",
    formation: "Snow accumulates, compacts into ice and flows downhill under gravity, eroding bedrock and carrying sediment.",
    geology: "Glacial erosion can create U-shaped valleys, striations and moraines made of transported rock debris.",
    environment: "The glacier and its surroundings respond to temperature, snowfall and changing seasonal melt.",
    importance: "It is a valuable site for studying glacier dynamics, climate change, water supply and Alpine landscapes.",
    fact: "Glaciers are moving bodies of ice; their length and area can change substantially over time.",
    process: "Ice flow and glacial erosion",
    reference: "https://en.wikipedia.org/wiki/Aletsch_Glacier"
  },
  {
    id: 21, name: "Great Barrier Reef Coast", category: "Coastal", group: "Reef and coastal landscape",
    location: "Queensland, Australia", country: "Australia",
    elevation: 0, elevationLabel: "Sea-level reef system",
    coordinates: [-18.2871, 147.6992],
    image: "photo-1544551763-46a013bb70d5",
    summary: "A complex marine landscape of coral reefs, lagoons, islands and adjoining coastlines.",
    formation: "Corals and other organisms build calcium-carbonate structures over time, influenced by water conditions, sea level and sediment.",
    geology: "Reef structures include living coral communities, carbonate deposits, reef flats and lagoonal sediments.",
    environment: "Water temperature, light, salinity and water quality strongly influence reef ecosystems.",
    importance: "The reef supports biodiversity, tourism, fisheries and coastal research, but is vulnerable to marine heatwaves and other pressures.",
    fact: "The Great Barrier Reef is a vast interconnected reef system, not one continuous coral wall.",
    process: "Biological carbonate construction",
    reference: "https://whc.unesco.org/en/list/154/"
  },
  {
    id: 22, name: "Galápagos Islands", category: "Other", group: "Volcanic islands",
    location: "Eastern Pacific Ocean", country: "Ecuador",
    elevation: 1707, elevationLabel: "Wolf Volcano: about 1,707 m",
    coordinates: [-0.8, -91.0],
    image: "photo-1469474968028-56623f02e42e",
    summary: "An archipelago of volcanic islands with distinctive geology and extraordinary wildlife.",
    formation: "Repeated eruptions built volcanic islands as the oceanic plate moved over a mantle hotspot region.",
    geology: "Lava fields, volcanic cones, calderas and young basaltic rocks occur across the archipelago.",
    environment: "Ocean currents, elevation and rainfall differences create varied habitats across the islands.",
    importance: "The islands are internationally significant for evolution studies, conservation and volcanic research.",
    fact: "The islands' landscapes and isolation helped shape their unique biological communities.",
    process: "Hotspot volcanism",
    reference: "https://whc.unesco.org/en/list/1/"
  },
  {
    id: 23, name: "Mariana Trench", category: "Other", group: "Ocean trench",
    location: "Western Pacific Ocean", country: "Pacific Ocean",
    elevation: -10900, elevationLabel: "Deepest point roughly 10.9 km below sea level",
    coordinates: [11.35, 142.2],
    image: "photo-1518837695005-2083093ee35b",
    summary: "A deep oceanic trench formed where one tectonic plate descends beneath another.",
    formation: "Subduction bends and carries oceanic lithosphere into the mantle, creating a long, narrow seafloor depression.",
    geology: "The trench lies within a complex subduction system associated with earthquakes, deep-sea sediments and volcanic-arc processes.",
    environment: "Extreme pressure, darkness and cold conditions characterise the deepest parts, with specialised deep-sea life.",
    importance: "The trench is crucial for studying subduction, deep-ocean ecosystems and the limits of life under extreme pressure.",
    fact: "Depth estimates depend on the measurement location, method and reference datum.",
    process: "Oceanic plate subduction",
    reference: "https://oceanexplorer.noaa.gov/facts/marianatrench.html"
  },
  {
    id: 24, name: "Icelandic Volcanic Terrain", category: "Other", group: "Volcanic landscape",
    location: "North Atlantic Ocean", country: "Iceland",
    elevation: 2110, elevationLabel: "Highest point: about 2,110 m",
    coordinates: [64.9, -18.6],
    image: "photo-1476610182048-b716b8518aae",
    summary: "A landscape of lava fields, volcanoes, glaciers, geothermal features and young volcanic rock.",
    formation: "Iceland lies along the Mid-Atlantic Ridge and is also influenced by a mantle hotspot, producing frequent geological activity.",
    geology: "Basaltic lava, volcanic ash, fissures, geothermal systems and glacial deposits create a varied terrain.",
    environment: "The cool maritime climate and interaction of fire and ice shape vegetation, rivers and land surfaces.",
    importance: "Iceland provides an important natural laboratory for volcanology, geothermal energy and glacial processes.",
    fact: "Volcanic activity and glaciation can interact, producing distinctive landforms and hazards.",
    process: "Rifting, volcanism and glaciation",
    reference: "https://en.wikipedia.org/wiki/Geography_of_Iceland"
  }
];

const grid = document.getElementById("landformGrid");
const searchInput = document.getElementById("searchInput");
const visibleCount = document.getElementById("visibleCount");
const recordCount = document.getElementById("recordCount");
const emptyState = document.getElementById("emptyState");
const sortSelect = document.getElementById("sortSelect");
const modal = document.getElementById("detailModal");
const modalContent = document.getElementById("modalContent");

let activeCategory = "All";
let map;
let markerLayer;
let mapMarkers = new Map();
let selectedId = null;

const imageUrl = (id, width = 850) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

function safeText(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function getSearchText(item) {
  return [
    item.name, item.category, item.group, item.location, item.country,
    item.summary, item.formation, item.geology, item.environment,
    item.importance, item.process, item.fact
  ].join(" ").toLowerCase();
}

function filteredLandforms() {
  const query = searchInput.value.trim().toLowerCase();

  let result = landforms.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = !query || getSearchText(item).includes(query);
    return matchesCategory && matchesSearch;
  });

  if (sortSelect.value === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortSelect.value === "elevation") {
    result.sort((a, b) => b.elevation - a.elevation);
  }

  return result;
}

function renderCards() {
  const items = filteredLandforms();

  visibleCount.textContent = items.length;
  recordCount.textContent = landforms.length;
  grid.innerHTML = "";
  emptyState.hidden = items.length !== 0;

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "land-card";
    card.style.animationDelay = `${Math.min(index * 35, 280)}ms`;

    card.innerHTML = `
      <div class="card-image">
        <img src="${imageUrl(item.image, 850)}"
             alt="${safeText(item.name)}"
             loading="lazy"
             onerror="this.style.opacity='.25'">
        <span class="card-type">${safeText(item.category.toUpperCase())}</span>
        <span class="card-number">GW / ${String(item.id).padStart(3, "0")}</span>
      </div>
      <div class="card-body">
        <div class="card-location">⌖ ${safeText(item.location.toUpperCase())}</div>
        <h3>${safeText(item.name)}</h3>
        <p>${safeText(item.summary)}</p>
        <div class="card-facts">
          <div class="card-fact"><span>LANDFORM CLASS</span><strong>${safeText(item.group)}</strong></div>
          <div class="card-fact"><span>KEY PROCESS</span><strong>${safeText(item.process)}</strong></div>
        </div>
        <div class="card-footer">
          <span>RECORD ${String(item.id).padStart(3, "0")}</span>
          <button class="details-button" type="button" data-open="${item.id}">OPEN INTELLIGENCE ↗</button>
        </div>
      </div>`;

    grid.appendChild(card);
  });
}

function openDetails(id) {
  const item = landforms.find(entry => entry.id === Number(id));
  if (!item) return;

  selectedId = item.id;

  modalContent.innerHTML = `
    <div class="modal-hero">
      <img src="${imageUrl(item.image, 1400)}" alt="${safeText(item.name)}">
      <div class="modal-hero-text">
        <span>${safeText(item.category.toUpperCase())} / ${safeText(item.group.toUpperCase())}</span>
        <h2 id="modalTitle">${safeText(item.name)}</h2>
      </div>
    </div>
    <div class="modal-body">
      <p class="modal-intro">${safeText(item.summary)}</p>
      <div class="modal-facts">
        <div class="modal-fact"><span>LOCATION</span><strong>${safeText(item.country)}</strong></div>
        <div class="modal-fact"><span>REFERENCE ELEVATION</span><strong>${safeText(item.elevationLabel)}</strong></div>
        <div class="modal-fact"><span>LATITUDE / LONGITUDE</span><strong>${item.coordinates[0].toFixed(4)}, ${item.coordinates[1].toFixed(4)}</strong></div>
      </div>
      <div class="modal-details">
        <div><h3>01 / FORMATION</h3><p>${safeText(item.formation)}</p></div>
        <div><h3>02 / GEOLOGY</h3><p>${safeText(item.geology)}</p></div>
        <div><h3>03 / ENVIRONMENT</h3><p>${safeText(item.environment)}</p></div>
        <div><h3>04 / WHY IT MATTERS</h3><p>${safeText(item.importance)}</p></div>
      </div>
      <div class="source-note">
        <div class="source-symbol">✦</div>
        <div><strong>FIELD NOTE</strong><p>${safeText(item.fact)}</p></div>
      </div>
      <a class="modal-reference" href="${safeText(item.reference)}" target="_blank" rel="noopener noreferrer">READ REFERENCE SOURCE ↗</a>
      <button class="map-reset" type="button" id="modalLocate">LOCATE THIS LANDFORM ON MAP ↗</button>
    </div>`;

  modal.hidden = false;
  document.body.style.overflow = "hidden";

  document.getElementById("modalLocate").addEventListener("click", () => {
    closeModal();
    locateLandform(item.id);
    document.getElementById("earth-map").scrollIntoView({ behavior: "smooth" });
  });
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

function initMap() {
  if (!window.L) {
    document.getElementById("terrainMap").innerHTML =
      '<p style="padding:24px;color:#91a5bb">The interactive map could not load. Check your internet connection and reload this page.</p>';
    return;
  }

  map = L.map("terrainMap", {
    scrollWheelZoom: false,
    worldCopyJump: true
  }).setView([18, 12], 2);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 18
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);

  landforms.forEach(item => {
    const marker = L.circleMarker(item.coordinates, {
      radius: 6,
      color: "#7beaff",
      weight: 1.5,
      fillColor: "#168dff",
      fillOpacity: 0.9
    }).addTo(markerLayer);

    marker.bindPopup(`
      <div class="map-popup">
        <strong>${safeText(item.name)}</strong><br>
        <span>${safeText(item.category)} · ${safeText(item.country)}</span><br>
        <button type="button" data-map-open="${item.id}">OPEN PROFILE ↗</button>
      </div>`);

    marker.on("click", () => updateMapPreview(item));
    mapMarkers.set(item.id, marker);
  });

  map.on("popupopen", event => {
    const button = event.popup.getElement()?.querySelector("[data-map-open]");
    if (button) {
      button.addEventListener("click", () => openDetails(button.dataset.mapOpen));
    }
  });

  document.getElementById("resetMap").addEventListener("click", () => {
    map.setView([18, 12], 2);
    document.getElementById("mapPreview").innerHTML = `
      <span class="preview-icon">◎</span>
      <h3>Explore the map</h3>
      <p>Select a map marker or a landform card to inspect a location.</p>`;
    document.getElementById("mapCoordinates").textContent = "COORDINATES: —";
    selectedId = null;
  });
}

function updateMapPreview(item) {
  selectedId = item.id;

  document.getElementById("mapPreview").innerHTML = `
    <span class="preview-icon">⌖</span>
    <h3>${safeText(item.name)}</h3>
    <p>${safeText(item.summary)}</p>
    <p><strong style="color:#69e7ff">${safeText(item.category)}</strong><br>${safeText(item.country)}</p>
    <button class="details-button" id="mapDetailsButton" type="button">OPEN FULL PROFILE ↗</button>`;

  document.getElementById("mapCoordinates").textContent =
    `LAT: ${item.coordinates[0].toFixed(4)} / LON: ${item.coordinates[1].toFixed(4)}`;

  document.getElementById("mapDetailsButton").addEventListener("click", () => openDetails(item.id));
}

function locateLandform(id) {
  const item = landforms.find(entry => entry.id === Number(id));
  if (!item || !map) return;

  updateMapPreview(item);
  map.flyTo(item.coordinates, 5, { duration: 1.1 });

  const marker = mapMarkers.get(item.id);
  if (marker) setTimeout(() => marker.openPopup(), 900);
}

document.getElementById("filterChips").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.classList.toggle("selected", chip === button);
  });
  renderCards();
});

searchInput.addEventListener("input", renderCards);
sortSelect.addEventListener("change", renderCards);

grid.addEventListener("click", event => {
  const button = event.target.closest("[data-open]");
  if (!button) return;

  const id = Number(button.dataset.open);
  openDetails(id);
  locateLandform(id);
});

document.getElementById("resetSearch").addEventListener("click", () => {
  searchInput.value = "";
  activeCategory = "All";
  sortSelect.value = "featured";
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.classList.toggle("selected", chip.dataset.category === "All");
  });
  renderCards();
});

document.getElementById("closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

renderCards();
initMap();

const SUPABASE_URL = "https://pwhqgafnqboabruhnarf.supabase.co";
const SUPABASE_KEY = "sb_publishable_c66NZz656lAB28ITz7WjBA_qtqatqmv";

async function loadSupabaseApps() {
  const appList = document.getElementById("appList");
  const searchInput = document.getElementById("searchInput");
  const appCount = document.getElementById("appCount");
  const noResults = document.getElementById("noResults");

  if (!window.supabase || !appList) return;

  const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  const { data, error } = await client
    .from("Apps")
    .select("id, name, category, version, logo, link")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error.message);
    return;
  }

  const newApps = (data || []).map((app) => ({
    id: app.id,
    name: app.name || "Android App",
    icon: app.logo || "",
    rating: "4.5",
    version: app.version || "1.0.0",
    description: app.category || "Android application.",
    link: app.link || ""
  }));

  // Purane apps ko preserve karke Supabase apps alag add karo.
  const existingIds = new Set(
    Array.from(appList.querySelectorAll("[data-supabase-app-id]"))
      .map((card) => card.dataset.supabaseAppId)
  );

  newApps.forEach((app) => {
    if (existingIds.has(String(app.id))) return;

    const card = document.createElement("article");
    card.className = "app-card";
    card.dataset.supabaseAppId = String(app.id);

    const top = document.createElement("div");
    top.className = "app-top";

    const img = document.createElement("img");
    img.className = "app-icon";
    img.src = app.icon;
    img.alt = app.name + " icon";
    img.loading = "lazy";
    img.onerror = () => {
      img.style.display = "none";
    };

    const info = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "app-name";
    title.textContent = app.name;

    const rating = document.createElement("div");
    rating.className = "app-rating";
    rating.textContent = "★ " + app.rating;

    info.append(title, rating);
    top.append(img, info);

    const desc = document.createElement("p");
    desc.className = "app-description";
    desc.textContent = app.description;

    const details = document.createElement("div");
    details.className = "app-info";

    const version = document.createElement("span");
    version.textContent = "Version " + app.version;

    const platform = document.createElement("span");
    platform.textContent = "Android";

    details.append(version, platform);

    const buttons = document.createElement("div");
    buttons.className = "app-buttons";

    if (app.link) {
      const download = document.createElement("a");
      download.className = "app-button download-button";
      download.href = app.link;
      download.target = "_blank";
      download.rel = "noopener noreferrer";
      download.textContent = "Download";
      buttons.append(download);
    }

    const detail = document.createElement("button");
    detail.className = "app-button details-button";
    detail.textContent = "Details";
    detail.addEventListener("click", () => {
      alert(
        app.name + "\n\n" + app.description +
        "\n\nVersion: " + app.version
      );
    });

    buttons.append(detail);
    card.append(top, desc, details, buttons);
    appList.append(card);
  });

  // Total cards count: old + Supabase apps.
  function updateCount() {
    const cards = Array.from(appList.querySelectorAll(".app-card"));
    const visibleCards = cards.filter(
      (card) => card.style.display !== "none"
    );

    appCount.textContent = `${visibleCards.length} APPS`;

    if (noResults) {
      noResults.style.display = visibleCards.length ? "none" : "block";
    }
  }

  function filterApps() {
    const query = (searchInput?.value || "").toLowerCase().trim();

    appList.querySelectorAll(".app-card").forEach((card) => {
      card.style.display = card.textContent.toLowerCase().includes(query)
        ? ""
        : "none";
    });

    updateCount();
  }

  if (searchInput && !searchInput.dataset.supabaseSearchBound) {
    searchInput.addEventListener("input", filterApps);
    searchInput.dataset.supabaseSearchBound = "true";
  }

  filterApps();
}

loadSupabaseApps();

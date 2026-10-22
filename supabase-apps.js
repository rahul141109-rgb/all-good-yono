const SUPABASE_URL = "https://pwhqgafnqboabruhnarf.supabase.co";
const SUPABASE_KEY = "sb_publishable_c66NZz656lAB28ITz7WjBA_qtqatqmv";

function supabaseAppSlug(app) {
  return String(app.name || "app")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  const supabaseApps = (data || []).map((item) => ({
    id: item.id,
    name: item.name || "Android App",
    icon: item.logo || "",
    rating: "4.5",
    version: item.version || "1.0.0",
    description: item.category || "Android application.",
    link: item.link || "",
    slug: supabaseAppSlug(item)
  }));

  // Store apps so the details page can find them.
  window.ALL_GOOD_YONO_SUPABASE_APPS = supabaseApps;

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createDetailsUrl(app) {
    return "/?app=" + encodeURIComponent(app.slug);
  }

  function showSupabaseDetails(app) {
    const home = document.getElementById("homePage");
    const page = document.getElementById("appDetailsPage");
    const content = document.getElementById("appDetailsContent");

    if (!home || !page || !content) return;

    home.hidden = true;
    page.hidden = false;
    content.replaceChildren();

    if (app.icon) {
      const img = createElement("img", "app-icon");
      img.src = app.icon;
      img.alt = app.name + " icon";
      img.onerror = () => {
        img.style.display = "none";
      };
      content.appendChild(img);
    }

    content.appendChild(createElement("h2", "", app.name));
    content.appendChild(
      createElement("p", "", app.description)
    );
    content.appendChild(
      createElement("p", "", "Version: " + app.version)
    );
    content.appendChild(
      createElement("p", "", "Platform: Android")
    );

    if (app.link) {
      const download = createElement(
        "a",
        "app-button download-button",
        "Download"
      );
      download.href = app.link;
      download.target = "_blank";
      download.rel = "noopener noreferrer";
      content.appendChild(download);
    }

    document.title = app.name + " | All Good Yono";
    history.replaceState({}, "", createDetailsUrl(app));
  }

  // Add Supabase cards without duplicating them.
  const existingIds = new Set(
    Array.from(
      appList.querySelectorAll("[data-supabase-app-id]")
    ).map((card) => card.dataset.supabaseAppId)
  );

  supabaseApps.forEach((app) => {
    if (existingIds.has(String(app.id))) return;

    const card = createElement("article", "app-card");
    card.dataset.supabaseAppId = String(app.id);
    card.dataset.appSlug = app.slug;

    const top = createElement("div", "app-top");

    if (app.icon) {
      const img = createElement("img", "app-icon");
      img.src = app.icon;
      img.alt = app.name + " icon";
      img.loading = "lazy";
      img.onerror = () => {
        img.style.display = "none";
      };
      top.appendChild(img);
    }

    const info = createElement("div");
    info.appendChild(createElement("h3", "app-name", app.name));
    info.appendChild(createElement("div", "app-rating", "★ " + app.rating));
    top.appendChild(info);

    const description = createElement(
      "p",
      "app-description",
      app.description
    );

    const appInfo = createElement("div", "app-info");
    appInfo.appendChild(
      createElement("span", "", "Version " + app.version)
    );
    appInfo.appendChild(
      createElement("span", "", "Android")
    );

    const buttons = createElement("div", "app-buttons");

    if (app.link) {
      const download = createElement(
        "a",
        "app-button download-button",
        "Download"
      );
      download.href = app.link;
      download.target = "_blank";
      download.rel = "noopener noreferrer";
      buttons.appendChild(download);
    }

    const details = createElement(
      "a",
      "app-button details-button",
      "View Details"
    );
    details.href = createDetailsUrl(app);
    details.addEventListener("click", (event) => {
      event.preventDefault();
      showSupabaseDetails(app);
    });
    buttons.appendChild(details);

    card.append(top, description, appInfo, buttons);
    appList.appendChild(card);
  });

  function updateCount() {
    const cards = Array.from(
      appList.querySelectorAll(".app-card")
    );
    const visibleCards = cards.filter(
      (card) => card.style.display !== "none"
    );

    if (appCount) {
      appCount.textContent = visibleCards.length + " APPS";
    }

    if (noResults) {
      noResults.style.display = visibleCards.length ? "none" : "block";
    }
  }

  // Filter all cards, including hardcoded and Supabase apps.
  function filterApps() {
    const query = (searchInput?.value || "").toLowerCase().trim();

    appList.querySelectorAll(".app-card").forEach((card) => {
      card.style.display = card.textContent
        .toLowerCase()
        .includes(query) ? "" : "none";
    });

    updateCount();
  }

  if (searchInput && !searchInput.dataset.supabaseSearchBound) {
    searchInput.addEventListener("input", filterApps);
    searchInput.dataset.supabaseSearchBound = "true";
  }

  filterApps();

  // Open a Supabase app when its URL is requested.
  const requestedSlug = new URLSearchParams(
    window.location.search
  ).get("app");

  if (requestedSlug) {
    const requestedApp = supabaseApps.find(
      (app) => app.slug === requestedSlug.toLowerCase()
    );

    if (requestedApp) {
      showSupabaseDetails(requestedApp);
    }
  }
}

loadSupabaseApps();

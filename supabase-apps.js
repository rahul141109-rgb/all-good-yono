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

  window.ALL_GOOD_YONO_SUPABASE_APPS = supabaseApps;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function detailsUrl(app) {
    return "/?app=" + encodeURIComponent(app.slug);
  }

  function showSupabaseDetails(app, updateUrl = true) {
    const home = document.getElementById("homePage");
    const page = document.getElementById("appDetailsPage");
    const content = document.getElementById("appDetailsContent");

    if (!home || !page || !content) return;

    home.hidden = true;
    page.hidden = false;
    content.replaceChildren();
    content.className = "app-details-card";

    const top = el("div", "details-app-top");
    const icon = el("img", "details-app-icon");
    icon.src = app.icon || "";
    icon.alt = app.name + " icon";
    icon.onerror = () => {
      icon.style.visibility = "hidden";
    };

    const heading = el("div", "details-app-heading");
    const title = el("h1", "", app.name);
    const rating = el("p", "details-rating", "★ " + app.rating);

    heading.append(title, rating);
    top.append(icon, heading);

    const description = el(
      "p",
      "details-description",
      app.description
    );

    const version = el(
      "p",
      "details-version",
      "Version: " + app.version
    );

    const platform = el(
      "p",
      "details-platform",
      "Platform: Android"
    );

    content.append(top, description, version, platform);

    if (app.link) {
      const download = el(
        "a",
        "app-button download-button details-download",
        "⬇ Download App"
      );
      download.href = app.link;
      download.target = "_blank";
      download.rel = "noopener noreferrer";
      content.appendChild(download);
    }

    document.title = app.name + " | All Good Yono";

    if (updateUrl) {
      history.pushState({}, "", detailsUrl(app));
    }
  }

  const existingIds = new Set(
    Array.from(
      appList.querySelectorAll("[data-supabase-app-id]")
    ).map((card) => card.dataset.supabaseAppId)
  );

  supabaseApps.forEach((app) => {
    if (existingIds.has(String(app.id))) return;

    const card = el("article", "app-card");
    card.dataset.supabaseAppId = String(app.id);
    card.dataset.appSlug = app.slug;

    const top = el("div", "app-top");

    if (app.icon) {
      const img = el("img", "app-icon");
      img.src = app.icon;
      img.alt = app.name + " icon";
      img.loading = "lazy";
      img.onerror = () => {
        img.style.visibility = "hidden";
      };
      top.appendChild(img);
    }

    const info = el("div");
    info.append(
      el("h3", "app-name", app.name),
      el("div", "app-rating", "★ " + app.rating)
    );
    top.appendChild(info);

    const description = el(
      "p",
      "app-description",
      app.description
    );

    const appInfo = el("div", "app-info");
    appInfo.append(
      el("span", "", "Version " + app.version),
      el("span", "", "Android")
    );

    const buttons = el("div", "app-buttons");

    if (app.link) {
      const download = el(
        "a",
        "app-button download-button",
        "Download"
      );
      download.href = app.link;
      download.target = "_blank";
      download.rel = "noopener noreferrer";
      buttons.appendChild(download);
    }

    const details = el(
      "a",
      "app-button details-button",
      "View Details"
    );
    details.href = detailsUrl(app);

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

    const visible = cards.filter(
      (card) => card.style.display !== "none"
    );

    if (appCount) {
      appCount.textContent = visible.length + " APPS";
    }

    if (noResults) {
      noResults.style.display = visible.length ? "none" : "block";
    }
  }

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

  const requestedSlug = new URLSearchParams(
    window.location.search
  ).get("app");

  if (requestedSlug) {
    const requestedApp = supabaseApps.find(
      (app) => app.slug === requestedSlug.toLowerCase()
    );

    if (requestedApp) {
      showSupabaseDetails(requestedApp, false);
    }
  }
}

loadSupabaseApps();

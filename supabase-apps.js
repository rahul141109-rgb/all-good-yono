const SUPABASE_URL = "https://pwhqgafnqboabruhnarf.supabase.co";
const SUPABASE_KEY = "sb_publishable_c66NZz656lAB28ITz7WjBA_qtqatqmv";

async function loadSupabaseApps() {
  const appList = document.getElementById("appList");

  if (!window.supabase || !appList) {
    console.error("Supabase library or appList not found.");
    return;
  }

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  const { data, error } = await supabaseClient
    .from("Apps")
    .select("id, name, category, version, logo, link")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error.message);
    return;
  }

  (data || []).forEach((app) => {
    const card = document.createElement("article");
    card.className = "app-card";
    card.dataset.supabaseAppId = app.id;

    const top = document.createElement("div");
    top.className = "app-top";

    const img = document.createElement("img");
    img.className = "app-icon";
    img.src = app.logo || "";
    img.alt = (app.name || "App") + " icon";
    img.loading = "lazy";
    img.onerror = () => {
      img.style.display = "none";
    };

    const info = document.createElement("div");

    const title = document.createElement("h3");
    title.className = "app-name";
    title.textContent = app.name || "Android App";

    const rating = document.createElement("div");
    rating.className = "app-rating";
    rating.textContent = "★ 4.5";

    info.append(title, rating);
    top.append(img, info);

    const description = document.createElement("p");
    description.className = "app-description";
    description.textContent = app.category || "Android application.";

    const details = document.createElement("div");
    details.className = "app-info";

    const version = document.createElement("span");
    version.textContent = "Version " + (app.version || "1.0.0");

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

    const detailButton = document.createElement("button");
    detailButton.className = "app-button details-button";
    detailButton.textContent = "Details";

    detailButton.addEventListener("click", () => {
      alert(
        (app.name || "Android App") +
        "\n\nCategory: " + (app.category || "Other") +
        "\nVersion: " + (app.version || "1.0.0")
      );
    });

    buttons.append(detailButton);
    card.append(top, description, details, buttons);
    appList.append(card);
  });
}

loadSupabaseApps();

const apps = [
  {
    name: "Spin Winner ",
    icon: "images/app01.png",
    rating: "4.5",
    version: "1.0.0",
    description: "Useful Android application.",
    link: "https://sfspinwinner.com/?code=SDN9HGYEL5C&t=1786179557"
  },
  {
    name: "Bingo101",
    icon: "images/app02.png",
    rating: "4.5",
    version: "1.0.0",
    description: "Useful Android application.",
    link: "https://bin3go101.net/?code=6YF8QWQFC4Z&t=1786125445"
  },
  {
    name: "Joy Rummy",
    icon: "images/app03.png",
    rating: "4.5",
    version: "1.0.0",
    description: "Useful Android application.",
    link: "https://www.joyrummyon.com/?code=J5K5FS3UR4F&t=1786171415"
  }

  // Isi format mein baaki apps add honge.
];

const appList = document.getElementById("appList");
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");
const appCount = document.getElementById("appCount");

function displayApps(list) {
  appList.innerHTML = "";

  appCount.textContent = `${list.length} APPS`;

  if (list.length === 0) {
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  list.forEach((app) => {
    const card = document.createElement("article");
    card.className = "app-card";

    card.innerHTML = `
      <div class="app-top">
        <img
          class="app-icon"
          src="${app.icon}"
          alt="${app.name} icon"
          loading="lazy"
        >

        <div>
          <h3 class="app-name">${app.name}</h3>
          <div class="app-rating">★ ${app.rating}</div>
        </div>
      </div>

      <p class="app-description">
        ${app.description}
      </p>

      <div class="app-info">
        <span>Version ${app.version}</span>
        <span>Android</span>
      </div>

      <div class="app-buttons">
        <a
          class="app-button download-button"
          href="${app.link}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download
        </a>

        <button
          class="app-button details-button"
          onclick="showDetails('${app.name}', '${app.description}', '${app.version}')"
        >
          Details
        </button>
      </div>
    `;

    appList.appendChild(card);
  });
}

function showDetails(name, description, version) {
  alert(
    `${name}\n\n${description}\n\nVersion: ${version}`
  );
}

searchInput.addEventListener("input", function () {
  const searchText = this.value.toLowerCase().trim();

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchText) ||
    app.description.toLowerCase().includes(searchText)
  );

  displayApps(filteredApps);
});

displayApps(apps);

const form = document.getElementById("form");
const queryInput = document.getElementById("query");
const section = document.getElementById("section");
const loading = document.getElementById("loading");
const playAllBtn = document.getElementById("playAllBtn");
const startBtn = document.getElementById("startBtn");
const landing = document.getElementById("landing");
const mainPage = document.getElementById("main-page");

let audioElements = [];

// Start button event
startBtn.addEventListener("click", () => {
  landing.classList.add("fade-out");
  setTimeout(() => {
    landing.classList.add("hidden");
    mainPage.classList.remove("hidden");
    mainPage.classList.add("fade-in");
  }, 1000);
});
// Search form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const searchTerm = queryInput.value.trim();
  if (searchTerm) {
    fetchMusic(searchTerm);
  }
});

// Fetch music
async function fetchMusic(query) {
  section.innerHTML = "";
  loading.classList.remove("hidden");
  playAllBtn.classList.add("hidden");
  audioElements = [];

  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        query
      )}&media=music`
    );
    const data = await res.json();
    loading.classList.add("hidden");

    if (data.results.length === 0) {
      section.innerHTML = "<p>No results found.</p>";
      return;
    }
    data.results.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
      <img  src="${item.artworkUrl100}" class="thumbnail" alt="${item.trackName}"> 
      <h3>${item.trackName}</h3> 
      <p>${item.artistName}</p>
      <audio controls> 
        <source src="${item.previewUrl}" type="audio/mpeg">  
        Your browser does not support the audio element. 
      </audio>`;
      section.appendChild(card);
      const audio = card.querySelector("audio");
      audioElements.push(audio);
    });

    if (audioElements.length > 0) {
      playAllBtn.classList.remove("hidden");
    }
  } catch (error) {
    loading.classList.add("hidden");
    section.innerHTML = "<p>Error loading music. Please try again later.</p>";
    console.error(error);
  }
}

// Play all previews
playAllBtn.addEventListener("click", () => {
  audioElements.forEach((audio) => {
    audio.play().catch((err) => console.error(err));
  });
});

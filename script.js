const breedsContainer = document.getElementById('breeds-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// Load dog data from local file
let allBreeds = [];

// Fetch local dog data
async function loadBreeds() {
  try {
    console.log("Loading local dog data...");
    breedsContainer.innerHTML = '<p>Loading breeds...</p>';

    // Load from local JSON file
    const response = await fetch('dog-data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allBreeds = await response.json(); // Added 'await' here

    console.log("Breeds loaded:", allBreeds.length);
    displayBreeds(allBreeds);
  } catch (error) {
    console.error("Error loading local data:", error); // Improved error message
    breedsContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <h3>❌ Failed to load dog breeds</h3>
        <p>Please make sure 'dog-data.json' is in the same folder.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}

// Display breeds in the grid
function displayBreeds(breeds) {
  breedsContainer.innerHTML = '';

  if (breeds.length === 0) {
    breedsContainer.innerHTML = '<p>No breeds found. Try a different search.</p>';
    return;
  }

  // Use DocumentFragment for better performance when adding many elements
  const fragment = document.createDocumentFragment();

  breeds.forEach(breed => {
    // Create image URL using reference_image_id (corrected URL)
    const imageUrl = breed.reference_image_id 
      ? `https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`
      : `https://placedog.net/500/300?id=${breed.id}`; // Fallback if no reference_image_id

    const card = document.createElement('div');
    card.className = 'breed-card';

    // Added height info and corrected onerror
    card.innerHTML = `
      <img 
        src="${imageUrl}" 
        alt="${breed.name}" 
        onerror="this.src='https://placedog.net/500/300?random=${breed.id}'; this.onerror=null;" 
      />
      <div class="breed-info">
        <h3>${breed.name}</h3>
        <p><strong>Breed Group:</strong> ${formatProperty(breed.breed_group)}</p>
        <p><strong>Temperament:</strong> ${formatProperty(breed.temperament)}</p>
        <p><strong>Origin:</strong> ${formatProperty(breed.origin)}</p>
        <p><strong>Life Span:</strong> ${formatProperty(breed.life_span)}</p>
        <p><strong>Weight:</strong> ${formatProperty(breed.weight?.metric)} kg</p>
        <p><strong>Height:</strong> ${formatProperty(breed.height?.metric)} cm</p> 
      </div>
    `;

    fragment.appendChild(card);
  });

  breedsContainer.appendChild(fragment); // Append the fragment
}

// Format undefined or missing properties
function formatProperty(value) {
  return value ? value : 'Not available';
}

// Search breeds by name (client-side filtering)
function searchBreeds() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    displayBreeds(allBreeds); // Show all if search is empty
    return;
  }

  const filtered = allBreeds.filter(breed =>
    breed.name.toLowerCase().includes(query)
  );

  displayBreeds(filtered);
}

// Event Listeners
searchBtn.addEventListener('click', searchBreeds);
searchInput.addEventListener('input', searchBreeds); // Live search

// Load all breeds on page load
document.addEventListener('DOMContentLoaded', loadBreeds);
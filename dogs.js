// dog images
async function fetchDogImages() {
    const url = 'https://dog.ceo/api/breeds/image/random/10';
    const response = await fetch(url);
    const data = await response.json();
    return data.message;
}

// dog breed buttons
async function fetchDogBreeds() {
    const url = 'https://dogapi.dog/api/v2/breeds';
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
}

// carousel
async function initializePage() {
    const images = await fetchDogImages();
    const breeds = await fetchDogBreeds();

    // dog images
    const carouselContainer = document.getElementById('dog-carousel');
    images.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = 'Random Dog';
        carouselContainer.appendChild(img);
    });

    // breed buttons
    const breedButtonsContainer = document.getElementById('breed-buttons-container');
    breeds.forEach(breed => {
        const breedButton = document.createElement('button');
        breedButton.textContent = breed.attributes.name;
        breedButton.setAttribute('class', 'breed-button');
        breedButton.addEventListener('click', () => showBreedInfo(breed));
        breedButtonsContainer.appendChild(breedButton);
    });
}

// dog breed information
function showBreedInfo(breed) {
    const breedInfoContainer = document.getElementById('breedInfo');
    document.getElementById('breedName').textContent = breed.attributes.name;
    document.getElementById('breedLifeSpan').textContent = `${breed.attributes.life_span_min} - ${breed.attributes.life_span_max} years`;
    document.getElementById('breedDescription').textContent = breed.attributes.description;
    breedInfoContainer.style.display = 'block';
}

// voice commands
function startAnnyang() {
    if (annyang) {
        const commands = {
            'hello': () => alert('Hello!'),
            'change the color to *color': (color) => {
                document.body.style.backgroundColor = color;
            },
            'navigate to *page': (page) => {
                const lowerPage = page.toLowerCase();
                if (lowerPage.includes('home')) window.location.href = 'homepage.html';
                else if (lowerPage.includes('stock')) window.location.href = 'stocks.html';
                else if (lowerPage.includes('dog')) window.location.href = 'dogs.html';
            },
            'load dog breed *breed': (breed) => {
                loadBreedByName(breed);
            }
        };
        annyang.addCommands(commands);
        annyang.start();
    }
}

function stopAnnyang() {
    if (annyang) {
        annyang.abort();
    }
}

// voice command dog breed
function loadBreedByName(breedName) {
    fetchDogBreeds().then(breeds => {
        const breed = breeds.find(b => b.attributes.name.toLowerCase() === breedName.toLowerCase());
        if (breed) {
            showBreedInfo(breed);
        } else {
            alert('Breed not found!');
        }
    });
}

initializePage();
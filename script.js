// Win tracker
let wins = parseInt(localStorage.getItem('wins')) || 0;
const gamePlayCount = document.getElementById('game-play-count');
const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-game');
const winCount = document.getElementById('win-count');
const winPopup = document.getElementById('win-popup');
const moveCountSpan = document.getElementById('move-count');
const playAgainButton = document.getElementById('play-again');

let tiles = [];
let flippedTiles = [];
let matches = 0;
let imageCache = {};
let isLocked = false;

let moveCount = 0;

// Update the win count display
winCount.textContent = wins;

// Update game play count
function updateGamePlayCount() {
    let playCount = localStorage.getItem('playCount') || 0;
    playCount = parseInt(playCount) + 1;
    localStorage.setItem('playCount', playCount);
    gamePlayCount.textContent = playCount;
}

// Display current game play count
function displayGamePlayCount() {
    let playCount = localStorage.getItem('playCount') || 0;
    gamePlayCount.textContent = playCount;
}

displayGamePlayCount();

// Celebrity lists
const celebrities = [
    'Beyonce', 'Leonardo DiCaprio', 'Kim Kardashian', 'Dwayne Johnson',
    'Rihanna', 'Taylor Swift'
];

const moreCelebrities = [
    "Brad Pitt", "Angelina Jolie", "Tom Cruise", "Selena Gomez",
    "Johnny Depp", "Ariana Grande", "Will Smith", "Jennifer Lopez",
    "Chris Hemsworth", "Scarlett Johansson", "Lady Gaga", "Justin Bieber",
    "Keanu Reeves", "Zendaya", "Drake", "Chris Evans", "Miley Cyrus",
    "Robert Downey Jr", "Emma Stone", "Kanye West", "Priyanka Chopra",
    "Ryan Reynolds", "Cardi B", "Hugh Jackman", "Gal Gadot", "Margot Robbie",
    "Vin Diesel", "Shakira", "Kylie Jenner", "Harry Styles", "Jason Momoa",
    "Dua Lipa", "Timothee Chalamet", "Nicole Kidman", "Post Malone",
    "Billie Eilish", "Matthew McConaughey", "Katy Perry", "50 Cent",
    "Reese Witherspoon", "Ed Sheeran", "Michael B Jordan", "Sofia Vergara",
    "Tom Holland"
];

function getRandomCelebrities(count) {
    const allCelebrities = [...celebrities, ...moreCelebrities];
    const shuffled = allCelebrities.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getCelebrityImageUrl(name) {
    const formattedName = name.toLowerCase().replace(/ /g, '_');
    return `/public/img/${formattedName}.jpg`;
}








async function preloadImage(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed to load image: ${url}`, error);
            if (i === retries - 1) {
                console.error(`Failed to load image after ${retries} attempts: ${url}`);
                return '/public/img/placeholder.jpg'; // Updated placeholder image path
            }
        }
    }
}




function flipTile() {
    if (isLocked || flippedTiles.length >= 2 || this.classList.contains('game__tile--flipped') || this.classList.contains('game__tile--matched')) {
        return;
    }
    this.classList.add('game__tile--flipped');
    flippedTiles.push(this);
    moveCount++;

    if (flippedTiles.length === 2) {
        isLocked = true;
        setTimeout(checkMatch, 1000);
    }
}


function checkMatch() {
    const [tile1, tile2] = flippedTiles;

    if (tile1.dataset.celebrity === tile2.dataset.celebrity) {
        tile1.classList.add('game__tile--matched');
        tile2.classList.add('game__tile--matched');
        matches++;

        if (matches === 6) {
            wins++;
            localStorage.setItem('wins', wins);
            winCount.textContent = wins;
            setTimeout(showWinPopup, 500);
        }
        isLocked = false;
    } else {
        setTimeout(() => {
            tile1.classList.remove('game__tile--flipped');
            tile2.classList.remove('game__tile--flipped');
            isLocked = false;
        }, 1000);
    }

    flippedTiles = [];
}


function showWinPopup() {
    moveCountSpan.textContent = moveCount;
    winPopup.classList.add('show');
}

function hideWinPopup() {
    winPopup.classList.remove('show');
}
async function createTiles() {
    updateGamePlayCount();
    gameBoard.innerHTML = '';
    tiles = [];
    flippedTiles = [];
    matches = 0;
    moveCount = 0;

    const selectedCelebrities = getRandomCelebrities(6);
    const allCelebrities = [...selectedCelebrities, ...selectedCelebrities];
    allCelebrities.sort(() => Math.random() - 0.5);
    for (let i = 0; i < allCelebrities.length; i++) {
        const tile = document.createElement('div');
        tile.className = 'game__tile';
        tile.dataset.celebrity = allCelebrities[i];

        const front = document.createElement('div');
        front.className = 'game__tile-front';
        front.textContent = '?';
        const back = document.createElement('div');
        back.className = 'game__tile-back';

      
        const imageUrl = getCelebrityImageUrl(allCelebrities[i]);
        const imgUrl = await preloadImage(imageUrl);
        back.style.backgroundImage = `url(${imgUrl})`;


        tile.appendChild(front);
        tile.appendChild(back);
        tile.addEventListener('click', flipTile);
        gameBoard.appendChild(tile);
        tiles.push(tile);
    }
}


startButton.addEventListener('click', createTiles);
playAgainButton.addEventListener('click', () => {
    hideWinPopup();
    createTiles();
});

// Initialize the game
createTiles();
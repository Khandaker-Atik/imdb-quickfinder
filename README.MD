# IMDb QuickFinder 🎬

A fast, clean, and user-friendly **movie and TV show search app** powered by the [OMDb API](https://www.omdbapi.com/).  
Search for titles, get instant suggestions, and view detailed information with a polished and responsive interface.

---

## Demo

Try the live demo here:  
[imdb-quickfind.vercel.app](https://imdb-quickfinder.vercel.app) 

---

## Features

- **Real-time search suggestions** with debounce to reduce API calls  
- Detailed movie information including poster, year, runtime, genres, IMDb rating, overview, cast, director, and awards  
- Clean, intuitive, and responsive UI for smooth user experience  
- Graceful handling of errors and loading states  
- Placeholder images for missing posters  
- Vote counts formatted (e.g., 1.2M, 450K) for readability  
- Keyboard support and accessibility-ready *(can be enhanced further)*  

---

## How It Works

- The app fetches movie data from a **custom backend API** proxy that connects to the OMDb API.  
- As the user types in the search box, suggestions are shown after 3 characters with a 500ms debounce delay.  
- Selecting a suggestion or clicking search fetches detailed movie info.  
- Loader spinner shows while data is loading.  
- If no movie is found, or if an error occurs, an informative message is displayed.  

---

## Tech Stack

- Vanilla JavaScript for frontend interaction  
- HTML5 & CSS3 for structure and styling  
- OMDb API for movie data  
- Custom backend proxy API hosted on Render
- No frontend frameworks or heavy libraries — fast and lightweight  

---

## Setup and Usage

1. **Clone this repository**

```bash
git clone https://github.com/Khandaker-Atik/imdb-quickfinder.git
cd imdb-quickfinder

# my.dictionary

A personal knowledge archive — a private space to capture anything worth remembering.

## What it is
A fully private blog/dictionary where I can write, categorize and store notes, ideas, 
learnings, book notes, and anything else worth remembering.

## Tech Stack
- **Frontend** — HTML, CSS, JavaScript (modular ES6)
- **Database** — Firebase Firestore
- **Auth** — Firebase Authentication (Google)
- **Hosting** — GitHub Pages

## Project Structure
Neored727.github.io/
├── index.html        → page structure only
├── style.css         → all styling
├── README.md         → this file
└── js/
├── firebase.js   → Firebase connection
├── auth.js       → login / logout
├── entries.js    → save, load, delete
└── ui.js         → connects data to screen

## Features
- Private — Google login required, single user only
- Write entries with title, category and body
- Categories: ideas, tech, life, people, books
- Delete entries with confirmation
- Data stored in Firebase Firestore cloud database

## Planned Features
- Search bar
- Category filtering
- Edit existing entries
- Custom styled delete confirmation modal
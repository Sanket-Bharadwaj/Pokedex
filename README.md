# Pokédex ✨

A cute, modern, and mobile-first Pokédex app built with **HTML**, **CSS**, and **JavaScript**, powered by the [PokéAPI](https://pokeapi.co/). **PokeKawaii** brings the first 151 Pokémon to life with a pastel aesthetic, smooth animations, and a delightful user experience optimized for single-hand mobile use. 🌸

---

## Features

- **Responsive Design:** Optimized for mobile and desktop with a clean, single-hand-friendly UI.
- **Pastel Aesthetic:** Soft colors (pink, lavender, cream) and neumorphic shadows for a kawaii vibe.
- **Interactive Pokémon Grid:** View all 151 Kanto Pokémon with images, IDs, names, and types.
- **Type Filtering:** Filter Pokémon by type (e.g., Fire, Water, Grass) with a scrollable nav bar.
- **Search Functionality:** Instantly search Pokémon by name or ID.
- **Modal Details:** Compact modal with horizontal favorite/close buttons, stats bars, and details (height, weight, abilities).
- **Favorites System:** Save favorite Pokémon to local storage with a heart toggle.
- **Dark Mode:** Toggle between light and dark themes for comfy viewing.
- **Favicon:** A cute pokeball favicon with a pastel gradient to match the app’s style.
- **Loading Animation:** A bouncing pokeball loader for a playful touch.
- **Accessibility:** Keyboard navigation and focus trapping for modals.
- **No External Dependencies:** Pure HTML/CSS/JS with a single Google Fonts import (Nunito).

---

## Demo

Check out the live app at [HERE](pokedexx-new.vercel.app)  


> **Note:** Ensure an internet connection for PokéAPI data fetching.

---

## Screenshots

- **Mobile View**
![Pokedex](https://github.com/user-attachments/assets/9aa587b4-cd0e-4eec-b0f4-9cfe852ead2f)

  
- **Desktop View**
<img width="2874" height="1716" alt="FullScreen" src="https://github.com/user-attachments/assets/aa503910-de4d-44bf-86b6-ea28d6854522" />

---

## Installation

1. **Clone the Repository:**
    ```sh
    git clone https://github.com/Sanket-Bharadwaj/pokedex.git
    cd pokedex
    ```

2. **Serve Locally:**
    - Use a local server (e.g., VS Code Live Server, or run `npx http-server`).
    - Open `index.html` in a browser to view the app.

3. **Deploy to Vercel (optional):**
    - Push to a GitHub repository.
    - Connect to Vercel, set the root directory to `/`, and deploy.
    - No build step needed since it’s a static HTML app.

---

## Usage

- **Search:** Type a Pokémon’s name or ID in the search bar to filter the grid.
- **Filter by Type:** Click type buttons (e.g., Fire, Grass) to show Pokémon of that type.
- **View Details:** Click a Pokémon card to open a modal with stats, types, height, weight, and abilities.
- **Favorites:** Click the heart button in the modal to save/remove favorites, or use the header/mobile favorites button to view your saved Pokémon.
- **Dark Mode:** Toggle the theme with the sun/moon button in the header.
- **Mobile:** Enjoy a compact header with a pokeball logo and pill-shaped search bar for single-hand use.

---

## Project Structure

```
pokedex/
├── index.html        # Main HTML file
├── styles.css        # Main CSS file
├── script.js         # Main JavaScript file
├── resources/
│   └── pokedex.png   # Favicon and assets
├── README.md         # This file
```

---

## Contributing

We’d love your help to make Pokedex even cuter! 🌟

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Commit your changes (`git commit -m 'Add awesome feature'`).
4. Push to the branch (`git push origin feature/awesome-feature`).
5. Open a Pull Request.

**Please follow these guidelines:**
- Keep the pastel aesthetic and mobile-first focus.
- Test changes across mobile and desktop.
- Ensure no external dependencies are added unless necessary.

---

## Tech Stack

- **HTML/CSS/JavaScript:** Core web technologies for a lightweight app.
- **PokéAPI:** Fetches Pokémon data (Kanto region, 151 Pokémon).
- **Nunito Font:** Via Google Fonts for a playful, rounded typography.
- **Vercel:** Recommended for deployment.

---

## Credits

- Built with 💖 by [Sanket Bharadwaj/Sanket-Bharadwaj].
- Pokémon data from [PokéAPI](https://pokeapi.co/).
- Inspired by the kawaii aesthetic and Pokémon fandom.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

🌸 **Pokedex - Catch 'em all, kawaii style!** ✨

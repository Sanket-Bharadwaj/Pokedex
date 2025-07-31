// Pokemon data and state
        let allPokemon = [];
        let filteredPokemon = [];
        let currentFilter = 'all';
        let favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];
        
        // Pokemon types with colors
        const pokemonTypes = [
            'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
            'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
            'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
        ];

        // Type color mapping
        const typeColors = {
            normal: '#F5F5DC', fire: '#FFD4B5', water: '#B8E0FF',
            electric: '#FFEB99', grass: '#B5FFCC', ice: '#E6F7FF',
            fighting: '#FFE4E1', poison: '#D8B5FF', ground: '#F4E4BC',
            flying: '#F0F8FF', psychic: '#FFB5D8', bug: '#F0FFF0',
            rock: '#F5F5DC', ghost: '#F8F8FF', dragon: '#E6E6FA',
            dark: '#F5F5F5', steel: '#F0F8FF', fairy: '#FFF0F5'
        };

        // DOM elements
        const pokemonGrid = document.getElementById('pokemonGrid');
        const searchInput = document.getElementById('searchInput');
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        const typeButtons = document.getElementById('typeButtons');
        const mobileTypeButtons = document.getElementById('mobileTypeButtons');
        const loader = document.getElementById('loader');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        const modalFavoriteButton = document.getElementById('modalFavoriteButton');

        // Initialize app
        async function init() {
            showLoader();
            await loadPokemon();
            createTypeButtons();
            setupEventListeners();
            renderPokemon();
            hideLoader();
        }

        // Load Pokemon data from API
        async function loadPokemon() {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
                const data = await response.json();

                const pokemonPromises = data.results.map(async (pokemon) => {
                    const pokemonResponse = await fetch(pokemon.url);
                    const pokemonData = await pokemonResponse.json();
                    return {
                        id: pokemonData.id,
                        name: pokemonData.name,
                        types: pokemonData.types.map(type => type.type.name),
                        image: pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default,
                        stats: pokemonData.stats,
                        height: pokemonData.height,
                        weight: pokemonData.weight,
                        abilities: pokemonData.abilities
                    };
                });

                allPokemon = await Promise.all(pokemonPromises);
                filteredPokemon = [...allPokemon];
            } catch (error) {
                console.error('Error loading Pokemon:', error);
                showError('Failed to load Pokémon data. Please try again later.');
            }
        }

        // Create type filter buttons
        function createTypeButtons() {
            const typeButtonHTML = pokemonTypes.map(type => 
                `<button class="type-button type-${type} ${type === 'all' ? 'active' : ''}" data-type="${type}">
                    ${type.charAt(0).toUpperCase() + type.slice(1)}
                </button>`
            ).join('');
            typeButtons.innerHTML = typeButtonHTML;
            mobileTypeButtons.innerHTML = typeButtonHTML;
        }

        // Setup event listeners
        function setupEventListeners() {
            // Search functionality
            searchInput.addEventListener('input', debounce(handleSearch, 300));
            mobileSearchInput.addEventListener('input', debounce(handleSearch, 300));
            
            // Type filter buttons
            typeButtons.addEventListener('click', handleTypeFilter);
            mobileTypeButtons.addEventListener('click', handleTypeFilter);
            
            // Modal controls
            modalClose.addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) closeModal();
            });
            
            // Header buttons
            document.getElementById('favoritesHeaderButton').addEventListener('click', showFavorites);
            document.getElementById('favoritesButton').addEventListener('click', showFavorites);
            modalFavoriteButton.addEventListener('click', handleModalFavoriteClick);
            
            // Dark mode toggle
            document.querySelectorAll('.dark-mode-toggle').forEach(button => {
                button.addEventListener('click', () => {
                    document.body.classList.toggle('dark-mode');
                    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
                    updateThemeIcon();
                });
            });

            // Apply saved dark mode preference
            if (localStorage.getItem('darkMode') === 'true') {
                document.body.classList.add('dark-mode');
                updateThemeIcon();
            }
            
            // Pokemon grid clicks
            pokemonGrid.addEventListener('click', handlePokemonClick);
            
            // Keyboard navigation
            document.addEventListener('keydown', handleKeyDown);
        }

        // Update theme icon
        function updateThemeIcon() {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const themeIcon = document.getElementById('themeIcon');
            const mobileThemeIcon = document.getElementById('mobileThemeIcon');
            const sunIcon = document.getElementById('sunIcon');
            const moonIcon = document.getElementById('moonIcon');
            const mobileSunIcon = document.getElementById('mobileSunIcon');
            const mobileMoonIcon = document.getElementById('mobileMoonIcon');

            if (isDarkMode) {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
                mobileSunIcon.style.display = 'none';
                mobileMoonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
                mobileSunIcon.style.display = 'block';
                mobileMoonIcon.style.display = 'none';
            }
        }

        // Handle search
        function handleSearch() {
            const query = (searchInput.value || mobileSearchInput.value).toLowerCase().trim();
            if (query === '') {
                filteredPokemon = currentFilter === 'all' ? [...allPokemon] : 
                    allPokemon.filter(p => p.types.includes(currentFilter));
            } else {
                const baseFilter = currentFilter === 'all' ? allPokemon : 
                    allPokemon.filter(p => p.types.includes(currentFilter));
                filteredPokemon = baseFilter.filter(pokemon => 
                    pokemon.name.toLowerCase().includes(query) ||
                    pokemon.id.toString().includes(query)
                );
            }
            renderPokemon();
        }

        // Handle type filter
        function handleTypeFilter(e) {
            if (!e.target.matches('.type-button')) return;
            
            const selectedType = e.target.dataset.type;
            currentFilter = selectedType;
            
            // Update active button
            document.querySelectorAll('.type-button').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Filter Pokemon
            if (selectedType === 'all') {
                filteredPokemon = [...allPokemon];
            } else {
                filteredPokemon = allPokemon.filter(pokemon => 
                    pokemon.types.includes(selectedType)
                );
            }
            
            // Apply search filter if there's a search query
            const query = (searchInput.value || mobileSearchInput.value).toLowerCase().trim();
            if (query) {
                filteredPokemon = filteredPokemon.filter(pokemon => 
                    pokemon.name.toLowerCase().includes(query) ||
                    pokemon.id.toString().includes(query)
                );
            }
            
            renderPokemon();
        }

        // Render Pokemon cards
        function renderPokemon() {
            if (filteredPokemon.length === 0) {
                pokemonGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
                        <h3 style="font-size: 24px; margin-bottom: 8px; color: var(--text-primary);">No Pokémon Found</h3>
                        <p style="color: var(--text-secondary);">Try adjusting your search or filter criteria</p>
                    </div>
                `;
                return;
            }

            pokemonGrid.innerHTML = filteredPokemon.map(pokemon => `
                <div class="pokemon-card" data-pokemon-id="${pokemon.id}">
                    <div class="pokemon-card-content">
                        <div class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</div>
                        <img class="pokemon-image" src="${pokemon.image}" alt="${pokemon.name}" loading="lazy">
                        <h3 class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                        <div class="pokemon-types">
                            ${pokemon.types.map(type => 
                                `<span class="type-badge" style="background-color: ${typeColors[type]};">${type}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Handle Pokemon card click
        function handlePokemonClick(e) {
            const card = e.target.closest('.pokemon-card');
            if (!card) return;
            
            const pokemonId = parseInt(card.dataset.pokemonId);
            const pokemon = allPokemon.find(p => p.id === pokemonId);
            if (pokemon) {
                showPokemonModal(pokemon);
            }
        }

        // Focus trap for modal
        function trapFocus(element) {
            const focusableEls = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstFocusableEl = focusableEls[0];
            const lastFocusableEl = focusableEls[focusableEls.length - 1];
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) { // shift + tab
                        if (document.activeElement === firstFocusableEl) {
                            lastFocusableEl.focus();
                            e.preventDefault();
                        }
                    } else { // tab
                        if (document.activeElement === lastFocusableEl) {
                            firstFocusableEl.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        }

        // Show Pokemon modal
        function showPokemonModal(pokemon) {
            document.getElementById('modalPokemonName').textContent = 
                pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            document.getElementById('modalPokemonId').textContent = 
                `#${pokemon.id.toString().padStart(3, '0')}`;
            document.getElementById('modalPokemonImage').src = pokemon.image;
            document.getElementById('modalPokemonImage').alt = pokemon.name;
            
            // Types
            const modalTypes = document.getElementById('modalPokemonTypes');
            modalTypes.innerHTML = pokemon.types.map(type => 
                `<span class="type-badge" style="background-color: ${typeColors[type]};">${type}</span>`
            ).join('');
            
            // Stats
            const modalStats = document.getElementById('modalStats');
            modalStats.innerHTML = pokemon.stats.map(stat => {
                const percentage = Math.min(100, (stat.base_stat / 255) * 100);
                return `
                    <div class="stat-item">
                        <div class="stat-name">${stat.stat.name.replace('-', ' ')}</div>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div class="stat-value">${stat.base_stat}</div>
                    </div>
                `;
            }).join('');
            
            // Details
            document.getElementById('modalDetails').innerHTML = `
                <div>
                    <div><strong>Height:</strong> ${(pokemon.height / 10).toFixed(1)} m</div>
                    <div><strong>Weight:</strong> ${(pokemon.weight / 10).toFixed(1)} kg</div>
                    <div><strong>Abilities:</strong> ${pokemon.abilities.map(a => a.ability.name).join(', ')}</div>
                </div>
            `;
            
            // Favorite button state
            const modalFavoriteButton = document.getElementById('modalFavoriteButton');
            const modalFavoriteIcon = document.getElementById('modalFavoriteIcon');
            if (favorites.includes(pokemon.id)) {
                modalFavoriteButton.classList.add('active');
                modalFavoriteIcon.setAttribute('fill', typeColors['fairy']);
                modalFavoriteIcon.setAttribute('stroke', 'none');
            } else {
                modalFavoriteButton.classList.remove('active');
                modalFavoriteIcon.setAttribute('fill', 'none');
                modalFavoriteIcon.setAttribute('stroke', 'currentColor');
            }
            
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            trapFocus(modalOverlay);
            setTimeout(() => {
                document.getElementById('modalClose').focus();
            }, 100);
        }

        // Close modal
        function closeModal() {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Show favorites
        function showFavorites() {
            currentFilter = 'favorites';
            filteredPokemon = allPokemon.filter(p => favorites.includes(p.id));
            renderPokemon();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Handle modal favorite button click
        function handleModalFavoriteClick() {
            const pokemonId = parseInt(document.getElementById('modalPokemonId').textContent.replace('#', ''));
            const pokemon = allPokemon.find(p => p.id === pokemonId);
            
            if (!pokemon) return;
            
            const isFavorite = favorites.includes(pokemon.id);
            if (isFavorite) {
                // Remove from favorites
                favorites = favorites.filter(id => id !== pokemon.id);
                showToast(`${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} removed from favorites`);
            } else {
                // Add to favorites
                favorites.push(pokemon.id);
                showToast(`${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} added to favorites`);
            }
            
            // Update local storage
            localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
            
            // Refresh modal to update favorite button state
            showPokemonModal(pokemon);
        }

        // Show toast notification
        function showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('visible');
            }, 100);
            
            setTimeout(() => {
                toast.classList.remove('visible');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }

        // Handle keyboard navigation
        function handleKeyDown(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        }

        // Utility functions
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        function showLoader() {
            loader.classList.remove('hidden');
            pokemonGrid.style.display = 'none';
            pokemonGrid.style.pointerEvents = 'none';
        }

        function hideLoader() {
            loader.classList.add('hidden');
            pokemonGrid.style.display = 'grid';
            pokemonGrid.style.pointerEvents = 'auto';
        }

        function showError(message) {
            pokemonGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">😔</div>
                    <h3 style="font-size: 24px; margin-bottom: 8px; color: var(--text-primary);">Oops!</h3>
                    <p style="color: var(--text-secondary);">${message}</p>
                </div>
            `;
        }

        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);
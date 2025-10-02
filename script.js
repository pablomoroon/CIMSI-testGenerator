// Botón hamburguesa
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('open');
  menuBtn.textContent = menu.classList.contains('open') ? "✖" : "≡";
});

// Filtros y búsqueda
const state = { query: "", type: "all", tech: new Set() };
const chips = document.querySelectorAll('.chip');
const input = document.getElementById('q');
const clearBtn = document.getElementById('clearSearch');
const cards = [...document.querySelectorAll('.card')];

function normalize(str){ return (str || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''); }

function applyFilters(){
  const q = normalize(state.query);
  cards.forEach(card => {
    const type = card.dataset.type;
    const tags = card.dataset.tags || '';
    const text = (card.innerText || '').toLowerCase();
    const matchType = state.type === 'all' || state.type === type;
    const matchTech = state.tech.size === 0 || [...state.tech].every(t => tags.includes(t));
    const matchQuery = !q || normalize(text + ' ' + tags).includes(q);
    const visible = matchType && matchTech && matchQuery;
    card.style.display = visible ? 'grid' : 'none';
  });
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    const tech = chip.dataset.tech;
    if (filter){
      state.type = filter;
      document.querySelectorAll('.chip[data-filter]').forEach(c => c.dataset.active = 'false');
      chip.dataset.active = 'true';
    }
    if (tech){
      if (state.tech.has(tech)) state.tech.delete(tech); else state.tech.add(tech);
      chip.dataset.active = chip.dataset.active === 'true' ? 'false' : 'true';
    }
    applyFilters();
  });
});

input.addEventListener('input', (e) => { state.query = e.target.value; applyFilters(); });
clearBtn.addEventListener('click', () => { input.value = ''; state.query = ''; applyFilters(); input.focus(); });

document.getElementById('year').textContent = new Date().getFullYear();

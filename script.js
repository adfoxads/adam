// Init AOS
AOS.init({ duration: 1000, once: true, offset: 100 });

// Navbar scroll effect
window.addEventListener('scroll', () => {
  document.querySelector('.navbar')
    .classList.toggle('scrolled', window.scrollY > 50);
});

// Fetch JSON
async function fetchData() {
  const res = await fetch('universityinfo.json');
  return await res.json();
}

// Highlight Search Matches
function highlightText(text, search) {
  if (!search) return text;
  const regex = new RegExp(`(${search})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// Render Helper
function createProgramSection(title, programs, search) {
  let html = `<div class="program-section">
    <span class="program-title">${title}:</span>
    <ul class="program-list">`;

  if (Array.isArray(programs)) {
    programs.forEach(p => {
      html += `<li class="program-item">${highlightText(p, search)}</li>`;
    });
  } else {
    html += `<li class="program-item">${highlightText(programs, search)}</li>`;
  }
  html += `</ul></div>`;
  return html;
}

// Render Universities
function renderUniversities(data, filters = {}) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  let found = false;

  data.forEach(countryData => {
    const { country, image, universities } = countryData;
    if (filters.country && filters.country !== country) return;

    let filtered = universities;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        JSON.stringify(u).toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Program filter (must exist + have data)
    if (filters.program) {
      filtered = filtered.filter(u => {
        if (!u.programmes) return false;
        const prog = u.programmes[filters.program];
        return Array.isArray(prog) ? prog.length > 0 : !!prog;
      });
    }

    // Sort
    if (filters.sort) {
      filtered.sort((a, b) =>
        filters.sort === "az"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }

    if (filtered.length > 0) {
      found = true;
      let uniList = '';
      filtered.forEach(u => {
        let programsHtml = '';
        if (u.programmes) {
          programsHtml = `<div class="programmes-container">`;
          if (u.programmes.bachelor)
            programsHtml += createProgramSection('Bachelor', u.programmes.bachelor, filters.search);
          if (u.programmes.master)
            programsHtml += createProgramSection('Master', u.programmes.master, filters.search);
          if (u.programmes.phd || u.programmes.doctoral || u.programmes.doctorate)
            programsHtml += createProgramSection('PhD/Doctoral',
              u.programmes.phd || u.programmes.doctoral || u.programmes.doctorate, filters.search);
          if (u.programmes.short_courses)
            programsHtml += createProgramSection('Short Courses', u.programmes.short_courses, filters.search);
          if (u.programmes.international)
            programsHtml += createProgramSection('International', u.programmes.international, filters.search);
          if (u.programmes.faculties)
            programsHtml += createProgramSection('Faculties', u.programmes.faculties, filters.search);
          programsHtml += `</div>`;
        }
        uniList += `
          <li class="university-item">
            <div class="university-header">
              <i class="fa-solid fa-building-columns university-icon"></i>
              <span class="university-name">${highlightText(u.name, filters.search)}</span>
              ${programsHtml ? `<button class="toggle-programs" type="button"><i class="fas fa-chevron-down"></i></button>` : ''}
            </div>
            ${programsHtml}
          </li>`;
      });

      resultsDiv.innerHTML += `
        <div class="col-md-6 col-lg-4" data-aos="fade-up">
          <div class="country-card">
            <div class="card-header">
              <img src="${image || 'flags/default.png'}" alt="${country}" class="country-flag">
              <h5 class="country-name">${country}</h5>
            </div>
            <ul class="university-list">${uniList}</ul>
          </div>
        </div>`;
    }
  });

  if (!found) {
    resultsDiv.innerHTML = `<div class="no-results">
      <i class="fa-solid fa-magnifying-glass"></i>
      <h3>No universities found</h3>
      <p>Try different search terms or browse all countries</p>
    </div>`;
  }

  // Toggle expand/collapse
  document.querySelectorAll('.toggle-programs').forEach(btn => {
    btn.addEventListener('click', function () {
      const container = this.closest('.university-item').querySelector('.programmes-container');
      const icon = this.querySelector('i');
      container.classList.toggle('show');
      icon.classList.toggle('fa-chevron-up');
      icon.classList.toggle('fa-chevron-down');
    });
  });
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchData();
  const filters = { country: '', program: '', sort: '', search: '' };

  // Populate country filter
  const countryFilter = document.getElementById('countryFilter');
  [...new Set(data.map(c => c.country))].sort().forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    countryFilter.appendChild(opt);
  });

  renderUniversities(data);

  // Event listeners
  document.getElementById('searchInput').addEventListener('input', e => {
    filters.search = e.target.value;
    renderUniversities(data, filters);
  });
  countryFilter.addEventListener('change', e => {
    filters.country = e.target.value;
    renderUniversities(data, filters);
  });
  document.getElementById('programFilter').addEventListener('change', e => {
    filters.program = e.target.value;
    renderUniversities(data, filters);
  });
  document.getElementById('sortFilter').addEventListener('change', e => {
    filters.sort = e.target.value;
    renderUniversities(data, filters);
  });
  document.getElementById('resetFilters').addEventListener('click', () => {
    filters.country = filters.program = filters.sort = filters.search = '';
    document.getElementById('searchInput').value = '';
    countryFilter.value = '';
    document.getElementById('programFilter').value = '';
    document.getElementById('sortFilter').value = '';
    renderUniversities(data);
  });
  document.getElementById('showAll').addEventListener('click', () => {
    filters.search = '';
    document.getElementById('searchInput').value = '';
    renderUniversities(data, filters);
  });
});



const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeBtn = document.querySelector(".close");
const loginSubmit = document.getElementById("loginSubmit");
const loginMessage = document.getElementById("loginMessage");

function checkAuth() {
  if (localStorage.getItem("authenticated") === "true") {
    loginBtn.textContent = "Logout";
  } else {
    loginBtn.textContent = "Login";
  }
}

loginBtn.addEventListener("click", () => {
  if (localStorage.getItem("authenticated") === "true") {
    // Logout
    localStorage.removeItem("authenticated");
    checkAuth();
    alert("Logged out successfully!");
  } else {
    loginModal.style.display = "flex";
  }
});

closeBtn.addEventListener("click", () => {
  loginModal.style.display = "none";
});

loginSubmit.addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "1234") {
    localStorage.setItem("authenticated", "true");
    loginMessage.textContent = "✅ Login successful!";
    setTimeout(() => {
      loginModal.style.display = "none";
      checkAuth();
    }, 1000);
  } else {
    loginMessage.textContent = "❌ Invalid username or password";
  }
});

checkAuth();

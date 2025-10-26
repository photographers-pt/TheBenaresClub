console.log("Complete shared.js loaded");

// =================================
// HEADER CREATION
// =================================

function createHeader() {
  return `
   <header>
      <a href="index.html">
        <img src="/media/A00_Logo_&_title_-_light.png" alt="Club Benares" style="height: 30px;">
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
        <span class="arrow-icon">▼</span>
      </button>
    </header>
    
    <nav aria-label="Menu principal" id="main-nav" class="active">
      <ul>
        <li><a href="/eventos.html">Eventos</a></li>
        <li><a href="/biblioteca/index.html">Biblioteca</a></li>
        <li><a href="/cinemateca.html">Cinemateca</a></li>
        <li><a href="/cinemateca/index.html">Cinemateca2</a></li>
        <li><a href="/valdi/index.html">Cinemateca3</a></li>
        <li><a href="/mercado.html">Mercado</a></li>
        <li><a href="/comunidad.html">Comunidad</a></li>
        <li><a href="/contactos.html">Contactos</a></li>
      </ul>
    </nav>
  `;
}

// =================================
// FOOTER CREATION
// =================================

function createFooter() {
  return `
    <footer>
      <div class="footer-controls">
        <button id="shadow-toggle" class="shadow-toggle-btn shadows-off">
          Debug
        </button>

        <div id="github-status" class="github-status pending">Loading...</div>
      </div>
      
      <div class="copyright">
        &copy; 2025 Club Benares.
      </div>
      
      <div class="social-icons">
        <a href="https://www.instagram.com/thebenaresclub" target="_blank" aria-label="Instagram">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="mailto:charlie@thebenaresclub.com" aria-label="Email">
          <i class="fas fa-envelope"></i>
        </a>
      </div>
    </footer>
  `;
}

// =================================
// NAV TOGGLE FUNCTIONALITY
// =================================

function initializeNavToggle() {
  const toggleBtn = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  const arrowIcon = toggleBtn?.querySelector('.arrow-icon');
  
  if (!toggleBtn || !nav || !arrowIcon) {
    console.log("Toggle elements not found");
    return;
  }
  
  console.log("Nav toggle initialized");
  
  // Set initial arrow based on nav state
  if (nav.classList.contains('active')) {
    arrowIcon.textContent = '▼';
  } else {
    arrowIcon.textContent = '▲';
  }
  
  toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    console.log("Toggle clicked");
    
    nav.classList.toggle('active');
    
    // Update arrow direction: down when open, up when closed
    if (nav.classList.contains('active')) {
      arrowIcon.textContent = '▼';
    } else {
      arrowIcon.textContent = '▲';
    }
  });
}

// =================================
// GITHUB STATUS FUNCTIONALITY
// =================================

async function updateGitHubStatus() {
  const owner = "TheBenaresClub";   // ← Replace
  const repo = "TheBenaresClub.github.io";    // ← Replace
  const branch = "main";                  // ← Replace if needed
  const statusDiv = document.getElementById("github-status");

  if (!statusDiv) return;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${branch}/status`);
    const data = await res.json();

    const state = data.state || "unknown";
    statusDiv.textContent =
      state === "success" ? "🟢 Success" :
      state === "failure" ? "🔴 Failure" :
      state === "pending" ? "🟡 Pending" : "⚪ Unknown";

    statusDiv.className = "github-status " + state;
  } catch (err) {
    console.error("Error fetching GitHub status:", err);
    statusDiv.textContent = "⚠️ Error";
    statusDiv.className = "github-status error";
  }
}

// =================================
// SHADOW TOGGLE FUNCTIONALITY
// =================================

let shadowsEnabled = false; // Shadows OFF by default

function toggleBoxShadows() {
  const allElements = document.querySelectorAll('*');
  const toggleBtn = document.getElementById('shadow-toggle');
  
  if (shadowsEnabled) {
    // Turn OFF shadows
    shadowsEnabled = false; // Update variable FIRST
    
    allElements.forEach(element => {
      element.style.boxShadow = 'none';
    });
    
    // Update button
    toggleBtn.textContent = 'Debug';
    toggleBtn.classList.add('shadows-off');
  } else {
    // Turn ON shadows
    shadowsEnabled = true; // Update variable FIRST
    
    // Now apply shadows
    applyRandomBoxShadows();
    
    // Update button
    toggleBtn.textContent = 'Debug';
    toggleBtn.classList.remove('shadows-off');
  }
}

// =================================
// RANDOM COLORED BOX SHADOWS
// =================================

function generateRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 40) + 60;
  const lightness = Math.floor(Math.random() * 30) + 60;
  const alpha = (Math.random() * 0.4) + 0.3;
  
  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}

function applyRandomBoxShadows() {
  if (!shadowsEnabled) return;
  
  const allElements = document.querySelectorAll('*');
  
  allElements.forEach(element => {
    const randomColor = generateRandomColor();
    const shadowBlur = Math.floor(Math.random() * 8) + 2;
    const offsetX = (Math.random() - 0.5) * 4;
    const offsetY = (Math.random() - 0.5) * 4;
    
    element.style.boxShadow = `${offsetX}px ${offsetY}px ${shadowBlur}px ${randomColor}`;
  });
}

// =================================
// PAGE INITIALIZATION
// =================================

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, initializing header and footer");
  
  // Insert header
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    console.log("Header container found, inserting header");
    headerContainer.innerHTML = createHeader();
    
    // Initialize nav toggle after header is created
    initializeNavToggle();
    }
    
    // Highlight current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentLink = document.querySelector(`nav a[href="${currentPage}"]`);
    if (currentLink) {
    if (currentLink) currentLink.classList.add('active');
  }

  // Insert footer
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    console.log("Footer container found, inserting footer");
    footerContainer.innerHTML = createFooter();
    
    // Add toggle functionality
    const toggleBtn = document.getElementById('shadow-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleBoxShadows);
    updateGitHubStatus();
    setInterval(updateGitHubStatus, 60000);
  }
});
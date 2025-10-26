console.log("Complete shared-header.js loaded");

// =================================
// HEADER CREATION
// =================================

function createHeader() {
  return `
   <header>
      <a href="index.html">
        <img src="./media/A00_Logo_&_title_-_light.png" alt="Club Benares" style="height: 30px;">
      </a>
    </header>
    
    <nav aria-label="Menu principal">
      <ul>
        <li><a href="eventos.html">Eventos</a></li>
        <li><a href="biblioteca.html">Biblioteca</a></li>
        <li><a href="cinemateca.html">Cinemateca</a></li>
        <li><a href="/cinemateca/index.html">Cinemateca2</a></li>
        <li><a href="mercado.html">Mercado</a></li>
        <li><a href="comunidad.html">Comunidad</a></li>
        <li><a href="contactos.html">Contactos</a></li>
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
      <button id="shadow-toggle" class="shadow-toggle-btn shadows-off">
        🎨 Sombras: OFF
      </button>
      
      <div class="copyright">
        &copy; 2025 Club Benares. Todos os direitos reservados.
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
    toggleBtn.textContent = '🎨 Sombras: OFF';
    toggleBtn.classList.add('shadows-off');
  } else {
    // Turn ON shadows
    shadowsEnabled = true; // Update variable FIRST
    
    // Now apply shadows
    applyRandomBoxShadows();
    
    // Update button
    toggleBtn.textContent = '🎨 Sombras: ON';
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
    const shadowSize = Math.floor(Math.random() * 3) + 1;
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
    
    // Highlight current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentLink = document.querySelector(`nav a[href="${currentPage}"]`);
    if (currentLink) {
      currentLink.classList.add('active');
    }
  }

  // Insert footer
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    console.log("Footer container found, inserting footer");
    footerContainer.innerHTML = createFooter();
    
    // Add toggle functionality
    const toggleBtn = document.getElementById('shadow-toggle');
    if (toggleBtn) {
      console.log("Toggle button found, adding click listener");
      toggleBtn.addEventListener('click', toggleBoxShadows);
    }
  }
});
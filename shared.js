console.log("Complete shared.js loaded");

// =================================
// HEADER CREATION
// =================================

function createHeader() {
  return `
   <header>
      <a href="/">
        <img src="/media/A00_Logo_&_title_-_light.png" alt="Club Benares" style="height: 30px;">
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
        <span class="arrow-icon">▼</span>
      </button>
    </header>
    
    <nav aria-label="Menu principal" id="main-nav" class="active">
      <ul>
        <li><a href="/eventos/index.html">Eventos</a></li>
        <li><a href="/biblioteca/index.html">Biblioteca</a></li>
        <li data-debug="true"><a href="/cinemateca-tv.html">TV</a></li>
        <li data-debug="true"><a href="/pc.html">PC</a></li>
        <li data-debug="true"><a href="/computer-films/index.html">Cine-PC</a></li>
        <li><a href="/cinemateca/index.html">Cinemateca</a></li>
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
  const mainContent = document.querySelector('main');
  
  if (!toggleBtn || !nav || !arrowIcon) {
    console.log("Toggle elements not found");
    return;
  }
  
  console.log("Nav toggle initialized");
  
  // Function to update content spacing
  function updateContentSpacing() {
    if (nav.classList.contains('active')) {
      // Nav is open - add padding to push content down
      const navHeight = nav.offsetHeight;
      if (mainContent) mainContent.style.paddingTop = `${navHeight}px`;
      arrowIcon.textContent = '▼';
    } else {
      // Nav is closed - remove padding
      if (mainContent) mainContent.style.paddingTop = '0';
      arrowIcon.textContent = '▲';
    }
  }
  
  // Set initial state
  updateContentSpacing();
  
  toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    console.log("Toggle clicked");
    
    nav.classList.toggle('active');
    updateContentSpacing();
  });
}

// =================================
// GITHUB STATUS FUNCTIONALITY
// =================================

async function updateGitHubStatus() {
  const owner = "TheBenaresClub";
  const repo = "TheBenaresClub.github.io";
  const statusDiv = document.getElementById("github-status");

  if (!statusDiv) return;

  try {
    // Check for active workflow runs
    const workflowRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`);
    const workflowData = await workflowRes.json();
    
    if (workflowData.workflow_runs && workflowData.workflow_runs.length > 0) {
      const latestRun = workflowData.workflow_runs[0];
      const status = latestRun.status; // queued, in_progress, completed
      const conclusion = latestRun.conclusion; // success, failure, cancelled, etc.
      
      // If workflow is running
      if (status === "queued" || status === "in_progress") {
        statusDiv.textContent = "Building";
        statusDiv.className = "github-status pending";
        return;
      }
      
      // If workflow completed
      if (status === "completed") {
        if (conclusion === "success") {
          statusDiv.textContent = "Live";
          statusDiv.className = "github-status success";
        } else if (conclusion === "failure") {
          statusDiv.textContent = "Failed";
          statusDiv.className = "github-status failure";
        } else {
          statusDiv.textContent = "Unknown";
          statusDiv.className = "github-status unknown";
        }
        return;
      }
    }
    
    // No workflows found - assume live
    statusDiv.textContent = "Live";
    statusDiv.className = "github-status success";
    
  } catch (err) {
    console.error("Error fetching GitHub status:", err);
    statusDiv.textContent = "Error";
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
  const debugItems = document.querySelectorAll('[data-debug="true"]');
  
  if (shadowsEnabled) {
    // Turn OFF shadows and hide debug items
    shadowsEnabled = false;
    
    allElements.forEach(element => {
      element.style.boxShadow = 'none';
    });
    
    debugItems.forEach(item => {
      item.style.display = 'none';
    });
    
    // Update button
    toggleBtn.textContent = 'Debug';
    toggleBtn.classList.add('shadows-off');
  } else {
    // Turn ON shadows and show debug items
    shadowsEnabled = true;
    
    // Apply shadows
    applyRandomBoxShadows();
    
    debugItems.forEach(item => {
      item.style.display = '';
    });
    
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
    
    // Hide debug items initially
    const debugItems = document.querySelectorAll('[data-debug="true"]');
    debugItems.forEach(item => {
      item.style.display = 'none';
    });
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
console.log("Complete shared.js loaded");

// =================================
// HEADER CREATION
// =================================

function createHeader() {
  return `
    <style>
      @keyframes pulseRed {
        0%, 100% {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.1),
                       0 0 20px rgba(255, 255, 255, 0.1),
                       0 0 30px rgba(255, 255, 255, 0.1);
        }
        50% {
          text-shadow: 0 0 10px rgba(255, 255, 255, 1),
                       0 0 20px rgba(255, 255, 255, 1),
                       0 0 30px rgba(255, 255, 255, 1);
        }
      }
      
      nav a[href="/eventos/"] {
        color: white !important;
        animation: pulseRed 2s ease-in-out infinite;
        font-weight: 600;
      }
      
      nav a.active {
        background-color: rgba(255, 255, 255, 0.15);
        padding: 8px 16px;
        border-radius: 6px;
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      
      nav img {
        vertical-align: middle;
      }
    </style>
    
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
        <!--<li><a href="/"><img src="/media/logo_small.png" alt="Logo" style="height:25px;"></a></li>-->
        <li><a href="/eventos/">Eventos</a></li>
        <li><a href="/biblioteca/">Biblioteca</a></li>
        <li data-debug="true"><a href="/cinemateca-tv.html">TV</a></li>
        <li data-debug="true"><a href="/pc.html">PC</a></li>
        <li data-debug="true"><a href="/computer-films/">Cine-PC</a></li>
        <li><a href="/cinemateca/">Cinemateca</a></li>
        <li><a href="/mercado/">Mercado</a></li>
        <li><a href="/comunidad/">Comunidad</a></li>
        <li><a href="/contactos/">Contactos</a></li>
        <li data-debug="true"><a href="/movielog/">Movie Log</a></li>
        <li data-debug="true"><a href="/sample.html">Sample</a></li>
      </ul>
    </nav>
  `;
}

// =================================
// FOOTER CREATION
// =================================

function createFooter() {
  return `
    <style>
      .shadow-toggle-btn:hover {
        background-color: rgba(255, 255, 255, 0.15) !important;
        box-shadow: 0 0 6px rgba(255, 255, 255, 0.1) !important;
        transform: none !important;
      }
      
      nav a.active {
        background-color: rgba(255, 255, 255, 0.15);
        padding: 8px 16px;
        border-radius: 6px;
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
    </style>
    <footer>
      <div class="footer-controls">
        <button id="shadow-toggle" class="shadow-toggle-btn shadows-off" style="cursor: not-allowed;">
          Loading...
        </button>
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
  const toggleBtn = document.getElementById("shadow-toggle");

  if (!toggleBtn) return;

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
        toggleBtn.textContent = "Building";
        toggleBtn.classList.add('github-pending');
        toggleBtn.classList.remove('github-success', 'github-failure', 'github-error');
        return;
      }
      
      // If workflow completed
      if (status === "completed") {
        if (conclusion === "success") {
          toggleBtn.textContent = "Online";
          toggleBtn.classList.add('github-success');
          toggleBtn.classList.remove('github-pending', 'github-failure', 'github-error');
        } else if (conclusion === "failure") {
          toggleBtn.textContent = "Failed";
          toggleBtn.classList.add('github-failure');
          toggleBtn.classList.remove('github-pending', 'github-success', 'github-error');
        } else {
          toggleBtn.textContent = "Unknown";
          toggleBtn.classList.remove('github-pending', 'github-success', 'github-failure', 'github-error');
        }
        return;
      }
    }
    
    // No workflows found - assume online
    toggleBtn.textContent = "Online";
    toggleBtn.classList.add('github-success');
    toggleBtn.classList.remove('github-pending', 'github-failure', 'github-error');
    
  } catch (err) {
    console.error("Error fetching GitHub status:", err);
    toggleBtn.textContent = "Error";
    toggleBtn.classList.add('github-error');
    toggleBtn.classList.remove('github-pending', 'github-success', 'github-failure');
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
    
    // Update button - keep status text
    toggleBtn.classList.add('shadows-off');
  } else {
    // Turn ON shadows and show debug items
    shadowsEnabled = true;
    
    // Apply shadows
    applyRandomBoxShadows();
    
    debugItems.forEach(item => {
      item.style.display = '';
    });
    
    // Update button - keep status text
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
    const currentPath = window.location.pathname;
    const currentLink = document.querySelector(`nav a[href="${currentPath}"]`);
    if (currentLink) {
      currentLink.classList.add('active');
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
/**
 * Toggles dark mode on the body and saves the preference to localStorage.
 * This is now the default mode.
 */
function myFunction() {
  const element = document.body;
  element.classList.toggle("dark-mode");

  // Save the user's preference in localStorage
  if (element.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
}

/**
 * Applies the saved dark mode, font, high contrast, and theme from localStorage when a page loads.
 * This function ensures the settings are consistent across all pages.
 */
function applyRememberedTheme() {
  // Always apply dark mode as it's the default
  document.body.classList.add("dark-mode");

  // Apply font setting
  const font = localStorage.getItem("siteFont") || "default";
  document.body.classList.remove("font-large", "font-small");
  if (font !== "default") {
    document.body.classList.add(font);
  }

  // Apply high contrast setting
  const highContrast = localStorage.getItem("highContrast") === "enabled";
  if (highContrast) {
    document.body.classList.add("high-contrast");
  } else {
    document.body.classList.remove("high-contrast");
  }

  // Apply the site theme (e.g., 'moonlight' or 'sandy')
  const theme = localStorage.getItem("siteTheme") || "default";
  document.body.classList.remove("moonlight", "sandy", "coffee", "forest");

  if (theme === "moonlight") {
    document.body.classList.add("moonlight");
    // Create the canvas for the stars background if it doesn't exist
    if (!document.getElementById('stars-bg')) {
      startStars();
    }
  } else {
    // For any other theme, remove the stars canvas if it exists
    document.body.classList.add(theme);
    const stars = document.getElementById('stars-bg');
    if (stars) stars.remove();
  }
}

// ... (rest of the script.js code) ...

// Theme select logic
const themeSelect = document.getElementById('theme-select');
if (themeSelect) {
  const applyTheme = (theme) => {
    document.body.classList.remove('moonlight', 'sandy', 'coffee', 'forest');
    if (theme === 'moonlight') {
      document.body.classList.add('moonlight');
    } else if (theme === 'sandy') {
      document.body.classList.add('sandy');
    } else if (theme === 'coffee') {
      document.body.classList.add('coffee');
    } else if (theme === 'forest') {
      document.body.classList.add('forest');
    }
    localStorage.setItem('siteTheme', theme);
  };

  themeSelect.addEventListener('change', function() {
    applyTheme(this.value);
  });

  // Initialize on load
  const currentTheme = localStorage.getItem('siteTheme') || 'default';
  themeSelect.value = currentTheme;
  applyTheme(currentTheme);
}
/**
 * Creates and animates the moving stars background for the 'moonlight' theme.
 */
function startStars() {
  if (document.getElementById('stars-bg')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'stars-bg';
  canvas.style.cssText = 'position:fixed; top:0; left:0; z-index:-1; pointer-events:none;';
  document.body.prepend(canvas);

  let w = window.innerWidth,
    h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const stars = Array.from({
    length: 120
  }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.2 + 0.5,
    dx: (Math.random() - 0.5) * 0.08,
    dy: (Math.random() - 0.5) * 0.08
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#fff';
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.restore();
  }

  function animate() {
    // Only run animation if the theme is active
    if (!document.body.classList.contains('moonlight')) {
      const starsCanvas = document.getElementById('stars-bg');
      if (starsCanvas) starsCanvas.remove();
      return;
    }

    for (const s of stars) {
      s.x += s.dx;
      s.y += s.dy;
      if (s.x < 0) s.x = w;
      if (s.x > w) s.x = 0;
      if (s.y < 0) s.y = h;
      if (s.y > h) s.y = 0;
    }
    draw();
    requestAnimationFrame(animate);
  }

  animate();
  window.addEventListener('resize', () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  });
}

/**
 * Ensures the stars animation is properly removed on page transition.
 */
window.addEventListener('beforeunload', () => {
  const stars = document.getElementById('stars-bg');
  if (stars) {
    stars.remove();
  }
});

// --- Event Listeners ---
// When the page content is loaded, apply the saved theme.
window.addEventListener("DOMContentLoaded", applyRememberedTheme);
// When another tab changes the theme, sync it here.
window.addEventListener("storage", applyRememberedTheme);
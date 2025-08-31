/**
 * Toggles dark mode on the body and saves the preference to localStorage.
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
 * Applies the saved dark mode and theme from localStorage when a page loads.
 * This function ensures the theme is consistent across all pages.
 */
function applyRememberedTheme() {
   // Apply dark mode if it was enabled
   if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
   }

   // Apply the site theme (e.g., 'moonlight') if it was selected
   const theme = localStorage.getItem("siteTheme") || "default";
   document.body.classList.remove("moonlight"); // Clear existing theme first

   if (theme === "moonlight") {
      document.body.classList.add("moonlight");
      // Create the canvas for the stars background if it doesn't exist
      if (!document.getElementById('stars-bg')) {
         startStars(); // Initialize the star animation
      }
   } else {
      // If the theme is not moonlight, remove the stars canvas
      const stars = document.getElementById('stars-bg');
      if (stars) stars.remove();
   }
}

/**
 * Creates and animates the moving stars background for the 'moonlight' theme.
 */
function startStars() {
   if (document.getElementById('stars-bg')) return; // Don't create if it already exists

   const canvas = document.createElement('canvas');
   canvas.id = 'stars-bg';
   document.body.prepend(canvas);

   let w = window.innerWidth, h = window.innerHeight;
   canvas.width = w; canvas.height = h;
   const ctx = canvas.getContext('2d');
   
   const stars = Array.from({length: 120}, () => ({
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
         s.x += s.dx; s.y += s.dy;
         if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
         if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;
      }
      draw();
      requestAnimationFrame(animate);
   }

   animate();
   window.addEventListener('resize', () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w; canvas.height = h;
   });
}

// --- Event Listeners ---
// When the page content is loaded, apply the saved theme.
window.addEventListener("DOMContentLoaded", applyRememberedTheme);
// When another tab changes the theme, sync it here.
window.addEventListener("storage", applyRememberedTheme);
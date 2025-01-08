// active class for nav links
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("active"));
          const activeLink = document.querySelector(
            `.nav-link[href="#${entry.target.id}"]`
          );

          if (activeLink) activeLink.classList.add("active");
        }
      });
    },
    {
      root: null,
      threshold: 0.6,
    }
  );
  sections.forEach((section) => observer.observe(section));
});

// theme toggle

// selecting the theme toggle button and icon element
const themeToggleButton = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");

// function Light Mode
const enableLightMode = () => {
  document.documentElement.classList.add("light-mode"); // Add light mode class to html
  document.documentElement.classList.remove("dark-mode"); // Remove dark mode class
  themeIcon.classList.replace("fa-sun", "fa-moon"); // Change icon to moon (dark mode)
  localStorage.setItem("theme", "light"); // Save theme in localStorage
};

// function Dark Mode
const enableDarkMode = () => {
  document.documentElement.classList.add("dark-mode"); // Add dark mode class to html
  document.documentElement.classList.remove("light-mode"); // Remove light mode class
  themeIcon.classList.replace("fa-moon", "fa-sun"); // Change icon to sun (light mode)
  localStorage.setItem("theme", "dark"); // Save theme in localStorage
};

// check the saved theme in localstorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  enableLightMode();
} else {
  enableDarkMode(); // Default mode
}

// event listener for the theme toggle button click
themeToggleButton.addEventListener("click", () => {
  if (document.documentElement.classList.contains("dark-mode")) {
    enableLightMode();
  } else {
    enableDarkMode();
  }
});

// nav-bar toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const body = document.body; // Detect clicks on the body

// Toggle the menu when the nav-toggle button is clicked
navToggle.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent the click from propagating to the body
  navLinks.classList.toggle("show");
});

// Close the menu if the user clicks outside of the nav links or nav-toggle
body.addEventListener("click", (e) => {
  // If the click is outside the nav links and nav-toggle button
  if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
    navLinks.classList.remove("show");
  }
});

// modal
document.addEventListener("click", function (e) {
  const target = e.target.closest("[data-modal-target]");
  if (target) {
    const modalId = target.getAttribute("data-modal-target");
    const modal = document.getElementById(modalId);
    modal.classList.remove("invisible", "opacity-0", "pointer-events-none");
    modal.classList.add("visible", "opacity-100", "pointer-events-auto");
  }
});

// close modal
document.addEventListener("click", function (e) {
  const closeBtn = e.target.closest(".close-modal");
  if (closeBtn) {
    const modal = closeBtn.closest(".modal");
    modal.classList.remove("visible", "opacity-100", "pointer-events-auto");
    modal.classList.add("invisible", "opacity-0", "pointer-events-none");
  }

  const backgroundClick =
    e.target.classList.contains("fixed") && !e.target.closest(".bg-white");
  if (backgroundClick) {
    e.target.classList.add("invisible", "opacity-0", "pointer-events-none");
    e.target.classList.remove("visible", "opacity-100", "pointer-events-auto");
  }
});

// animation on section loading
document.addEventListener("DOMContentLoaded", () => {
  const elementsToAnimate = document.querySelectorAll(".animate-fade-in");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // When the section is in view, add 'visible' to start the animation
          entry.target.classList.add("visible");
          entry.target.classList.remove("invisible");
        } else {
          // When the section is out of view, reset it to invisible
          entry.target.classList.remove("visible");
          entry.target.classList.add("invisible");
        }
      });
    },
    { threshold: 0.5 }
  ); // Trigger when 50% of the element is visible

  elementsToAnimate.forEach((element) => {
    // Initially mark all sections as invisible
    element.classList.add("invisible");
    observer.observe(element); // Start observing
  });
});


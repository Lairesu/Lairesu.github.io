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
  enableDarkMode();  // Default mode
}

// event listener for the theme toggle button click
themeToggleButton.addEventListener("click", () => {
  if (document.documentElement.classList.contains("dark-mode")) {
    enableLightMode();
  } else {
    enableDarkMode();
  }
});




// nav-bar responsive
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});
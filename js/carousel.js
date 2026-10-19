const stage = document.getElementById("stage");
const rig = stage.parentElement;
const faces = [...stage.children];
const tabs = document.getElementById("tabs");
const overviewBtn = document.getElementById("overview");
const total = faces.length;
const PERSPECTIVE = 2000; // keep equal to .scene { perspective } in input.css

const step = 360 / total; // degrees between pages

// tell the CSS how many pages there are, and give each page its angle.
// (so adding or removing a <section class="face"> just works)
document.documentElement.style.setProperty("--n", total);
faces.forEach((face, i) => face.style.setProperty("--a", `${i * step}deg`));

let index = 0; // keeps growing/shrinking so the spin never "rewinds"

// one tab per page, labelled from data-label
faces.forEach((face, i) => {
  const btn = document.createElement("button");
  btn.textContent = face.dataset.label;
  btn.addEventListener("click", () => goTo(i));
  tabs.appendChild(btn);
});

function render() {
  stage.style.setProperty("--i", index);
  const current = ((index % total) + total) % total;

  faces.forEach((face, i) => {
    const active = i === current;
    face.classList.toggle("active", active);
    const rel = (i - current + total) % total; // 0 = page in front
    face.dataset.rel = rel;
    // pages on the far side of the ring turn to face inward in overview
    const facesAway = Math.cos((rel * step * Math.PI) / 180) < 0.25;
    face.dataset.flip = facesAway ? "1" : "0";
    face.toggleAttribute("inert", !active);
    face.setAttribute("aria-hidden", String(!active));
  });
  [...tabs.children].forEach((btn, i) =>
    btn.classList.toggle("active", i === current)
  );
}

function goTo(target) {
  const current = ((index % total) + total) % total;
  let diff = target - current;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  index += diff;
  render();
}
const next = () => { index += 1; render(); };
const prev = () => { index -= 1; render(); };

document.getElementById("next").addEventListener("click", next);
document.getElementById("prev").addEventListener("click", prev);

// ---------------- overview (open-box view) ----------------
// overview is ON when Ctrl is held OR the Overview button is latched on
let ctrlHeld = false;
let latched = false;

const cssNum = (name) =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));

// work out how far to pull the camera back so the whole open box fits the screen
function fitOverview() {
  const w = rig.offsetWidth;
  const h = rig.offsetHeight;
  const lean = (cssNum("--lean-on") * Math.PI) / 180;
  const tilt = (cssNum("--tilt-on") * Math.PI) / 180;

  const radius = w / 2 / Math.tan(Math.PI / total) + 70; // same formula as the CSS
  const reach = Math.hypot(radius, w / 2) + h * Math.sin(lean); // centre -> outer edge
  const boxW = 2 * reach;
  const boxH = 2 * reach * Math.sin(tilt) + h * Math.cos(tilt);

  const scene = document.getElementById("scene");
  const fit = Math.min(
    (scene.clientWidth * 0.94) / boxW,
    (scene.clientHeight * 0.9) / boxH,
    0.8
  );
  const s = Math.max(fit, 0.15);
  document.documentElement.style.setProperty(
    "--fit-pull",
    `${Math.round(PERSPECTIVE * (1 / s - 1))}px`
  );
}

function applyOverview() {
  const on = ctrlHeld || latched;
  if (on) fitOverview();
  document.body.classList.toggle("overview", on);
  overviewBtn.classList.toggle("active", on);
  overviewBtn.setAttribute("aria-pressed", String(latched));
}

// always trust the browser's own "is Ctrl down right now" flag,
// so overview can never get stuck on
const syncCtrl = (e) => {
  if (ctrlHeld !== e.ctrlKey) {
    ctrlHeld = e.ctrlKey;
    applyOverview();
  }
};

document.addEventListener("keydown", (e) => {
  syncCtrl(e);
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
});
document.addEventListener("keyup", syncCtrl);
document.addEventListener("pointermove", syncCtrl);
document.addEventListener("pointerdown", syncCtrl);
window.addEventListener("blur", () => {
  ctrlHeld = false;
  applyOverview();
});

// phones / no keyboard: the button latches overview on and off
overviewBtn.addEventListener("click", () => {
  latched = !latched;
  applyOverview();
});

window.addEventListener("resize", () => {
  if (ctrlHeld || latched) fitOverview();
});

// touch swipe
let startX = null;
document.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
document.addEventListener("touchend", (e) => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
  startX = null;
});

render();
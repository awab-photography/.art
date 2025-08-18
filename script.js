// =========== وضع ليلي/صباحي ===========
const themeToggle = document.getElementById("themeToggle");
themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// =========== سلايدر الصور ===========
let slideIndex = 0;
const slides = document.querySelector(".slides");
const totalSlides = slides?.children.length;

function showSlide(index) {
  if (!slides) return;
  if (index >= totalSlides) slideIndex = 0;
  if (index < 0) slideIndex = totalSlides - 1;
  slides.style.transform = `translateX(-${slideIndex * 100}%)`;
}

document.getElementById("nextBtn")?.addEventListener("click", () => {
  slideIndex++;
  showSlide(slideIndex);
});

document.getElementById("prevBtn")?.addEventListener("click", () => {
  slideIndex--;
  showSlide(slideIndex);
});

// تشغيل تلقائي كل 5 ثواني
setInterval(() => {
  slideIndex++;
  showSlide(slideIndex);
}, 5000);

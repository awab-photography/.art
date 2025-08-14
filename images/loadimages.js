// قائمة أسماء الصور الموجودة في مجلد الصور
const imageNames = [
  "image1.jpg",
  "image2.png",
  "image3.jpg"
];

// المجلد الذي يحتوي الصور
const imagesFolder = "images/";

// العنصر الذي سيتم عرض الصور فيه
const gallery = document.getElementById("gallery");

// استدعاء الصور وعرضها
imageNames.forEach(imageName => {
  const img = document.createElement("img");
  img.src = imagesFolder + imageName;
  img.alt = imageName;
  img.style.width = "200px";  // حجم الصورة مثلاً
  img.style.margin = "10px";
  gallery.appendChild(img);
});
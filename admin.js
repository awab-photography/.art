const adminForm = document.getElementById("adminForm");
const imageList = document.getElementById("imageList");

// تحميل الصور في لوحة الإدارة
async function loadAdminImages() {
  const res = await fetch("images.json");
  const images = await res.json();
  imageList.innerHTML = "";

  images.forEach(url => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${url}" width="120">
      <button onclick="deleteImage('${url}')">حذف</button>
    `;
    imageList.appendChild(div);
  });
}

// إضافة صورة
adminForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const urlInput = document.getElementById("imageUrl").value;
  const fileInput = document.getElementById("imageFile").files[0];

  const formData = new FormData();
  if (urlInput) formData.append("url", urlInput);
  if (fileInput) formData.append("file", fileInput);

  const res = await fetch("api.php", { method: "POST", body: formData });
  const data = await res.json();

  if (data.success) {
    alert("✅ تمت إضافة الصورة بنجاح");
    adminForm.reset();
    loadAdminImages();
  } else {
    alert("❌ حدث خطأ");
  }
});

// حذف صورة
async function deleteImage(url) {
  const formData = new FormData();
  formData.append("delete", url);

  const res = await fetch("api.php", { method: "POST", body: formData });
  const data = await res.json();

  if (data.success) {
    alert("🗑️ تم حذف الصورة");
    loadAdminImages();
  }
}

loadAdminImages();

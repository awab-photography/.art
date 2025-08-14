// server.js
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, update } from "firebase/database";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// إعداد Firebase
const firebaseConfig = {
  apiKey: "ضع_القيمة_هنا",
  authDomain: "ضع_القيمة_هنا",
  databaseURL: "ضع_القيمة_هنا",
  projectId: "ضع_القيمة_هنا",
  storageBucket: "ضع_القيمة_هنا",
  messagingSenderId: "ضع_القيمة_هنا",
  appId: "ضع_القيمة_هنا"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// إعداد رفع الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// جعل مجلد الصور متاح للعرض
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// رفع صورة جديدة
app.post("/upload", upload.single("image"), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// إضافة مطعم جديد مع صورة
app.post("/add-restaurant", (req, res) => {
  const { name, imageUrls } = req.body;
  const restaurantsRef = ref(db, "restaurants");
  push(restaurantsRef, { name, imageUrls })
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// تعديل مطعم موجود وإضافة صورة جديدة
app.post("/update-restaurant/:id", (req, res) => {
  const { name, imageUrls } = req.body;
  const restaurantRef = ref(db, `restaurants/${req.params.id}`);
  update(restaurantRef, { name, imageUrls })
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));

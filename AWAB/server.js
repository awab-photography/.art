const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// إعداد التخزين للصور المرفوعة
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images/'),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.static('.')); // يسمح بالوصول لكل الملفات (index.html, images, etc.)

// جلب بيانات المطاعم
app.get('/restaurants', (req, res) => {
  fs.readFile('restaurants.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('خطأ في قراءة الملف');
    res.send(data);
  });
});

// إضافة أو تعديل مطعم
app.post('/restaurants', upload.array('images'), (req, res) => {
  const { name } = req.body;
  const images = req.files.map(f => f.filename);

  fs.readFile('restaurants.json', 'utf8', (err, data) => {
    let restaurants = [];
    if (!err) restaurants = JSON.parse(data);

    const index = restaurants.findIndex(r => r.name === name);
    if (index >= 0) {
      // تعديل مطعم موجود
      restaurants[index].images = images.length ? images : restaurants[index].images;
    } else {
      // إضافة مطعم جديد
      restaurants.push({ name, images });
    }

    fs.writeFile('restaurants.json', JSON.stringify(restaurants, null, 2), err => {
      if (err) return res.status(500).send('خطأ في حفظ الملف');
      res.send('تمت العملية بنجاح');
    });
  });
});

// حذف مطعم
app.delete('/restaurants', (req, res) => {
  const { name } = req.body;

  fs.readFile('restaurants.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('خطأ في قراءة الملف');
    let restaurants = JSON.parse(data);
    restaurants = restaurants.filter(r => r.name !== name);

    fs.writeFile('restaurants.json', JSON.stringify(restaurants, null, 2), err => {
      if (err) return res.status(500).send('خطأ في حفظ الملف');
      res.send('تم حذف المطعم');
    });
  });
});

app.listen(PORT, () => console.log(`الخادم يعمل على http://localhost:${PORT}`));

// server.js
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🛠️ الاتصال بقاعدة البيانات
const pool = new Pool({
  connectionString: "postgresql://postgres:obSVMZpUxTXoRcaBrcZNCAfZVtwTiVrC@centerbeam.proxy.rlwy.net:17828/railway",
  ssl: {
    rejectUnauthorized: false,
  },
});

// ✅ إنشاء جدول الطلبات إن لم يكن موجود
pool.query(`
  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    offer TEXT NOT NULL,
    price NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error("❌ خطأ في إنشاء الجدول:", err);
  } else {
    console.log("✅ جدول الطلبات جاهز");
  }
});

// نقطة اختبار
app.get("/", (req, res) => {
  res.send("✅ API شغال ومرتبط بـ PostgreSQL");
});

// استقبال الطلبات وتخزينها في PostgreSQL
app.post("/order", async (req, res) => {
  const { offer, price } = req.body;

  if (!offer || !price) {
    return res.status(400).json({ success: false, message: "البيانات ناقصة" });
  }

  try {
    await pool.query(
      "INSERT INTO orders (offer, price) VALUES ($1, $2)",
      [offer, price]
    );

    console.log("✅ تم تخزين الطلب:", offer, price);
    res.json({ success: true, message: "✅ تم استلام وتخزين الطلب" });
  } catch (error) {
    console.error("❌ خطأ أثناء التخزين:", error);
    res.status(500).json({ success: false, message: "حدث خطأ أثناء حفظ الطلب" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API شغال على http://localhost:${PORT}`);
});

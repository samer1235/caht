const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express(); // ✅ هنا أنشأنا app
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', (req, res) => {
  res.send('✅ 4STORE API يعمل!');
});

app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('خطأ في قاعدة البيانات');
  }
});

app.listen(port, () => {
  console.log(`✅ السيرفر يعمل على المنفذ ${port}`);
});

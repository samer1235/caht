app.get("/orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");

    const html = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>لوحة الطلبات - 4 STORE</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css" rel="stylesheet">
      </head>
      <body class="bg-light">
        <div class="container py-5">
          <h2 class="mb-4 text-center text-primary">📦 لوحة الطلبات</h2>
          <table class="table table-bordered table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th>رقم</th>
                <th>العرض</th>
                <th>السعر (ريال)</th>
                <th>الوقت</th>
              </tr>
            </thead>
            <tbody>
              ${result.rows
                .map(
                  (row) => `
                <tr>
                  <td>${row.id}</td>
                  <td>${row.offer}</td>
                  <td>${row.price}</td>
                  <td>${new Date(row.created_at).toLocaleString("ar-EG")}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    console.error("❌ خطأ في جلب الطلبات:", err);
    res.status(500).send("حدث خطأ أثناء تحميل الطلبات.");
  }
});

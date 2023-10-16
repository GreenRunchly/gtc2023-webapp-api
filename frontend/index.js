// Sengaja dibuat server ini untuk mensimulasikan 
// bahwa project ini sudah di upload ke cloudflare pages

// WebServer Library untuk handle incoming client, etc.
const express = require('express');
const app = express();
// Port yang dipakai ExpressJS untuk menjalankan webserver listen()
const port = 61000;

// Library Tambahan untuk melengkapi fitur yang dipakai
const path = require("path");
const cors = require('cors');

// Menggunakan CORS agar api dapat dipakai oleh siapa saja (tanpa perlu origin server)
app.use(cors());

// Mengakses static file (main web)
app.use('/', express.static(path.join(__dirname, 'static')))

// Menjalankan webserver ExpressJS
app.listen(port, () => {
    console.log(`Server simulasi Cloudflare Pages dengan port ${port} berjalan...`);
});
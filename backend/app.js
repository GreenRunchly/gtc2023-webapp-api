// DotEnv Config
require('dotenv').config(); // Load Configuration

// WebServer Library untuk handle incoming client, etc.
const express = require('express');
const app = express();
// Port yang dipakai ExpressJS untuk menjalankan webserver listen()
const port = 62000;

// Library Tambahan untuk melengkapi fitur yang dipakai
const fs = require('fs');
const path = require("path");
const cors = require('cors');
const alat = require('./module-tools');

// Module untuk Validasi input
const mdvld = require('express-validator');
function mdvldResult(req, res, next) {
    // Validasi Input
    const errorValidasiInput = mdvld.validationResult(req);
    if (!errorValidasiInput.isEmpty()) { // Jika tidak ada error
        res.status(200).json({
			code : 'error',
            msg : errorValidasiInput.errors[0].msg
        });
        return true;
    }else{
        return false;
    }
}

// Menggunakan CORS agar api dapat dipakai oleh siapa saja (tanpa perlu origin server)
app.use(cors())

// Koneksi mysql
const mysql = require('mysql2');

// Membuat koneksi db secara pooling
const pooldb = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
	multipleStatements: true
});

// Mengambil data Countdown
app.get('/app-data', (req, res) => {
	res.json({
		code : "ok",
		msg : "Berhasil!",
		data : {}
	});
});

// Menampilkan hasil error karena mengunjungi halaman yang tidak (Lost API url)
app.get('/*', (req, res) => {
	res.json({
		code : "error",
		msg : "API not found!"
	})
});

// Menjalankan webserver ExpressJS
app.listen(port, () => {
  	console.log(`Server dengan port ${port} berjalan...`);
});


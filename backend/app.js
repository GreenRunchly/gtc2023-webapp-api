// WebServer Library untuk handle incoming client, etc.
const express = require('express');
const app = express();
// Port yang dipakai ExpressJS untuk menjalankan webserver listen()
const port = 25000;

// Library Tambahan untuk melengkapi fitur yang dipakai
const fs = require('fs');
const path = require("path");
const cors = require('cors');

// Menggunakan CORS agar api dapat dipakai oleh siapa saja (tanpa perlu origin server)
app.use(cors())

// Mengambil data Countdown
app.get('/app-data', (req, res) => {
	function bacaFile(aksiLanjutan, filePath) {
		let file = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
		let informasi = fs.readFileSync(path.join(__dirname, "data", "informasi-penting.html"), { encoding: 'utf8', flag: 'r' });
		aksiLanjutan(JSON.parse(file), (informasi));
	}
	bacaFile( (fileTerbaca, informasi) => {
		delete fileTerbaca['rundown'];
		res.json({
			code : "ok",
			msg : "Berhasil!",
			data : {
				utama : fileTerbaca,
				informasi : informasi
			}
		});
	}, path.join(__dirname, "data", "app-data-dev.json") );
});

// Menampilkan hasil error karena mengunjungi halaman yang tidak (Lost API url)
app.get('/*', (req, res) => {
	res.json({
		code : "error",
		msg : "URL invalid!"
	})
});

// Menjalankan webserver ExpressJS
app.listen(port, () => {
  	console.log(`Server dengan port ${port} berjalan...`);
});


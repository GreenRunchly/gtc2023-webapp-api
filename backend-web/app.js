// Database library
const mysql = require('mysql')

// WebServer Library untuk handle incoming client, etc.
const express = require('express');
const app = express();
// Port yang dipakai ExpressJS untuk menjalankan webserver listen()
const port = 800;

// Library Tambahan untuk melengkapi fitur yang dipakai
const cors = require('cors');
const path = require('path');

// Menggunakan CORS agar api dapat dipakai oleh siapa saja (tanpa perlu origin server)
app.use(cors())

// app.get('/dashboard/:adminPage', (req, res) => {
// 	let {adminPage} = req.params;
// 	res.sendFile(path.join(__dirname+`/${adminPage}.html`));
// });

// app.get('/:slug', (req, res) => {
// 	let {slug} = req.params;
//   	res.send(slug);
// });

// Mengambil data Countdown
app.get('/api/countdown', (req, res) => {
	res.json({
		code : "error",
		msg : "Countdown berhasil dipanggil",
		data : {
			countdowndate : "Dec 6, 2023 00:00:00"
		}
	})
});

// Mengambil data Thumbnail slider utama
app.get('/api/banner-thumbnail', (req, res) => {
	res.json({
		code : "ok",
		msg : "Banner berhasil dipanggil",
		data : {
			banner : [
				"https://gtc.ieu.link/app/foto-destinasi/bus.jpg",
				"https://gtc.ieu.link/app/foto-destinasi/bali.jpeg",
				"https://gtc.ieu.link/app/foto-destinasi/denpasar.jpeg",
				"https://gtc.ieu.link/app/foto-destinasi/padawa-bali.jpg",
				"https://gtc.ieu.link/app/foto-destinasi/semarang.jpg",
				"https://gtc.ieu.link/app/foto-destinasi/trikabta.jpeg",
				"https://gtc.ieu.link/app/foto-destinasi/bromo.jpg"
			]
		}
	})
});

// Mengambil data Thumbnail slider utama
app.get('/api/kelas', (req, res) => {
	res.json({
		code : "ok",
		msg : "Daftar kelas berhasil dipanggil",
		data : {
			kelas : [
				"11-MIPA-1",
				"11-MIPA-2",
				"11-MIPA-3",
				"11-MIPA-4",
				"11-MIPA-5",
				"11-MIPA-6",
				"11-MIPA-7",
				"11-IPS-1",
				"11-IPS-2",
				"11-IPS-3",
				"11-IPS-4",
				"11-IPS-5"
			]
		}
	})
});

// Mengambil data Thumbnail slider utama
app.get('/api/helpdesk', (req, res) => {
	res.json({
		code : "ok",
		msg : "Daftar kelas berhasil dipanggil",
		data : {
			helpdesk : {
				"11-MIPA-1" : "KzYyODEyODMxNzE2MTc=",
				"11-MIPA-2" : "KzYyODE5MDYwMDAwMzI=",
				"11-MIPA-3" : "KzYyODc3NzIzOTg0ODI=",
				"11-MIPA-4" : "KzYyODEyOTY4MTMzMA==",
				"11-MIPA-5" : "KzYyODc3NzE3NzQ4NTE=",
				"11-MIPA-6" : "KzYyODEyODM4NzkyMjc=",
				"11-MIPA-7" : "KzYyODU3NzEyNzExNjU=",
				"11-IPS-1" : "KzYyODg4MDk5MTI4MDA=",
				"11-IPS-2" : "KzYyODU2MjExMTI4Ng==",
				"11-IPS-3" : "KzYyODEzMTEwNzM5NDY=",
				"11-IPS-4" : "KzYyODU4OTIxMjUxMDQ=",
				"11-IPS-5" : "KzYyODEyOTI1MTUxOQ=="
			}
		}
	})
});

// Menampilkan hasil error karena mengunjungi halaman yang tidak (Lost API url)
app.get('/*', (req, res) => {
	res.json({
		code : "error",
		msg : "API url is invalid"
	})
});

// Menjalankan webserver ExpressJS
app.listen(port, () => {
  	console.log(`Server dengan port ${port} berjalan...`);
});

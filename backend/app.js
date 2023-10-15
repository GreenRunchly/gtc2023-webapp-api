// DotEnv Config
require('dotenv').config(); // Load Configuration

// WebServer Library untuk handle incoming client, etc.
const express = require('express');
const app = express();
// Port yang dipakai ExpressJS untuk menjalankan webserver listen()
const port = 62000;
// Agar saat crash web tidak shutdown
app.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node Still Running...");
});

// Library Tambahan untuk melengkapi fitur yang dipakai
// const fs = require('fs');
// const path = require("path");
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
// Module cek kode negara nomor hp
function moduleCekNoHP(nohp, eksekusi) {
	// Mengecek kode negara pada nomor hp
	let hp_kode_negara = nohp.split("")[0] + nohp.split("")[1];
	if (hp_kode_negara !== '62'){
		eksekusi();
	};
}

// Menggunakan CORS agar api dapat dipakai oleh siapa saja (tanpa perlu origin server)
app.use(cors())

// Use JSON
app.use(express.json());

// Form Data
app.use(express.urlencoded({
    extended: true
}));

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

// Keep alive with data 
app.get('/account/alive', [
	mdvld.body('sesi').not().isEmpty().withMessage('Sesi ini sepertinya sudah expire.').trim().escape()
], (req, res) => {

	// Cek Error pada validasi input
    if ( mdvldResult(req, res) ){ // Jika ditemukan masalah akan return true
        return;
	};

	let {sesi} = req.body;

	let sqlsyn = `
		SELECT * FROM tb_akun WHERE sesi=?;
		SELECT * FROM tb_appdata_thumbnail;
		SELECT * FROM tb_appdata_kelas;
		SELECT * FROM tb_appdata_helpdesk;
	`;
	pooldb.query(sqlsyn, [sesi], (err, result) => {
		// Mengambil data antrian
		if (err){ 
			// Menampilkan error terjadi
			console.log(err);
			res.json({
				code : "error",
				msg : err
			}); return;
		}else{
			if (result[0].length !== 0) {
				res.json({
					code : "ok",
					msg : "Keep Alive!",
					data : {
						thumbnail : result[1],
						kelas : result[2],
						helpdesk : result[3]
					}
				}); return;
			}else{
				res.json({
					code : "error",
					msg : "Dead!",
					logout : true
				}); return;
			}
			

		}
	});

});

// Meminta OTP lewat WA
app.get('/account/request', [
	mdvld.body('nis').not().isEmpty().withMessage('NIS belum disiapkan.').trim().escape(),
	mdvld.body('nohp').not().isEmpty().withMessage('Nomor hp belum dimasukan.').trim().escape()
], (req, res) => {

	// Cek Error pada validasi input
    if ( mdvldResult(req, res) ){ // Jika ditemukan masalah akan return true
        return;
	};

	let {nis, nohp} = req.body;
	let onetimepassword = alat.numberGen();

	// Cek kode negara nomor hp
	moduleCekNoHP(nohp, () => {
		res.json({
			code : "error",
			msg : "Kode negara Nomor telepon harus bernegara Indonesia (62)"
		}); return;
	});

	let sqlsyn = `
		SELECT * FROM tb_akun WHERE kode_akun=? OR hp=?;
	`;
	pooldb.query(sqlsyn, [nis, nohp], (err, result) => {
		// Mengambil data antrian
		if (err){ 
			// Menampilkan error terjadi
			console.log(err);
			res.json({
				code : "error",
				msg : err
			}); return;
		}else if ((result[0]['hp'] === '') || (result[0]['hp'] === nohp)) {

			let sqlsyn = `
				DELETE FROM tb_otp WHERE kode_akun=? OR hp=?;
				INSERT INTO tb_otp (kode_akun, otp, hp) VALUES (?,?,?)
			`;
			pooldb.query(sqlsyn, [nis, nohp, nis, onetimepassword, nohp], (err, result) => {
				// Mengambil data antrian
				if (err){ 
					// Menampilkan error terjadi
					console.log(err);
					res.json({
						code : "error",
						msg : err
					}); return;
				} else {

					// Kirim OTP lewat WA
					let kirimotp = alat.webGo(`https://wa.ieu.link/send?destinasi=${nohp}&pesan=${onetimepassword}`);
					res.json({
						code : "ok",
						msg : "OTP berhasil dikirim!"
					}); return;

				}
			});

		}else{

			res.json({
				code : "ok",
				msg : "OTP tidak dapat dikirimkan karena nomor telpon tidak sesuai."
			}); return;

		}
	});

});

// Menerapkan QR dan menyimpnan no telp
app.get('/account/assign', [
	mdvld.body('nis').not().isEmpty().withMessage('NIS harap dimasukan.').trim().escape(),
	mdvld.body('otp').not().isEmpty().withMessage('OTP harap dimasukan.').trim().escape(),
	mdvld.body('nohp').not().isEmpty().withMessage('Nomor hp belum dimasukan.').trim().escape()
], (req, res) => {

	// Cek Error pada validasi input
    if ( mdvldResult(req, res) ){ // Jika ditemukan masalah akan return true
        return;
	};

	let {nis, otp, nohp} = req.body;

	let sqlsyn = `
		SELECT * FROM tb_otp WHERE kode_akun=? AND otp=?;
		SELECT * FROM tb_akun WHERE hp=?;
	`;
	pooldb.query(sqlsyn, [nis, otp, nohp], (err, result) => {
		// Mengambil data antrian
		if (err){ 
			// Menampilkan error terjadi
			console.log(err);
			res.json({
				code : "error",
				msg : err
			}); return;
		} else {
			if (result[0].length !== 0) {
				
				let sesi = Buffer.from((alat.numberGen(12)).toString()).toString('base64');
				
				if (result[1].length === 0){
					sqlsyn = `
						DELETE FROM tb_otp WHERE kode_akun=?;
						UPDATE tb_akun SET hp=?, sesi=? WHERE kode_akun=?
					`;
				}else{
					sqlsyn = `
						DELETE FROM tb_otp WHERE kode_akun=?;
						UPDATE tb_akun SET sesi=? WHERE kode_akun=?
					`;
				}
				
				pooldb.query(sqlsyn, [nis, nohp, sesi, nis], (err, result) => {
					res.json({
						code : "ok",
						msg : "OTP is match!",
						sesi : sesi
					}); return;
				});
			}else{
				res.json({
					code : "error",
					msg : "OTP is not match!"
				}); return;
			}
		}
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


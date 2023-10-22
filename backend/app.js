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
const fs = require('fs');
const http = require('http');
const https = require('https');
const cors = require('cors');
const alat = require('./module-tools');
const xlsxReader = require('read-excel-file/node');
const QRCode = require('qrcode');

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

// Import Data Excel
app.get('/app/virtualcard/get/akun', [
], (req, res) => {
	let sqlsyn = `
	SELECT kode_akun, kode_kelas, nama, TO_BASE64(CONCAT('00101101',kode_akun,'00101101')) AS qrcode FROM tb_akun ORDER BY kode_kelas ASC;
	`;
	pooldb.query(sqlsyn, (err, result) => { if (err){ /* Jika terjadi error */ }else{
		function genQR(simpan) {
			let hasil = result;
			result.forEach((item, index, arr) => {
				QRCode.toDataURL(item.qrcode, function (err, url) {
					hasil[index]['qrcode'] = url;
					if (index == (arr.length - 1)){ simpan(hasil); }
				});
			})
		}; genQR((hasil) => {
			res.json({
				code : "ok",
				msg : "Fecth Complete",
				data : hasil
			}); return;
		});
	}});
});

// Import Data Excel
app.get('/app/update', [
], (req, res) => {
	const child = require("child_process").exec("curl -L 'https://docs.google.com/spreadsheets/d/18P74DZV6-WQVIUstZF_ehU-eUedOlxfRT1MfyM4P76Q/export?format=xlsx' > './data/temp.xlsx'");
	child.on('exit', function() {
		// Menambahkan akun siswa
		xlsxReader('./data/temp.xlsx', { sheet: 'Siswa' }).then((rows) => { rows[0].pop();
			rows.forEach(row => {
				// Mengetahui akun yang sudah ada per kode akun/nis
				let sqlsyn = `SELECT * FROM tb_akun WHERE kode_akun=?;`;
				pooldb.query(sqlsyn, [row[1]], (err, result) => { if (err){ /* Jika terjadi error */ }else{
					if (result.length === 0){
						pooldb.query(`INSERT INTO tb_akun (kode_akun, nama, kode_kelas) VALUES (?,?,?)`, [
							row[1], row[2], row[3]
						], (err, result) => { 
							if (err){ /* Jika terjadi error */ }else{
								console.log(`Insert ${row[1]}`);
							}
						});
					}else{
						pooldb.query(`UPDATE tb_akun SET nama=?, kode_kelas=? WHERE kode_akun=?`, [
							row[2], row[3], row[1]
						], (err, result) => { 
							if (err){ /* Jika terjadi error */ }else{
								console.log(`Update ${row[1]}`);
							}
						});
					}
				}});
			});
		});
		
		// Menambahkan Wali Kelas
		xlsxReader('./data/temp.xlsx', { sheet: 'Wali Kelas' }).then((rows) => { rows[0].pop();
			rows.forEach(row => {
				// Mengetahui akun yang sudah ada per kode akun/nis
				let sqlsyn = `SELECT * FROM tb_akun WHERE kode_akun=? AND role=?;`;
				pooldb.query(sqlsyn, [row[1],'guru'], (err, result) => { if (err){ /* Jika terjadi error */ }else{
					if (result.length === 0){
						pooldb.query(`INSERT INTO tb_akun (kode_akun, nama, kode_kelas, role) VALUES (?,?,?,?)`, [
							row[1], row[2], row[3], 'guru'
						], (err, result) => { 
							if (err){ /* Jika terjadi error */ }else{
								console.log(`Insert ${row[1]}`);
							}
						});
					}else{
						pooldb.query(`UPDATE tb_akun SET nama=?, kode_kelas=?, role=? WHERE kode_akun=?`, [
							row[2], row[3], 'guru', row[1]
						], (err, result) => { 
							if (err){ /* Jika terjadi error */ }else{
								console.log(`Update ${row[1]}`);
							}
						});
					}
				}});
			});
		});

		// Informasi
		xlsxReader('./data/temp.xlsx', { sheet: 'Informasi' }).then((rows) => { rows[0].pop();
			rows.forEach(row => {
				// Mengetahui akun yang sudah ada per kode akun/nis
				let sqlsyn = `DELETE FROM tb_appdata_informasi WHERE kode_kelas=?;`;
				pooldb.query(sqlsyn, [row[1]], (err, result) => { if (err){ /* Jika terjadi error */ }else{
					pooldb.query(`
						INSERT INTO tb_appdata_informasi (kode_kelas, konten) VALUES (?,?);
					`, [ row[1], row[2] ], (err, result) => { 
						if (err){ /* Jika terjadi error */ }else{
							console.log(`Insert Info ${row[1]}`);
						}
					});
				}});
			});
		});
	});
});

// Check account availablity
app.post('/account/check', [
	mdvld.body('nis').not().isEmpty().withMessage('NIS belum disiapkan.').trim().escape(),
], (req, res) => {

	// Cek Error pada validasi input
    if ( mdvldResult(req, res) ){ // Jika ditemukan masalah akan return true
        return;
	};

	let {nis} = req.body;

	let sqlsyn = `
		SELECT * FROM tb_akun WHERE kode_akun=?;
	`;
	pooldb.query(sqlsyn, [nis], (err, result) => {
		// Mengambil data antrian
		if (err){ 
			// Menampilkan error terjadi
			console.log(err);
			res.json({
				code : "error",
				msg : err
			}); return;
		}else{
			if (result.length !== 0) {
				res.json({
					code : "ok",
					msg : "Akun ditemukan!",
					preview : result[0].nama
				}); return;
			}else{
				res.json({
					code : "error",
					msg : "Akun tidak ditemukan!"
				}); return;
			}
		}
	});

});

// Keep alive with data 
app.post('/account/alive', [
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

		/* Dipakai nanti -- SELECT * FROM tb_appdata_kelas; */

		/* Mengambil Nomor Helpdesk dan Kode Kelas */
		SELECT tb_appdata_helpdesk.kode_kelas,tb_appdata_helpdesk.nomor FROM tb_appdata_helpdesk 
		INNER JOIN tb_akun ON tb_akun.kode_kelas = tb_appdata_helpdesk.kode_kelas
		WHERE tb_akun.sesi=?;

		/* Mengambil informasi terbaru sesuai kelas masing-masing */
		SELECT tb_appdata_informasi.kode_kelas, tb_appdata_informasi.konten, tb_appdata_informasi.updated FROM tb_akun
		INNER JOIN tb_appdata_informasi ON tb_appdata_informasi.kode_kelas=tb_akun.kode_kelas
		WHERE tb_akun.sesi=?;
	`;
	pooldb.query(sqlsyn, [sesi, sesi, sesi], (err, result) => {
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
				fs.readFile('./data/app-data-rundown.json', 'utf8', function(err, dataRundown){ 
					let dataRun = JSON.parse(dataRundown);
					res.json({
						code : "ok",
						msg : "Keep Alive!",
						accountdata : result[0][0],
						appdata : {
							countdown: "Dec 6, 2023 00:00:00",
							informasi: result[3][0],
							helpdesk: result[2][0],
							thumbnail: result[1],
							rundown: dataRun
						}
					}); return;
				}); 
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
app.post('/account/request', [
	mdvld.body('nis').not().isEmpty().withMessage('NIS belum disiapkan.').trim().escape(),
	mdvld.body('nohp').not().isEmpty().withMessage('Nomor hp belum dimasukan.').trim().escape()
], (req, res) => {

	// Cek Error pada validasi input
    if ( mdvldResult(req, res) ){ // Jika ditemukan masalah akan return true
        return;
	};

	let {nis, nohp} = req.body;
	let onetimepassword = alat.numberGen();

	// Mengecek kode negara pada nomor hp
	let hp_kode_negara = nohp.split("")[0] + nohp.split("")[1] + nohp.split("")[2];
	if (hp_kode_negara !== '+62'){
		res.json({
			code : "error",
			msg : "Kode negara Nomor telepon harus bernegara Indonesia (62)"
		}); return;
	};
	// Menghilangkan +
	nohp = nohp.replace('+','');

	let sqlsyn = `
		/* Mencari ketersediaan akun */ 
		SELECT tb_akun.kode_akun,tb_akun.hp FROM tb_akun 
		WHERE tb_akun.kode_akun=?;

		/* Mengecek apakah OTP sudah di minta dalam waktu 5 menit */ 
		SELECT tb_akun.kode_akun,tb_akun.hp,tb_otp.created FROM tb_akun 
		INNER JOIN tb_otp ON tb_otp.kode_akun=tb_akun.kode_akun
		WHERE tb_akun.kode_akun=? AND tb_otp.updated BETWEEN (DATE_SUB(NOW(),INTERVAL 5 MINUTE)) AND NOW();

		/* Cek apakah sudah ada yang memakai nomor telepon tersebut atau tidak */
		SELECT tb_akun.kode_akun FROM tb_akun WHERE tb_akun.hp=? AND tb_akun.kode_akun<>?;
	`;
	pooldb.query(sqlsyn, [nis, nis, nohp, nis], (err, result) => {

		// Cek jika OTP sudah dikirim sebelumnya
		if (result[1].length !== 0){
			res.json({
				code : "error",
				msg : "OTP sebelumnya sudah terkirim, tunggu 5 menit untuk meminta lagi."
			}); return;
		}
		// Mengambil data antrian
		if (err){ 
			// Menampilkan error terjadi
			console.log(err);
			res.json({
				code : "error",
				msg : err
			}); return;
		}else if ((result[0][0]['hp'] === '') || (result[0][0]['hp'] === nohp)) {

			if (result[2].length === 0){
				let sqlsyn = `
					DELETE FROM tb_otp WHERE kode_akun=?;
					INSERT INTO tb_otp (kode_akun, otp, hp) VALUES (?,?,?)
				`;
				pooldb.query(sqlsyn, [nis, nis, onetimepassword, nohp], (err, result) => {
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
						alat.webGo(`http://localhost:63000/send?destinasi=${nohp}&pesan=${onetimepassword}`);
						
						res.json({
							code : "ok",
							msg : "OTP berhasil dikirim!"
						}); return;

					}
				});
			}else{
				res.json({
					code : "error",
					msg : "Nomor telepon sudah disandingkan dengan akun lain."
				}); return;
			}

		}else{

			res.json({
				code : "error",
				msg : "Akun sudah terhubung dengan nomor wa, harap login dengan nomor wa yang sama saat didaftarkan."
			}); return;

		}
	});

});

// Menerapkan QR dan menyimpnan no telp
app.post('/account/assign', [
	mdvld.body('nis').not().isEmpty().withMessage('NIS harap dimasukan.').trim().escape(),
	mdvld.body('otp').not().isEmpty().withMessage('OTP harap dimasukan.').trim().escape(),
	mdvld.body('nohp').not().isEmpty().withMessage('Nomor hp belum dimasukan.').trim().escape()
], (req, res) => {

	// Cek Error pada validasi input
    if ( mdvldResult(req, res) ){ // Jika ditemukan masalah akan return true
        return;
	};

	let {nis, otp, nohp} = req.body;

	// Mengecek kode negara pada nomor hp
	let hp_kode_negara = nohp.split("")[0] + nohp.split("")[1] + nohp.split("")[2];
	if (hp_kode_negara !== '+62'){
		res.json({
			code : "error",
			msg : "Kode negara Nomor telepon harus bernegara Indonesia (62)"
		}); return;
	};
	// Menghilangkan +
	nohp = nohp.replace('+','');

	let sqlsyn = `
		/* Mengecek apakah OTP sama atau tidak */ 
		SELECT tb_akun.kode_akun,tb_akun.hp,tb_otp.otp FROM tb_akun 
		INNER JOIN tb_otp ON tb_otp.kode_akun=tb_akun.kode_akun
		WHERE tb_otp.kode_akun=? AND tb_otp.otp=? AND tb_otp.hp=? AND tb_otp.updated BETWEEN (DATE_SUB(NOW(),INTERVAL 5 MINUTE)) AND NOW();

		/* Cek apakah sudah ada nomor hp atau tidak */
		SELECT tb_akun.hp FROM tb_akun WHERE tb_akun.kode_akun=?;

		/* Cek apakah sudah ada yang memakai nomor telepon tersebut atau tidak */
		SELECT tb_akun.kode_akun FROM tb_akun WHERE tb_akun.hp=? AND tb_akun.kode_akun<>?;
	`;
	pooldb.query(sqlsyn, [nis, otp, nohp, nis, nohp, nis], (err, result) => {
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
				
				// Generate Token Sesi
				let sesi = Buffer.from((alat.numberGen(12)).toString()).toString('base64');
				
				if (result[1].length !== 0){
					console.log(result[1][0].hp);
					if (result[1][0].hp === ''){
						// Dengan assign hp
						sqlsyn = `
							DELETE FROM tb_otp WHERE kode_akun=?;
							UPDATE tb_akun SET hp=?, sesi=? WHERE kode_akun=?
						`;
					}else{
						// Tanpa assign hp
						sqlsyn = `
							DELETE FROM tb_otp WHERE kode_akun=?;
							/* ? */
							UPDATE tb_akun SET sesi=? WHERE kode_akun=?
						`;
					}
					if (result[2].length === 0){
						pooldb.query(sqlsyn, [nis, nohp, sesi, nis], (err, result) => {
							res.json({
								code : "ok",
								msg : "OTP cocok.",
								sesi : sesi
							}); return;
						});
					}else{
						res.json({
							code : "error",
							msg : "Nomor telepon sudah disandingkan dengan akun lain."
						}); return;
					}
				}else{
					res.json({
						code : "error",
						msg : "Internal Error"
					}); return;
				}
			}else{
				res.json({
					code : "error",
					msg : "OTP tidak cocok."
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


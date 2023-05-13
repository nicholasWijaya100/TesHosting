const express = require("express");
const router = express.Router();
const {
  onetooneToko,
  onetoonePengguna,
  onetomanyKategori,
  onetomanyBuku,
  manytomanyToko,
  manytomanyBuku,
  kategoriCreateBuku,
  createTokoBuku,
} = require("../controllers/contohRelasi");

router.get("/onetoone/toko/:toko_id", onetooneToko);
router.get("/onetoone/pengguna/:pengguna_id", onetoonePengguna);
router.get("/onetomany/kategori/:kategori_id/bukus", onetomanyKategori);
router.get("/onetomany/buku/:buku_id", onetomanyBuku);
router.get("/manytomany/toko/:toko_id/bukus", manytomanyToko);
router.get("/manytomany/buku/:buku_id/tokos", manytomanyBuku);

router.post("/onetomany/kategori/:kategori_id/bukus", kategoriCreateBuku);
router.post("/manytomany/toko/:toko_id/bukus", createTokoBuku);

module.exports = router;

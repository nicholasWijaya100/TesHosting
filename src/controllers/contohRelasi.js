const { Sequelize } = require("sequelize");
const { Toko, Pengguna, KategoriBuku, Buku } = require("../models");

const onetooneToko = async (req, res) => {
  const { toko_id } = req.params;
  //eager loading
  const toko = await Toko.findByPk(Number(toko_id), {
    include: {
      model: Pengguna,
    },
  });

  return res.status(200).json(toko);
};
const onetoonePengguna = async (req, res) => {
  const { pengguna_id } = req.params;
  const penggunaDitemukan = await Pengguna.findByPk(Number(pengguna_id));
  // 1000 baris kodingan
  return res.status(200).json({
    pengguna: penggunaDitemukan,
    toko: await penggunaDitemukan.getToko(),
  });
};
const onetomanyKategori = async (req, res) => {
  const { kategori_id } = req.params;
  const kategoriFound = await KategoriBuku.findByPk(Number(kategori_id));
  //2juta koding
  const daftarBuku = await kategoriFound.getBuku();
  return res.status(200).json({
    kategori: kategoriFound,
    daftarBuku: daftarBuku,
  });
};
const onetomanyBuku = async (req, res) => {};

const manytomanyToko = async (req, res) => {
  const { toko_id } = req.params;
  const tokoFound = await Toko.findByPk(Number(toko_id), {
    attributes: [
      "toko_id",
      "toko_nama",
      [Sequelize.literal("Pengguna.pengguna_nama"), "pengguna_nama"],
    ],
    include: [
      { model: Pengguna, attributes: [] },
      {
        model: Buku,
        attributes: [
          "buku_id",
          "buku_nama",
          "buku_tahun_terbit",
          [Sequelize.literal("`Buku->toko_buku`.tb_stok"), "tb_stok"],
          [
            Sequelize.literal("`Buku->KategoriBuku`.kategori_nama"),
            "kategori_nama",
          ],
        ],
        include: { model: KategoriBuku, attributes: [] },
        through: { attributes: [] },
      },
    ],
  });

  return res.status(200).json({
    toko: tokoFound,
  });
};

const manytomanyBuku = async (req, res) => {};
const kategoriCreateBuku = async (req, res) => {};
const createTokoBuku = async (req, res) => {
  const { toko_id } = req.params;
  const toko = await Toko.findByPk(Number(toko_id));

  const body = req.body;
  const buku = await Buku.findByPk(Number(body.buku_id));

  const result = await toko.addBuku(buku, {
    through: { tb_stok: body.tb_stok },
  });

  const resultRemove = await toko.removeBuku(buku);

  return res.status(200).json(result);
};

module.exports = {
  onetooneToko,
  onetoonePengguna,
  onetomanyKategori,
  onetomanyBuku,
  manytomanyToko,
  manytomanyBuku,
  kategoriCreateBuku,
  createTokoBuku,
};

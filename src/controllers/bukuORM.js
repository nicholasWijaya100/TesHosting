const e = require("express");
const { Sequelize, Op } = require("sequelize");
const { Buku, Toko, KategoriBuku } = require("../models");

const queryBuku = async (req, res) => {
  const { keyword, tahun_terbit_awal, tahun_terbit_akhir } = req.query;

  let results;
  if (
    keyword !== undefined ||
    (tahun_terbit_awal !== undefined && tahun_terbit_akhir !== undefined)
  ) {
    const processKeyword = `%${keyword}%`;
    results = await Buku.findAll({
      //   limit: 10,
      //   offset:2,
      attributes: ["buku_nama", "buku_tahun_terbit", "keterangan_lengkap"],
      where: {
        [Op.or]: [
          { buku_nama: { [Op.like]: processKeyword } },
          {
            buku_tahun_terbit: {
              [Op.gte]: Number(tahun_terbit_awal),
              [Op.lte]: Number(tahun_terbit_akhir),
            },
          },
        ],
      },
    });

    // jangan lupa return
    return res.status(200).json(results);
  } else {
    results = await Buku.findAll({
      order: [["buku_id", "desc"]],
      attributes: [
        "buku_id",
        "buku_nama",
        "buku_tahun_terbit",
        "keterangan_lengkap",
        [Sequelize.col("KategoriBuku.kategori_nama"), "kategori_nama"],
      ],
      include: [{ model: KategoriBuku, attributes: [] }],
    });
    if (results.length < 1) {
      return res.status(404).json({ msg: "Tidak ada buku" });
    } else {
      return res.status(200).json(results);
    }
  }
};
const getSingleBuku = async (req, res) => {
  const { buku_id } = req.params;
  const results = await Buku.findByPk(buku_id, {
    attributes: [
      "buku_nama",
      "buku_tahun_terbit",
      [Sequelize.fn("LOWER", Sequelize.col("buku_nama")), "buku_nama_lower"],
    ],
  });
  if (!results) {
    return res.status(404).json({ msg: "Tidak ada buku" });
  } else {
    return res.status(200).json(results);
  }
};
const storeBuku = async (req, res) => {
  const body = req.body;
  try {
    // const result = await Buku.create({
    //     buku_nama: body.buku_nama,
    //     buku_tahun_terbit: body.buku_tahun_terbit,
    //     kategori_id: body.kategori_id
    // })
    const result = await Buku.create(body);
    if (result) {
      return res
        .status(200)
        .json({ msg: `Berhasil insert dengan id ${result.buku_id}` });
    } else {
      return res.status(500).json({ msg: "Gagal insert" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};
const updateBuku = async (req, res) => {
  const { buku_id } = req.params;
  const body = req.body;

  const bukuYangDiupdate = await Buku.findByPk(buku_id);
  if (!bukuYangDiupdate) {
    return res.sendStatus(404);
  }

  const result = await bukuYangDiupdate.update(body);

  return res.status(200).json({ msg: "Berhasil update" });
};
const patchBuku = async (req, res) => {};
const deleteBuku = async (req, res) => {
  const { buku_id } = req.params;
  const bukuYangDihapus = await Buku.findByPk(buku_id);
  if (!bukuYangDihapus) {
    return res.sendStatus(404);
  }

  const result = await bukuYangDihapus.destroy();
  // const result = await bukuYangDihapus.restore()
  // const result = await bukuYangDihapus.destroy({force:true}) //dihapus datanya
  return res.status(200).json({ msg: "Berhasil hapus" });
};

module.exports = {
  queryBuku,
  getSingleBuku,
  storeBuku,
  updateBuku,
  patchBuku,
  deleteBuku,
};

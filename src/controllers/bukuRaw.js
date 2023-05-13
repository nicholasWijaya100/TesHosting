const databasebuku = require('../databases/connectionBuku')
const { QueryTypes } = require('sequelize');

const queryBuku = async (req, res) => {
    const { keyword, limit, offset } = req.query
    console.log(keyword, limit, offset);

    if (keyword !== undefined || (limit !== undefined && offset !== undefined)) {
        let processKeyword = keyword || ""
        processKeyword = `%${processKeyword}%`
        let processOffset = offset || 0
        let processLimit = limit || 0

        let results
        if (processLimit === 0) {
            results = await databasebuku.query(
                "SELECT * FROM buku JOIN kategori_buku on kategori_buku.kategori_id = buku.kategori_id WHERE buku_nama like ?",
                {
                    type: QueryTypes.SELECT,
                    replacements: [processKeyword]
                });
        } else {
            results = await databasebuku.query(
                "SELECT * FROM BUKU JOIN kategori_buku on kategori_buku.kategori_id = buku.kategori_id WHERE buku_nama like ? limit ? offset ?",
                {
                    type: QueryTypes.SELECT,
                    replacements: [processKeyword, Number(processLimit), Number(processOffset)]
                });
        }

        if (results.length < 1) {
            return res.status(200).json({ msg: 'Tidak buku yang cocok dengan keyword, offset, dan limit yang anda masukkan' })
        } else {
            return res.status(200).json(results)
        }
    } else {
        const results = await databasebuku.query(
            "SELECT * FROM buku JOIN kategori_buku on kategori_buku.kategori_id = buku.kategori_id",
            { type: QueryTypes.SELECT }
        );

        if (results.length < 1) {
            return res.status(404).json({ msg: 'Tidak ada data buku' })
        } else {
            return res.status(200).json(results)
        }
    }
}

const getSingleBuku = async (req, res) => {
    let { buku_id } = req.params
    const results = await databasebuku.query(
        "SELECT * FROM buku JOIN kategori_buku on kategori_buku.kategori_id = buku.kategori_id WHERE buku_id = :buku_id",
        {
            type: QueryTypes.SELECT,
            replacements: {
                buku_id: Number(buku_id)
            }
        }
    )

    if (!results) {
        return res.status(404).send({ msg: 'Buku tidak ditemukan' })
    } else {
        let { buku_id, buku_nama, buku_tahun_terbit } = results[0]
        return res.status(200).json({ buku_id, buku_nama, buku_tahun_terbit })
    }
}

const storeBuku = async (req, res) => {
    const body = req.body;

    if (body) {
        const result = await databasebuku.query(
            "INSERT INTO buku(buku_nama, buku_tahun_terbit, kategori_id) VALUES (:buku_nama, :buku_tahun_terbit, :kategori_id)",
            {
                type: QueryTypes.INSERT,
                replacements: {
                    buku_nama: body.buku_nama,
                    buku_tahun_terbit: body.buku_tahun_terbit,
                    kategori_id: body.kategori_id,
                }
            }
        )
        if (result) {
            return res.status(200).json({msg:`Berhasil insert buku dengan id ${result[0]}`});
        } else {
            return res.status(500).json({ msg: "Silahkan coba lagi" });
        }
    } else {
        return res.status(400).json({ msg: "Pastikan inputan anda sudah tepat" });
    }
}

const updateBuku = async (req, res) => {
    const { buku_id } = req.params;
    const body = req.body;
    if (body) {

        const cekAda = await databasebuku.query(
            "SELECT * FROM buku JOIN kategori_buku on kategori_buku.kategori_id = buku.kategori_id WHERE buku_id = :buku_id",
            {
                type: QueryTypes.SELECT,
                replacements: {
                    buku_id: Number(buku_id)
                }
            }
        )

        if (!cekAda[0]) {
            return res.status(404).json({ msg: `Buku dengan id ${buku_id} tidak ditemukan` });
        }

        const result = await databasebuku.query(
            "UPDATE buku SET buku_nama = ?, buku_tahun_terbit = ?, kategori_id = ? WHERE buku_id = ?",
            {
                type: QueryTypes.UPDATE,
                replacements:
                [
                    body.buku_nama,
                    body.buku_tahun_terbit,
                    body.kategori_id,
                    Number(buku_id)
                ]
            }
        )

        return res.status(200).json({msg:`${result[1]} data buku berhasil diubah`});
    } else {
        return res.status(400).json({ msg: "Pastikan inputan anda sudah tepat" });
    }
}

const patchBuku = async (req, res) => {
    const { buku_id } = req.params;
    const body = req.body;
    if (body) {
        const cekAda = await databasebuku.query(
            "SELECT * FROM buku JOIN kategori_buku on kategori_buku.kategori_id = buku.kategori_id WHERE buku_id = :buku_id",
            {
                type: QueryTypes.SELECT,
                replacements: {
                    buku_id: Number(buku_id)
                }
            }
        )

        if (!cekAda[0]) {
            return res.status(404).json({ msg: `Buku dengan id ${buku_id} tidak ditemukan` });
        }

        const result = await databasebuku.query(
            "UPDATE buku SET buku_nama = ? WHERE buku_id = ?",
            {
                type: QueryTypes.UPDATE,
                replacements:
                [
                    body.buku_nama,
                    buku_id
                ]
            }
        )
        return res.status(200).json({msg:`${result[1]} data buku berhasil diubah`});
    } else {
        return res.status(400).json({ msg: "Pastikan inputan anda sudah tepat" });
    }
}

const deleteBuku = async (req, res) => {
    const { buku_id } = req.params;
    const cekAda = await databasebuku.query(
        "SELECT * FROM buku JOIN kategori_buku on kategori_buku.kategori_id = buku.kategori_id WHERE buku_id = :buku_id",
        {
            type: QueryTypes.SELECT,
            replacements: {
                buku_id: Number(buku_id)
            }
        }
    )

    if (!cekAda[0]) {
        return res.status(404).json({ msg: `Buku dengan id ${buku_id} tidak ditemukan` });
    } else {
        const result = await databasebuku.query(
            "DELETE FROM buku WHERE buku_id = ?",
            {
                type: QueryTypes.DELETE,
                replacements:
                [
                    buku_id
                ]
            }
        )
        console.log(result);
        return res.status(200).json({msg:`Buku ${buku_id} berhasil dihapus`});
    }
}

module.exports = {
    queryBuku,
    getSingleBuku,
    storeBuku,
    updateBuku,
    patchBuku,
    deleteBuku
}
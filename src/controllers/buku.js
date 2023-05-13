let  buku = require("../data/buku");

const queryBuku = (req, res) => {
    const { keyword, limit, offset } = req.query;

    if (keyword !== undefined && limit !== undefined && offset !== undefined) {
        let results = buku;

        if (keyword) {
            results = results.filter(
                (b) =>
                    b.title.toLowerCase().includes(keyword.toLowerCase()) ===
                    true
            );
        }

        let processOffset = offset || 0;
        let processLimit = limit || 0;

        if (processLimit === 0) {
            results = results.slice(Number(processOffset));
        } else {
            results = results.slice(
                Number(processOffset),
                Number(processOffset) + Number(processLimit)
            );
        }

        // results = results.map((b) => {
        //     let { id, title, price } = b
        //     return { id, title, price }
        // })

        if (results.length < 1) {
            return res.status(200).json({
                msg: "Tidak buku yang cocok dengan keyword, offset, dan limit yang anda masukkan",
            });
        } else {
            return res.status(200).json(results);
        }
    } else {
        // //cara 1: lempar semuanya
        // res.json(buku)

        // // cara 2 : lempar hanya sebagian kolom saja
        // let daftarBuku = [];
        // for (const b of buku) {
        //     let data = {
        //         id: b.id,
        //         title: b.title,
        //         price: b.price
        //     }
        //     daftarBuku.push(data)
        // }
        // res.json(daftarBuku)

        // cara 3 : lempar hanya sebagian kolom saja, tapi pakai array function
        const results = buku.map((b) => {
            let { id, title, price } = b;
            return { id, title, price };
        });

        if (results.length < 1) {
            return res.status(404).json({ msg: "Tidak ada data buku" });
        } else {
            return res.status(200).json(results);
        }
    }
};

const getSingleBuku = (req, res) => {
    // cara 1, cara di for dicari satu-satu
    // let bukuId = req.params.bukuId
    // let singleBuku = null
    // for (const b of buku) {
    //     if(b.id === Number(bukuId)){
    //         singleBuku = b
    //         break
    //     }
    // }

    // // cara 2 sedikit lebih "modern"
    let { bukuId } = req.params;
    let result = buku.find((b) => b.id === Number(bukuId));

    if (!result) {
        return res.status(404).send({ msg: "Buku tidak ditemukan" });
    } else {
        let { id, title, price } = result;
        return res.status(200).json({ id, title, price });
    }
};

const getCharacter = (req, res) => {
    let { bukuId, charId } = req.params;

    let singleBuku = buku.find((b) => b.id === Number(bukuId));

    if (!singleBuku) {
        return res.status(404).send({ msg: "Buku tidak ditemukan" });
    } else {
        if (charId) {
            // kalau ada charId
            if (!singleBuku.character) {
                return res
                    .status(404)
                    .send({ msg: "Character tidak ditemukan" });
            } else {
                let singleChar = singleBuku.character.find(
                    (c) => c.id === Number(charId)
                );
                if (!singleChar) {
                    return res
                        .status(404)
                        .send({ msg: "Character tidak ditemukan" });
                } else {
                    let { id, name, desc } = singleChar;
                    return res.status(200).json({ id, name, desc });
                }
            }
        } else {
            // kalau tidak di kasi charId, maka kembalikan semua characternya
            if (!singleBuku.character) {
                return res
                    .status(404)
                    .send({ msg: "Character tidak ditemukan" });
            } else {
                let allChar = singleBuku.character.map((c) => {
                    let { id, name, desc } = c;
                    return { id, name, desc };
                });

                if (allChar.length < 1) {
                    return res.status(404).send({
                        msg: "Tidak ada data character pada buku ini",
                    });
                } else {
                    return res.status(200).json(allChar);
                }
            }
        }
    }
};

const storeBuku = (req, res) => {
    const body = req.body;
    const maxBuku = buku.reduce((max, b) => (b.id > max.id ? b : max));
    const maxId = Number(maxBuku.id) + 1;
    body["id"] = maxId;

    if (body) {
        if (buku.push(body)) {
            console.log(buku);
            return res.status(200).json(body);
        } else {
            return res.status(500).json({ msg: "Silahkan coba lagi" });
        }
    } else {
        return res
            .status(400)
            .json({ msg: "Pastikan inputan anda sudah tepat" });
    }
};

const updateBuku = (req, res) => {
    const { bukuId } = req.params;
    const body = req.body;
    let bukuYangDiupdate = null;
    if (body) {
        const cekAda = buku.find((b) => b.id === Number(bukuId));
        if (!cekAda) {
            return res
                .status(404)
                .json({ msg: `Buku dengan id ${id} tidak ditemukan` });
        }
        buku = buku.map((b) => {
            if (b.id === Number(bukuId)) {
                b = body;
                bukuYangDiupdate = b;
            }
            return b;
        });
        return res.status(200).json(bukuYangDiupdate);
    } else {
        return res
            .status(400)
            .json({ msg: "Pastikan inputan anda sudah tepat" });
    }
};

const patchBuku = (req, res) => {
    const { bukuId } = req.params;
    const body = req.body;
    let bukuYangDiupdate = null;
    if (body) {
        const { title, price } = body;
        const cekAda = buku.find((b) => b.id === Number(bukuId));
        if (!cekAda) {
            return res
                .status(404)
                .json({ msg: `Buku dengan id ${bukuId} tidak ditemukan` });
        }
        buku = buku.map((b) => {
            if (b.id === Number(bukuId)) {
                b.title = title;
                b.price = price;
                bukuYangDiupdate = b;
            }
            return b;
        });
        return res.status(200).json(bukuYangDiupdate);
    } else {
        return res
            .status(400)
            .json({ msg: "Pastikan inputan anda sudah tepat" });
    }
};

const deleteBuku = (req, res) => {
    const { bukuId } = req.params;
    const cekAda = buku.find((b) => b.id === Number(bukuId));
    if (!cekAda) {
        return res
            .status(404)
            .json({ msg: `Buku dengan id ${bukuId} tidak ditemukan` });
    } else {
        buku = buku.filter((b) => b.id !== Number(bukuId));
        return res
            .status(200)
            .json({ msg: `Buku dengan id ${bukuId} telah dihapus` });
    }
};

module.exports = {
    queryBuku,
    getSingleBuku,
    getCharacter,
    storeBuku,
    updateBuku,
    patchBuku,
    deleteBuku,
};

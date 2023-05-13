const express = require("express");
const router = express.Router();
const {
    queryBuku,
    getSingleBuku,
    getCharacter,
    storeBuku,
    updateBuku,
    patchBuku,
    deleteBuku,
} = require("../controllers/buku");

router.get("/", queryBuku);
router.get("/:bukuId", getSingleBuku);
router.get("/:bukuId/char/:charId?", getCharacter);
router.post("/", storeBuku);
router.put("/:bukuId", updateBuku);
router.patch("/:bukuId", patchBuku);
router.delete("/:bukuId", deleteBuku);

module.exports = router;

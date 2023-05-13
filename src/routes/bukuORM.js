const express = require('express');
const router = express.Router()
const {
    queryBuku,
    getSingleBuku,
    storeBuku,
    updateBuku,
    patchBuku,
    deleteBuku
} = require('../controllers/bukuORM');

router.get('/', queryBuku)
router.get('/:buku_id', getSingleBuku)
router.post('/', storeBuku)
router.put('/:buku_id', updateBuku)
router.patch('/:buku_id', patchBuku)
router.delete('/:buku_id', deleteBuku);

module.exports = router

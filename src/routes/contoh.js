const express = require('express');
const router = express.Router()
const {
    contohQuery,
    contohParams,
    contohPost
} = require('../controllers/contoh')

router.get("/contohQuery",contohQuery)

router.get("/contohParams/:nama/umur/:umur/jk/:jk?", contohParams)

router.post('/contohPost', contohPost)

module.exports = router
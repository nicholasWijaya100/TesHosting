//http://localhost:3000/contohQuery?nama=mimi&umur=45&jk=pria
const contohQuery = (req, res) => {
    return res.json(req.query)
}

//localhost:3000/contohParams/mimis/umur/45000/jk
//localhost:3000/contohParams/mimis/umur/45000/jk/pria
const contohParams = (req, res) => {
    return res.json(req.params)
}

//localhost:3000/contohPost
const contohPost = (req, res) => {
    return res.json(req.body)
}

module.exports = {
    contohQuery,
    contohParams,
    contohPost
}
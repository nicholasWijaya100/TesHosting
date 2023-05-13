var express = require('express'),
app         = express(),
bodyParser  = require('body-parser'),
axios       = require('axios');
conn        = require('./conn');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const {getDB}       = require("./conn");
const sequelize     = getDB(); 

app.listen(3000, function(){
    console.log('Server running at port 3000: http://127.0.0.1:3000')
})

app.post('/api/users', async (req, res) => {
    var username = req.body.username;
    var name = req.body.name;

    var [rows] = await sequelize.query("select * from users where username = :username",{
        replacements:{
            username: username
        }
    });

    if(username == "" || username == null || username == undefined ||
    name == "" || name == null || name == undefined) {
        res.status(400).json("Semua field wajib diisi");
    } else if(rows.length > 0) {
        res.status(400).json("Username sudah ada");
    } else {
        await sequelize.query("insert into users (username, name) values (:username, :name)",{
            replacements:{
                username: username,
                name: name,
            }
        });
        const output = {
            username: username,
            name: name,
        }
        res.status(201).json(output);
    }
})

app.get('/api/cards', async(req, res) => {
    var name = req.query.name;
    var type = req.query.type;

    if(name == "" || name == undefined || name == "null") {
        res.status(400).json("Name wajib diisi")
    } else{
        let card = [];
        if(type == undefined || type == null) {
            type == "";
        }

        let returnvalue = await axios.get("https://db.ygoprodeck.com/api/v7/cardinfo.php");
        let data = returnvalue.data.data;
        for(let i = 0; i < data.length; i++) {
            if(data[i].name.includes(name) && data[i].type.includes(type)) {
                card_temp = {
                    id: data[i].id,
                    name: data[i].name,
                    type: data[i].type,
                    race: data[i].race,
                }
                card.push(card_temp);
            }
        }

        res.status(200).json(card);
    }
})

app.get('/api/cards/:id_card', async(req, res) => {
    var id_card = req.params.id_card;

    let card = "";
    let returnvalue = await axios.get("https://db.ygoprodeck.com/api/v7/cardinfo.php");
    let data = returnvalue.data.data;
    for(let i = 0; i < data.length; i++) {
        if(String(data[i].id) == id_card) {
            card = {
                name: data[i].name,
                type: data[i].type,
                frameType: data[i].frameType,
                desc: data[i].desc,
                race: data[i].race,
                archetype: data[i].archetype
            }
        }
    }

    if(card == "") {
        res.status(400).json("Invalid ID");
    } else {
        res.status(200).json(card);
    }
})

app.post('/api/decks', async(req, res) => {
    var username = req.body.username;
    var deck_name = req.body.deck_name;

    if(username == "" || username == null || username == undefined ||
    deck_name == "" || deck_name == null || deck_name == undefined) {
        res.status(400).json('Semua field wajib diisi');
    } else {
        var [rows] = await sequelize.query("select * from users where username = :username",{
            replacements:{
                username: username
            }
        });
        if(rows.length == 0) {
            res.status(400).json('User belum terdaftar');
        } else {
            var [rows] = await sequelize.query("select * from decks");
            var id_deck = "D";
            var id_number = rows.length + 1;
            if(id_number < 10) {id_deck = id_deck + "00" + id_number}
            else if(id_number < 100) {id_deck = id_deck + "00" + id_number}
            else {id_deck = id_deck + id_number}

            await sequelize.query("insert into decks (id_deck, deck_name, username) values (:id_deck, :deck_name, :username)",{
                replacements:{
                    id_deck: id_deck,
                    deck_name: deck_name,
                    username: username,
                }
            });

            res.status(201).json({
                id_deck: id_deck,
                deck_name: deck_name
            })
        }   
    }
})

app.post('/api/decks/:id_deck/cards', async(req, res) => {
    var id_deck = req.params.id_deck;
    var username = req.body.username;
    var id_card = req.body.id_card;
    var qty = req.body.qty;

    if(username == "" || username == null || username == undefined ||
    id_deck == "" || id_deck == null || id_deck == undefined || 
    id_card == "" || id_card == null || id_card == undefined || 
    qty == "" || qty == null || qty == undefined || qty == "0") {
        res.status(400).json('Semua field wajib diisi');
    } else {
        var [rows] = await sequelize.query("select * from decks where id_deck = :id_deck", {
            replacements:{
                id_deck: id_deck
            }
        });
        if(rows.length == 0) {
            res.status(400).json("Deck tidak valid");
        } else if(rows[0].username != username) {
            res.status(400).json("User tidak memiliki deck");
        } else {
            let card = "";
            let returnvalue = await axios.get("https://db.ygoprodeck.com/api/v7/cardinfo.php");
            let data = returnvalue.data.data;
            for(let i = 0; i < data.length; i++) {
                if(String(data[i].id) == id_card) {
                    card = {
                        name: data[i].name,
                        type: data[i].type,
                        frameType: data[i].frameType,
                        desc: data[i].desc,
                        race: data[i].race,
                        archetype: data[i].archetype
                    }
                }
            }

            if(card == "") {
                res.status(400).json("Invalid card id");
            } else {
                var [rows] = await sequelize.query("select * from cards where id_card = :id_card and id_deck = :id_deck",{
                    replacements:{
                        id_card: id_card,
                        id_deck: id_deck,
                    }
                });

                var flag_qty = -1;
                if(rows.length != 0) {
                    if(Number(rows[0].qty) + Number(qty) <= 3) {
                        flag_qty = 1;
                    }

                    if(flag_qty == -1) {
                        res.status(400).json("Kartu yang sama tidak boleh lebih dari 3 pada deck yang sama");
                    } else {
                        var temp = {
                            id_card: id_card,
                            id_deck: id_deck,
                            qty_final: Number(rows[0].qty) + Number(qty) 
                        }
                        await sequelize.query('UPDATE cards SET qty = $qty_final WHERE id_card = $id_card and id_deck = $id_deck',
                        {
                            bind: temp,
                            type: sequelize.QueryTypes.UPDATE
                        });
                        res.status(201).json("Berhasil menambahkan kartu '" + card.name + "' kedalam deck sebanhyak " + qty + " kartu")
                    }
                } else {
                    if(Number(qty) <= 3) {
                        flag_qty = 1;
                    }
                    if(flag_qty == -1) {
                        res.status(400).json("Kartu yang sama tidak boleh lebih dari 3 pada deck yang sama");
                    } else {
                        await sequelize.query("insert into cards (id_card, qty, id_deck) values (:id_card, :qty, :id_deck)",{
                            replacements:{
                                id_card: id_card,
                                qty: qty,
                                id_deck: id_deck,
                            }
                        });  
                        res.status(201).json("Berhasil menambahkan kartu '" + card.name + "' kedalam deck sebanhyak " + qty + " kartu")
                    }      
                }
            }
        }
    }
})

app.delete('/api/decks/:id_deck/cards/:id_card', async(req, res) => {
    var id_deck = req.params.id_deck;
    var username = req.body.username;
    var id_card = req.params.id_card;

    if(username == "" || username == null || username == undefined ||
    id_deck == "" || id_deck == null || id_deck == undefined || 
    id_card == "" || id_card == null || id_card == undefined) {
        res.status(400).json('Semua field wajib diisi');
    } else {
        var [rows] = await sequelize.query("select * from decks where id_deck = :id_deck", {
            replacements:{
                id_deck: id_deck
            }
        });
        if(rows.length == 0) {
            res.status(400).json("Deck tidak valid");
        } else if(rows[0].username != username) {
            res.status(400).json("User tidak memiliki deck");
        } else {
            let card = "";
            let returnvalue = await axios.get("https://db.ygoprodeck.com/api/v7/cardinfo.php");
            let data = returnvalue.data.data;
            for(let i = 0; i < data.length; i++) {
                if(String(data[i].id) == id_card) {
                    card = {
                        name: data[i].name,
                        type: data[i].type,
                        frameType: data[i].frameType,
                        desc: data[i].desc,
                        race: data[i].race,
                        archetype: data[i].archetype
                    }
                }
            }

            if(card == "") {
                res.status(400).json("Invalid card id");
            } else {
                const rows = await sequelize.query("DELETE FROM cards WHERE id_deck = :id_deck and id_card = :id_card",
                {
                    replacements: {
                        id_deck: id_deck,
                        id_card: id_card,
                    }
                });
                res.status(201).json("Berhasil menghapus kartu '" + card.name + "' dari dalam deck")
            }
        }
    }
})

app.get('/api/decks/:id_deck/details', async(req, res) => {
    var id_deck = req.params.id_deck;

    var [deck] = await sequelize.query("select * from decks where id_deck = :id_deck", {
        replacements:{
            id_deck: id_deck
        }
    });

    if(deck.length == 0) {
        res.status(400).json("Deck tidak ditemukan");
    } else {
        var [cards] = await sequelize.query("select * from cards where id_deck = :id_deck", {
            replacements:{
                id_deck: id_deck
            }
        });
        var cards_final_format = [];
        var summary = {
            'Monster_Cards': 0,
            'Spell_Cards': 0,
            'Trap_Cards': 0,
        }
        let returnvalue = await axios.get("https://db.ygoprodeck.com/api/v7/cardinfo.php");
        let data = returnvalue.data.data;
        for(var i = 0; i < cards.length; i++) {
            let card = "";
            for(let j = 0; j < data.length; j++) {
                if(String(data[j].id) == cards[i].id_card) {
                    card = {
                        id_card: String(data[j].id),
                        name: data[i].name,
                        type: data[i].type,
                        qty: cards[i].qty,
                    }
                    cards_final_format.push(card);

                    if(data[j].type.includes("Monster")) {
                        summary.Monster_Cards += Number(card.qty);
                    } else if(data[j].type.includes("Spell")) {
                        summary.Spell_Cards += Number(card.qty);
                    } else if(data[j].type.includes("Trap")) {
                        summary.Trap_Cards += Number(card.qty);
                    }
                }
            }
        }

        const output = {
            deck_name: deck[0].deck_name,
            owner: deck[0].username,
            summary: {
                "Monster Cards": summary.Monster_Cards,
                "Spell Cards": summary.Spell_Cards,
                "Trap Cards": summary.Trap_Cards,
            },
            cards: cards_final_format
        }
        res.status(200).json(output);
    }
})

app.get('/api/users/:username', async(req, res) => {
    var username = req.params.username;
    var [user] = await sequelize.query("select * from users where username = :username", {
        replacements:{
            username: username
        }
    });
    if(user.length == 0) {
        res.status(400).json("User tidak ditemukan");
    } else {
        var [decks] = await sequelize.query("select * from decks where username = :username", {
            replacements:{
                username: username
            }
        });
        var decks_final_format = [];
        for(var i = 0; i < decks.length; i++) {
            decks_final_format.push({
                id_deck: decks[i].id_deck,
                deck_name: decks[i].deck_name,
            })
        }
        const output = {
            name: user[0].name,
            username: username,
            decks: decks_final_format,
        }
        res.status(200).json(output);
    }
})
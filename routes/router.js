const express = require('express')
const router = express.Router()
const db = require('../config/database')
const createDb = require('../config/dbCreation')
const User = require("../models/User")

router.get('/filiere/lists/:id', function (req, res) {
    //req.params.id : l'id ajouté depuis la requete get avec axios
    db.query(`SELECT filiere.idFiliere, brancheFiliere.nom_branche, filiere.nom_filiere FROM filiere LEFT OUTER JOIN brancheFiliere ON brancheFiliere.idFiliere = filiere.idFiliere WHERE nom_branche = '${req.params.id}';`, function (err, rows) {
        (err)? console.log(err) : res.send(rows)
    })
})

router.get('/eleves/list', function(req, res){
    db.query('SELECT * FROM eleve', function(err, rows){
        if(err) console.log(err)
        else res.send(rows)
    })
})

router.get('/removeAll/data', function (req, res) {
    db.query('DELETE brancheFiliere FROM brancheFiliere;', function (err, rows) {
        if(err) console.log('error 1: ' + err)
        else db.query('DELETE filiere FROM filiere;', function (error, row) {
            if(error) console.log('error 2: ' + error)
            else db.query('DELETE eleve FROM eleve;', function (errors, data) {
                if(errors) console.log('error 3: ' + errors)
                res.send(data)
            })
        })
    })
})

router.post('/inscription', async function(req, res){
    createDb();
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (req.method === 'OPTIONS' || req.method === 'POST') {
        res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type');
    }
    let utilisateur = new User(req.body.nom, req.body.prenom, req.body.date_de_naissance, req.body.niveau, req.body.past_ecole, req.body.tel_eleve, req.body.tel_eleve2, req.body.address_eleve, req.body.e_mail, req.body.nom_pere, req.body.tel_pere, req.body.nom_mere, req.body.tel_mere, req.body.address_parent)
    db.query(`INSERT INTO eleve values(0,'${utilisateur.nom}', '${utilisateur.prenom}', '${utilisateur.date_de_naissance}', ${utilisateur.niveau}, '${utilisateur.past_ecole}', '${utilisateur.tel_eleve}', '${utilisateur.tel_eleve2}', '${utilisateur.address_eleve}', '${utilisateur.e_mail}', '${utilisateur.nom_pere}', '${utilisateur.tel_pere}', '${utilisateur.nom_mere}', '${utilisateur.tel_mere}', '${utilisateur.address_parent}')`, function(err, rows){
        if(err) throw err
        else {
            db.query(`INSERT INTO filiere VALUES(0, '${req.body.filiere}', ${rows.insertId})`, function(error, row){
                //(idFiliere, nomFiliere, #idEleve)
                //rows.insertId : id de la derniere élève ajouté
                if(error) throw error
                else{
                    if(req.body.filiere === 'isaia' || req.body.filiere === 'esiia' || req.body.filiere === 'igglia' || req.body.filiere === 'imticia'){
                        db.query(`INSERT INTO brancheFiliere VALUES (0, 'informatique', ${row.insertId})`)//(idBranche, nomBranch, #idFiliere)
                    }   else if(req.body.filiere === 'emp' || req.body.filiere === 'fic' || req.body.filiere === 'dtga' || req.body.filiere === 'teh'){
                            db.query(`INSERT INTO brancheFiliere VALUES (0, 'tertiaire', ${row.insertId})`)//row.insertId : id de la derniere filiere inserée
                    }   else{
                            db.query(`INSERT INTO brancheFiliere VALUES (0, 'industrielle', ${row.insertId})`)  
                    }
                }
            })
        }
    })
    res.send(req.body)
})

module.exports = router

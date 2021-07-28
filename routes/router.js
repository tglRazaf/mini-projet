const { json } = require('body-parser')
const express = require('express')
const router = express.Router()
const db = require('../config/database')
const User = require("../models/User")

let findBranch = function (req) {
    if(req.body.filiere === 'isaia' || req.body.filiere === 'esiia' || req.body.filiere === 'igglia' || req.body.filiere === 'imticia')
        return 'informatique'    
        else if(req.body.filiere === 'emp' || req.body.filiere === 'fic' || req.body.filiere === 'dtga' || req.body.filiere === 'teh')
            return 'tertiaire'
            else
                return 'industrielle'
}

router.get('/filiere/lists/:branche', function (req, res) {
    db.query(`SELECT filieres.idFiliere, filieres.nom_filiere, brancheFilieres.idBranche, brancheFilieres.nom_branche FROM filieres RIGHT OUTER JOIN brancheFilieres ON filieres.idBranche = brancheFilieres.idBranche WHERE brancheFilieres.nom_branche = '${req.params.branche}';`, function (err, rows) {
        console.log(rows);
        (err)? console.log(err) : res.send(rows)
    })
})

router.get('/all/:table', function(req, res){
    db.query(`SELECT * FROM ${req.params.table}`, function (err, rows) {
        (err)? console.log(err) : res.send(rows)
    })
})


router.get('/filiere/count/:nom/:annee', function (req, res) {
    console.log(req.params);
    db.query(`SELECT matricule, nom, prenom, tel_eleve, tel_eleve2 FROM eleves WHERE idFiliere = (SELECT idFiliere FROM filieres WHERE nom_filiere = '${req.params.nom}')AND eleves.niveau =${req.params.annee}`, function (err, rows) {
        (err)? console.log(err) : res.send(rows)
    })
})

router.get('/eleves/list', function(req, res){
    db.query('SELECT * FROM eleve', function(err, rows){
        if(err) console.log(err)
        else res.send(rows)
    })
})


router.post('/inscription', async function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (req.method === 'OPTIONS' || req.method === 'POST') {
        res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type');
    }
    let utilisateur = new User(req.body.nom, req.body.prenom, req.body.date_de_naissance, req.body.niveau, req.body.past_ecole, req.body.tel_eleve, req.body.tel_eleve2, req.body.address_eleve, req.body.e_mail, req.body.nom_pere, req.body.tel_pere, req.body.nom_mere, req.body.tel_mere, req.body.address_parent)
    db.query(`SELECT idFiliere FROM filieres WHERE nom_filiere = '${req.body.filiere}'`, function (err, result) {
        console.log(JSON.stringify(result))
        if(err) console.log('error to find id ', err)
        else{ 
            db.query(`
                INSERT INTO eleves(nom, prenom, date_de_naissance, niveau, past_ecole, tel_eleve, tel_eleve2, address_eleve, e_mail, nom_pere, tel_pere, nom_mere, tel_mere, address_parent, idFiliere) values(
                    '${utilisateur.nom}', 
                    '${utilisateur.prenom}', 
                    '${utilisateur.date_de_naissance}', 
                    ${utilisateur.niveau}, 
                    '${utilisateur.past_ecole}', 
                    '${utilisateur.tel_eleve}', 
                    '${utilisateur.tel_eleve2}', 
                    '${utilisateur.address_eleve}', 
                    '${utilisateur.e_mail}', 
                    '${utilisateur.nom_pere}', 
                    '${utilisateur.tel_pere}', 
                    '${utilisateur.nom_mere}', 
                    '${utilisateur.tel_mere}',
                    '${utilisateur.address_parent}', 
                    ${result[0].idFiliere}
                )`, 
                function (error, rows) {
                    if(err) console.log('eleve insertion ' + error);
                    else console.log('Every thing is ok!!')
                }
            )
        }
    })

})


router.post('/add/branche', function (req, res) {
    db.query(`SELECT nom_branche FROM brancheFilieres WHERE nom_branche = '${req.body.nomBranche}'`, function (erreur, results) {
        if(erreur) console.log('checking if this branche exist : ' + erreur)
        else if(results.length < 1){
            res.setHeader('Access-Control-Allow-Origin', '*')
            if (req.method === 'OPTIONS' || req.method === 'POST') {
                res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type');
            }
            db.query(`INSERT INTO brancheFilieres VALUES (0, '${req.body.nomBranche}', NOW())`, function (err, rows) {
                if(err) console.log('branche insertion ' + err);
                else{
                    for (let i = 0; i < req.body.filieres.length; i++) {
                        db.query(`INSERT INTO filieres VALUES(0, '${req.body.filieres[i]}', ${rows.insertId})`,
                            function(error, row){
                                (error)? console.log('filiere insertion ' + error): console.log(row.insertId);
                            }
                        )
                    }   
                }
            })
        }   else res.send(req.body.nomBranche)
    })
})

router.post('/add/filiere', function (req, res) {
    console.log(req.body);
    db.query(`INSERT INTO filieres VALUES (0, '${req.body.nom_filiere}', ${req.body.idBranche})`, function (err, rows) {
        if(err) console.log('Insert filiere : ' + erreur)
        res.send(req.body)
    })
})

router.post('/delete/filiere', function (req, res) {
    console.log(req.body);
    db.query(`DELETE filieres FROM filieres WHERE idFiliere = ${req.body.idFiliere}`, function (err, rows) {
        if(err) console.log('delete filiere : ' + erreur)
        res.send(req.body)
    })
})

router.post('/eleve/payement', function (req, res) {
    db.query(`SELECT matricule FROM eleves WHERE matricule = ${req.body.matricule_eleve}`, function (error, result) {
        console.log(result);
        if(error) console.log('find eleve matricule ', error);        
        else if(result.length != 1){
            res.json({
                "err": "cette matricule n'existe pas"
            })
        }   else{
            console.log(req.body)
            db.query(`INSERT INTO payements VALUES(0, '${req.body.nom}', ${req.body.somme_payee}, ${req.body.somme_restante}, NOW(), ${req.body.annee_scolaire}, ${req.body.matricule_eleve})`, function (err, rows) {
                if(err) console.log('delete filiere : ' + err)
                res.send(req.body)
            })
        }
    })
})

module.exports = router






const db = require('./database')

const createDb = function (){
    db.query(`CREATE DATABASE IF NOT EXISTS mySchoolDb;`, function (err, result) {
        if (err) console.log('database creation error : ' + err);
        else {
            db.query(`CREATE TABLE IF NOT EXISTS eleve(matricule INTEGER PRIMARY KEY AUTO_INCREMENT, nom CHAR(20), prenom CHAR(20), date_de_naissance DATE, niveau INT(1), past_ecole CHAR(20), tel_eleve CHAR(10),tel_eleve2 CHAR(10), address_eleve CHAR(30), e_mail CHAR(50), nom_pere CHAR(30), tel_pere CHAR(10), nom_mere CHAR(30), tel_mere CHAR(10), address_parent CHAR(30));`, function (error, results) {
                if (error) console.log('table creation(eleve) error : ' + error);
                else{
                    db.query(`CREATE TABLE IF NOT EXISTS payement(idPayement INTEGER PRIMARY KEY AUTO_INCREMENT, somme_payee INTEGER, reste INTEGER, date_payement DATE, annee_scolaire CHAR(10), matricule_eleve INTEGER, CONSTRAINT fk_payement FOREIGN KEY(matricule_eleve) REFERENCES eleve(matricule))`, function (errors, resultats) {
                        if (errors) console.log('table creation(payement) error : ' + errors);
                        db.query(`CREATE TABLE IF NOT EXISTS filiere(idFiliere INTEGER PRIMARY KEY AUTO_INCREMENT, nom_filiere CHAR(20), matricule_eleve INTEGER, CONSTRAINT fk_filiere FOREIGN KEY(matricule_eleve) REFERENCES eleve(matricule));`, function (errs, valiny) {
                            if (errs) console.log('table creation(filiere) error : ' + errs);
                            else{
                                db.query(`CREATE TABLE brancheFiliere(idBranche INTEGER PRIMARY KEY AUTO_INCREMENT, nom_branche CHAR(20), idFiliere INTEGER, CONSTRAINT fk_branche FOREIGN KEY(idFiliere) REFERENCES filiere(idFiliere));`, function (erreur, reponse) {
                                    if (errs) console.log('table creation(filiere) error : ' + errs);
                                    else console.log('DB created!!!');
                                })
                            }
                        })
                    })
                }
            })
        }
    })
}

module.exports = createDb
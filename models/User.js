
module.exports = class User{
    constructor(name,prenom, date_de_naissance, niveau, past_ecole, tel_eleve, tel_eleve2, address_eleve, e_mail, nom_pere, tel_pere, nom_mere, tel_mere, address_parent){
        this.nom = name
        this.prenom =prenom
        this.date_de_naissance = date_de_naissance
        this.niveau = niveau
        this.past_ecole = past_ecole
        this.tel_eleve= tel_eleve
        this.tel_eleve2= tel_eleve2
        this.address_eleve= address_eleve
        this.e_mail= e_mail
        this.nom_pere= nom_pere
        this.tel_pere= tel_pere
        this.nom_mere= nom_mere
        this.tel_mere= tel_mere
        this.address_parent= address_parent
    }
}
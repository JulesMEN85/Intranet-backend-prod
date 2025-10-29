/** 
 * Ce fichier sert à traduire le texte dans la table 'varcli', 
 * colonne 'varremise' en un texte compréhensible par WinPro.
 * Par exemple: 
 * &01(familleremise&1D1)
 * _!893&2355
 * qui est dans la base de données devient pour WinPro:
 * Si (familleremise = 1) 
 *  _Remise := 55
 * 
 * PS: Je ne sais pas pourquoi cela fonctionne comme cela, mais c'est ainsi. 
 */  

const winProToSql = {
    "#" : "&0E",            //Pour ajouter un commentaire
    "Executer": "!8F1",     //Pour exécuter une fonction externe
    "Si" : "&01",           //Dans le cadre d'une condition
    "Sinon Si": "&02",      //Dans le cadre d'une condition
    "Sinon": "&03",         //Dans le cadre d'une condition
    "Fin Si": "&04",        //Afin d'indiquer la fin d'une série de conditions
    "=" : "&1D",            //Dans le cas où l'on souhaite vérifier une conditon. Exemple: Si (a=1) -> &01(a&1D1)
    ":=" : "&23",           //Dans le cas d'une affectation de variable. Exemple: a := 2 -> a&232
    "_Remise": "_!893",     //Nom de la variable dans le tableau des remises de prix 
}


//On inverse chaque clé/valeur afin de pouvoir retransformer dans l'autre sens s'il le faut
const sqlToWinPro = Object.fromEntries(Object.entries(winProToSql).map(([k,v]) => [v,k]));

module.exports = {
    winProToSql,
    sqlToWinPro
};
/**
 * Created by michel on 21/12/2015.
 */
var request = require('request');
var http = require('http');
module.exports =
{
    remote_acces_region:'http://localhost:8984/region',
    remote_access_tutelle:'http://localhost:8984/tutelle',
    remote_access_academie:'http://localhost:8984/academie',
    remote_access_sigle:'http://localhost:8984/sigle',
    remote_access_universite:'http://localhost:8984/universite',
    remote_access_statut:'http://localhost:8984/statut',
    remote_access_type:'http://localhost:8984/type',
    remote_access_before_event:'http://localhost:8984/expandable?requete=',
    getRegion: function (res)
    {
        var arrayRegion = [];
        request(this.remote_acces_region, function (error, response, body)
        {
            if (!error && response.statusCode == 200)
            {
                var myResponse = body.split('</li>');
                for(var i =0; i<myResponse.length; i++) {
                    arrayRegion[i] = {
                        name: myResponse[i].replace('<li>', '')
                    };
                }
                res.json(arrayRegion);
            }else{
                res.json(arrayRegion);
            }
        });
    },
    getTutelle: function (res)
    {
        var arrayTutelle = [];
        request(this.remote_access_tutelle, function (error, response, body)
        {
            if (!error && response.statusCode == 200)
            {
                var myResponse = body.split('</li>');
                for(var i =0; i<myResponse.length; i++) {
                    arrayTutelle[i] = {
                        name: myResponse[i].replace('<li>', '')
                    };
                }
                res.json(arrayTutelle);
            }else{
                res.json(arrayTutelle);
            }
        });
    },

    getAcademie: function (res)
    {
        var arrayAcademie = [];
        request(this.remote_access_academie, function (error, response, body)
        {
            if (!error && response.statusCode == 200)
            {
                var myResponse = body.split('</li>');
                for(var i =0; i<myResponse.length; i++) {
                    arrayAcademie[i] = {
                        name: myResponse[i].replace('<li>', '')
                    };
                }
                res.json(arrayAcademie);
            }else{
                res.json(arrayAcademie);
            }
        });
    },

    getSigles: function (res)
    {
        var arraySigles = [];
        request(this.remote_access_sigle, function (error, response, body)
        {
            if (!error && response.statusCode == 200)
            {
                var myResponse = body.split('</li>');
                for(var i =0; i<myResponse.length; i++) {
                    arraySigles[i] = {
                        name: myResponse[i].replace('<li>', '')
                    };
                }
                res.json(arraySigles);
            }else{
                res.json(arraySigles);
            }
        });
    },
    getUniversite: function (res)
    {
        var arrayUniversite = [];
        request(this.remote_access_universite, function (error, response, body)
        {
            if (!error && response.statusCode == 200)
            {
                var myResponse = body.split('</li>');
                for(var i =0; i<myResponse.length; i++) {
                    arrayUniversite[i] = {
                        name: myResponse[i].replace('<li>', '')
                    };
                }
                res.json(arrayUniversite);
            }else{
                res.json(arrayUniversite);
            }
        });
    },
    getStatuts: function (res)
    {
        var arrayStatut = [];
        request(this.remote_access_statut, function (error, response, body)
        {
            if (!error && response.statusCode == 200)
            {
                var myResponse = body.split('</li>');
                for(var i =0; i<myResponse.length; i++) {
                    arrayStatut[i] = {
                        name: myResponse[i].replace('<li>', '')
                    };
                }
                res.json(arrayStatut);
            }else{
                res.json(arrayStatut);
            }
        });
    },
    getTypes: function (res)
    {
        var arrayType = [];
        request(this.remote_access_type, function (error, response, body)
        {
            if (!error && response.statusCode == 200)
            {
                var myResponse = body.split('</li>');
                for(var i =0; i<myResponse.length; i++) {
                    arrayType[i] = {
                        name: myResponse[i].replace('<li>', '')
                    };
                }
                res.json(arrayType);
            }else{
                res.json(arrayType);
            }
        });
    },
    expandable: function(req, res, myUri)
    {
        var myJocker = req.query.jocker;
        request(myUri,function (error, response, body)
            {
                //console.log(response.statusCode);
                var arrayEtablissement =[];
                if (!error && response.statusCode == 200)
                {

                    console.log(body);
                    var myResponse = body.split('</etablissement>');
                    //console.log("size " +myResponse.length);
                    for(var i =0; i<myResponse.length; i++)
                    {
                        if((myResponse[i]).length>0)  //le split peut ne pas marcher
                        {
                            var stringEtablissement = myResponse[i].replace('<etablissement>', '');
                            var insideEtab =stringEtablissement.split("</");

                            var valueUAI="", valueType="", valueNom="", valueSigle="", valueStatut="", valueTutelle="",
                                valueUniversite="", valueAdresse="", valueCp="", valueCommune="", valueDepart="",
                                valueAcademie="", valueRegion="", valueLongitude="", valueLatitude="", valueLien="";

                            for(var j =0; j<insideEtab.length; j++)
                            {
                                //console.log(j +" " +insideEtab[j]);
                                switch (j)
                                {
                                    case 0:
                                        valueUAI=(insideEtab[j]).replace("<UAI>", "").replace("UAI>", "").replace("<UAI", "").trim();
                                        break;
                                    case 1:
                                        valueType=(insideEtab[j]).replace("<type>", "").replace("type>", "").replace("UAI>", "").replace("<type", "").trim();
                                        break;
                                    case 2:
                                        //replace 3 = ancien
                                        valueNom=(insideEtab[j]).replace("<nom>", "").replace("nom>", "").replace("type>", "").replace("<nom", "").trim();
                                        break;
                                    case 3:
                                     valueSigle=(insideEtab[j]).replace("<sigle>", "").replace("sigle>", "").replace("nom>", "").replace("<type", "").trim();
                                     break;
                                     case 4:
                                     valueStatut=(insideEtab[j]).replace("<statut>", "").replace("statut>", "").replace("sigle>", "").replace("<statut", "").trim();
                                     break;
                                     case 5:
                                     valueTutelle=(insideEtab[j]).replace("<tutelle>", "").replace("tutelle>", "").replace("statut>", "").replace("<tutelle", "").trim();
                                     break
                                     case 6:
                                     valueUniversite=(insideEtab[j]).replace("<universite>", "").replace("universite>", "").replace("tutelle>", "").replace("<universite", "").trim();

                                     break;
                                     case 7:
                                     valueAdresse=(insideEtab[j]).replace("<adresse>", "").replace("adresse>", "").replace("universite>", "").replace("<adresse", "").trim();
                                     break;
                                     case 8:
                                     valueCp=(insideEtab[j]).replace("<cp>", "").replace("cp>", "").replace("adresse>", "").replace("<cp", "").trim();
                                     break;
                                     case 9:
                                     valueCommune=(insideEtab[j]).replace("<commune>", "").replace("commune>", "").replace("cp>", "").replace("<commune", "").trim();
                                     break;
                                     case 10:
                                     valueDepart=(insideEtab[j]).replace("<departement>", "").replace("departement>", "").replace("commune>", "").replace("<departement", "").trim();
                                     break;
                                     case 11:
                                     valueAcademie=(insideEtab[j]).replace("<academie>", "").replace("academie>", "").replace("departement>", "").replace("<academie", "").trim();
                                     break;
                                     case 12:
                                     valueRegion=(insideEtab[j]).replace("<region>", "").replace("region>", "").replace("academie>", "").replace("<region", "").trim();
                                     break;
                                     case 13:
                                     valueLongitude=(insideEtab[j]).replace("<longitude_X>", "").replace("longitude_X>", "").replace("region>", "").replace("<longitude_X", "").trim();
                                     break;
                                     case 14:
                                     valueLatitude=(insideEtab[j]).replace("<latitude_Y>", "").replace("latitude_Y>", "").replace("longitude_X>", "").replace("<latitude_Y", "").trim();
                                     break;
                                     case 15:
                                     valueLien=(insideEtab[j]).replace("<lien>", "").replace("lien>", "").replace("latitude_Y>", "").replace("<lien", "").trim();
                                     break;
                                }
                            }
                            arrayEtablissement[i] = {

                                id: valueUAI,
                                typeEtab:valueType,
                                name:valueNom,
                                sigle:valueSigle,
                                statutEtab:valueStatut,
                                tutelle:valueTutelle,
                                universite:valueUniversite,
                                adresseEtab:valueAdresse,
                                cp:valueCp,
                                commune:valueCommune,
                                academie:valueAcademie,
                                region:valueRegion,
                                longitude:valueLongitude,
                                latitude:valueLatitude,
                                lien:valueLien

                            };
                        }// fin du if split peut ne pas marcher

                        /*arrayEtablissement[i] = {
                            uai: valueUAI,
                            typeEtab:valueType,
                            nom:valueNom,
                            sigle:valueSigle,
                            statutEtab:valueStatut,
                            tutelle:valueTutelle,
                            universite:valueUniversite,
                            adresseEtab:valueAdresse,
                            cp:valueCp,
                            commune:valueCommune,
                            academie:valueAcademie,
                            region:valueRegion,
                            longitude:valueLongitude,
                            latitude:valueLatitude,
                            lien:valueLien
                        };*/

                    }

                  //console.log(arrayEtablissement);
                }//end status code 200

                res.json(arrayEtablissement);
            });

        /*res.json({
            "name":"coucou"
        });*/

    }
};



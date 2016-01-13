/**
 * Created by michel on 21/12/2015.
 */
'use strict';

var request = require('request');
var http = require('http');
var xml2js = require('xml2js');
var config = require('config');

module.exports = {

  remote_acces_region: `${config.client}/region`,
  remote_access_tutelle: `${config.client}/tutelle`,
  remote_access_academie: `${config.client}/academie`,
  remote_access_sigle: `${config.client}/sigle`,
  remote_access_universite: `${config.client}/universite`,
  remote_access_statut: `${config.client}/statut`,
  remote_access_type: `${config.client}/type`,
  remote_access_before_event: `${config.client}/expandable?requete=`,
  remote_access_establissement_par_region: `${config.client}/nbEtablRegion`,
  remote_access_establissement_par_academie: `${config.client}/nbEtablAcademie`,

  getRegion: function(res) {
    var arrayRegion = [];
    request(this.remote_acces_region, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var myResponse = body.split('</li>');
        for (var i = 0; i < myResponse.length; i++) {
          arrayRegion[i] = {
            name: myResponse[i].replace('<li>', '')
          };
        }
        res.json(arrayRegion);
      } else {
        res.json(arrayRegion);
      }
    });
  },

  getTutelle: function(res) {
    var arrayTutelle = [];
    request(this.remote_access_tutelle, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var myResponse = body.split('</li>');
        for (var i = 0; i < myResponse.length; i++) {
          arrayTutelle[i] = {
            name: myResponse[i].replace('<li>', '')
          };
        }
        res.json(arrayTutelle);
      } else {
        res.json(arrayTutelle);
      }
    });
  },

  getAcademie: function(res) {
    var arrayAcademie = [];
    request(this.remote_access_academie, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var myResponse = body.split('</li>');
        for (var i = 0; i < myResponse.length; i++) {
          arrayAcademie[i] = {
            name: myResponse[i].replace('<li>', '')
          };
        }
        res.json(arrayAcademie);
      } else {
        res.json(arrayAcademie);
      }
    });
  },

  getSigles: function(res) {
    var arraySigles = [];
    request(this.remote_access_sigle, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var myResponse = body.split('</li>');
        for (var i = 0; i < myResponse.length; i++) {
          arraySigles[i] = {
            name: myResponse[i].replace('<li>', '')
          };
        }
        res.json(arraySigles);
      } else {
        res.json(arraySigles);
      }
    });
  },

  getUniversite: function(res) {
    var arrayUniversite = [];
    request(this.remote_access_universite, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var myResponse = body.split('</li>');
        for (var i = 0; i < myResponse.length; i++) {
          arrayUniversite[i] = {
            name: myResponse[i].replace('<li>', '')
          };
        }
        res.json(arrayUniversite);
      } else {
        res.json(arrayUniversite);
      }
    });
  },

  getStatuts: function(res) {
    var arrayStatut = [];
    request(this.remote_access_statut, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var myResponse = body.split('</li>');
        for (var i = 0; i < myResponse.length; i++) {
          arrayStatut[i] = {
            name: myResponse[i].replace('<li>', '')
          };
        }
        res.json(arrayStatut);
      } else {
        res.json(arrayStatut);
      }
    });
  },

  getTypes: function(res) {
    var arrayType = [];
    request(this.remote_access_type, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var myResponse = body.split('</li>');
        for (var i = 0; i < myResponse.length; i++) {
          arrayType[i] = {
            name: myResponse[i].replace('<li>', '')
          };
        }
        res.json(arrayType);
      } else {
        res.json(arrayType);
      }
    });
  },

  expandable: function(req, res, myUri) {
    var myJocker = req.query.jocker;
    request(myUri, function(error, response, body) {
      var arrayEtablissement = [];

      // Handle error
      if (error || response.statusCode !== 200) {
        res.json(error);
        return;
      }

      // Entourer le resultat d'une balise ouvrante et fermante pour parser en JSON
      var xml = `<resultat>${body}</resultat>`;

      // Parse XML => JSON (plus userfriendly)
      xml2js.parseString(xml, function (err, result) {

        // Pour chaque etablissement, ajouter les valeur dans le tableau "arrayEtablissement"
        result.resultat.etablissement.forEach(function (etablissement) {
          arrayEtablissement.push({
            id: etablissement.UAI[0],
            typeEtab: etablissement.type[0],
            name: etablissement.nom[0],
            sigle: etablissement.sigle[0],
            statutEtab: etablissement.statut[0],
            tutelle: etablissement.tutelle[0],
            universite: etablissement.universite[0],
            adresseEtab: etablissement.adresse[0],
            cp: etablissement.cp[0],
            commune: etablissement.commune[0],
            academie: etablissement.academie[0],
            region: etablissement.region[0],
            longitude: etablissement.longitude_X[0],
            latitude: etablissement.latitude_Y[0],
            lien: etablissement.lien[0]
          });
        });
      });
      // Retourner le résultat
      res.json(arrayEtablissement);
    });
  },

  getEtablissementParRegion: function getEtablissementParRegion(res) {

    // Envoie de la requête à la baseX
    request(this.remote_access_establissement_par_region, function(error, response, body) {

      // Handle error
      if (error || response.statusCode !== 200) {
        return res.json(error);
      }

      var resultJson = [];

      // Parse XML to JSON
      xml2js.parseString(body, function(err, result) {

        // Pour chaque item mettre le résultat dans "resultJson"
        result.result.item.forEach(function(item) {
          resultJson.push({
            "key": item.split("/")[0],
            "value": parseFloat(item.split("/")[1])
          });
        })

        // Retourner le résultat
        res.json(resultJson);
      });
    });
  },

  getEtablissementParAcademie: function getEtablissementParAcademie(res) {

    // Envoie de la requête à la baseX
    request(this.remote_access_establissement_par_academie, function(error, response, body) {

      // Handle error
      if (error || response.statusCode !== 200) {
        return res.json(error);
      }

      var resultJson = [];

      // Parse XML to JSON
      xml2js.parseString(body, function(err, result) {

        // Pour chaque item mettre le résultat dans "resultJson"
        result.result.item.forEach(function(item) {
          resultJson.push({
            "key": item.split("/")[0],
            "value": parseFloat(item.split("/")[1])
          });
        })

        // Retourner le résultat
        res.json(resultJson);
      });
    });
  },

  getStatutParRegion: function getStatutParRegion(req, res, myUri) {

    request(myUri, function(error, response, body) {
      // Handle error
      if (error || response.statusCode !== 200) {
        return res.json(error);
      }

      var resultJson = [];

      // Parse XML to JSON
      xml2js.parseString(body, function(err, result) {

        // Pour chaque item mettre le résultat dans "resultJson"
        result.result.item.forEach(function(item) {
          resultJson.push({
            "key": item.split("/")[0],
            "value": parseFloat(item.split("/")[1])
          });
        })

        // Retourner le résultat
        res.json(resultJson);
      });
    });
  },

  getRchUai: function getRchUai(req, res, myUri) {

    console.log(myUri);
    request(myUri, function(error, response, body) {
      // Handle error
      if (error || response.statusCode !== 200) {
        return res.json(error);
      }

      var resultJson = [];

      // Parse XML to JSON
      xml2js.parseString(body, function(err, result) {
        console.log(result.result.item[0].etablissement[0].universite);
        // Retourner le résultat
        res.json(result.result.item[0].etablissement[0]);
      });
    });
  },

};

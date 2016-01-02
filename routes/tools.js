/**
 * Created by michel on 21/12/2015.
 */
'use strict';

var request = require('request');
var http = require('http');
var xml2js = require('xml2js');

module.exports = {

  remote_acces_region: 'http://localhost:8984/region',
  remote_access_tutelle: 'http://localhost:8984/tutelle',
  remote_access_academie: 'http://localhost:8984/academie',
  remote_access_sigle: 'http://localhost:8984/sigle',
  remote_access_universite: 'http://localhost:8984/universite',
  remote_access_statut: 'http://localhost:8984/statut',
  remote_access_type: 'http://localhost:8984/type',
  remote_access_before_event: 'http://localhost:8984/expandable?requete=',
  remote_access_establissement_par_region: 'http://localhost:8984/nbEtablRegion',

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
            "region": item.split("/")[0],
            "nb": parseFloat(item.split("/")[1])
          });
        })

        // Retourner le résultat
        res.json(resultJson);
      });
    });
  }
};

/**
 * Created by michel on 22/12/2015.
 */
var express = require('express');
var path = require('path');
var tools = require(path.join(__dirname, 'tools'));
var router = express.Router();
var config = require('config');


/* Controller for useful requests. */
router.get('/region', function(req, res, next) {
  tools.getRegion(res);
});

/*
   url pour recuperer les tutelles
*/
router.get('/tutelle', function(req, res, next) {
  tools.getTutelle(res);
});

/*
   url pour récupérer les academies
 */
router.get('/academie', function(req, res, next) {
  tools.getAcademie(res);
});

router.get('/sigle', function(req, res, next) {
  tools.getSigles(res);
});

router.get('/universite', function(req, res, next) {
  tools.getUniversite(res);
});

router.get('/statut', function(req, res, next) {
  tools.getStatuts(res);
});

router.get('/type', function(req, res, next) {
  tools.getTypes(res);
});

router.get('/expandEtablissement', function(req, res, next) {
  var myUri = req.originalUrl.replace("/controller/expandEtablissement?jocker=", `${config.client}/expandable?requete=`);
  // console.log("uri " + myUri);

  tools.expandable(req, res, myUri);
});

router.get('/etablissementParRegion', function(req, res, next) {
  tools.getEtablissementParRegion(res);
});

router.get('/etablissementParAcademie', function(req, res, next) {
  tools.getEtablissementParAcademie(res);
});

router.get('/statutParRegion', function(req, res, next) {
  // console.log(decodeURI(req.query.region));
  var region = encodeURI(req.query.region.trim());
  var myUri = `${config.client}/statutParRegion?region=${region}`
  // console.log("uri " + myUri);

  tools.getStatutParRegion(req, res, myUri);
});

module.exports = router;

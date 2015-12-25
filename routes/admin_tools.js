/**
 * Created by michel on 22/12/2015.
 */
var express = require('express');
var path = require('path');
var tools = require(path.join(__dirname, 'tools'));
var router = express.Router();


/* Controller for useful requests. */
router.get('/region', function(req, res, next)
{
    tools.getRegion(res);
});

router.get('/tutelle', function(req, res, next)
{
    tools.getTutelle(res);
});

router.get('/academie', function(req, res, next)
{
    tools.getAcademie(res);
});

router.get('/sigle', function(req, res, next)
{
    tools.getSigles(res);
});

router.get('/universite', function(req, res, next)
{
    tools.getUniversite(res);
});

router.get('/statut', function(req, res, next)
{
    tools.getStatuts(res);
});

router.get('/type', function(req, res, next)
{
    tools.getTypes(res);
});

router.get('/expandEtablissement', function(req, res, next)
{
    var myUri =req.originalUrl.replace("/controller/expandEtablissement?jocker=", "http://localhost:8984/expandable?requete=");
    console.log("uri " +myUri);

    tools.expandable(req, res, myUri);
});

module.exports = router;

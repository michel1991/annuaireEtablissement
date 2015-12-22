/**
 * Created by michel on 21/12/2015.
 */
var request = require('request');
module.exports =
{
    remote_acces_region:'http://localhost:8984/region',
    remote_access_tutelle:'http://localhost:8984/tutelle',
    remote_access_academie:'http://localhost:8984/academie',
    remote_access_sigle:'http://localhost:8984/sigle',
    remote_access_universite:'http://localhost:8984/universite',
    remote_access_statut:'http://localhost:8984/statut',
    remote_access_type:'http://localhost:8984/type',
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
    }
};



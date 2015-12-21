/**
 * Created by michel on 21/12/2015.
 */
var request = require('request');
module.exports =
{
    remote_acces:'http://localhost:8984/region',
    getRegion: function (res)
    {
        var arrayRegion = [];
        request(this.remote_acces, function (error, response, body)
        {
            if (!error && response.statusCode == 200)
            {
                var myResponse = body.split('</li>');
                console.log(typeof body + ' ' + myResponse.length);
                for(var i =0; i<myResponse.length; i++) {
                    arrayRegion[i] = {
                        name: myResponse[i].replace('<li>', '')
                    };
                    //console.log(myResponse[i]);
                    //arrayRegion[i]= myResponse[i].replace('<li>', '');
                }
                res.json(arrayRegion);
            }
        });
    },
    getTutelle: function () {
        // whatever
    }
};



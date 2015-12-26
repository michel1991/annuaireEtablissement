/**
 * Created by michel on 26/12/2015.
 */


function initComponent()
{

}

function modifyData(data)
{
    var smallArray =[];
    for(var i =0; i<data.length; i++)
    {
        smallArray.push({
            id:i,
            name:data[i].id
        });
    }
    return smallArray;
}


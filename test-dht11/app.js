var azure = require('azure-storage');
var uuid = require('node-uuid');
var GetTemp = require('./getTemp.js');
var gt = new GetTemp();

var tableSvc = azure.createTableService('sensorydata', 'vgxlMPTNh8vDGpufbFKac/JZynYRVAwmo3IvidGElyaU58h340WgpDboteAWSWXtzZLOMeDbZ0Y9FRKdJYau6w==');

gt.logTemp();

gt.on('driverloaded', function() {
    console.log('driver loaded');
});

gt.on('error', function(err) {
    console.log('ERROR', err);
});

gt.on('init', function() {
    tableSvc.createTableIfNotExists('temperature', function(error, result, response) {
        if (!error) {
            console.log('The table temperatur was created or it already exists');
        } else {
            console.log('Bloody hell!', error);
        }
    });
});

gt.on('tempstamp', function(data) {
        var entGen = azure.TableUtilities.entityGenerator;
        var item = {
            PartitionKey: entGen.String('10-000800e45c44'),
            RowKey: entGen.String(uuid.v4()),
            temp: entGen.Double(data.temp),
            time: entGen.String(data.time)
        };
        console.log('item', item);
        tableSvc.insertEntity('temperature', item, function(error, result, response) {
            if (!error) {
                console.log('Fucking hell!', error);
            }
            if(result){
                console.log('Result:', result);
            }
            if(response){
                console.log('Response', response);
            }
            console.log(data);
        });
});
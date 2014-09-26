var azure = require('azure-storage');
var uuid = require('node-uuid');
var clc = require('cli-color');

var tableSvc = azure.createTableService('sensorydata', 'vgxlMPTNh8vDGpufbFKac/JZynYRVAwmo3IvidGElyaU58h340WgpDboteAWSWXtzZLOMeDbZ0Y9FRKdJYau6w==');

var init = function(table, cb) {
    tableSvc.createTableIfNotExists(table, function(error, result, response) {
        if (!error) {
            console.log(clc.green('The table temperatur was created or it already exists'));
            cb();
        } else {
            console.log(clc.red('Bloody hell!', error));
        }
    });
};

var save = function(table, sensorId, data) {
    var entGen = azure.TableUtilities.entityGenerator;
    var item = {
        PartitionKey: entGen.String(sensorId),
        RowKey: entGen.String(data.RowKey),
        temp: entGen.Double(data.temp),
        //time: entGen.String(data.time)
    };
    tableSvc.insertEntity(table, item, function(error, result, response) {
        if (error) {
            console.log(clc.red('Fucking hell! ', error));
        }
    });
};

exports.init = init;
exports.save = save;

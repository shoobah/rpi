var file = require('./sensorydata_temperature.json');
var moment = require('moment');
var Storage = require('./data.js');

var tableName = 'temp';

var writeSameLine = function(str) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(str);
};

Storage.init(tableName, function() {
    file.Entities.forEach(function(item) {
        var stamp = moment(item.time).format('YYYY-MM-DD HH:mm:ss');
        var newItem = {
            "RowKey": stamp,
            "temp": item.temp,
        };
        writeSameLine(stamp);
        Storage.save(tableName, newItem);
    });
});

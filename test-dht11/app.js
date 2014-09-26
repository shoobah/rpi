var Storage = require('./data.js');
var GetTemp = require('./getTemp.js');

var sensor1 = '/sys/bus/w1/devices/10-000800e45c44/w1_slave';
var sensor2 = '/sys/bus/w1/devices/10-00080113bb02/w1_slave';

var sensorList = [{
    id: '10-000800e45c44',
    name: 'inne',
    last: 0
}, {
    id: '10-00080113bb02',
    name: 'ute',
    last: 0
}];
var Gt = new GetTemp(sensorList);

Gt.on('driverloaded', function() {
    console.log('driver loaded');
});

Gt.on('error', function(err) {
    console.log('ERROR', err);
});

Gt.on('tempstamp', function(data) {
    Storage.save('temp', data.sensorName, data);
    console.log('Saved data: ', data);
});

Storage.init('temp', function() {
    Gt.logTemp();
});

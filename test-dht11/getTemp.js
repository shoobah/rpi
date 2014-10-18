var util = require('util');
var EventEmitter = require('events').EventEmitter;
var sensor = require('ds18x20');
var moment = require('moment');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var clc = require('cli-color');

var lastTemp;

function puts(error, stdout, stderr) {
    sys.puts(stdout);
}

var sensorList = [];

function GetTemp(sensors) {
    console.log(clc.cyan('GetTemp ctor'));
    sensorList = sensors;
    EventEmitter.call(this);
    exec("sudo modprobe w1-gpio", puts);
    exec("sudo modprobe w1-therm", puts);
    console.log(clc.green('Init, done'));
}

util.inherits(GetTemp, EventEmitter);

GetTemp.prototype.readSensor = function(sensor) {
    var self = this;
    var sensorFileName = '/sys/bus/w1/devices/' + sensor.id + '/w1_slave';
    fs.readFile(sensorFileName, 'utf-8', function(err, data) {
        if (err) {
            self.emit('error', err);
        }
        var myregexp = /t=([M]{0,1})([\d]*)/i;
        var match = myregexp.exec(data);
        if (match !== null) {
            possibleM = match[1];
            tmp = parseFloat(match[2]);
            if (possibleM === 'M') {
                tmp = tmp * -1;
            }
            var t = 500 * Math.round(parseFloat(tmp) / 500) / 1000;
            var currentTime = Date();
            self.emit('tempstamp', {
                'sensorName': sensor.name,
                'RowKey': moment(currentTime).format('YYYY-MM-DD HH:mm:ss.S'),
                'temp': t
            });
            sensor.last = t;
        }
    });
};

GetTemp.prototype.logTemp = function() {
    var self = this;
    setInterval(function() {
        sensorList.forEach(function(sensor) {
            self.readSensor(sensor);
        });
    }, 10000);
};

module.exports = GetTemp;

//   --Gul
//  /
//D ---Koppar
//  \
//   --Grön
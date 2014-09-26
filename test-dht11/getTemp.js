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
    lastTemp = 0;
    console.log(clc.green('Init, done'));
}

util.inherits(GetTemp, EventEmitter);

GetTemp.prototype.readSensor = function(sensor) {
    var self=this;
    var sensorFileName = '/sys/bus/w1/devices/' + sensor.id + '/w1_slave';
    fs.readFile(sensorFileName, 'utf-8', function(err, data) {
        if (err) {
            self.emit('error', err);
        }
        var temp = data.match(/t=([\d]*)/)[1];
        var t = 500 * Math.round(parseFloat(temp) / 500) / 1000;
        var currentTime = Date();
        if (sensor.last !== t) {
            self.emit('tempstamp', {
                'sensorName': sensor.name,
                'RowKey': moment(currentTime).format('YYYY-MM-DD HH:mm:ss.S'),
                'temp': t
            });
        }
        sensor.last = t;
    });
};

GetTemp.prototype.logTemp = function() {
    var self=this;
    setInterval(function() {
        sensorList.forEach(function(sensor) {
            self.readSensor(sensor);
        });
    }, 1000);
};

module.exports = GetTemp;

//   --Gul
//  /
//D ---Koppar
//  \
//   --Grön

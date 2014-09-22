var util = require('util');
var EventEmitter = require('events').EventEmitter;
var sensor = require('ds18x20');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var lastTemp;

function puts(error, stdout, stderr) {
    sys.puts(stdout);
}

function GetTemp() {
    EventEmitter.call(this);
    exec("sudo modprobe w1-gpio", puts);
    exec("sudo modprobe w1-therm", puts);
    lastTemp = 0;
}

util.inherits(GetTemp, EventEmitter);

GetTemp.prototype.logTemp = function() {
    var self = this;
    setInterval(function() {
        fs.readFile('/sys/bus/w1/devices/10-000800e45c44/w1_slave', 'utf-8', function(err, data) {
            if (err) {
                self.emit('error',err);
            }
            var temp = data.match(/t=([\d]*)/)[1];
            var t = parseFloat(temp) / 1000;
            var currentTime = Date();
            if (lastTemp !== t) {
                self.emit('tempstamp', {
                    'time': currentTime,
                    'temp': t
                });
            }
            lastTemp = t;
        });
    }, 1000);
};

module.exports = GetTemp;

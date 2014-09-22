var GetTemp = require('./getTemp.js');
var gt = new GetTemp();

gt.logTemp();

gt.on('driverloaded', function() {
    console.log('driver loaded');
});

gt.on('error', function(err) {
    console.log('ERROR', err);
});

gt.on('tempstamp', function(data) {
    console.log(data);
});

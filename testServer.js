var app = require('express')(),
    http = require('http').Server(app),
    fs = require('fs'),
    io = require('socket.io')(http);

app.get('/',function(req, res) {
    res.sendfile(__dirname+'/testNoTableSVG.html');
});
http.listen(3000, function(){
    console.log('listening on *:3000');
});

var options = {logFile: __dirname+'/data.txt',endOfLineChar: require('os').EOL};
var fileSize = fs.statSync(options.logFile).size;
var fsTimeout
fs.watch(options.logFile, function (current,previous) {
    if (current.mtime <= previous.mtime) { return; }
    var newFileSize = fs.statSync(options.logFile).size;
    var sizeDiff = newFileSize - fileSize;
    if (sizeDiff < 0) {
        fileSize = 0;
        sizeDiff = newFileSize;
    }
    var buffer = new Buffer(sizeDiff);
    var fileDescriptor = fs.openSync(options.logFile, 'r');
    fs.readSync(fileDescriptor, buffer, 0, sizeDiff, fileSize);
    fs.closeSync(fileDescriptor);
    fileSize = newFileSize;
    parseBuffer(buffer);
});
function parseBuffer(buffer) { 
    var threatRegex = /\n?([A-Za-z\s]+)\|/;
    var latRegex = /\|(-?\d+\.\d+),/;
    var lonRegex = /,(-?\d+\.\d+)/;
    buffer.toString().split(options.endOfLineChar).forEach(function(line){
        if(line.includes("|") && line.includes(",")){
            console.log(line);
            var thr = line.match(threatRegex)[1];
            var lat = line.match(latRegex)[1];
            var lng = line.match(lonRegex)[1];
            var jsonObj = {"threat":thr,"latitude":lat,"longitude":lng};
            io.sockets.volatile.emit('threatObj',jsonObj);
        }
    });
};

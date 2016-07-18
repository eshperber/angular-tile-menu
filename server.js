var connect = require('connect'),
    serveStatic = require('serve-static');

var app = connect();

app.use(serveStatic(__dirname + '/demo'));
app.listen(5000, function(){
	console.log('listenign on port 5000')

});
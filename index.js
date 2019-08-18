var http=require('http');
var https=require('https');
var url=require('url');
var fs=require('fs');
var StringDecoder=require('string_decoder').StringDecoder;
var config=require('./config');

console.log("Hello World!!");

var httpServer=http.createServer(function(req,res){
    unifiedServer(req, res);   
});

httpServer.listen(config.httpPort,function(){
    console.log("Server is up at port "+config.httpPort+" in mode:"+config.envName);
});

//setup cert for SSL
var httpsServerOptions={
    'key':fs.readFileSync('./ssl/key.pem'),
    'cert':fs.readFileSync('./ssl/cert.pem')
};

var httpsServer=https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req, res);    
});

httpsServer.listen(config.httpsPort,function(){
    console.log("Server is up at port "+config.httpsPort+" in mode:"+config.envName);
});

//define handlers
var handlers = {};

//sample handler
handlers.sample=function(data,callback) {
    //callback http status code and payload as object
    console.log("Query::"+JSON.stringify(data.query)+"\nHeaders:"+JSON.stringify(data.headers)+"\n")
    console.log("Payload::\n"+data.payload);
    callback(200,data);
};

//return 200
handlers.ping=function(data,callback) {
    //callback http status code and payload as object
    callback(200,{'state':'alive'});
};

//not found handler
handlers.notfound=function (data,callback) {
    callback(404,{'message':'not found'});
};

//route handler
var router = {
    'sample':handlers.sample,
    'ping':handlers.ping
};

function unifiedServer(req, res) {
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var method = req.method;
    var queryString = parsedUrl.query;
    var headers = req.headers;
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    
    //Get data from request and add to buffer
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });

    //On end of stream return back response.
    req.on('end', function () {
        buffer += decoder.end();
        
        //Routing based on path
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notfound;
        var data = {
            'path': trimmedPath,
            'query': queryString,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        //calling controller
        chosenHandler(data, function (statusCode, payload) {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : {};
            var payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
}

var http=require('http');
var url=require('url');
var StringDecoder=require('string_decoder').StringDecoder;

console.log("Hello World!!");

var server=http.createServer(function(req,res){

    var parsedUrl=url.parse(req.url,true);
    var path=parsedUrl.pathname;
    var trimmedPath=path.replace(/^\/+|\/+$/g,'');
    var method=req.method;
    var queryString=parsedUrl.query;
    var headers=req.headers;

    var decoder=new StringDecoder('utf-8');
    

    console.log("Query::"+queryString+" Headers:"+headers+"\n")
    res.end("Method::"+method+" URL::"+trimmedPath);
});

server.listen(3000,function(){
    console.log("Server is up at port 3000");
})
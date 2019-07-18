var PORT = 8089;//监听的端口
 
var http = require('http');
var url=require('url');
var fs=require('fs');
var help=require('./help').types;//
var path=require('path');
 
var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    if (pathname.indexOf('/ui/') !== -1) {
        var realPath = path.join(pathname.slice(1));
    } else {
        realPath = path.join("product", pathname); 
    }
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
 
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = help[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");
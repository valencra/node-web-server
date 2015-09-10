//simple server that can serve any html file within the directory

//required modules
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

//MIME types
var mimeTypes = {
  'html' : 'text/html',
  'js' : 'text/javascript',
  'css' : 'text/css',
  'jpeg' : 'image/jpeg',
  'jpg' : 'image/jpg',
  'png' : 'image/png'
};

//create server
http.createServer(function(request, response){
  //get relative path
  var uri = url.parse(request.url).pathname;
  //get full path
  var filePath = path.join(process.cwd(), unescape(uri));
  console.log('Loading ' + uri);
  var stats;
  //check if the filepath exists
  try{
    stats = fs.lstatSync(filePath);
  }
  //send error message if not found
  catch(error){
    //error response
    response.writeHead(404, {'Content-type': 'text/plain'});
    response.write('404 Not Found\n');
    response.end();
    return;
  }
  //if file
  if(stats.isFile()){
    //get MIME type
    var mimeType = mimeTypes[path.extname(filePath).split('.').reverse()[0]];
    //okay response
    response.writeHead(200, {'Content-type': mimeType});
    //create file stream
    var fileStream = fs.createReadStream(filePath);
    fileStream.pipe(response);
  }
  //if directory
  else if(stats.isDirectory()){
    //redirect response
    response.writeHead(302, {
      'Location': 'index.html'
    });
    response.end();
  }
  // if neither a file or directory
  else{
    //internal error response
    response.writeHead(500, {'Content-type': 'text/plain'});
    response.write('500 Internal Error\n');
    response.end();
  }
// specify port to listen to
}).listen(3000);

function download(fileUrl, apiPath, callback) {
        var url = require('url'),
            http = require('http'),
            p = url.parse(fileUrl),           
            timeout = 10000; 
        
        var file = fs.createWriteStream(apiPath);
        
        /*var timeout_wrapper = function( req ) {
            return function() {
                console.log('abort');
                req.abort();
                callback("File transfer timeout!");
            };
        };*/
        
     
        console.log('before');
    
        var request = http.get(fileUrl).on('response', function(res) { 
            console.log('in cb');           
            var len = parseInt(res.headers['content-length'], 10);
            var downloaded = 0;
            
            res.on('data', function(chunk) {
                file.write(chunk);
                downloaded += chunk.length;
                console.log("Downloading " + (100.0 * downloaded / len).toFixed(2) + "% " + downloaded + " bytes");
				
                // reset timeout
                clearTimeout( timeoutId );
                timeoutId = setTimeout( fn, timeout );
            }).on('end', function () {
                // clear timeout
                clearTimeout( timeoutId );
                file.end();
                console.log('Downloaded to: ' + apiPath);
                callback(null);
            }).on('error', function (err) {
                // clear timeout
                console.log(file);
				fs.close(file);
				fs.unlinkSync(file);
            });           
        });
        
        

       
    }
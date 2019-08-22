const readdirp = require('readdirp');
const fs = require('fs');
const path = require('path');

var deps = [];
var found = '';

fs.readFile('./package.json', 'utf8', function(err, contents) {
    var obj = JSON.parse(contents);
    Object.keys(obj.dependencies).forEach(function(e) {
        deps.push(e);
    });
});


readdirp({
        root: __dirname.split(path.sep).pop(),
        fileFilter: 'package.json',
        depth: 3
    })
    .on('data', (entry) => {
        var str_sub = entry.parentDir.substr(entry.parentDir.lastIndexOf("\/") + 1);
        console.log(deps);
        deps.forEach(function(el) {
            var fcopy = '';
            if (el.indexOf(str_sub) > -1) {
                fs.readFile(entry.fullPath, 'utf8', function(err, contents) {
                    var obj = JSON.parse(contents);
                    // if we have a main file specified
                    if (obj.main !== undefined && obj.main.indexOf("\/") < 1) {
                        // if only the file is specified as a path
                        if (entry.parentDir != '') {
                            fcopy = entry.parentDir + '/' + obj.main;
                        } else {
                            // get only the file
                            fcopy = obj.main;
                        }
                        // get the file
                        var isFile = fs.statSync(fcopy);
                        // if it is not Grunt and is a file
                        if (fcopy != 'Gruntfile.js' && isFile.isFile()) {
                            fs.copyFileSync(fcopy, './wp-content/themes/gulo-theme/js/' + obj.main, (err) => {
                                console.log('The file' + fcopy + 'has been copied successfully');
                            });
                        }
                    } else {
                        if (obj.main === undefined) {
                            // continue
                        } else {
                            // get the nested file
                            var nestedFile = entry.parentDir.substr(entry.parentDir.lastIndexOf("\/") + 1);

                            if (path.extname(nestedFile) == '.js' && obj.name != '') {
                                console.log("This is the nested file" + nestedFile);
                                fs.copyFileSync(nestedFile, './wp-content/themes/twentyseven5teen/js/' + nestedFile, (err) => {
                                    console.log('The file' + fcopy + 'has been copied successfully');
                                });
                            }
                        }
                    }
                });
            }
        });
    });

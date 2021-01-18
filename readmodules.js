#!/usr/bin/env node

const readdirp = require('readdirp');
const fs = require('fs');
const path = require('path');

let deps = [];
let obj = {};
let target_obj = nested_file = '';
let project_deps = __dirname + '/package.json';

fs.readFile(project_deps, (err, data) => {
    if (err) throw err;
    obj = JSON.parse(data);
    Object.keys(obj.dependencies).forEach(function(e) {
        deps.push(e);
    });

    let curdir = __dirname.split(path.sep).pop().toString();

    readdirp(__dirname, {
        fileFilter: 'package.json',
        depth: 3
    }).on('data', (entry) => {
        if (entry.path !== undefined) {
            if (entry.path.split('/').slice(-2)[0] !== 'undefined') {
                var str_sub = entry.path.split('/').slice(-2)[0];
            }
        }

        if (deps.includes(str_sub)) {
            var fcopy = '';
            fs.readFile(entry.fullPath, (err, data) => {
                if (typeof data !== 'undefined') {
                    target_obj = JSON.parse(data);
                }

                // if we have a main file specified
                if (typeof target_obj.main !== 'undefined') {
                    fcopy = __dirname + '/node_modules/' + str_sub + '/' + target_obj.main;

                    // check if main includes parent dir and get just the file name
                    if (fcopy.includes('/')) {
                        var filename = target_obj.main.split('/').slice(-1)[0];
                    } else {
                        var filename = target_obj.main;
                    }

                    // check if file exists
                    if (fs.statSync(fcopy) !== 'undefined') {
                        var isFile = fs.statSync(fcopy);
                    }

                    // copy file
                    if (typeof fcopy !== 'undefined') {
			            const destination = __dirname + '/wp-content/themes/' + curdir + '/js/' + filename; 
                        fs.copyFile(fcopy, destination, (err) => {
                            console.log('The file ' + fcopy + ' has been copied successfully');
                        });
                    }

                    //get jquery.min.js
                    if (filename.includes('jquery.js') ) {
                        target_obj.main = 'dist/jquery.min.js';
                        filename = 'jquery.min.js';
                        fcopy = __dirname + '/node_modules/' + str_sub + '/' + target_obj.main;
                        fs.copyFile(fcopy, __dirname + '/wp-content/themes/' + curdir + '/js/' + filename, (err) => {
                            console.log('The file ' + fcopy + ' has been copied successfully');
                        });
                    }
                }
            });
        }
    });
});


var path = require('path');
var cp = require('child_process');
var fs = require('fs');

var binName = process.platform === 'win32' ? 'gifsicle.exe' : 'luo';
var binPath = path.resolve(__dirname, binName);

var splitGif = function(gifSrcPath, callBack) {
    var prefixPath = path.resolve(__dirname, 'tmp');
    var list = fs.readdirSync(prefixPath);
    var i;

    try {
        if(list.length != 0){
            for(i=0; i<list.length; i++){
                var name = path.join(prefixPath, list[i]);
                fs.unlinkSync(name);
            }
        }
    }
    catch(e) {
        callBack(e);
        return;
    }

    try {
        cp.execFileSync(binPath, ["--unoptimize", "-w", "--explode", gifSrcPath, '-o', path.join(prefixPath, 'out')]);
    }
    catch(e) {
        //callBack(e);
    }
    finally {
        list = fs.readdirSync(prefixPath);
        if (list.length == 0){
            callBack(new Error('split gif failed!'));
            return;
        }
        list.sort();
        var pathList = [];
        for(i=0; i<list.length; i++){
            pathList.push(path.resolve(prefixPath, list[i]));
        }
        callBack(null, pathList);
    }
}

module.exports = splitGif;

if (require.main === module) {
    var filename = path.resolve(__dirname, 'a.gif');
    splitGif(filename, function(e, list) { 
        if(e) {
            console.log(e.message); 
            console.log(e, '--*---99')
        }
        else {
            console.log(list);
        }
    });
}

var fs = require("fs");
var myUtils = require("./utils");
const spawn = require('child_process').spawn;

// Process Env Vars
var gitURL = process.env["GIT_URL"];
var targetDir = process.env["TARGET_DIR"];
var ssh_key_path = process.env["SSH_KEY_PATH"] || "~/.ssh/id_rsa";
var ssh_key_data = process.env["SSH_KEY_DATA"] || null;

if (!gitURL) {
    console.error("You have to specify a GIT_URL environment variable to 'pull' from.")
}

if (!targetDir) {
    console.error("You have to give a targeted directory to pull to...")
}


// Checkout via git to your location of choice.


var clone = function () {
    const git = spawn('git', ['clone', gitURL, targetDir]);
    git.stdout.on('data', function (data) {
        var output = data.toString("ascii")
        console.log(output);
    })
    git.stderr.on('data', function (data) {
        var output = data.toString("ascii")

        if (output.indexOf("fatal: destination path '" + targetDir + "' already exists and is not an empty directory") != -1) {
            // cleanup();
            return false
        }
        if (output.indexOf("Cloning into '" + targetDir + "'...")) {
            console.log("success");
        }
    })
    git.on('exit', function (code) {
        console.log(code);
    })
}

var pull = function () {
    const git = spawn('git', ['pull'], {cwd: targetDir});

    git.stdout.on('data', function (data) {
        var output = data.toString("ascii")
        console.log(output)
    })
    git.stderr.on('data', function (data) {
        var output = data.toString("ascii")
        console.error(output);
    })
    git.on('exit', function (code) {
        // console.log(code);
    })

    setTimeout(pull, 5000);
}

var cleanup = function () {
    myUtils.deleteFolderRecursive(targetDir);
}
var t = fs.statSync(targetDir)
if (t.isDirectory()) {
    console.log("Repo already cloned... no need to clone again... starting pull worker")
    // TODO: Pull
    pull();
} else {
    console.log("Repo needs cloning... stand by...")
    clone();
}

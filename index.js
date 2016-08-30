var fs = require("fs");
// var myUtils = require("./utils");
// const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
// var NodeGit = require("nodegit");

// Process Env Vars
var gitURL = process.env["GIT_URL"];
var targetDir = process.env["TARGET_DIR"];
var ssh_key_path = process.env["SSH_KEY_PATH"] || "/root/.ssh/id_rsa";
var ssh_key_data = process.env["SSH_KEY_DATA"] || null;

if (!gitURL) {
    console.error("You have to specify a GIT_URL environment variable to 'pull' from.")
}

if (!targetDir) {
    console.error("You have to give a targeted directory to pull to...")
}

// Process ssh key if needed

if (ssh_key_data) {
    // fs.mkdirSync("/root/.ssh")
    exec("mkdir -p /root/.ssh");
    const buf = Buffer.from(ssh_key_data, "base64")
    fs.writeFileSync(ssh_key_path, buf);
    fs.chmodSync(ssh_key_path, 0600);
    exec("ssh-keygen -y -f /root/.ssh/id_rsa > /root/.ssh/id_rsa.pub")
}
console.log("testing")
var gitSync = require('git-sync')

var cronJob = gitSync({
    remoteUrl: 'https://github.com/holodex/git-sync',
    localDir:  '/tmp/dir',
    branch: 'master',
    cronTime: '* */15 * * * *'
}, function (err, commit) {
    console.log(err, commit.id())
})

//
//
// var repository
//
// var pull = function () {
//     NodeGit.Repository.open(targetDir)
//         .then(function (repo) {
//             repository = repo;
//
//             return repository.fetchAll({
//                 callbacks: {
//                     credentials: function (url, userName) {
//                         // return NodeGit.Cred.sshKeyFromAgent(userName);
//                         return NodeGit.Cred.sshKeyNew(userName,"/root/.ssh/id_rsa.pub","/root/.ssh/id_rsa","")
//
//                     },
//                     certificateCheck: function () {
//                         return 1;
//                     }
//                 }
//             });
//         })
//         .done(function (t) {
//             console.log("Fetched the latest")
//             setTimeout(pull, 5000)
//         })
//
//
// }
//
// var clone = function () {
//     var cloneOptions = {};
//     cloneOptions.fetchOpts = {
//         callbacks: {
//             certificateCheck: function () {
//                 return 1;
//             },
//
//             credentials: function (gitURL, userName) {
//                 return NodeGit.Cred.sshKeyNew(userName,"/root/.ssh/id_rsa.pub","/root/.ssh/id_rsa","")
//             }
//         }
//     };
//
//     var cloneRepository = NodeGit.Clone(gitURL, targetDir, cloneOptions);
//     var errorAndAttemptOpen = function (t) {
//         console.log(t)
//         return NodeGit.Repository.open(targetDir);
//     };
//     cloneRepository.catch(errorAndAttemptOpen).then(function (repo) {
//         console.log("Initial")
//         pull();
//     })
// }
//
// clone()


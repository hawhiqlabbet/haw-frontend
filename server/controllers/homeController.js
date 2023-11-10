const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const secretKey = "MySecretKey";

let currCode = "";
let currHost = "";

function joinRoom(req, res, next) {
    const { code } = req.query;

    console.log("Current code: " + currCode);
    console.log("Current host: " + currHost);
    console.log(code);
    if (currCode === code) {
        res.json({ "success": "true" });
    }
    else {
        res.json({ "success": "false" });
    }
}

function hostRoom(req, res, next) {
    console.log("Someone is trying to host");
    if (currCode == "") {
        const code = crypto.randomBytes(2).toString('hex').toUpperCase();
        currCode = code;
        // Create a JWT token
        const token = jwt.sign({ code }, secretKey, { expiresIn: '1 hour' });
        // Send the JWT and code to the client
        res.json({ token, code });
        console.log(currCode);
    }
    else {
        res.json({ "token": "", "code": "" });
    }
}


module.exports = {
    joinRoom,
    hostRoom
};

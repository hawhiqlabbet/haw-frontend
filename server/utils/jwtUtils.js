const jwt = require('jsonwebtoken');


function extractUserIdFromJwt(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        return false;
    }
}

function extractUsernameFromJwt(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.username;
    } catch (error) {
        return false;
    }
}

module.exports = {
    extractUserIdFromJwt,
    extractUsernameFromJwt
}
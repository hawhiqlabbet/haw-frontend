const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cookie = require('cookie');

const secretKey = "MySecretKey";
const usernames = [];

function generateTokenAndSetCookie(res, username) {
    const code = crypto.randomBytes(2).toString('hex').toUpperCase();
    const token = jwt.sign({ code, username }, secretKey, { expiresIn: '1 day' });

    res.setHeader('Set-Cookie', cookie.serialize('jwt', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        secure: true
    }));

    return token;
}

function login(req, res, next) {

    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is missing in the query parameters' });
    }

    if (!usernames.includes(username)) {
        usernames.push(username);
        const token = generateTokenAndSetCookie(res, username);
        res
            .status(200)
            .json({ message: 'Successfully added username', token });
    } else {
        res
            .status(300)
            .json({ message: 'Username already taken' });
    }
}

function extractUsernameFromToken(req, res, next) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.jwt;

    console.log(token)


    if (token) {
        try {
            const decoded = jwt.verify(token, secretKey);

            return res
                .status(200)
                .json({ message: 'Successfull retrival of username', username: decoded.username });
        } catch (error) {
            return res.status(300)
                .json({ message: 'JWT verification error:', error });
        }
    }

    return res.status(300)
        .json({ message: 'Not authenticated' });
}


module.exports = {
    login,
    extractUsernameFromToken
};

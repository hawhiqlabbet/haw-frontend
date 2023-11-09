app.post('/join', (req, res, next) => {
    console.log("Current code: " + currCode);
    console.log("Current host: " + currHost);
    console.log(req.body.code);
    if (currCode === req.body.code) {
        res.json({ "success": "true" });
    }
    else {
        res.json({ "success": "false" });
    }
});

app.get('/host', (req, res) => {
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
});
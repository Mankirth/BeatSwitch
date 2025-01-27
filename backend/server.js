import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();

app.use(bodyParser.json({ limit: '128mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Your MySQL username
    password: '123456', // Your MySQL password
    database: 'beatswitch_app' // Your database name
});

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Insert data
app.post('/add', (req, res) => {
    const { titl, bod, user, imag, aud, arti, link } = req.body;
    console.log("request being sent " + titl + bod, + user, + imag + aud + arti + link);
    const query = 'INSERT INTO songs (title, description, user, image, audio, artist, link) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [titl, bod, user, imag, aud, arti, link], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Song added successfully');
    });
});

// Read data
app.get('/songs', (req, res) => {
    const query = 'SELECT * FROM songs';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/addmsg', (req, res) => {
    const { sender, topic, body, reciever, aud } = req.body;
    console.log("request being sent " + sender + topic + body + reciever + aud);
    const query = 'INSERT INTO messages (sender, topic, body, reciever, audio) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [sender, topic, body, reciever, aud], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Song added successfully');
    });
});

app.post('/adduser', (req, res) => {
    const { email, username, password } = req.body;
    console.log("request being sent " + email, username, password);
    const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    db.query(query, [email, username, password], (err) => {
        if (err) return res.status(500).send(err);
        res.send('user added successfully');
    });
});

app.get('/messages', (req, res) => {
    const query = 'SELECT * FROM messages';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
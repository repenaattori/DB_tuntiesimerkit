require('dotenv').config()
const mysql = require('mysql2/promise');
const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({dest: 'upload/'});

//Bcrypt
const bcrypt = require('bcrypt'); 

//Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});

const conf = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

app.post('/register', upload.none(), async (req, resp) =>{
    const fname = req.body.fname;
    const lname = req.body.lname;
    const uname = req.body.uname;
    let pw =req.body.pw;

    pw = await bcrypt.hash(pw, 12);

    const sql = 'INSERT INTO customer (first_name,last_name,username,pw) VALUES (?,?,?,?)';

    try {
        const con = await mysql.createConnection(conf);
        await con.execute(sql, [fname,lname,uname,pw])
        resp.end();
    } catch (error) {
        resp.status(500).send(error.message);
    }
})

app.post('/login', upload.none(), async (req,resp)=>{
    const uname = req.body.uname;
    const pw =req.body.pw;

    const sql = 'SELECT pw FROM customer WHERE username=?';

    try {
        const con = await mysql.createConnection(conf);
        const [rows] = await con.execute(sql, [uname]);

        if(rows.length === 0){
            resp.status(401).send('Username not found!')
        }else{
            const pwHash = rows[0].pw;
            const valid = await bcrypt.compare(pw, pwHash);

            if(valid){
                resp.status(200).send("Logged in!!!");
            }else{
                resp.status(401).send("Wrong password!!!");
            }
        }

    } catch (error) {
        resp.status(500).send(error.message);
    }

});
 


//Tukee sekä urlenecoded että multipart/form-data
//Tukee myös JSONia
app.get('/product', async (req,resp) =>{

    const id = req.query.id;
  
    const sql = 'SELECT * FROM product WHERE id=?';

    try {
       const con = await mysql.createConnection(conf);
       const [rows] = await con.execute(sql, [id]);
       resp.status(200).json(rows);

    } catch (error) {
        console.log(error);
        resp.status(500).send(error.message);
    }

});

//JSON-tauluko, jossa käyttäjiä esim. [{"fname" : "Reima", "age": 22}]
app.post('/users', (req,resp)=>{

    const users = req.body;

    for (user of users) {
        console.log(user.fname + " " + user.age);
    }

    resp.end();
});


app.post('/harj', (req,resp) =>{
    const games = req.body;

    for (g of games) {
        console.log(g.title);
    }

    resp.end();
});


app.post('/harj2', (req,resp) =>{
    const country = req.body[0];

    const fin = country.name.nativeName.fin.official;
    const swe = country.name.nativeName.swe.official;

    console.log(fin);
    console.log(swe);

    resp.end();
});


//Polkuparametrin käyttö (? viittaa, että optionaalinen)
app.get('/testi/:name?', (req, resp) =>{
    console.log(req.params.name);
    resp.end();
} );



app.get( '/', (req, resp) => {
    resp.send('REST root get is working');
});

app.get('/summa', (req, resp) => {
    const x = Number(req.query.x);
    const y = Number(req.query.y);

    resp.send('Summa on ' + (x+y));
});

app.get( '/user', (req, resp) => {

    const id = req.query.id;
 
    const users = [
        {fname: 'Reiska', lname: 'Riihimäki'},
        {fname: 'Lisa', lname: 'Simpson'},
        {fname: 'Timo', lname: 'Teus'},
    ];
    
    if(id){
        if(id < users.length){
            resp.status(200).json(users[id]);
        }else{
            resp.status(404).json({error: 'User with id ' + id + ' was not found'});
        }
    }
    else{
        //content-type: json
        resp.status(200).json(users);
    }
});

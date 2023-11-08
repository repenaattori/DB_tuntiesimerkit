const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({dest: 'upload/'});

//Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});

//Tukee sekä urlenecoded että multipart/form-data
//Tukee myös JSONia
app.post('/user', upload.none(), (req,resp) =>{

    const username = req.body.username;
    const pw = req.body.pw;

    const sql = `SELECT * FROM customer WHERE username='${username}'`;


    console.log(sql);

    resp.end(username);

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

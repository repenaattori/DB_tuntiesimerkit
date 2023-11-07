const express = require('express');
const app = express();

//Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});


app.post('/user', (req,resp) =>{

    const username = req.body.username;
    const pw = req.body.pw;

    resp.end(username);

});


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

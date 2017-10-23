const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const massive = require('massive');
require('dotenv').config()
const controller = require('./controllers/controller')

const auth = require('./middleware/authorization')
const createInitialSession = require('./middleware/session.js')

const app = express();

massive( process.env.CONNECTION_STRING).then( dbInstance => {
  app.set('db', dbInstance);
})

app.use( bodyParser.json() );
app.use( session({
  secret: 'kyle-token',
  resave: false,
  saveUninitialized: false,
  //cookie: {maxAge: 6000 }
}));

app.use( cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST','DELETE'],
  credentials: true
}) );




//Endpoints
app.post('/login', controller.login);
app.post('/createAccount', controller.createAccount);
app.post('/createProperty', controller.createProperty)
app.get('/logout', controller.logout);

//Displays properties if user is logged in
app.get('/content/' ,auth, controller.content);
app.get('/content/filter/:rent',auth, controller.contentFilter);

app.delete('/content/:Id', controller.deleteProperty);


const port = process.env.PORT || 3001
app.listen( port, () => {console.log(`Server is running on port ${port}`);});

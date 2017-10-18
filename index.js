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
app.use( cors() );
app.use( session({
  secret: 'ben-super-secret-token',
  resave: false,
  saveUninitialized: false,
  //cookie: {maxAge: 6000 }
}));

//Endpoints
app.post('/login', controller.login);
app.post('/createAccount', controller.createAccount);
app.post('/createProperty', controller.createProperty)
app.get('/logout', controller.logout);

//Displays properties if user is logged in
app.get('/content',auth, controller.content);
app.get('/content/filter/:rent',auth, controller.contentFilter);

app.delete('/content/:Id', controller.deleteProperty);


const port = process.env.PORT || 3000
app.listen( port, () => {console.log(`Yo Dawg, This server be trippin on port ${port}`);});

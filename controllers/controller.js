module.exports = {

/**
  Creates a new user account in the user table.
  If the username input is not unique, the user will be
  required to try agian with a unique username
*/

  createAccount: (req, res) =>{
    const dbInstance = req.app.get('db')
    let username = req.body.username;
    let password = req.body.password;
    let userrole = req.body.userrole;

/* Will check username data base for proposed user name, if the
   username does not already exist, the username and password will be added
  to the user table
*/
    dbInstance.check_unique({username})
      .then(response =>{
        if(response.length>0){
          res.status(500).send(`The username ${username} is already in use.`)
        }else{
          dbInstance.create_account({username, password, userrole})
            .then(response2 =>{
              res.status(200).send('Account has been created')
            })
          }
      })
  },

/*
  Inserts a new property into the Properties data base. Post request
  will push an object with all the parameters from the front-end wizard
*/
  createProperty: (req, res) =>{
    const dbInstance = req.app.get('db')
    let { property_name,
    property_description, address, city, state, zip,
    url, loan_amount, monthly_mortage, desired_rent } = req.body;
    let userid = req.session.userID;

    dbInstance.create_property({ userid, property_name,
    property_description, address, city, state, zip,
    url, loan_amount, monthly_mortage, desired_rent })
    .then(response => {
      res.status(200).send('Property has been added')
    })
    .catch(err => res.status(500).send(err))

  },

/*
  Login method, upon successful login, session.loggedIN Boolean
  will be set to true, allowing access to the content endpoint
*/
  login: (req, res) =>{
    const dbInstance = req.app.get('db')
    let username = req.body.username;
    let password = req.body.password;
    dbInstance.get_username({username, password})
      .then( user =>{
        if(user.length > 0){
          req.session.loggedIN = true;
          req.session.userID = user[0].userid
          res.status(200).send(`Welcome back ${username}`)
        }else{
          res.status(500).send('Incorrect username or password')
        }
      })

  },
/*
  Sets session.loggedIN to false, denying access to content endpoint
*/
  logout: (req, res) =>{
    req.session.destroy();
    res.status(200).send('logout success!');
  },

/*
  One of several content endpoints that will only be accessable if
  the session.loggedIN boolean is set to true
*/
  content: (req, res) => {
    const dbInstance = req.app.get('db')
    let userID = req.session.userID
    dbInstance.get_properties({userID})
      .then( response =>{
        res.status(200).send(response)
      })
  },

/*
  Similar to content call, content filter requires a desired_rent
  parameter to be passed in the GET call. It then uses that parameter
  in the SQL Query to sort properties by both UserID and desired_rent
*/
  contentFilter: (req, res) =>{
    const dbInstance = req.app.get('db')
    let userID = req.session.userID
    let desired_rent = req.params.rent

    dbInstance.get_properties_filtered({ userID, desired_rent })
      .then( response => {
        res.status(200).send(response)
      })
  },

  deleteProperty: (req, res) =>{
    const dbInstance = req.app.get('db')
    let propertyID = req.params.Id
    let userID = req.session.userID
    dbInstance.delete_property({propertyID})
      .then(response =>{
        dbInstance.get_properties({userID})
        .then(response2 =>{
          res.status(200).send(response2)
        })
      })
  }



};

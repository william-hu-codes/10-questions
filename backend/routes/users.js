//PATH STARTS WITH localhost:4000/users

///////////////////////////////
// DEPENDENCIES
////////////////////////////////

const express = require('express')
const router = express.Router()
const usersCtrl = require("../controllers/users")
const ensureLoggedIn = require('../config/ensureLoggedIn')

///////////////////////////////
// ROUTES
////////////////////////////////

// INDEX - GET
router.get('/', usersCtrl.index)

///////////////////////////////
// LOGIN
////////////////////////////////
router.post('/login', usersCtrl.login);


///////////////////////////////
// CHECK TOKEN
////////////////////////////////
router.get('/check-token', ensureLoggedIn, usersCtrl.checkToken);
// later, we will add ensureLoggedIn protection to other routes, both in users and cases


///////////////////////////////
// SHOW - DETAIL - GET
////////////////////////////////

router.get('/:userId', usersCtrl.show)

///////////////////////////////
// CREATE - POST
////////////////////////////////
router.post('/', usersCtrl.create)

///////////////////////////////
// DESTROY - DELETE 
////////////////////////////////
router.delete('/:userId', usersCtrl.delete)

///////////////////////////////
// UPDATE - PUT
////////////////////////////////
router.put('/:userId', usersCtrl.update)

// MISSING - NEW (rendering a template for creating a post)
// MISSING - EDIT (rendering a template for editing a speific post)


module.exports = router
// PATH STARTS WITH localhost:4000/cases 

///////////////////////////////
// DEPENDENCIES
////////////////////////////////

const express = require('express')
const router = express.Router()
const casesCtrl = require("../controllers/cases")
const ensureLoggedIn = require("../config/ensureAdmin")
const ensureAdmin = require('../config/ensureAdmin')


///////////////////////////////
// ROUTES
////////////////////////////////

// CASES INDEX ROUTE
router.get('/', casesCtrl.index)

///////////////////////////////
// SHOW - DETAIL - GET
////////////////////////////////
router.get('/:caseId', casesCtrl.show)

///////////////////////////////
// CREATE - POST
////////////////////////////////
router.post('/', casesCtrl.create)
router.post("/:caseId/response", casesCtrl.handleResponse)

///////////////////////////////
// OPEN-AI
////////////////////////////////
router.post("/:caseId/chat-open-ai", casesCtrl.chat)

///////////////////////////////
// DESTROY - DELETE 
////////////////////////////////
router.delete('/:caseId', ensureAdmin, casesCtrl.delete)

///////////////////////////////
// UPDATE - PUT
////////////////////////////////
router.put('/:caseId', casesCtrl.update)

// MISSING - NEW (rendering a template for creating a post)
// MISSING - EDIT (rendering a template for editing a speific post)

module.exports = router
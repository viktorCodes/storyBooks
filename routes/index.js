const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest} = require('../middleware/auth')
const Story = require('../models/story')


//@desc Login/Landing page
//Route GET /

router.get('/', ensureGuest, (request, response) => {
    response.render('login', {
        layout: 'login',
    })
})

//@desc Dashboard
//Route GET /dashboard

router.get('/dashboard', ensureAuth, async (request, response) => {

   try {
     const stories = await Story.find({user: request.user.id}).lean()

     response.render('dashboard', {
        name: request.user.firstName,
        stories,
    })
   } catch (err) {
    console.error(err)
    response.render('error/500')
   }

    
    
})




module.exports = router
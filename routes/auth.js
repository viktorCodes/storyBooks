
const express = require('express')
const passport = require('passport')
const router = express.Router()

//@desc Auth with Google
//Route GET /auth/google


router.get('/google', passport.authenticate('google', {scope: ['profile']}) )
    

//@desc Google Auth callback
//Route GET /auth/google/callback

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (request, response) =>{
    response.redirect('/dashboard')
})


//@desc Logout user
//Route  /auth/logout

/*router.get('/logout', (request, response) => {
    request.logout()
    response.redirect('/')
})
 */
router.get("/logout", function(request, response, next) {
    request.logout(function(err) {
      if (err) {
        return next(err);
      }
      response.redirect("/");
    });
  });





module.exports = router
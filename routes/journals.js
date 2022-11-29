const express = require('express')
const router = express.Router()
const { ensureAuth} = require('../middleware/auth')


let Journal = require('../models/journal')


//@desc Show Add page
//Route GET /journal/add

router.get('/add', ensureAuth, (request, response) => {
    response.render('journal/add')
})


//@desc Process add form
//Route  POST /journals

router.post('/', ensureAuth, async  (request, response) => {
    try {
        request.body.user = request.user.id
        await Journal.create(request.body)
        response.redirect('/dashboard')
    } catch (err) {
         console.error(err)
         response.render('error/500')
    }
})


//@desc Show All Journals
//Route GET /journal

router.get('/', ensureAuth, async (request, response) => {
    try {
      const journals = await Journal.find({ status: 'public' })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()
  
      response.render('journal/index', {
        journals,
      })
    } catch (err) {
      console.error(err)
      response.render('error/500')
    }
  })
  


  // @desc    Show single journal
// @route   GET /journal/:id
router.get('/:id', ensureAuth, async (request, response) => {
    try {
      let journal = await Journal.findById(request.params.id).populate('user').lean()
  
      if (!journal) {
        return response.render('error/404')
      }
  
      if (journal.user._id != request.user.id && journal.status == 'private') {
        response.render('error/404')
      } else {
        response.render('journal/show', {
          journal,
        })
      }
    } catch (err) {
      console.error(err)
      response.render('error/404')
    }
  })
  
//@desc Show Edit page
//Route GET /journal/edit/:id

router.get('/edit/:id', ensureAuth, async (request, response) => {
    try {
      const journal = await Journal.findOne({
        _id: request.params.id,
      }).lean()
  
      if (!journal) {
        return response.render('error/404')
      }
  
      if (journal.user != request.user.id) {
        response.redirect('/journal')
      } else {
        response.render('journal/edit', {
          journal,
        })
      }
    } catch (err) {
      console.error(err)
      return response.render('error/500')
    }
  })


//@desc Update Journal.
//Route PUT /journal/:id

router.put('/:id', ensureAuth, async (request, response) => {
    try {
      let journal = await Journal.findById(request.params.id).lean()
  
      if (!journal) {
        return response.render('error/404')
      }
  
      if (journal.user != request.user.id) {
        response.redirect('/journal')
      } else {
        journal = await Journal.findOneAndUpdate({ _id: request.params.id }, request.body, {
          new: true,
          runValidators: true,
        })
  
        response.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return response.render('error/500')
    }
  })

// @desc    Delete Journal
// @route   DELETE /journal/:id
router.delete('/:id', ensureAuth, async (request, response) => {
    try {
      let journal = await Journal.findById(request.params.id).lean()
  
      if (!journal) {
        return response.render('error/404')
      }
  
      if (journal.user != request.user.id) {
        response.redirect('/journal')
      } else {
        await Journal.remove({ _id: request.params.id })
        response.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return response.render('error/500')
    }
  })

  // @desc    User journals
// @route   GET /journal/user/:userId
router.get('/user/:userId', ensureAuth, async (request, response) => {
    try {
      const journals = await Journal.find({
        user: request.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      response.render('journal/index', {
        journals,
      })
    } catch (err) {
      console.error(err)
      response.render('error/500')
    }
  })


module.exports = router
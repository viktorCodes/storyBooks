const express = require('express')
const router = express.Router()
const { ensureAuth} = require('../middleware/auth')


let privateJournal = require('../models/privatejournal')


//@desc Show Add page
//Route GET /privatejournal/add

router.get('/add', ensureAuth, (request, response) => {
    response.render('privatejournal/add')
})


//@desc Process add form
//Route  POST /privatejournal

router.post('/', ensureAuth, async  (request, response) => {
    try {
        request.body.user = request.user.id
        await privateJournal.create(request.body)
        response.redirect('/dashboard')
    } catch (err) {
         console.error(err)
         response.render('error/500')
    }
})


//@desc Show All private Journals
//Route GET /privatejournal

router.get('/', ensureAuth, async (request, response) => {
    try {
      const journals = await privateJournal.find({ status: 'private' })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()
  
      response.render('privatejournal/index', {
        journals,
      })
    } catch (err) {
      console.error(err)
      response.render('error/500')
    }
  })
  


  // @desc    Show single story
// @route   GET /journal/:id
router.get('/:id', ensureAuth, async (request, response) => {
    try {
      let journal = await privateJournal.findById(request.params.id).populate('user').lean()
  
      if (!privatejournal) {
        return response.render('error/404')
      }
  
      if (privatejournal.user._id != request.user.id && privatejournal.status == 'private') {
        response.render('error/404')
      } else {
        response.render('privatejournal/show', {
          journal,
        })
      }
    } catch (err) {
      console.error(err)
      response.render('error/404')
    }
  })
  
//@desc Show Edit page
//Route GET /privatejournal/edit/:id

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
  
      response.render('journals/index', {
        journals,
      })
    } catch (err) {
      console.error(err)
      response.render('error/500')
    }
  })


module.exports = router
const Comment = require ('../models/Comment.model.js')
const User = require ('../models/User.model.js')
const { isLogged } = require("../middlewares/auth")

const router = require("express").Router()

//POST /comments/
router.post('/:bikeId/create', isLogged, async (req, res, next) => {
   const { bikeId } = req.params 
   const { message } = req.body
   try {
      await Comment.create({
         creator: req.session.user._id, 
         bike: bikeId,
         text: message
      })
      res.redirect(`/bikes/${bikeId}`)
   } catch (error) {
      next (error)
   }
})

//POST /comments/
router.post('/:commentId/:bikeId/delete', isLogged, async (req, res, next) => {
   const { commentId } = req.params
   const { bikeId } = req.params
   try {
      await Comment.findByIdAndRemove(commentId)
      res.redirect(`/bikes/${bikeId}`)
   } catch (error) {
      next(error)
   }
})


router.post('/:bikeId/edit', isLogged, async (req, res, next) => {
   const { bikeId } = req.params
   const { text } = req.body
   try {
   const edited = await Comment.findByIdAndUpdate(bikeId, {text})
   res.render('bikes/oneBike', {edited})
   } catch (error) {
      next(error)
   }
})

module.exports = router
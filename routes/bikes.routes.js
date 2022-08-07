const router = require('express').Router()
const { isLogged } = require('../middlewares/auth')
const Bike = require('../models/Bike.model')
const User = require('../models/User.model')
const Comment = require ('../models/Comment.model.js')


// GET "/bikes" => lista todas las bicicletas por name
router.get('/allBikes', async (req, res, next) => {
   try {
      const allBikes = await Bike.find()
      res.render('bikes/allBikes.hbs', {allBikes})
   } catch (error) {
      next(error)
   }
})


router.post('/allBikes/precio-descendente', async (req, res, next) => {
   try {

      const allBikes = await Bike.find().sort({price: -1})
      res.render('bikes/allBikes.hbs', {allBikes})

   } catch (error) {
      next(error)
   }
})

router.post('/allBikes/precio-ascendente', async (req, res, next) => {
   try {

      const allBikes = await Bike.find().sort({price: 1})
      res.render('bikes/allBikes.hbs', {allBikes})

   } catch (error) {
      next(error)
   }
})

router.post('/allBikes/peso-descendente', async (req, res, next) => {
   try {

      const allBikes = await Bike.find().sort({weight: -1})
      res.render('bikes/allBikes.hbs', {allBikes})

   } catch (error) {
      next(error)
   }
})

router.post('/allBikes/peso-ascendente', async (req, res, next) => {
   try {

      const allBikes = await Bike.find().sort({weight: 1})
      res.render('bikes/allBikes.hbs', {allBikes})

   } catch (error) {
      next(error)
   }
})


router.post('/allBikes/a-z', async (req, res, next) => {
   try {

      const allBikes = await Bike.find().sort({name: 1})
      res.render('bikes/allBikes.hbs', {allBikes})

   } catch (error) {
      next(error)
   }
})

router.post('/allBikes/z-a', async (req, res, next) => {
   try {

      const allBikes = await Bike.find().sort({name: -1})
      res.render('bikes/allBikes.hbs', {allBikes})

   } catch (error) {
      next(error)
   }
})


router.get('/:bikeId', isLogged, async (req, res, next) => {
   const { bikeId } = req.params
   try {
      const allComments = await Comment.find({bike: bikeId}).populate('creator')
      const allCommentsCloned = JSON.parse(JSON.stringify(allComments))
      allCommentsCloned.forEach((eachComment) => {
         //variable para que solo el usuario que hace el comentario pueda borrarlo o el admin 
         eachComment.isMyComment = false  
         if(req.session.user._id == eachComment.creator._id || req.session.user.role === 'admin')
            eachComment.isMyComment = true
      })
      console.log(allCommentsCloned);
      const oneBike = await Bike.findById(bikeId).populate("owner")
      res.render('bikes/oneBike.hbs', {oneBike, bikeId, allCommentsCloned})
   } catch (error) {
      next(error)
   }
})


module.exports = router
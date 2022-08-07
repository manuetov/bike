const User = require("../models/User.model")
const Bike = require("../models/Bike.model")
const router = require("express").Router()
const imageLoader = require("../middlewares/multer")
const {isLogged, isAdmin} = require("../middlewares/auth")


router.get("/profile", isLogged, async (req, res, next)=>{
    const {_id} = req.session.user

    const user = await User.findById(_id).populate("favBikes")
    const user2 = await User.findById(_id).populate("boughtBikes")
    const user3 = await User.findById(_id).populate("soldBikes")

    let banMessage
    if (user.deleteUser === true){
        banMessage = "Estás baneado no puedes subir ninguna bici más"
    }

    res.render("users/profile", {user, user2, user3, banMessage})
})

router.get("/profile/vendidas", isLogged, async (req, res, next)=>{
    const {_id} = req.session.user

    const user3 = await User.findById(_id).populate("soldBikes")

    res.render("users/vendidas", {user3})
})

router.get("/profile/compradas", isLogged, async (req, res, next)=>{
    const {_id} = req.session.user

    const user = await User.findById(_id).populate("boughtBikes")

    res.render("users/compradas", {user})
}) 

router.get('/create', isLogged, async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user._id).populate("favBikes")
        res.render('users/add-bikes', {user})
    } catch (error) {
       next(error)
    }
 })

 router.post('/create', imageLoader.single("image"), async (req, res, next) => {
    const { name, weight, size, colour, price, description} = req.body
    const {_id} = req.session.user

    try{
        const user = await User.findById(_id)

        if(user.deleteUser === false){

            const bici = await Bike.create({name, weight, size, colour, price, image: req.file.path, owner: _id, description})
            await User.findByIdAndUpdate(_id, {$addToSet:{favBikes: bici._id}})

            res.redirect("/users/profile")
        }
        
        res.redirect('/users/profile')
    }
    catch(error){
        next(error)
    }
 
 })


router.get('/admin-profile', isAdmin, async (req, res, next)=>{
    const {_id} = req.session.user
    try {
        const admin = await User.findById(_id)
        const allUsers = await User.find({role : "user"})
        res.render("users/admin-profile.hbs", {admin, allUsers})

    } catch (error) {
        next(error)
    }
})

router.get('/admin-users/:userId', isAdmin, async (req, res, next) => {
    const {userId} = req.params
    try {
        const user = await User.findById(userId)
        res.render("users/admin-users.hbs", {user})    
    } catch (error) {
        next(error)
    }
})

router.post('/admin-users/:userId/delete', isAdmin, async(req, res, next) => {
    const {userId} = req.params
    try {
        await User.findByIdAndUpdate(userId, {deleteUser: true}) 
        res.redirect('/users/admin-profile')       
    } catch (error) {
        next(error)
    }
})

router.post('/admin-users/:userId/autorize', isLogged, isAdmin, async(req, res, next) => {
    const {userId} = req.params
    try {
        await User.findByIdAndUpdate(userId, {deleteUser: false}) 
        res.redirect('/users/admin-profile')       
    } catch (error) {
        next(error)
    }
})
 

router.post("/:bikeId/delete", isLogged, async (req, res, next)=>{
    const {bikeId} = req.params
    const {_id} = req.session.user

    try{

        const bike = await Bike.findById(bikeId)

        if(bike.isSold){

            const user = await User.findById(_id).populate("favBikes")
            const user2 = await User.findById(_id).populate("boughtBikes")
            const user3 = await User.findById(_id).populate("soldBikes")

            res.render("users/profile", {user, user2, user3, errorMessage: "No se puede borrar una bici vendida"})
            return
        }
        
        await Bike.findByIdAndDelete(bikeId)
        await User.findByIdAndUpdate(_id, {$pull:{favBikes: bikeId}})   

        res.redirect(`/users/profile`)
    }
    catch(error){
        next(error)
    }

 })

 router.get("/:bikeId/edit", isLogged, async (req, res, next)=>{
    const { bikeId } = req.params

    try{
        const bike = await Bike.findById(bikeId)
        res.render("users/edit-bikes", {bike})
     }
     catch(error){
         next(error)
     }
 })
 
 router.post('/:bikeId/edit', imageLoader.single("image"), async (req, res, next) => {
    const { bikeId } = req.params
    const {name, color, size, weight, colour, price, description} = req.body
    const {_id} = req.session.user
    
    try{
       const bike = await Bike.findById(bikeId)

        if(bike.isSold){

            const user = await User.findById(req.session.user._id).populate("favBikes")
            const user2 = await User.findById(req.session.user._id).populate("boughtBikes")
            const user3 = await User.findById(_id).populate("soldBikes")

            res.render("users/profile", {user, user2, user3, errorMessage: "No se puede editar una bici vendida"})
            return
        }

        await Bike.findByIdAndUpdate(bikeId, {name, color, size, weight, colour, price, description})
        res.redirect("/users/profile")
    }
    catch(error){
        next(error)
    }
 
 })

module.exports = router
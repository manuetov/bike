const router = require('express').Router()
const Bike = require('../models/Bike.model')
const User = require('../models/User.model')
const Transaction = require("../models/Transaction.model")
const { isLogged } = require("../middlewares/auth")


router.get("/:bikeId", isLogged, (req, res, next)=>{
    const {bikeId} = req.params
    
    Bike.findById(bikeId).populate("owner")
    .then(bike=>res.render("transaction/confirm", {bike}))
    .catch(err=>next(err))
    
})

router.post("/:bikeId", async (req, res, next)=>{
    const {bikeId} = req.params
    const {owner} = req.body

    try{

        const vendedor = await User.findOne({username: owner})
        const bike = await Bike.findById(bikeId).populate("owner")

        if(bike.isSold){
            res.render("transaction/confirm", {bike, errorMessage: "Esta bici ya está vendida"})
            return
        }

        if(vendedor._id == req.session.user._id){

            res.render("transaction/confirm", {bike, errorMessage: "Esta bici ya es tuya, no la puedes comprar"})
            return
        }

        await Transaction.create({customer: req.session.user._id, seller: vendedor._id, bike: bikeId})
        await Bike.findByIdAndUpdate(bikeId, {isSold: true})
        await User.findByIdAndUpdate(vendedor._id, {$addToSet:{soldBikes: bikeId}})
        await User.findByIdAndUpdate(req.session.user._id, {$addToSet:{boughtBikes: bikeId}})

        res.redirect("/users/profile")

    }
    catch(error){
        next(error)
    }

})


module.exports = router
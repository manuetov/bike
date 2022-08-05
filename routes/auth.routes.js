const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User.model")

router.get("/register", (req, res, next)=> res.render("auth/register"))

router.post("/register", async (req, res, next)=>{

    const {username, email, password} = req.body

    const usernameOk = username.trim().toLowerCase()

    if(username === "" || email === "" || password === ""){
        res.render("auth/register", {errorMessage: "Debes llenar todos los campos"})
        return 
    }

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/
    if(passwordRegex.test(password) === false){
        res.render("auth/register", {errorMessage: "La contraseña debe contener al menos 1 mayúscula, 1 minúscula y 1 número"})
        return
    }

    try{

        const foundUser = await User.findOne({email})
        if(foundUser !== null){
            res.render("auth/register", {errorMessage: "Usuario ya registrado"})
            return
        }

        const foundUserByUsername = await User.findOne({username})
        if(foundUserByUsername !== null){
            res.render("auth/register", {errorMessage: "Nombre de usuario en uso"})
            return
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        await User.create({
            username: usernameOk,
            email,
            password: hashedPassword
        })

        res.redirect("/auth/login")

    }
    catch(error){
        next(error)
    }
})


router.get("/login", (req, res, next)=> res.render("auth/login"))

router.post("/login", async (req, res, next)=>{

    const {password, username} = req.body

    const usernameOk = username.trim().toLowerCase()

    try{

        if(username === "" || password === ""){
            res.render("auth/login", {errorMessage: "Debes rellenar todos los campos"})
            return
        }
    
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        if(passwordRegex.test(password) === false){
            res.render("auth/login", {errorMessage: "La contraseña debe tener al menos 8 caracteres, al menos 1 minúscula, 1 mayúscula y 1 número"})
            return 
        }

        const foundUser = await User.findOne({username: usernameOk})
        if(foundUser === null){
            res.render("auth/login", {errorMessage: "Usuario no encontrado"})
            return
        }

        const passwordValidated = await bcrypt.compare(password, foundUser.password)

        if(!passwordValidated){
            console.log(passwordValidated)
            res.render("auth/login", {errorMessage: "Contraseña incorrecta"})
            return
        } 

        req.session.user = {
            _id: foundUser._id,
            email: foundUser.email,
            role: foundUser.role
        }

        req.app.locals.isUserActive = true

        req.session.save(()=>{

            if(req.session.user.role === "admin"){
                res.redirect("/users/admin-profile") 
                return
            }
            res.redirect("/users/profile") 
        })

    }
    catch(error){
        next(error)
    }

})

router.get("/logout", (req, res, next)=>{
    req.session.destroy(()=>{
        req.app.locals.isUserActive = false
        res.redirect("/")
    })
})

module.exports = router

const isLogged = (req, res, next)=>{

    if(req.session.user === undefined){
        res.redirect("/auth/login")
        req.app.locals.isUserActive = false
        return
    }
    next()

}

const isAdmin = (req, res, next) => {
    if (req.session.user.role === "admin") {
        next()
    } else {
        req.app.locals.isUserActive = false
        res.redirect('/auth/login')
        return
    }
}



function localsUpdate(req, res, next) {
    if (req.session.user === undefined) {
      // usuario no está logeado
      res.locals.isUserActive = false;
      res.locals.isUserAdmin = false;
    } else if (req.session.user.role === "admin") {
      //  usuario activo y admin
      res.locals.isUserActive = true;
      res.locals.isUserAdmin = true;
    } else if (req.session.user.role === "user") {
      res.locals.isUserActive = true;
      res.locals.isUserAdmin = false;
    }
    next()
  }

module.exports = {
    isLogged,
    isAdmin,
    localsUpdate
}
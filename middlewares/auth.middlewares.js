function isLoggedIn(req, res, next) {

 if (req.session.user === undefined) {
    //el usuario no está logueado
    res.redirect("/auth/login")
 } else {
    //el usuario está activo
    next()
 }
module.exports = { isLoggedIn: isLoggedIn }

}
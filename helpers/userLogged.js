const userLogged = (req) => req.session.user ? true : false;

module.exports = userLogged
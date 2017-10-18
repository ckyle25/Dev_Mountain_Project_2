module.exports = function (req, res, next){
  if(req.session.loggedIN === true){
  return next();
}else {
    return res.sendStatus(403);
}
}

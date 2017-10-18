module.exports = function (req, res, next){
  const { session, method } = req;
  if ( !session.user ){
    session.user = {
      user: "notben"
    };
  }
  next();
}

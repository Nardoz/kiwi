
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.render('usuarios', { title: 'Usuarios' });
};
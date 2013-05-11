
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'The Kiwi Page' });
};

exports.estaciones = function(req, res){
  res.render('estaciones', { title: 'Estaciones' });
};

exports.usuarios = function(req, res){
  res.render('usuarios', { title: 'Usuarios' });
};
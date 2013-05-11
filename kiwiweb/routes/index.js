
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'The Kiwi Page', page: 'pages/index.ejs' });
};

exports.estaciones = function(req, res){
  res.render('index', { title: 'Estaciones', page: 'pages/estaciones.ejs' });
};

exports.usuarios = function(req, res){
  res.render('index', { title: 'Usuarios', page: 'pages/usuarios.ejs' });
};
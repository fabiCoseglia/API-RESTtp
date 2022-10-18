const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

const {list,detail,recomended,create,update,destroy} = require('../controllers/moviesController')





//Rutas exigidas en el TP de apis
router.get('/movies', moviesController.list);
router.post('/movies', moviesController.create);
router.delete('/movies/:id', moviesController.destroy);

//extras
router.get('/movies/new', moviesController.new); // listado con limit mandado por params
router.get('/movies/recommended', moviesController.recomended); //lista de recomendadas
router.get('/movies/detail/:id', moviesController.detail); //id del detail por params
module.exports = router;
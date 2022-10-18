const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    list: async(req, res) => {
       try{
        let movies = await db.Movie.findAll({
            include: [{
                association: 'genre',
                attributes: ['name']
            }]
        });
        if(movies.length){
            return res.status(200).json({
                ok : true,
                meta : {
                    status: 1
                },
                data : movies
            })
        }
        throw new Error('ups, no se encontro peliculas para listar')

        }catch(err){
        return res.status(500).json({
             ok: false,
             msg: err.massage ? err.massage: 'comuniquese con el admin'
        })
    }
    },
    detail: async(req, res) => {
        try{
          
            const {id} = req.params;
            if(isNaN(id)){
              throw new Error('el ID debe ser un number')
            }
              
              let movie = await db.Movie.findByPk(id,{
                  attributes: {
                      exclude: ['created_at', 'updated_at']
                  }
              });
  
              if(movie){
                  return res.status(200).json({
                      ok : true,
                      meta : {
                          status: 1
                      },
                      data : movie
                  })
              }
              throw new Error('ups, la pelicula no existe')
          }catch(err){
            console.log(err)
                return res.status(500).json({
                    ok: false,
                    msg: err.message ? err.message : 'comuniquese con el admin'
                })
        }
    },
    new: async(req, res) => {

        try{
            let movies = await db.Movie.findAll({
                order : [
                    ['release_date', 'DESC']
                ],
                limit: +req.query.limit || 5
            });

            if(movies.length){
                return res.status(200).json({
                    ok:true,
                    meta:{
                        total: movies.length
                    },
                    data: movies
                })
            }
        }catch(error){
            console.log(error);
            return res.status(error.status || 500).json({
                ok: false,
                msg: error.message ? error.massage : 'comuniquese con el admin'
            });
        }
    },
    'recomended': async(req, res) => {

        try{
            let movies= await db.Movie.findAll({
                include: ['genre'],
                where: {
                    rating: {[db.Sequelize.Op.gte] : 8}
                },
                order: [
                    ['rating', 'DESC']
                ]
            });

            if(movies.length){
                return res.status(200).json({
                    ok:true,
                    meta:{
                        total: movies.length
                    },
                    data: movies
                })
            }

        }catch(error){
            console.log(error);
            return res.status(error.status || 500).json({
                ok: false,
                msg: error.message ? error.massage : 'comuniquese con el admin'
            });
        }
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
   create: async(req,res)=> {
    try{
        const {id} = req.params.id;
        let newMovie= await Movie.create(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            }
        )
        if(newMovie.length){
            return res.status(200).json({
                ok:true,
                meta:{
                    total: movies.length
                    
                },
                data: newMovie
            })
        }
    }catch(error){
        console.log(error);
        return res.status(error.status || 500).json({
            ok: false,
            msg: error.message ? error.massage : 'comuniquese con el admin'
        });
    }
    },
    edit: function(req,res) {
        let movieId = req.params.id;
        let promMovies = Movies.findByPk(movieId,{include: ['genre','actors']});
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        Promise
        .all([promMovies, promGenres, promActors])
        .then(([Movie, allGenres, allActors]) => {
            Movie.release_date = moment(Movie.release_date).format('L');
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesEdit'), {Movie,allGenres,allActors})})
        .catch(error => res.send(error))
    },
    update: function (req,res) {
        let movieId = req.params.id;
        Movies
        .update(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },
            {
                where: {id: movieId}
            })
        .then(()=> {
            return res.redirect('/movies')})            
        .catch(error => res.send(error))
    },
    delete: function (req,res) {
        let movieId = req.params.id;
        Movies
        .findByPk(movieId)
        .then(Movie => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesDelete'), {Movie})})
        .catch(error => res.send(error))
    },
    destroy:  async(req,res)=> {

        try{
            let movieId = req.params.id;
            Movies.destroy({where: {id: movieId}, force: true}) // force: true es para asegurar que se ejecute la acción
        }catch(error){
            console.log(error);
            return res.status(error.status || 500).json({
                ok: false,
                msg: error.message ? error.massage : 'comuniquese con el admin'
            });
        }
        
    }
}

module.exports = moviesController;
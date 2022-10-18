const db = require('../database/models');
const sequelize = db.sequelize;


const genresController = {
    list: async(req, res) => {
       try{
        let genres = await db.Genre.findAll({
            order: ['name'],
            attributes: {
                exclude: ['created_at','update_at']
            }
        })
        if(genres){
            return res.status(200).json({
                ok : true,
                meta: {
                    total: genres.length
                },
                data: genres
            })
        }
        throw new Error({
            ok: false,
            massage: 'algo salío mal'
        })
        
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
              
              let genre = await db.Genre.findByPk(id,{
                  attributes: {
                      exclude: ['created_at', 'updated_at']
                  }
              });
  
              if(genre){
                  return res.status(200).json({
                      ok : true,
                      meta : {
                          status: 1
                      },
                      data : genre
                  })
              }
              throw new Error('ups, no se encuentra el genre')
          }catch(err){
            console.log(err)
                return res.status(500).json({
                    ok: false,
                    msg: err.message ? err.message : 'comuniquese con el admin'
                })
        }
    }
    

}

module.exports = genresController;
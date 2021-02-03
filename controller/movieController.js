const db = require("../database");
const SECRET_KEY = "!@#$%^&*";
const jwt = require('jsonwebtoken')
const { asyncQuery, generateQuery } = require("../helper/queryHelper");

module.exports = {
    getAll : async (req, res) => {

        try{
            const query = `select name, release_date, release_month, release_year, duration_min, genre, description, ms.status status, location, time from movies m
            left join movie_status ms
            on m.status = ms.id
            left join schedules s
            on m.id = s.movie_id
            left join locations l
            on s.location_id = l.id
            left join show_times st
            on s.time_id = st.id;`

            const result = await asyncQuery(query)
            res.status(200).send(result)
        }
        catch(err){
            console.log(err);
            res.status(400).send(err)
        }
    },
    get:async(req, res)=>{
        try{
            const query = `select name, release_date, release_month, release_year, duration_min, genre, description, ms.status as status, location, time from movies m
            left join movie_status ms
            on m.status = ms.id
            left join schedules s
            on m.id = s.id
            left join locations l
            on s.location_id = l.id
            left join show_times st
            on s.time_id = st.id where ${generateQuery(req.query)};`

            const result = await asyncQuery(query)
            res.status(200).send(result)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },
    add: async(req, res)=>{
        const { name, release_date, release_month,release_year, duration_min, genre, description} =req.body
        try{
            const add = `insert into movies (name, release_date, release_month,release_year, duration_min, genre, description) 
            values (${db.escape(name)}, ${db.escape(release_date)}, ${db.escape(release_month)}, ${db.escape(release_year)},
            ${db.escape(duration_min)}, ${db.escape(genre)}, ${db.escape(description)})`
            await asyncQuery(add)

            const query = `select name, release_date, release_month,release_year, duration_min, genre, description from movies where name = ${db.escape(name)}`
            const result = await asyncQuery(query)
            res.status(200).send(result[0])
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },
    editStatus: async(req, res)=>{
        const {status, token} = req.body
        const verify = jwt.verify(token, 'token')

        try{
            const query = `select * from users where uid = ${db.escape(verify.uid)}`
           
            const check = await asyncQuery(query)
           
            if(check[0].role !== 1) return res.status(400).send('Akun bukan admin')

            const queryEdit = `update movies set status =${db.escape(status)} where id = ${db.escape(req.params.id)}`
            await asyncQuery(queryEdit)

            const show = `select id from movies where id = ${db.escape(req.params.id)}`
            const result = await asyncQuery(show)
            let msg = 'status has been changed'

            result[0].message = msg

            res.status(200).send(result[0])
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },
    editTime: async(req, res) => {
            const {location_id, time_id, token} =req.body
            const verify = jwt.verify(token, 'token')
        try{
            const query = `select * from users where uid = ${db.escape(verify.uid)}`
           
            const check = await asyncQuery(query)
           
            if(check[0].role !== 1) return res.status(400).send('Akun bukan admin')

            const queryEditTime = `insert into schedules (movie_id, location_id, time_id)
            values (${parseInt(req.params.id)}, ${db.escape(location_id)}, ${db.escape(time_id)})`

            await asyncQuery(queryEditTime)

            const querySearch = `select id from movies where id=${db.escape(req.params.id)}`
            const result = await asyncQuery(querySearch)

            let msg = 'sschedule has been added'

            result[0].message = msg

            res.status(200).send(result[0])

        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    }
}
const db = require("../database");
const cryptjs = require("crypto-js");
const jwt = require('jsonwebtoken')
const { asyncQuery } = require("../helper/queryHelper");
const { validationResult } = require("express-validator")
const SECRET_KEY = "!@#$%^&*";

module.exports = {
  register: async (req, res) => {
    const { username, password, email } = req.body;

    let errors = validationResult(req);
    const msg = errors.array().map((item) => item.msg);

    if (!errors.isEmpty()) {
      return res.status(400).send(msg);
    }

    const hashpass = cryptjs.HmacMD5(password, SECRET_KEY).toString();

    try {
      const queryAdd = `insert into users (username, password, email, uid) 
           values (${db.escape(username)}, ${db.escape(hashpass)}, ${db.escape(email)}, ${Date.now()})`;
      await asyncQuery(queryAdd)

      const query = `select id, uid, username, email from users where username = ${db.escape(username)}`
      const search = await asyncQuery(query)

      const token = jwt.sign({uid: search[0].uid, role: search[0].role}, 'token')

     search[0].token = token

      
      res.status(200).send(search[0])
      ;
    } catch (err) {
        console.log(err)
      res.status(400).send(err);
    }
  },
  login: async (req, res) => {
    const { username, password, email } = req.body;

    const hashpass = cryptjs.HmacMD5(password, SECRET_KEY).toString();

    try{
        const queryLogin = `select id, uid, username, email, status, role from users where 
        username = ${db.escape(username)} or email = ${db.escape(email)} and password = ${db.escape(hashpass)}`

        const result = await asyncQuery(queryLogin)

       
        if(result[0].status !== 1) return res.status(200).send('Akun anda tidak aktif atau close')


      const token = jwt.sign({uid: result[0].uid, role: result[0].role}, 'token')

     result[0].token = token

        res.status(200).send(result)

    }
    catch(err){
        console.log(err)
        res.status(400).send(err)
    }
  },
  deactivate: async (req, res) => {
      const {token} = req.body

      const verify = jwt.verify(token, 'token')

    try{
        const queryEdit = `update users set status = 2 where uid = ${db.escape(verify.uid)}`
        await asyncQuery(queryEdit)
        console.log(queryEdit)

        const show = `select uid, s.status from users u
        left join status s
        on u.status = s.id
        where uid = ${db.escape(verify.uid)}`

        const result = await asyncQuery(show)
        res.status(200).send(result)

    }
    catch(err){
        console.log(err)
        res.status(400).send(err)
    }
  },
  activate: async(req, res) => {
      const {token} = req.body
      const verify = jwt.verify(token, 'token')

      try{
        const query = `select * from users where uid = ${db.escape(verify.uid)}`
        const result = await asyncQuery(query)

        if(result[0].status !== 2) return res.status(200).send('Akun anda masih aktif atau close')
        const queryEdit = `update users set status = 1 where uid = ${db.escape(verify.uid)}`
        await asyncQuery(queryEdit)

        const show = `select uid, s.status from users u
        left join status s
        on u.status = s.id
        where uid = ${db.escape(verify.uid)}`

        const result1 = await asyncQuery(show)
        res.status(200).send(result1)
       

      }
      catch(err){
          console.log(err)
          res.status(400).send(err)
      }
  },
  close: async(req, res)=>{
    const {token} = req.body
    const verify = jwt.verify(token, 'token')

    try{
        const queryEdit = `update users set status = 3 where uid = ${db.escape(verify.uid)}`
        await asyncQuery(queryEdit)

        const show = `select uid, s.status from users u
        left join status s
        on u.status = s.id
        where uid = ${db.escape(verify.uid)}`

        const result = await asyncQuery(show)
        res.status(200).send(result[0])
    }
    catch(err){
        console.log(err)
        res.status(400).send(err)
    }
  }
  
};

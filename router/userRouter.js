const router = require('express').Router()
const { userController } =require('../controller')
const { body } = require("express-validator");

const registerValidation = [
    body("username")
      .notEmpty()
      .withMessage("Username can't be empty")
      .isLength({ min: 6 })
      .withMessage("Username must have 6 character"),
    body("password")
      .notEmpty()
      .withMessage("Password can't be empty")
      .isLength({ min: 6 })
      .withMessage("Password must have 6 character")
      .matches(/[0-9]/)
      .withMessage("Password must include number")
      .matches(/[!@#$%^&*]/)
      .withMessage("password must include symbol"),
    body("email").isEmail().withMessage("Invalid email"),
  ];

  router.post('/register', registerValidation, userController.register )
  router.post('/login', userController.login)
  router.patch('/deactive', userController.deactivate)
  router.patch('/activate', userController.activate)
  router.patch('/close', userController.close)

  module.exports = router
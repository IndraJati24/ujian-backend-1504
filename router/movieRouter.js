const router = require('express').Router()
const { movieController } = require('../controller')

router.get('/get/all', movieController.getAll)
router.get('/get', movieController.get)
router.post('/add', movieController.add)
router.patch('/edit/:id', movieController.editStatus)
router.patch('/set/:id', movieController.editTime)
module.exports = router
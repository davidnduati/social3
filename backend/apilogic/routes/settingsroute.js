const express = require('express')
const settings = express.Router()
const {changepassword,deleteaccount} = require('../controllers/settingscontroller')


settings.put('/changepassword',changepassword)
settings.delete('/deleteaccount',deleteaccount)

module.exports = {settings}
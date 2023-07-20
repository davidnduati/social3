const express = require('express')
const{followed,unfollow}= require('../controllers/friendscontrollers')
const friendsroute = express.Router()

friendsroute.get('/followed',followed)
friendsroute.post('/unfollow',unfollow)
module.exports = {friendsroute}
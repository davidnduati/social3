const express = require('express')
const {singlepost,likepost} = require('../controllers/singlepostcontroller')
const post1 = express.Router()

post1.get('/singlepost/:postid',singlepost)
post1.put('/:postId/like',likepost)

module.exports = {post1}
const express = require('express')
const {posts, replytocomment,likecomment} = require('../controllers/commentscontrollers')
const commentsroute = express.Router()

commentsroute.post('/posts',posts)
commentsroute.post('/comments/:commentid/replies', replytocomment)
commentsroute.post('/comments/:commentid/like',likecomment)

module.exports = {commentsroute}
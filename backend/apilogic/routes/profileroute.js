const express = require('express')
const {updateprofile,updateprofilepic,deleteprofilepic} = require('../controllers/profilecontroller')
const profileroute = express.Router()

profileroute.put('/updateprofile', updateprofile)
profileroute.put('/updateprofilepic', updateprofilepic)
profileroute.delete('/deleteprofilepic', deleteprofilepic)

module.exports = {profileroute}
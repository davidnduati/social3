const express = require('express')
const sql = require('mssql')
require('dotenv').config()

//const config = require('.../config') //import it porperly


const config = {
    server: 'localhost',
    database: 'social',
    user: 'sa',
    password: 'Dee2222',//<== replace with the actual real pass in order to work

    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

module.exports = {
    updateprofile: async (req, res) => {
        try {
            const user = req.body
            const pool = await sql.connect(config)
            if (pool.connected) {
                console.log(user)
               
                    const result = await pool.request()
                        .input('userid', user.userid)//find a better way to cope with the id
                        .input('username', user.username)
                        .input('firstname', user.firstname)
                        .input('lastname', user.lastname)
                        .execute('updateuserprofile')
                    console.log(result)
                    
                    if(result.rowsAffected[0]>0){
                        res.status(200).json({
                        success: true,
                        message: 'updated status successfully'
                    })
                    }else{
                        res.send('coundnt update')
                    }
                    
               

            } else {
                res.status(500).json({
                    success: false,
                    message: "internal server error"
                })
            }

        } catch (error) {
            console.log(error)
            res.send(error)
        }

    },
    updateprofilepic: async (req, res) => {
        const { imageurl, id } = req.body
        console.log(imageurl)
        const pool = await sql.connect(config)
        if (pool.connected) {
            const result = pool.request()
                .input('userid', id)
                .input('imageurl', imageurl)
            //.execute('updateprofilepic')

            res.status(200).json({
                success: true,
                message: 'updated status successfully'
            })
        } else {
            res.status(500).json({
                success: false,
                message: "internal server error"
            })
        }
    },
    deleteprofilepic: async (req, res) => {
        try {
            const user = req.body
            const pool = await sql.connect(config)
            if (pool.connected) {
                const result = pool.request()
                    .input('userid', user.id)
                    .execute('dbo.deleteprofilepic')
                res.status(200).json({
                    success: true,
                    message: 'you deleted the profile picture successfully'
                })
            }
        } catch (error) {
            console.log(error)
            res.send(error)

        }

    }

}
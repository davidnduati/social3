const express = require('express')
const sql = require('mssql')
require('dotenv').config()

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
    postfromfollowingusers: async (req, res) => {
        try {
                const user = req.body
        const pool = await sql.connect(config)
        if (pool.connected) {
            const result = await pool.request()
                .input('userid', user.id)
                .execute('GetPostsByUserId')

            res.status(200).json({
                success: true,
                message: 'post from people you follow',
                result: result.recordset
            })
        }else{
            res.send("internal server error")
        }
        } catch (error) {
            console.log(error)
            res.json(error)
            
        }
    
    },
    mypost:async(req,res)=>{
        const user = req.body
        const pool = await sql.connect(config)
        console.log(pool)
        if (pool.connected) {
            const result = await pool.request()
            .input('userid', user.id)
            .execute('dbo.mypost')

            res.status(200).json({
                success: true,
                message: 'all your posts',
                result: result.recordset
            })
        }
    },
    peopleyoucanfollow: async(req,res)=>{
        try {
            const user = req.body
        const pool = await sql.connect(config)
        if (pool.connected) {
            const result  = await pool.query('select userid,username from users')
            res.status(200).json({
                success: true,
                message: 'people you may know ',
                result: result.recordset
            })
        }

        } catch (error) {
            res.send(error)
            console.log(error)
        }
        
        
    }
}
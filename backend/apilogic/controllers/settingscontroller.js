const express = require('express')
const sql = require('mssql')
const bcrypt = require('bcrypt')


const config = {
    server: 'localhost',
    database: 'social',
    user: 'sa',
    password: 'Dee2222',

    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};
module.exports = {
    changepassword: async (req, res) => {
        const { id, password } = req.body
        const pool = await sql.connect(config)
        const hashed_pwd = await bcrypt.hash(password, 8)
        if (pool.connected) {
            try {
                const request = await pool.request()
                    .input('userid', id)
                    .input('password', hashed_pwd)
                    .execute('dbo.changepassword')
                res.status(200).json({
                    success: true,
                    message: 'changed password successfully'
                })
            } catch (error) {
                console.log(error)
                res.send(error)
            }

        } else {
            res.status(500).json({
                success: false,
                message: 'internal server error'
            })
        }

    },
    deleteaccount: async (req, res) => {
        try {
            const user = req.body
            const pool = await sql.connect(config)
            if (pool.connected) {
                const request = await pool.request()
                    .input('userid', user.id)
                    .execute('deleteuser')
                res.status(200).json({
                    success: true,
                    message: 'changed password successfully'
                })
            } else {
                res.status(500).json({
                    success: false,
                    message: 'internal server error'
                })
            }
        }
        catch (error) {
            res.send(error)
        }
    }
}

const express = require('express')
const sql = require('mssql')
//const config = require('../../config')

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
    singlepost: async (req, res) => {
        try {
            const {postid,userid} = req.body;
            const pool =await sql.connect(config)

            if (pool.connected) {
                try {
                    const singlepost = await pool.request()
                        .input('postid', postid)
                        .input('userid',userid)
                        .execute('dbo.singlepost')


                res.status(200).json({
                success: true,
                message: "success",
                result: singlepost.recordset
                })
                }
                catch (error) {
                    console.log(error)
                    res.send(error)
                }
            } else {
                console.log("you are not connected to the database")
                res.send("internal server error")
            }


        } catch (error) {
            console.log(error)
            res.send(error)
            res.status(200).json({
                success: false,
                message: "error"
            })
        }
    },
    likepost: async (req, res) => {
        try {
            const postid = req.params.postid;
            const pool = await sql.connect(config)

            if(pool.connected){
                try {
                    const result = await pool.query('UPDATE posts SET likey = likey + 1 WHERE id = '+postid)

                    console.log(result.recordset)
                    res.json({ message: 'Post liked successfully' });


                } catch (error) {
                    res.status(500).json({ error: 'Error liking post' });
                }
            }else{
                res.send('not connected to database')
            }         
                
            } catch (error) {
            console.log(error)
            res.status(200).json({
                success: false,
                message: "error"
            })
        }
    },
    createnewpost: async (req, res) => {

        const { userid, content } = req.body;
        const pool = await sql.connect(config)
        if(pool.connected){
            try {
                 const result = await pool.request()
            .input("userid",userid)
            .input("contenturl",contenturl)
            .execute('creatpost')
            res.json({ message: 'Post created successfully' });
            } catch (error) {
                console.log(error)
                res.send(error)
            }
           

        }else{
            res.send("not connected to database")
        }

        
      
    }
}

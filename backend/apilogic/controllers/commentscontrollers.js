const express = require('express')
const sql  = require('mssql')


const config = {
    server: 'localhost',
    database: 'social',
    user: 'sa',
    password: 'process.env.PWD',
   
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};
module.exports= {
    posts:async (req, res) => {
        try {
            const {postid,userid,contenturl} =  req.body;
            console.log(postid)
            const pool = await sql.connect(config)
            if (pool.connected) {
                try {
                     const comment = await pool.request()
                    .input('postid', postid)
                    .input('userid', userid)
                    .input('contenturl', contenturl)
                    .execute('createcomment')
    
                console.log(comment.recordset)
                res.json({ message: 'Comment added successfully' });
                } catch (error) {
                    res.send(error)
                }
               
            } else {
               res.send('not connected to the database') 
            }
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    },
    replytocomment:async(req, res) => {
        const commentid = req.params.commentid;
        const { replyText } = req.body;
    
        const pool = sql.connect(config)
    
        // Insert the reply into the database
        const replyQuery = `INSERT INTO replies (commentid, text) VALUES (?, ?)`;
        pool.query(replyQuery, [commentid, replyText], (err, results) => {
            if (err) {
                console.error('Error replying to comment: ', err);
                res.status(500).json({ error: 'Error replying to comment' });
                return;
            }
    
            res.json({ message: 'Reply added successfully' });
        });
    },
    likecomment: async(req, res) => {
        const commentid = req.params.commentid;
    
        const pool = sql.connect(config)
        // Increment the like count for the comment
        const likeQuery = `UPDATE comments SET likey = likey + 1 WHERE id = ?`;
        pool.query(likeQuery, [commentid], (err, results) => {
            if (err) {
                console.error('Error liking comment: ', err);
                res.status(500).json({ error: 'Error liking comment' });
                return;
            }
    
            res.json({ message: 'Comment liked successfully' });
        });
    }
}
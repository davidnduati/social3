const express = require('express');
const sql = require('mssql');
require('dotenv').config()

module.exports = {
    followed:async (req, res) => {
        try {
            const pool = sql.connect(config)
            const user = req.body
    
            const userid = user.id;
    
            if (pool.connected) {
                try {
                    const followedusers = await pool.query(' SELECT users.id, users.username FROM followers INNER JOIN users ON follows.followeduserid = users.id WHERE followeruserid = ' + userid)
                    
                    res.status(200).json({
                        success: true,
                        message: 'here are the followed users',
                        result: followedusers.recordset
                    })
                } catch (error) {
                    console.log(error)
                    res.send(error)
                }
            } 
            
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    
    
    
    },
    unfollow: (req, res) => {
        const userid = req.body.userid;
        const followeduserid = req.body.followeduserid;
    
        const pool = sql.connect(config)
    
        // Delete the follow relationship from the database
        const unfollowQuery = `
        DELETE FROM follows
        WHERE userid = ? AND followeduserid = ?
      `;
        pool.query(unfollowQuery, [userid, followeduserid], (err, results) => {
            if (err) {
                console.error('Error unfollowing user: ', err);
                res.status(500).json({ error: 'Error unfollowing user' });
                return;
            }
    
            res.json({ message: 'User unfollowed successfully' });
        });
    }
    
}
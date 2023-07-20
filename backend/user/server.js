const express = require('express');
const app = express();
const mssql = require('mssql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const sendMail = require('./services/sendmail');
const cors = require('cors');
const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis').default;
require('dotenv').config();
const {v4} = require('uuid')

app.use(cors());
app.use(express.json());
redisClient.connect()

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

// Session configuration
app.use(
  session({
    secret: 'david',
    resave: false,
    genid: ()=>v4(),
    saveUninitialized: true,
    store: new redisStore({ client: redisClient, prefix: "" }),
    cookie: {
      maxAge: 3600000, // Set the cookie expiration time (in milliseconds)
      httpOnly: true, // Ensure the cookie is only accessible via HTTP(S)
      secure: false // Set to true if using HTTPS
    }
  })
);

// Middleware to check if the user has an active session
const requiresLogin = (req, res, next) => {
  const sessionId = req.sessionID;

  redisClient.get(sessionId, (err, sessionData) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }

    if (!sessionData) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    req.session = JSON.parse(sessionData);
    next();
  });
};

// Protected route example
app.get('/protected', requiresLogin, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authorized access'
  });
});

// Login route
app.post('/login', async (req, res) => {
  const user = req.body;
  const pool = await mssql.connect(config);

  try {
    if (pool.connected) {
      try {
        const result = await pool
          .query(`SELECT * FROM users WHERE username = '${user.username}'`);

        const hashedPwd = result.recordset[0]?.password;
        const userId = result.recordset[0]?.userid;

        if (hashedPwd && userId) {
          const comparisonPwd = await bcrypt.compare(user.password, hashedPwd);

          if (comparisonPwd === true) {
            req.session.user = user;
          
            res.status(200).json({
              success: true,
              message: 'Successfully logged in'
            });
          } else {
            res.status(402).json({
              success: false,
              message: 'Invalid credentials'
            });
          }
        } else {
          res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});
app.post('/signup', async (req, res) => {
  const user = req.body
  try {
      const pool = await mssql.connect(config)
      const hashed_pwd = await bcrypt.hash(user.password, 8)
      if (pool.connected) {
          const result = await pool.request()
              .input('firstname', user.firstname)
              .input('lastname', user.lastname)
              .input('username', user.username)
              .input('email', user.email)
              .input('password', hashed_pwd)
              .input('imageurl', user.imageurl)
              .execute('createuser')

          const useremail = user.email

          sendMail(useremail)

          res.status(201).send({
              message: 'Signup successful'
          });
      } else { console.log('internal server error')
   }

  } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Server error' });
  }
});

// Logout route
app.post('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie('sessionId');
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    }
  });
});

const port = 4040;
app.listen(port, () => console.log(`Server started on port ${port}`));

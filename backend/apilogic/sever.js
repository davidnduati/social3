const express = require('express');
const app = express();
const redis = require('redis');
const cors = require('cors');

//const session = require('express-session');
//const redisStore = require('connect-redis').default;
const { post1 } = require('./routes/singlepostroute');
const { settings } = require('./routes/settingsroute');
const { profileroute } = require('./routes/profileroute');
const { postroute } = require('./routes/postroute');
const { friendsroute } = require('./routes/friendsroute');
const { commentsroute } = require('./routes/commentroutes')

// Create a Redis client
const redisClient = redis.createClient();
redisClient.connect()
app.use(express.json())
app.use(cors());

// Middleware to check if the user has an active session
const requiresLogin = async (req, res, next) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access no cookie found'
      });
    }

    //substing method bits end and from using the uuid to get a constant num
    const sessionId = cookie.substring(16, 52)

    //console.log("require Login", sessionId)
    let sessionData = await redisClient.get(sessionId)
    if (!sessionData) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized access session doesnt have data'
      });
    } else {

      req.session = JSON.parse(sessionData)
      //console.log(req.session)
      next();
    }

    ;
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: "error with session"
    })
  }


};


app.use('/', requiresLogin)

// routes that require authentication

app.use('/comments', commentsroute);
app.use('/friends', friendsroute);
app.use('/posts', postroute);
app.use('/profile', profileroute);
app.use('/settings', settings);
app.use('/singlepost', post1);

const port = 4016;
app.listen(port, () => console.log(`Server running on port ${port}`));

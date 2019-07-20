const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hashedPass => {
      const user = new User({
        email: req.body.email,
        password: hashedPass
      });
      user.save()
        .then(result => {
          res.status(200).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    })
});


router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      console.log(user)
      if(!user) {
        return res.status(401).json({
          message: 'Unregisterd user'
        });
      }
      fetchedUser = user;
      return bcrypt.compareSync(req.body.password, user.password);
    })
    .then(result => {
      if(!result) {
        return res.status(401).json({
          message: 'Wrong password'
        })
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id },
        "something_very_hard",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth failed'
      });
    })
});

module.exports = router;

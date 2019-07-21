const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
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
            message: 'Invalid authentication credentials!'
          });
        });
    })
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
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
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid authentication credentials!'
      });
    })
}

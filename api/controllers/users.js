const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.users_signup = (req, res, next) => {
  User.find({
    email: req.body.email,
  })
    .exec()
    .then((user) => {
      if (user.length > 0) {
        return res.status(409).json({
          message: "This email exists.",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, encrypted) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: encrypted,
            });

            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                  user: {
                    email: result.email,
                  },
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};
exports.users_login = (req, res, next) => {
  User.find({
    email: req.body.email,
  })
    .exec()
    .then((users) => {
      if (users.length < 1) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }
      bcrypt.compare(req.body.password, users[0].password, (err, same) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed!",
          });
        }
        if (same) {
          const currentMill = new Date().getTime();
          const token = jwt.sign(
            {
              email: users[0].email,
              userId: users[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth successful.",
            token: token,
            user_id: users[0]._id,
            expires_at: currentMill + 1 * 60 * 60 * 1000,
          });
        }
        return res.status(401).json({
          message: "Auth failed!",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
exports.users_delete = (req, res, next) => {
  User.deleteOne({
    _id: req.params.userId,
  })
    .exec()
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: "No user found with provided ID",
        });
      }
      res.status(200).json({
        message: "User deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/users/signup",
          body: {
            email: "String",
            password: "String",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

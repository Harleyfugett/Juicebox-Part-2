require('dotenv').config();


const jwt = require('jsonwebtoken');

function requireUser(req, res, next) {
    if (!req.user) {
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
      });
    }
  
    next();
  }
  function requireActiveUser(req, res, next) {
    if (!req.user.ative) {
      next({
        name: "MissingUserError",
        message: "User not found"
      })
    }
  }

  module.exports = {
    requireUser
  }
const express = require('express');
require('dotenv').config();
const usersRouter = express.Router();

const jwt = require('jsonwebtoken');
async function myJwt(){
    let mySignedToken = await jwt.sign({"username": "albert", "password": "bertie99"}, process.env.JWT_SECRET)
    console.log(mySignedToken);
}

const {getAllUsers, getUserByUsername, createUser, getUserById, updateUser} = require('../db');
const { requireUser } = require('./utils');

usersRouter.use((req, res, next) => {
    next();
});

usersRouter.get('/', async (req,res)=>{
    try {

        const users = await getAllUsers();
        res.send({
            users
        });

    } catch (error) {
        console.log(error);
    }
});
usersRouter.post('/login', async (req,res,next)=>{
    const {username,password} = req.body;

    if(!username || !password){
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }
    try {
        const user = await getUserByUsername(username);
        if(user && user.password == password){
            const token = await jwt.sign({username, password}, process.env.JWT_SECRET)
            res.send({message: "you're logged in!", token: token});
        }else{
            next({
                name: 'IncorrectCredentialError',
                message: 'Username or password is incorrect'
            })
        }
    } catch (error) {
        console.log(error);
        next(error);
        
    }
});

usersRouter.post('/register', async (req, res, next) => {
    const { username, password, name, location } = req.body;
    try {
      const _user = await getUserByUsername(username);
      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      }
  
      const user = await createUser({
        username,
        password,
        name,
        location,
      });
      console.log(user);
      const token = jwt.sign({ 
        id: user.id,
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });
  
      res.send({ 
        message: "thank you for signing up",
        token 
      });
    } catch ({ name, message }) {
      next({ name, message })
    } 
  });

  usersRouter.delete('/:userId',requireUser, async (req,res, next) =>{
    try {
        const user = await getUserById(req.params.userId);
        if (user && user.id === req.user.id) {
            const updatedUser = await updateUser(user.id, { active: false });
            res.send({ user: updatedUser });
        }else{
            next(user ? { 
                name: "UnauthorizedUserError",
                message: "You cannot delete a User"
                } : {
                name: "User not found",
                message: "That User doesn't exist"
                });
        }
    } catch ({name, message}) {
        next({
            name,
            message
        })
    }

  })

module.exports = usersRouter;
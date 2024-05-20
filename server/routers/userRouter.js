const express = require('express');
const userControllers = require('../controllers/userControllers');
const checkAuthentication = require('../middleware/checkAuthentication');

const userRouter = express.Router();

userRouter.post('/', userControllers.createUser);

// These actions require users to be logged in (authentication)
// Express lets us pass a piece of middleware to run for a specific endpoint
userRouter.get('/', checkAuthentication, userControllers.listUsers);
userRouter.get('/:id', userControllers.showUser);
// userRouter.get('/programs/:id', checkAuthentication, userControllers.getPrograms);
userRouter.get('/recommends/:id', checkAuthentication, userControllers.getAllRecommends);
userRouter.patch('/:id', checkAuthentication, userControllers.updateUser);

module.exports = userRouter;

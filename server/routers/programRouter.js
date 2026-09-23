const express = require('express');
const programControllers = require("../controllers/programControllers");
const checkAuthentication = require('../middleware/checkAuthentication');

const programRouter = express.Router();

programRouter.post("/",checkAuthentication, programControllers.createProgram);

// These actions require users to be logged in (authentication)
// Express lets us pass a piece of middleware to run for a specific endpoint
programRouter.get("/", programControllers.listAllPrograms);
programRouter.get('/recommends/:id', programControllers.getRecommends);
programRouter.get('/comments/:id', programControllers.getAllComments)
programRouter.get("/:id",  programControllers.showProgram);
programRouter.patch("/:id", checkAuthentication, programControllers.updateProgram);
programRouter.delete('/:id', checkAuthentication, programControllers.deleteProgram)
module.exports = programRouter;

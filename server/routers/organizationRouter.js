const express = require('express');
const organizationControllers = require('../controllers/organizationControllers');
const checkAuthentication = require('../middleware/checkAuthentication');

const organizationRouter = express.Router();

organizationRouter.post('/', organizationControllers.createOrg);

organizationRouter.get("/", checkAuthentication, organizationControllers.listOrganizations);
organizationRouter.get("/programs/:id", checkAuthentication, organizationControllers.showOrganizationPrograms);
organizationRouter.get("/:id", organizationControllers.showOrganization);
organizationRouter.patch("/:id", checkAuthentication, organizationControllers.updateOrganization);

module.exports = organizationRouter;

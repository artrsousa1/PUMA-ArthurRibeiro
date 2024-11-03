const router = require('express').Router();

const userController = require('../controller/userController');


router.get('/users', async (req, res) => await userController.getUsers(req,res));
router.post('/users', async (req, res) => await userController.addUser(req,res));
router.delete('/users/:username', async (req, res) => await userController.deleteUser(req,res));
router.patch('/users/:username/toggle-star', async (req, res) => await userController.favoriteUser(req,res));

module.exports = router;
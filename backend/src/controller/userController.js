const userManager = require('../manager/userManager');
const { PrismaClientKnownRequestError } = require('@prisma/client');

const userController = {
    getUsers: async (req, res) => {
        try {
            const users = await userManager.getAllUsers();
            res.status(200).json({ data: users });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    addUser: async (req, res) => {
        try {
            const username = req.body.username;
            const addedUser = await userManager.addUser(username);
            res.status(201).json({ message: `Usuário ${addedUser.username} adicionado com sucesso.` });
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    return res.status(400).json({ error: 'Usuário já cadastrado.'})
                }
            }
            res.status(error.cause).json({ error: error.message });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const username = req.params.username;
            const deletedUser = await userManager.deleteUser(username);
            res.status(200).json({ 
                message: `Usuário ${deletedUser.username} deletado com sucesso.`
            })
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2025') {
                    return res.status(404).json({ error: 'Usuário não encontrado.'})
                }
            }
            res.status(500).json({ error: 'Internal server error.' });
        }
    },
    favoriteUser: async (req, res) => {
        try {
            const username = req.params.username;
            const { action, user } = await userManager.toggleFavorite(username);
            res.status(200).json({
                message: `Usuário ${user} ${action} com sucesso.`
            })
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2025') {
                    return res.status(404).json({ error: 'Usuário não encontrado.'})
                }
            }
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = userController;
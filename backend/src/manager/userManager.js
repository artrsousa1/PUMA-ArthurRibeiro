require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const userManager = {
    getAllUsers: async () => {
        const allUsers = await prisma.user.findMany();

        return allUsers;
    },
    addUser: async (username) => {
        if (!username) {
            throw new Error('Campo username é obrigatório.', { cause: 400 });
        }

        const userCount = await prisma.user.count();
        if (userCount >= 5) {
            throw new Error('Quantidade máxima de usuários atingida.', { cause: 400 });
        }

        const response = await fetch(`${process.env.GITHUB_API}/users/${username}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Usuário não encontrado.', { cause: 404 });
            } else {
                throw new Error('Internal server error.', { cause: 500 });
            }
        }
        const data = await response.json();
        const user = { 
            name: data.name,
            pictureUrl: data.avatar_url,
            profileUrl: data.html_url,
            username: data.login
        }

        const newUser = await prisma.user.create({ data: user });

        return newUser;
    },
    deleteUser: async (username) => {
        const deletedsUser = await prisma.user.delete({ where: { username: username } })

        return deletedsUser;
    },
    toggleFavorite: async (username) => {
        const favoritedUser = await prisma.user.findFirst({
            where: { isFavorited: true }
        });

        if (favoritedUser) {
            await prisma.user.update({
                where: { username: favoritedUser.username },
                data: { isFavorited: false }
            });

            if (favoritedUser.username === username) {
                return {
                    action: "removido",
                    user: favoritedUser.username
                };
            }
        }

        const favorited = await prisma.user.update({
            where: { username: username },
            data: { isFavorited: true }
        })

        return {
            action: "favoritado",
            user: favorited.username
        };
    }
}

module.exports = userManager;
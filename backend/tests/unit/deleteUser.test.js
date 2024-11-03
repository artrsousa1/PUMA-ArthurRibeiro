const { PrismaClient } = require('@prisma/client');
const request = require('supertest');
const server = require('../../src/server');

const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
    server.close();
});

beforeEach(async () => {
    await prisma.user.deleteMany();
});

describe('Delete users router', () => {
    it('should throw an error when user does not exist', async () => {
        await request(server)
            .delete('/api/users/testusername')
            .expect(404)
            .then((response) => {
                expect(response.body.error).toBe('Usuário não encontrado.');
            });
    })

    it('should delete a user successfully when it exists', async () => {
        await prisma.user.create({
            data: {
                username: 'testusername',
                name: 'Test User',
                pictureUrl: 'https://avatars.githubusercontent.com/u/00000000?v=4',
                profileUrl: 'https://github.com.br/testusername'
            }
        });

        await request(server)
            .delete('/api/users/testusername')
            .expect(200)
            .then((response) => {
                expect(response.body.message).toBe('Usuário testusername deletado com sucesso.');
            });
    })
})
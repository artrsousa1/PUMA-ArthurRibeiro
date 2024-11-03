const { PrismaClient } = require('@prisma/client');
const request = require('supertest');
const server = require('../../src/server');

global.fetch = jest.fn();

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
    jest.clearAllMocks();
});

describe('Add users router', () => {
    it('should throw an error when username is not passed', async () => {
        await request(server)
            .post('/api/users')
            .send()
            .expect(400)
            .then((response) => {
                expect(response.body.error).toBe('Campo username é obrigatório.');
            });
    });

    it('should throw an error if maximum user count is reached', async () => {
        for (let i = 1; i <= 5; i++) {
            await prisma.user.create({
                data: {
                    name: `User${i}`,
                    pictureUrl: `https://picture.com/user${i}.png`,
                    profileUrl: `https://github.com/user${i}`,
                    username: `user${i}`
                }
            });
        }
        await request(server)
            .post('/api/users')
            .send({
                username: 'artrsousa1'
            })
            .expect(400)
            .then((response) => {
                expect(response.body.error).toBe('Quantidade máxima de usuários atingida.');
            });

    });

    it('should add a user when github api fetch is successful', async () => {
        const mockResponse = {
            name: 'artrsousa1',
            avatar_url: 'https://avatars.githubusercontent.com/u/109052099?v=4',
            html_url: 'https://github.com/artrsousa1',
            login: 'artrsousa1'
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse),
        });

        await request(server)
            .post('/api/users')
            .send({
                username: 'artrsousa1'
            })
            .expect(201)
            .then((response) => {
                expect(response.body.message).toBe('Usuário artrsousa1 adicionado com sucesso.');
            });
    });

    it('should throw an error when user is not found', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        });

        await request(server)
            .post('/api/users')
            .send({
                username: 'artrsousa1'
            })
            .expect(404)
            .then((response) => {
                expect(response.body.error).toBe('Usuário não encontrado.');
            });
    });

    it('should throw an error if tries to add an already existing user', async () => {
        await prisma.user.create({
            data: {
                username: 'testusername',
                name: 'Test User',
                pictureUrl: 'https://avatars.githubusercontent.com/u/00000000?v=4',
                profileUrl: 'https://https://github.com/testusername'
            }
        });

        const mockResponse = {
            login: 'testusername',
            name: 'Test User',
            avatar_url: 'https://avatars.githubusercontent.com/u/00000000?v=4',
            html_url: 'https://https://github.com/testusername'
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse),
        });

        await request(server)
            .post('/api/users')
            .send({
                username: 'testusername'
            })
            .expect(400)
            .then((response) => {
                expect(response.body.error).toBe('Usuário já cadastrado.');
            });
    });
});
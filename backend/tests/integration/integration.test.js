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
    jest.clearAllMocks();
});

const mockResponse = {
    name: 'artrsousa1',
    avatar_url: 'https://avatars.githubusercontent.com/u/109052099?v=4',
    html_url: 'https://github.com/artrsousa1',
    login: 'artrsousa1'
}

describe('User API integration', () => {
    it('should add a user when github api fetch is successful', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse),
        });

        await request(server)
            .post('/api/users')
            .send({
                username: mockResponse.login
            })
            .expect(201)
            .then((response) => {
                expect(response.body.message).toBe('Usuário artrsousa1 adicionado com sucesso.');
            });
    });
    it('should star the user if the user is not already starred', async () => {
        const user = await prisma.user.findUnique({
            where: { username: mockResponse.login }
        });
        expect(user.isFavorited).toBe(false);

        await request(server)
            .patch(`/api/users/${mockResponse.login}/toggle-star`)
            .expect(200)

        const starredUser = await prisma.user.findFirst({
            where: { isFavorited: true }
        });

        expect(starredUser.username).toBe(mockResponse.login);
    });
    it('should unstar the user if the user is already starred', async () => {
        const user = await prisma.user.findUnique({
            where: { username: mockResponse.login }
        });
        expect(user.isFavorited).toBe(true);

        await request(server)
            .patch(`/api/users/${mockResponse.login}/toggle-star`)
            .expect(200)

        const unstarred = await prisma.user.findUnique({
            where: { username: mockResponse.login }
        });

        expect(unstarred.isFavorited).toBe(false);
    });
    it('should return the only user saved', async () => {
        await request(server)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                expect(response.body.data).toHaveLength(1);
                expect(response.body.data[0].username).toBe(mockResponse.login);
            });
        
        
    });
    it('should throw an error when trying to add an already existing user', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse),
        });

        await request(server)
            .post('/api/users')
            .send({
                username: mockResponse.login
            })
            .expect(400)
            .then((response) => {
                expect(response.body.error).toBe('Usuário já cadastrado.');
            });
    });
    it('should delete the user successfully', async () => {
        await request(server)
            .delete(`/api/users/${mockResponse.login}`)
            .expect(200)
            .then((response) => {
                expect(response.body.message).toBe(`Usuário ${mockResponse.login} deletado com sucesso.`);
            });
    });
    it('should not add more then 5 users', async() => {
        
    })

})
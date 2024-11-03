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

describe('Get users router', () => {
    it('should return all users successfully', async () => {
        await prisma.user.create({
            data: {
                username: 'testusername',
                name: 'Test User',
                pictureUrl: 'https://avatars.githubusercontent.com/u/00000000?v=4',
                profileUrl: 'https://github.com.br/testusername'
            }
        });

        await request(server)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                expect(response.body.data).toHaveLength(1);
            });
    });
    it('should return an empty array when there are no users', async () => {
        await request(server)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                expect(response.body.data).toHaveLength(0);
            });
    });
    it('should return the response with correct format', async () => {
        await prisma.user.create({
            data: {
                username: 'testusername',
                name: 'Test User',
                pictureUrl: 'https://avatars.githubusercontent.com/u/00000000?v=4',
                profileUrl: 'https://github.com.br/testusername'
            }
        });

        await request(server)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                expect(response.body.data[0].username).toBe('testusername');
                expect(response.body.data[0].name).toBe('Test User');
                expect(response.body.data[0].pictureUrl).toBe('https://avatars.githubusercontent.com/u/00000000?v=4');
                expect(response.body.data[0].profileUrl).toBe('https://github.com.br/testusername');
            });
    });
})
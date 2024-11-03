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
    for (let i = 1; i <= 5; i++) {
        await prisma.user.create({
            data: {
                name: `User${i}`,
                pictureUrl: `https://picture.com/user${i}.png`,
                profileUrl: `https://github.com/user${i}`,
                username: `user${i}`
            }
        })
    }
});

describe('Toggle star router', () => {
    it('should star the user if the user is not already starred', async () => {
        const user1 = await prisma.user.findUnique({
            where: { username: 'user1' }
        });
        expect(user1.isFavorited).toBe(false);

        await request(server)
            .patch('/api/users/user1/toggle-star')
            .expect(200)
        
        const starredUser = await prisma.user.findFirst({
            where: { isFavorited: true }
        });
        expect(starredUser.username).toBe('user1');
    });
    it('should unstar the user if the user is already starred', async () => {
        await request(server)
            .patch('/api/users/user1/toggle-star')
            .expect(200)
        
        const user1 = await prisma.user.findUnique({
            where: { username: 'user1' }
        });
        expect(user1.isFavorited).toBe(true);

        await request(server)
            .patch('/api/users/user1/toggle-star')
            .expect(200)
        
        const unstarred = await prisma.user.findUnique({
            where: { username: 'user1' }
        });

        expect(unstarred.isFavorited).toBe(false);
    });
    it('should unstar the user if the user is starred and another user is set to starred', async () => {
        await request(server)
            .patch('/api/users/user1/toggle-star')
            .expect(200)
        
        const user1 = await prisma.user.findUnique({
            where: { username: 'user1' }
        });
        expect(user1.isFavorited).toBe(true);

        await request(server)
            .patch('/api/users/user2/toggle-star')
            .expect(200)
        
        const starredUser = await prisma.user.findFirst({
            where: { isFavorited: true }
        });
        expect(starredUser.username).toBe('user2');

        const unstarred = await prisma.user.findUnique({
            where: { username: 'user1' }
        });

        expect(unstarred.isFavorited).toBe(false);
    });

    it('should throw an error when user does not exist', async () => {
        await request(server)
            .patch('/api/users/inexistente/toggle-star')
            .expect(404)
            .then((response) => {
                expect(response.body.error).toBe('Usuário não encontrado.');
            });
    });

    it('should not star more then 1 user', async() => {
        await request(server)
            .patch('/api/users/user1/toggle-star')
            .expect(200)
        
        await request(server)
            .patch('/api/users/user2/toggle-star')
            .expect(200)
        
        await request(server)
            .patch('/api/users/user3/toggle-star')
            .expect(200)
        
        await request(server)
            .patch('/api/users/user4/toggle-star')
            .expect(200)
        
        await request(server)
            .patch('/api/users/user5/toggle-star')
            .expect(200)
        
        const count = await prisma.user.count({
            where: { isFavorited: true }
        });
        expect(count).toBe(1);
    })
})
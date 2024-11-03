require('dotenv').config();
const app = require('./app');
const port = 8000;

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

module.exports =  server;
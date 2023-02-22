import express from 'express';

const PORT = 3000;

const app = express();

app.get('/', (req, res) => res.send('Hello World')).listen(PORT, () =>
    console.log(`running api on :${PORT}`)
);

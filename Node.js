// server.js
require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const fetch = require('node-fetch');
const multer = require('multer');
const upload = multer();

const app = express();
app.use(express.json());

const USER = process.env.ST_USER;
const PASS = process.env.ST_PASS;
const KEY = crypto.createHash('md5').update(`${USER}:${PASS}`).digest('hex');

app.post('/upload', upload.single('file'), async (req, res) => {
  const ticket = await (await fetch(`https://api.streamtape.com/upload/get_ticket?login=${USER}&key=${KEY}`)).json();
  const form = new FormData();
  form.append('file1', req.file.buffer, req.file.originalname);
  const up = await fetch(`https://tapecontent.net/${ticket.result.ticket}`, { method: 'POST', body: form });
  res.json(await up.json());
});

app.listen(3000);

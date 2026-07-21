const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', './views');

const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_TOKEN;
const OBJECT_TYPE = '2-205806617';

const headers = {
  Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
  'Content-Type': 'application/json'
};

// ROUTE 1 - Homepage: GET all custom object records, show them in a table
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=name,author,genre`;
  try {
    const response = await axios.get(url, { headers });
    const records = response.data.results;
    res.render('homepage', { title: 'Books | Integrating With HubSpot I Practicum', records });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching records');
  }
});

// ROUTE 2 - Show the form
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3 - Receive form data, create a record, redirect home
app.post('/update-cobj', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;
  const newRecord = {
    properties: {
      name: req.body.name,
      author: req.body.author,
      genre: req.body.genre
    }
  };
  try {
    await axios.post(url, newRecord, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error creating record');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));

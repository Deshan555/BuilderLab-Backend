require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const username = process.env.USERNAMED;
const password = encodeURIComponent(process.env.PASSWORD);
const cluster = process.env.CLUSTER;
const options = process.env.OPTIONS;

const uri = `mongodb+srv://${username}:${password}@${cluster}/${options}`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    db = client.db("checkLists"); // replace with your database name
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

app.get('/data', async (req, res) => {
  try {
    const data = await db.collection('templates').find().toArray(); // replace with your collection name
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/data', async (req, res) => {
  try {
    const result = await db.collection('templates').insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to insert data' });
  }
});

app.put('/data/:id', async (req, res) => {
  try {
    const result = await db.collection('templates').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update data' });
  }
});

app.delete('/data/:id', async (req, res) => {
  try {
    const result = await db.collection('templates').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete data' });
  }
});

app.get('/checklists', async (req, res) => {
    try {
      const checklists = await db.collection('checkLists').find().toArray();
      res.json(checklists);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch checklists' });
    }
  });
  
  app.get('/checklists/:id', async (req, res) => {
    try {
      const checklist = await db.collection('checkLists').findOne({ _id: new ObjectId(req.params.id) });
      res.json(checklist);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch checklist' });
    }
  });
  
  app.post('/checklists', async (req, res) => {
    try {
      const checklist = {
        ...req.body,
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
      };
      const result = await db.collection('checkLists').insertOne(checklist);
      res.json(result.ops[0]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create checklist' });
    }
  });
  
  app.put('/checklists/:id', async (req, res) => {
    try {
      const updateFields = {
        ...req.body,
        updatedOn: new Date().toISOString(),
      };
      const result = await db.collection('checkLists').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updateFields }
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update checklist' });
    }
  });
  
  app.delete('/checklists/:id', async (req, res) => {
    try {
      const result = await db.collection('checkLists').deleteOne({ _id: new ObjectId(req.params.id) });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete checklist' });
    }
  });

// Correct the port number
app.listen(3001, () => console.log('Server is running on port 3001'));

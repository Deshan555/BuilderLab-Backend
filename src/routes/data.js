const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (db) => {
  router.get('/', async (req, res) => {
    try {
      const data = await db.collection('templates').find().toArray();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const data = {
        ...req.body,
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
        uniqueId: Math.floor(Math.random() * 1000000),
      };
      const result = await db.collection('templates').insertOne(data);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to insert data' });
    }
  });

  router.put('/:id', async (req, res) => {
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

  router.delete('/:id', async (req, res) => {
    try {
      const result = await db.collection('templates').deleteOne({ _id: new ObjectId(req.params.id) });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete data' });
    }
  });
  router.get('/checklist/:checklistName', async (req, res) => {
    try {
      const data = await db.collection('templates').find({ checklistName: req.params.checklistName }).toArray();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

  return router;
};

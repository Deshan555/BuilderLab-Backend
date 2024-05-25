const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (db) => {
  router.get('/', async (req, res) => {
    try {
      const checklists = await db.collection('checkLists').find().toArray();
      res.json(checklists);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch checklists' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const checklist = await db.collection('checkLists').findOne({ _id: new ObjectId(req.params.id) });
      res.json(checklist);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch checklist' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const checklist = {
        ...req.body,
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
      };
      const result = await db.collection('checkLists').insertOne(checklist);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create checklist' });
    }
  });

  router.put('/:id', async (req, res) => {
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

  router.delete('/:id', async (req, res) => {
    try {
      const result = await db.collection('checkLists').deleteOne({ _id: new ObjectId(req.params.id) });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete checklist' });
    }
  });

  return router;
};

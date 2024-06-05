const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { incrementVersion } = require('../utils/versions');
const { version } = require('winston');

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
      const dataFetch = await db.collection('templates').find({ 'section.sectionID': req.body?.section.sectionID }).toArray();
      let versionNumber = 'V1.0.0';
      if (dataFetch.length > 0) {
        let latestData = dataFetch?.sort((a, b) => {
          return new Date(b?.createdOn) - new Date(a?.createdOn);
        });
        let latestRecord = latestData[0];
        versionNumber = incrementVersion(latestRecord?.version);
      }
      const data = {
        ...req.body,
        version: versionNumber,
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
        uniqueId: Math.floor(Math.random() * 1000000),
      };
      const result = await db.collection('templates').insertOne(data);
      res.json(result);
    } catch (err) {
      console.log(err);
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
      const data = await db.collection('templates').find({ checklistID: req?.params?.checklistName }).toArray();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  router.get('/checklist/id/:uniqueId', async (req, res) => {
    try {
      const data = await db.collection('templates').find({ uniqueId: parseInt(req.params.uniqueId) }).toArray();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  router.get('/checklist/section/:sectionID', async (req, res) => {
    try {
      const data = await db.collection('templates').find({ 'section.sectionID': req.params.sectionID }).toArray();
      let latestData = data.sort((a, b) => {
        return new Date(b.createdOn) - new Date(a.createdOn);
      });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }); 

  return router;
};

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (db) => {
    router.get('/', async (req, res) => {
        try {
            const mainGroups = await db.collection('mainGroups').find().toArray();
            res.json(mainGroups);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch mainGroups' });
        }
    });
    router.get('/:id', async (req, res) => {
        try {
            const mainGroup = await db.collection('mainGroups').findOne({ _id: new ObjectId(req.params.id) });
            res.json(mainGroup);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch mainGroup' });
        }
    });
    router.post('/', async (req, res) => {
        try {
            const mainGroup = {
                ...req.body,
                groupId: Math.floor(Math.random() * 1000000),
                createdOn: new Date().toISOString(),
                updatedOn: new Date().toISOString(),
            };
            const result = await db.collection('mainGroups').insertOne(mainGroup);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create mainGroup' });
        }
    });
    router.get('/group/:groupId', async (req, res) => {
        try {
            const mainGroup = await db.collection('mainGroups').find({ groupId: req.params.groupId }).toArray();
            res.json(mainGroup);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch mainGroup' });
        }
    });
    router.put('/:id', async (req, res) => {
        try {
            const updateFields = {
                ...req.body,
                updatedOn: new Date().toISOString(),
            };
            const result = await db.collection('mainGroups').updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: updateFields }
            );
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update mainGroup' });
        }
    });
    router.delete('/:id', async (req, res) => {
        try {
            const result = await db.collection('mainGroups').deleteOne({ _id: new ObjectId(req.params.id) });
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete mainGroup' });
        }
    });

    return router;
};


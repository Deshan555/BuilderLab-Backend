const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { incrementVersion } = require('../utils/versions');
const { version } = require('winston');
const checklists = require('./checklists');

module.exports = (db) => {

    router.get('/checklist/full/:checklistID', async (req, res) => {
        try {
            const checkList = await db.collection('checkLists').find({ checklistID: req.params.checklistID }).toArray();
            let sections = [];
            let groups = [];
            checkList.forEach(element => {
                sections = sections.concat(element.sections);
                groups = groups.concat(element.groups);
            });
            groups.forEach(group => {
                group.sections = sections.filter(section => section.groupID === group.groupID);
                group.active = true;
            });
            const sectionsFetch = await db.collection('templates').find({ checklistID: req.params.checklistID }).toArray();
//             groups.forEach(group => {
//                 // group.sections.forEach(section => {
//                 //     section.templates = sectionsFetch.filter(template => template.section.sectionID === section.sectionID);
//                 // });
//                 group.sections.forEach(section => {
//     section.templates = sectionsFetch.filter(template => template.section.sectionID === section.sectionID);
//     section.active = checkList[0].isActive === true ? true : false;
// });
//             });
groups.forEach(group => {
    group.sections.forEach(section => {
        section.templates = sectionsFetch.filter(template => template.section.sectionID === section.sectionID);
        section.active = checkList[0].isActive === true ? true : false;
        section.templates.forEach(template => {
            template.active = checkList[0].isActive === true ? true : false;
        });
    });
});
//             groups.forEach(group => {
//     group.sections.forEach(section => {
//         section.templates = sectionsFetch.filter(template => template.section.sectionID === section.sectionID);
//         section.active = checkList[0].isActive === true ? true : false;
//     });
// });
            const responseJson = {
                "_id": checkList[0]._id,
                "name": checkList[0].name,
                "description": checkList[0].description,
                "version": checkList[0].version,
                "active": checkList[0].isActive === true ? true : false,
                "checklistID": checkList[0].checklistID,
                "sectionCount": checkList[0].sectionCount,
                "groupCount": checkList[0].groupCount,
                "createdBy": checkList[0].createdBy,
                "createdByMail": checkList[0].createdByMail,
                "groups": groups,
            }
            res.json(responseJson);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });

    return router;
}


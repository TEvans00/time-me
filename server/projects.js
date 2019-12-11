const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const auth = require("./auth.js");

//
// Projects
//

const projectSchema = new mongoose.Schema({
  title: String,
  descript: String,
  time: Number,
  started: Boolean,
  currStart: Number,
});

const Project = mongoose.model('Project', projectSchema);

router.get('/', async(req, res) => {
  try {
    let projects = await Project.find();
    return res.send(projects);
  }
  catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get('/:id', async(req, res) => {
  try {
    let project = await Project.findOne({
      _id: req.params.id
    });
    return res.sendStatus(project);
  }
  catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post('/', async(req, res) => {
  const project = new Project({
    title: req.body.title,
    descript: req.body.descript,
    time: 0,
    started: false,
    currStart: 0,
  });
  try {
    await project.save();
    return res.send(project);
  }
  catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put('/stop/:id', async(req, res) => {
  try {
    let id = req.params.id;

    Project.findOne({ "_id": id }, function(err, project) {
      let oldTime = project.time;
      let timeToAdd = req.body.t - project.currStart;
      console.log(oldTime);
      console.log(timeToAdd);
      project.time = timeToAdd;
      project.started = false;
      project.save();
      return res.send(project);
    });
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.put('/start/:id', async(req, res) => {
  try {
    let id = req.params.id;
    Project.findOne({ "_id": id }, function(err, project) {
      project.currStart = req.body.t;
      project.started = true;
      project.save();
      return res.send(project);
    });
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.delete('/:id', auth.verifyToken, async(req, res) => {
  try {
    await Project.deleteOne({
      _id: req.params.id
    });
    return res.sendStatus(200);
  }
  catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;

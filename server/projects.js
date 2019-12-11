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
  total: Number,
  hours: Number,
  minutes: Number,
  seconds: Number,
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

router.post('/', auth.verifyToken, async(req, res) => {
  const project = new Project({
    title: req.body.title,
    descript: req.body.descript,
    total: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
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

router.put('/stop/:id', auth.verifyToken, async(req, res) => {
  try {
    let id = req.params.id;

    Project.findOne({ "_id": id }, function(err, project) {
      let oldTime = project.total;
      console.log(project.total);
      let timeToAdd = Math.round((req.body.t - project.currStart) / 1000);
      console.log(req.body.t);
      console.log(project.currStart);
      console.log(timeToAdd);
      project.total = oldTime + timeToAdd;
      project.seconds = project.total % 60;
      project.minutes = ((project.total - project.seconds) % 3600) / 60;
      project.hours = ((project.total - (project.seconds + (project.minutes * 60))) % 216000) / 3600;
      console.log(project.seconds);
      console.log(project.minutes);
      console.log(project.hours);
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

router.put('/start/:id', auth.verifyToken, async(req, res) => {
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

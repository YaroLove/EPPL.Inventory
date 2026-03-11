const { Router } = require('express');
const express = require('express');

const itemsController = require('../controllers/itemsController');

const router = express.Router();

// GET ROUTES
router.get('/', (req, res) => {
  res.json('your reached the main page!');
});
router.get('/MedCart', itemsController.getMedCart, (req, res) => {
  res.status(200).json(res.locals.allMedCart);
});
router.get('/PowerLab', itemsController.getPowerLab, (req, res) => {
  res.status(200).json(res.locals.allPowerLab);
});
router.get('/Physioflow', itemsController.getPhysioflow, (req, res) => {
  res.status(200).json(res.locals.allPhysioflow);
});
router.get('/Bloodwork', itemsController.getBloodwork, (req, res) => {
  res.status(200).json(res.locals.allBloodwork);
});

// POST ROUTES
router.post('/MedCart', itemsController.addMedCart, (req, res) => {
  res.sendStatus(200);
});
router.post('/PowerLab', itemsController.addPowerLab, (req, res) => {
  res.sendStatus(200);
});
router.post('/Physioflow', itemsController.addPhysioflow, (req, res) => {
  res.sendStatus(200);
});
router.post('/Bloodwork', itemsController.addBloodwork, (req, res) => {
  res.sendStatus(200);
});

// DELETE ROUTES
router.delete(
  '/MedCart/:id',
  itemsController.deleteMedCart,
  (req, res) => {
    res.sendStatus(200);
  }
);
router.delete('/PowerLab/:id', itemsController.deletePowerLab, (req, res) => {
  res.sendStatus(200);
});
router.delete('/Physioflow/:id', itemsController.deletePhysioflow, (req, res) => {
  res.sendStatus(200);
});
router.delete('/Bloodwork/:id', itemsController.deleteBloodwork, (req, res) => {
  res.sendStatus(200);
});

// UPDATE ROUTES
router.put('/MedCart/:id', itemsController.updateMedCart, (req, res) => {
  res.sendStatus(200);
});
router.put('/PowerLab/:id', itemsController.updatePowerLab, (req, res) => {
  res.sendStatus(200);
});
router.put('/Physioflow/:id', itemsController.updatePhysioflow, (req, res) => {
  res.sendStatus(200);
});
router.put('/Bloodwork/:id', itemsController.updateBloodwork, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;

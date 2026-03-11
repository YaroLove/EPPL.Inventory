const { model } = require('mongoose');
const models = require('../models/itemsModels');

const itemsController = {};

// GET MIDDLEWARE
itemsController.getMedCart = (req, res, next) => {
  models.MedCart.find()
    .exec()
    .then((MedCart) => {
      res.locals.allMedCart = MedCart;
      next();
    })
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};
itemsController.getPowerLab = (req, res, next) => {
  models.PowerLab.find()
    .exec()
    .then((PowerLab) => {
      res.locals.allPowerLab = PowerLab;
      next();
    })
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};
itemsController.getBloodwork = (req, res, next) => {
  models.Bloodwork.find()
    .exec()
    .then((Bloodwork) => {
      res.locals.allBloodwork = Bloodwork;
      next();
    })
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};
itemsController.getPhysioflow = (req, res, next) => {
  models.Physioflow.find()
    .exec()
    .then((Physioflow) => {
      res.locals.allPhysioflow = Physioflow;
      next();
    })
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};

// POST MIDDLEWARE
itemsController.addMedCart = (req, res, next) => {
  models.MedCart.create(req.body)
    .then(() => next())
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};
itemsController.addPowerLab = (req, res, next) => {
  models.PowerLab.create(req.body)
    .then(() => next())
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};
itemsController.addPhysioflow = (req, res, next) => {
  models.Physioflow.create(req.body)
    .then(() => next())
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};
itemsController.addBloodwork = (req, res, next) => {
  models.Bloodwork.create(req.body)
    .then(() => next())
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};

// DELETE MIDDLEWARE
itemsController.deleteMedCart = (req, res, next) => {
  const itemToDeleteId = req.params.id;

  models.MedCart.deleteOne({ _id: itemToDeleteId })
    .exec()
    .then(() => next())
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};
itemsController.deletePowerLab = (req, res, next) => {
  const itemToDeleteId = req.params.id;

  models.PowerLab.deleteOne({ _id: itemToDeleteId })
    .exec()
    .then(() => next())
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};
itemsController.deletePhysioflow = (req, res, next) => {
  const itemToDeleteId = req.params.id;

  models.Physioflow.deleteOne({ _id: itemToDeleteId })
    .exec()
    .then(() => next())
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};
itemsController.deleteBloodwork = (req, res, next) => {
  const itemToDeleteId = req.params.id;

  models.Bloodwork.deleteOne({ _id: itemToDeleteId })
    .exec()
    .then(() => next())
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};

// UPDATE MIDDLEWARE
itemsController.updateMedCart = (req, res, next) => {
  const itemToUpdateId = req.params.id;

  models.MedCart.findOneAndUpdate({ _id: itemToUpdateId }, req.body)
    .exec()
    .then(() => next())
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};
itemsController.updatePowerLab = (req, res, next) => {
  const itemToUpdateId = req.params.id;

  models.PowerLab.findOneAndUpdate({ _id: itemToUpdateId }, req.body)
    .exec()
    .then(() => next())
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};
itemsController.updatePhysioflow = (req, res, next) => {
  const itemToUpdateId = req.params.id;

  models.Physioflow.findOneAndUpdate({ _id: itemToUpdateId }, req.body)
    .exec()
    .then(() => next())
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};
itemsController.updateBloodwork = (req, res, next) => {
  const itemToUpdateId = req.params.id;

  models.Bloodwork.findOneAndUpdate({ _id: itemToUpdateId }, req.body)
    .exec()
    .then(() => next())
    .catch((err) => {
      next({
        code: 500,
        error: err,
      });
    });
};

module.exports = itemsController;

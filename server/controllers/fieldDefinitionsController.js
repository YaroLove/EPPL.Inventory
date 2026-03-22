const { FieldDefinition, FIELD_TYPES } = require('../models/itemsModels');
const { PROTECTED_FROM_HIDE } = require('../utils/seedFieldDefinitions');

const fieldDefinitionsController = {};

fieldDefinitionsController.getAll = (req, res, next) => {
  const includeHidden = req.query.includeHidden === 'true';
  const query = includeHidden ? {} : { hidden: false };
  FieldDefinition.find(query)
    .sort({ order: 1, label: 1 })
    .exec()
    .then((defs) => {
      res.locals.fieldDefinitions = defs;
      next();
    })
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

fieldDefinitionsController.add = (req, res, next) => {
  const {
    label,
    fieldKey,
    fieldType = 'text',
    required = false,
    order = 999,
    section = 'optional',
  } = req.body;

  if (!label || !fieldKey) {
    return next({ code: 400, error: 'label and fieldKey are required' });
  }
  if (!FIELD_TYPES.includes(fieldType)) {
    return next({ code: 400, error: 'Invalid fieldType' });
  }
  const safeKey = String(fieldKey).replace(/[^a-zA-Z0-9_-]/g, '');
  if (!safeKey) {
    return next({ code: 400, error: 'fieldKey must contain alphanumeric characters' });
  }
  const prefixedKey = `custom_${safeKey}`;

  FieldDefinition.create({
    label,
    fieldKey: prefixedKey,
    fieldType,
    required: Boolean(required),
    order: Number(order) || 0,
    section: section === 'required' ? 'required' : 'optional',
    builtin: false,
    hidden: false,
  })
    .then((doc) => {
      res.locals.fieldDefinition = doc;
      next();
    })
    .catch((err) => {
      next({ code: 500, error: err });
    });
};

fieldDefinitionsController.update = async (req, res, next) => {
  const { id } = req.params;
  const updates = { ...req.body };
  delete updates._id;
  delete updates.builtin;

  try {
    const doc = await FieldDefinition.findById(id).exec();
    if (!doc) {
      return next({ code: 404, error: 'Field definition not found' });
    }
    if (doc.builtin && updates.fieldKey !== undefined && updates.fieldKey !== doc.fieldKey) {
      return next({ code: 400, error: 'Cannot change fieldKey for built-in fields' });
    }
    if (updates.fieldType !== undefined && !FIELD_TYPES.includes(updates.fieldType)) {
      return next({ code: 400, error: 'Invalid fieldType' });
    }
    Object.assign(doc, updates);
    const saved = await doc.save();
    res.locals.fieldDefinition = saved;
    next();
  } catch (err) {
    next({ code: 500, error: err });
  }
};

fieldDefinitionsController.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const doc = await FieldDefinition.findById(id).exec();
    if (!doc) {
      return next({ code: 404, error: 'Field definition not found' });
    }
    if (doc.builtin && PROTECTED_FROM_HIDE.has(doc.fieldKey)) {
      return next({
        code: 403,
        error: 'Cannot remove this built-in field from the form',
      });
    }
    if (doc.builtin) {
      doc.hidden = true;
      await doc.save();
    } else {
      await FieldDefinition.deleteOne({ _id: id }).exec();
    }
    next();
  } catch (err) {
    next({ code: 500, error: err });
  }
};

module.exports = fieldDefinitionsController;

// UCLA BEGIN EDIT
// localStrategy exports both localStrategy and localStrategyExcel, so we need to import both
// const localStrategy = require('./localStrategy');
const localStrategies = require('./localStrategy');
// UCLA END EDIT
const process = require('./process');
const save = require('./save');

module.exports = {
  ...save,
  ...process,
  // UCLA BEGIN EDIT
  // localStrategy,
  ...localStrategies,
  // UCLA END EDIT
};

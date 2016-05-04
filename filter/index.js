'use strict';
var util = require('util'),
    chalk = require('chalk');

var ScriptBase = require('../script-base.js');

var sttGenerator = module.exports = function sttGenerator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(sttGenerator, ScriptBase);

sttGenerator.prototype.createFilterFiles = function createFilterFiles() {
  this.log(
    chalk.yellow('\n┌──────────────────────────────────────────────────────────────┐ \n' +
                   '| Creating filter, please wait...                              | \n' +
                   '└──────────────────────────────────────────────────────────────┘ ')
  );

  this.generateSourceAndTest(
    '_filter',
    'spec/filter',
    'filters',
    this.options['add-index'] || false
  );
};

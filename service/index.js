'use strict';
var util = require('util'),
    chalk = require('chalk');

var ScriptBase = require('../script-base.js');

var sttGenerator = module.exports = function sttGenerator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(sttGenerator, ScriptBase);

sttGenerator.prototype.createServiceFiles = function createServiceFiles() {
  this.log(
    chalk.yellow('\n┌──────────────────────────────────────────────────────────────┐ \n' +
                   '| Creating service, please wait...                             | \n' +
                   '└──────────────────────────────────────────────────────────────┘ ')
  );

  this.generateSourceAndTest(
    '_service',
    'spec/service',
    'services',
    this.options['skip-add'] || false
  );
};

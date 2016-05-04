/*global describe, beforeEach, it */
// TODO: Add tests for all app types
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Generator stt test', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        done(err);
        return;
      }

      this.stt = helpers.createGenerator('stt:app', [
        '../../app', [
          helpers.createDummyGenerator(),
          'mocha:app'
        ]
      ]);
      this.stt.options['skip-install'] = true;

      done();
    }.bind(this));
  });

  it('the generator can be required without throwing', function () {
    // not testing the actual run of generators yet
    this.app = require('../app');
  });

  it('creates expected files', function (done) {
    var expected = [
      'package.json',
      'gulpfile.js',
      'app/favicon.ico',
      'app/index.html'
    ];

    helpers.mockPrompt(this.stt, {
      appType: ['typeFullPackWebApp'],
      appFeatures: ['includeQuery']
    });

    this.stt.run(function () {
      helpers.assertFile(expected);
      done();
    });
  });
});

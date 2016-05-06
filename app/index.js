'use strict';
var yeoman = require('yeoman-generator'),
    fs = require('fs'),
    util = require('util'),
    path = require('path'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    shell = require('shelljs'),
    updateNotifier = require('update-notifier'),
    pkg = require('../package.json');

// stt Updater - Checks for available update and returns an instance
var notifier = updateNotifier({pkg: pkg});

if(notifier.update) {
  // var notifier = updateNotifier({
  //   pkg: pkg,
  //   updateCheckInterval: 1000 * 60 * 60 * 24 // 1 day
  // });

  // Notify using the built-in convenience method
  notifier.notify();

  // `notifier.update` contains some useful info about the update
  console.log(notifier.update);
}

var sttGenerator = yeoman.generators.Base.extend({
    constructor: function () {
        // note: arguments and options should be defined in the constructor.
        yeoman.generators.Base.apply(this, arguments);

        // Options
        this.option('app-suffix', {
            desc: 'Allow a custom suffix to be added to the module name',
            type: String,
            required: 'false'
        });
        this.env.options['app-suffix'] = this.options['app-suffix'];

        this.option('skip-welcome-message', {
            desc: 'Skips the welcome message',
            type: Boolean
        });

        this.option('skip-install', {
            desc: 'Skips the installation of dependencies',
            type: Boolean
        });

        this.option('skip-install-message', {
            desc: 'Skips the message after the installation of dependencies',
            type: Boolean
        });

        // This method adds support for a `--coffee` flag
        this.option('coffee');
        // And you can then access it later on this way; e.g.
        this.scriptSuffix = (this.options.coffee ? ".coffee": ".js");
    },
});

sttGenerator.prototype.initializing = function initializing() {
    this.pkg = require('../package.json');
};

// Welcome Message with yeoman
sttGenerator.prototype.welcome = function welcome() {
    if (!this.options['skip-welcome-message']) {
        this.log(yosay('Hola! Bienvenido A ST&T'));
        this.log(
          chalk.magenta("Estas usando nuestro generador de frontend\n") +
          chalk.yellow('┌──────────────────────────────────────────────────────────────┐ \n' +
                       '|Respondenos unas simples preguntas para comenzar el proyecto  | \n' +
                       '└──────────────────────────────────────────────────────────────┘ ')
        );
    }
};

// Prompt - Ask for the type of application
sttGenerator.prototype.askAppType = function askAppType() {
    var done = this.async();

    var prompts = [{
        name: 'appName',
        message: '¿Como se llama la aplicación?',
        default: process.cwd().split(path.sep).pop()
        },{
        name: 'appType',
        message: '¿Que tipo de sitio quieres construir?',
        type: 'list',
        choices:[{
            name: 'Simple Web App',
            value: 'typeSimpleWebApp',
            checked: false
        },{
            name: 'Full Pack Web App',
            value: 'typeFullPackWebApp',
            checked: false
        },{
            name: 'Angular App',
            value: 'typeAngularApp',
            checked: false
        },{
            name: 'Restify App',
            value: 'typeRestifyApp',
            checked: false
        },{
            name: 'Admin Web App',
            value: 'typeAdminWebApp',
            checked: false
        }],
        default: 1
    }];
    this.prompt(prompts, function (answers) {
        var type = answers.type;

        this.appName = this._.camelize(this._.slugify(this._.humanize(answers.appName)));
        this.appType = answers.appType;

        // Underscore templating context to replace placeholders
        sttGenerator.context = {
            site_name: this.appName,
        };

        done();
    }.bind(this));
};

// Prompt - Ask for the required plugins
sttGenerator.prototype.askAppFeatures = function askAppFeatures() {
    if(this.appType === 'typeFullPackWebApp' || this.appType === 'typeAngularApp' || this.appType === 'typeAdminWebApp') {
        var done = this.async();
        var prompts = [{
            name: 'appFeatures',
            message: 'Que cosas adicionales desas agregarle',
            type: 'checkbox',
            choices:[{
                name: ' jQuery',
                value: 'includeQuery',
                checked: true
            },{
                name: ' Modernizr',
                value: 'includeModernizr',
                checked: false
            }]
        }];
        this.prompt(prompts, function (answers) {
            var appFeatures = answers.appFeatures;

            var hasFeature = function (feat) {
                return appFeatures.indexOf(feat) !== -1;
            };

            this.includeQuery = hasFeature('includeQuery');
            this.includeModernizr = hasFeature('includeModernizr');

            done();
        }.bind(this));
    }
};

// Prompt - Ask for the required angular modules
sttGenerator.prototype.askAngularModules = function askAngularModules() {
    if(this.appType === 'typeAngularApp') {
        var done = this.async();
        var prompts = [{
            name: 'angularModules',
            message: 'Cuales modulos de angular quieres añadir',
            type: 'checkbox',
            choices:[{
                name: ' Angular Ui Route',
                value: 'includeUiRouterModule',
                checked: true
            },{
                name: ' Angular Sanitize',
                value: 'includeSanitizeModule',
                checked: false
            },{
                name: ' Angular Table',
                value: 'includeAtTable',
                checked: false
            },{
                name: ' Angular Breadcrumb',
                value: 'includeBreadcrumb',
                checked: false
            }]
        }];
        this.prompt(prompts, function (answers) {

            var hasModule = function (mod) {
                return answers.angularModules.indexOf(mod) !== -1;
            };

            this.includeUiRouterModule = hasModule('includeUiRouterModule');
            this.includeBreadcrumb = hasModule('includeBreadcrumb');
            this.includeSanitizeModule = hasModule('includeSanitizeModule');
            this.includeAtTable = hasModule('includeAtTable');
            this.includeAnimateModule = hasModule('includeAnimateModule');

            var angMods = [];

            if (this.includeUiRouterModule) {
              angMods.push("'ui.router'");
            }
            if (this.includeSanitizeModule) {
              angMods.push("'ngSanitize'");
            }
            if (this.includeAnimateModule) {
              angMods.push("'ngAnimate'");
            }
            if (this.includeAtTable) {
              angMods.push("'angular-table'");
            }
            if (this.includeBreadcrumb) {
              angMods.push("'ncy-angular-breadcrumb'");
            }

            if (angMods.length) {
              this.env.options.angularDeps = '\n    ' + angMods.join(',\n    ') + '\n  ';
            }

            done();
        }.bind(this));
    }
};

// Creating - App Directory structure
sttGenerator.prototype.scaffoldFolders = function scaffoldFolders() {
    this.log(
      chalk.yellow('\n┌──────────────────────────────────────────────────────────────┐ \n' +
                     '| Creando estructura del proyecto                              | \n' +
                     '└──────────────────────────────────────────────────────────────┘ ')
    );

    if (this.appType === 'typeRestifyApp') {
      this.mkdir(this.appName + '/controllers');
      this.mkdir(this.appName + '/models');
      this.mkdir(this.appName + '/utils');

    } else {

      // Common Scaffolding for all projets
      this.mkdir(this.appName + '/app');
      this.mkdir(this.appName + '/app/css');
      this.mkdir(this.appName + '/app/scss');
      this.mkdir(this.appName + '/app/js');
      this.mkdir(this.appName + '/app/images');
      this.mkdir(this.appName + '/app/fonts');

      if(this.appType === 'typeFullPackWebApp' || this.appType === 'typeAngularApp') {
          if(this.appType !== 'typeAdminWebApp') {
            this.mkdir(this.appName + '/app/partials');
          }
          this.mkdir(this.appName + '/build');
      }
      if(this.appType === 'typeAngularApp') {
          this.mkdir(this.appName + '/app/templates');
          this.mkdir(this.appName + '/app/js/controllers');
          this.mkdir(this.appName + '/app/js/directives');
      }
    }
};

// Copying - HTML files
sttGenerator.prototype.copyHTMLFiles = function copyHTMLFiles() {

  // Restify app - Don't have create html files
  if (this.appType === 'typeRestifyApp') {
    return false;
  }

  // Replace folder name with appType variable
  this.copy("common/_404.html", this.appName + "/app/404.html");
  this.template("_" + this.appType + "/_index.html", this.appName + "/app/index.html", sttGenerator.context);

  // Partial File Include
  if(this.appType === 'typeFullPackWebApp' || this.appType === 'typeAngularApp') {
      this.template("partials/_header.html", this.appName + "/app/partials/_header.html", sttGenerator.context);
      this.template("partials/_footer.html", this.appName + "/app/partials/_footer.html", sttGenerator.context);
  }
  if(this.appType === 'typeAngularApp') {
    this.template("partials/_index.html", this.appName + "/app/templates/index.html", sttGenerator.context);
    this.template("partials/_vista2.html", this.appName + "/app/templates/vista2.html", sttGenerator.context);
  }

  // Files related to Aadmin Web App
  if(this.appType === 'typeAdminWebApp') {
    this.copy("_" + this.appType + "/_tables.html", this.appName + "/app/tables.html");
    this.copy("_" + this.appType + "/_forms.html", this.appName + "/app/forms.html");
    this.copy("_" + this.appType + "/_bootstrap-elements.html", this.appName + "/app/bootstrap-elements.html");
    this.copy("_" + this.appType + "/_bootstrap-grid.html", this.appName + "/app/bootstrap-grid.html");
    this.copy("_" + this.appType + "/_blank-page.html", this.appName + "/app/blank-page.html");
  }
};

// Copying - CSS stylesheet files
sttGenerator.prototype.copyCSSFiles = function copyCSSFiles() {
  console.log('entre');
  if (this.appType === 'typeRestifyApp') {
    return false;
  }

  this.copy("common/_master.css", this.appName + "/app/css/master.css");

  // stt - SCSS Structure
  // TODO: Update structure based on ticket #7
  if(this.appType !== "typeAdminWebApp") {
    this.copy("scss/_master.scss", this.appName + "/app/scss/master.scss");
    this.copy("scss/_base.scss", this.appName + "/app/scss/base.scss");
    this.copy("scss/_layout.scss", this.appName + "/app/scss/layout.scss");
    this.copy("scss/_reset.scss", this.appName + "/app/scss/reset.scss");
    this.copy("scss/_variables.scss", this.appName + "/app/scss/variables.scss");
    this.copy("scss/_mixins.scss", this.appName + "/app/scss/mixins.scss");
    this.copy("scss/_module.scss", this.appName + "/app/scss/modules/module.scss");
    this.copy("scss/_page_landing.scss", this.appName + "/app/scss/pages/page-landing.scss");
  }

  if(this.appType === "typeAdminWebApp") {
    this.copy("_" + this.appType + "/scss/_master.scss", this.appName + "/app/scss/master.scss");
    this.copy("_" + this.appType + "/scss/_admin.scss", this.appName + "/app/scss/admin.scss");
    this.copy("_" + this.appType + "/scss/_bootstrap.scss", this.appName + "/app/scss/bootstrap.scss");
    this.copy("_" + this.appType + "/scss/_font-awesome.scss", this.appName + "/app/scss/font-awesome.scss");
  }

};

// TODO: Replace with bower font-awesome plugin
// Copy - Fonts for Admin Web App
sttGenerator.prototype.copyFonts = function copyFonts() {
    if(this.appType === "typeAdminWebApp") {
        this.copy("_" + this.appType + "/fonts/_fontawesome-webfont.eot", this.appName + "/app/fonts/fontawesome-webfont.eot");
        this.copy("_" + this.appType + "/fonts/_fontawesome-webfont.svg", this.appName + "/app/fonts/fontawesome-webfont.svg");
        this.copy("_" + this.appType + "/fonts/_fontawesome-webfont.ttf", this.appName + "/app/fonts/fontawesome-webfont.ttf");
        this.copy("_" + this.appType + "/fonts/_fontawesome-webfont.woff", this.appName + "/app/fonts/fontawesome-webfont.woff");
        this.copy("_" + this.appType + "/fonts/_FontAwesome.otf", this.appName + "/app/fonts/FontAwesome.otf");
    }
};

// Copy - Javascript Files
sttGenerator.prototype.copyJSFiles = function copyJSFiles() {
    if (this.appType === 'typeAngularApp') {
        this.template("js/_angular_application.js", this.appName + "/app/js/application.js", sttGenerator.context);
        this.template("js/_angular_indexcontroller.js", this.appName + "/app/js/controllers/index.js", sttGenerator.context);
        this.template("js/_angular_indexcontroller.js", this.appName + "/build/js/controllers/index.js", sttGenerator.context);
    }
    else if (this.appType === 'typeRestifyApp') {
      this.template("_typeRestifyApp/_app.js", this.appName + "/app.js", sttGenerator.context );
      this.template("_typeRestifyApp/_routes.js", this.appName + "/routes.js", sttGenerator.context );
      this.template("_typeRestifyApp/_db.js", this.appName + "/db.js", sttGenerator.context );
    }
    else {
      this.copy("js/_application.js", this.appName + "/app/js/application.js");
    }
};

// Copy - Gulp Task Files
sttGenerator.prototype.copyTasksFile = function copyTasksFile() {
    if (this.appType === 'typeSimpleWebApp') {
      this.copy("tasks/simpleWebApp/_simple_browser_sync.js", this.appName + "/tasks/browser-sync.js");
      this.copy("tasks/simpleWebApp/_simple_sass.js", this.appName + "/tasks/sass.js");
    }
    else if(this.appType === 'typeFullPackWebApp' || this.appType === 'typeAngularApp' || this.appType === "typeAdminWebApp") {
      this.copy("tasks/_bower.js", this.appName + "/tasks/bower.js");
      this.copy("tasks/_browser_sync.js", this.appName + "/tasks/browser-sync.js");
      this.copy("tasks/_clean.js", this.appName + "/tasks/clean.js");
      this.copy("tasks/_config.js", this.appName + "/tasks/config.js");
      this.copy("tasks/_environment.js", this.appName + "/tasks/environment.js");
      this.copy("tasks/_fonts.js", this.appName + "/tasks/fonts.js");
      this.copy("tasks/_html.js", this.appName + "/tasks/html.js");
      this.copy("tasks/_image.js", this.appName + "/tasks/image.js");
      this.copy("tasks/_scripts.js", this.appName + "/tasks/scripts.js");
      this.copy("tasks/_server.js", this.appName + "/tasks/server.js");
      this.copy("tasks/_styles.js", this.appName + "/tasks/styles.js");
      this.copy("tasks/_watch.js", this.appName + "/tasks/watch.js");
      this.copy("tasks/_zip.js", this.appName + "/tasks/zip.js");
    }
};

// Copy - Dependency Files
sttGenerator.prototype.copyDependencyFiles = function copyDependencyFiles() {
  if (this.appType === 'typeRestifyApp') {
    this.template("_typeRestifyApp/_package.json", this.appName + "/package.json", sttGenerator.context);
    this.template("_typeRestifyApp/_config.json", this.appName + "/config.json", sttGenerator.context);
    this.template("_typeRestifyApp/_userSchema.js", this.appName + "/models/userSchema.js", sttGenerator.context);
    this.template("_typeRestifyApp/_userController.js", this.appName + "/controllers/userController.js", sttGenerator.context);
    return false;
  }

  if(this.appType === 'typeFullPackWebApp' || this.appType === 'typeAngularApp' || this.appType === "typeAdminWebApp") {
    this.template("common/_gulpfile.js", this.appName + "/gulpfile.js", sttGenerator.context);
  }
  else {
    this.template("_typeSimpleWebApp/_gulpfile.js", this.appName + "/gulpfile.js", sttGenerator.context);
  }

  this.template("_" + this.appType + "/_package.json", this.appName + "/package.json", sttGenerator.context);
};

// Copy - Project Files
sttGenerator.prototype.copyProjectfiles = function copyProjectfiles() {
  this.copy("dot-files/_gitignore", this.appName + "/.gitignore");
  this.copy("dot-files/_gitattributes", this.appName + "/.gitattributes");

  if (this.appType === 'typeAngularApp') {
    this.template("_typeAngularApp/_README.md", this.appName + "/README.md", sttGenerator.context);
  }
  else if (this.appType === 'typeFullPackWebApp') {
    this.template("_typeFullPackWebApp/_README.md", this.appName + "/README.md", sttGenerator.context);
  }
  else if (this.appType === 'typeSimpleWebApp') {
    this.template("_typeSimpleWebApp/_README.md", this.appName + "/README.md", sttGenerator.context);
  }
  else if (this.appType === 'typeRestifyApp') {
    return false;
  }

  this.copy("common/_editorconfig", this.appName + "/.editorconfig");
  this.copy("common/_robots.txt", this.appName + "/robots.txt");
  this.copy("common/_favicon.ico", this.appName + "/app/favicon.ico");

  if(this.appType !== 'typeSimpleWebApp') {
    this.template("dot-files/_jshintrc", this.appName + "/.jshintrc", sttGenerator.context);
    this.template("dot-files/_jshintignore", this.appName + "/.jshintignore", sttGenerator.context);
  }
};

// Bower Dependency Injection
sttGenerator.prototype.injectDependencies = function injectDependencies() {
    // Bower is supported only in full & angular app types
    if(this.appType === 'typeFullPackWebApp' || this.appType === 'typeAngularApp' || this.appType === "typeAdminWebApp") {
        var bower = {
            name: this.appName,
            private: true,
            dependencies: {}
        };
        this.copy('dot-files/_bowerrc', this.appName + '/.bowerrc');

        this.template("_" + this.appType + '/_bower.json', this.appName + '/bower.json');
    }
};

// NPM, Bower Dependency Installation & Trigger Server
sttGenerator.prototype.install = function install() {
    // Installation context object
    var installContext = {};
    installContext.appPath = process.cwd() + "/"+ this.appName;
    process.chdir(installContext.appPath); // activating app directory for installation

    // Assign context based on app types
    if(this.appType === 'typeSimpleWebApp' || this.appType === 'typeRestifyApp') {
        installContext.helpCommand = 'npm install';
        installContext.includeNpm = true;
        installContext.includeBower = false;
    }
    else {
        installContext.helpCommand = 'npm install & bower install';
        installContext.includeNpm = true;
        installContext.includeBower = true;
    }

    if (this.options['skip-install']) {
        this.log(
          chalk.green('\n ✔  Project structure created successfully! \n\n') +
          chalk.yellow('┌──────────────────────────────────────────────────────────────┐ \n' +
                       '| Follow the instructions below                                | \n' +
                       '└──────────────────────────────────────────────────────────────┘ ')
        );

        var skipHelpMessage = function(appname, command) {
            console.log(
              'Next Steps:' +
              '\n1) Now '+ chalk.yellow.bold('cd '+ appname +'') + ' into your project folder' +
              '\n2) Install dependencies by typing '+ chalk.yellow.bold(command) +
              '\n3) Run the server using: ' + chalk.yellow.bold('gulp')
            );
        };

        skipHelpMessage(this.appName, installContext.helpCommand);
    }
    else {
        this.log(
          chalk.green('\n ✔  Project structure created successfully! \n\n') +
          chalk.yellow('┌──────────────────────────────────────────────────────────────┐ \n' +
                       '| Installating Dependencies, Please wait...                    | \n' +
                       '└──────────────────────────────────────────────────────────────┘ ')
        );

        this.on('end', function () {
            this.installDependencies({
                bower: installContext.includeBower,
                npm: installContext.includeNpm,
                callback: function () {
                    this.emit('dependenciesInstalled');
                }.bind(this)
            });
        });

        this.on('dependenciesInstalled', function() {
            this.log(
              chalk.green('\n ✔  Dependencies installed successfully! \n\n') +
              chalk.yellow('┌──────────────────────────────────────────────────────────────┐ \n' +
                           '| Please wait while we start the server...                     | \n' +
                           '└──────────────────────────────────────────────────────────────┘ \n')
            );

            shell.cd(installContext.appPath);

            if (this.appType === 'typeRestifyApp') {
              shell.exec('node app.js');
              this.log(chalk.green('\n ✔  Please make sure your Database server is running! \n\n'));
            } else {
              shell.exec('gulp'); // trigger the server using gulp command
            }
        });
    }
};

sttGenerator.prototype.helper = function helper() {
    //this.log('App Helper functions and methods');
};

sttGenerator.prototype.errorHanding = function errorHanding() {
    //this.log('Something has gone wrong! Handle errors in this section');
};

sttGenerator.prototype.paths = function paths() {
    //this.log('Path Handling');
};

module.exports = sttGenerator;

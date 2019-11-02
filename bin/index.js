#!/usr/bin/env node

//colourful console
const chalk = require('chalk');
const ctx = new chalk.constructor({level: 0});

//arguments and app name
const args = process.argv.slice(2); //remove the first two things in the args
const appName = 'plix';
const appDirIn = 'src';
const appDirOut = 'dist';
const c = console.log;

//file writing helpers
const fs = require('fs-extra');
const appRoot = require('app-root-path');

// plix app functions
const plix = require('./plix.js');

//package json details in app
const pjson = require('./../package.json');

function showError() {
c(chalk.red(`
            ░▓▓▓░
           ░▓    ░
          ░▓ ░░░▒ ░
         ░▓ ░░░░░▒ ░
        ░▓ ░░   ░░▒ ░
       ░▓ ░░░   ░░░▒ ░
      ░▓ ░░░░   ░░░░▒ ░
     ░▓ ░░░░░   ░░░░░▒ ░
    ░▓ ░░░░░░   ░░░░░░▒ ░
   ░▓ ░░░░░░░░░░░░░░░░░▒ ░
  ░▓ ░░░░░░░░   ░░░░░░░░▒ ░
 ░▓ ░░░░░░░░░░░░░░░░░░░░░▒ ░
 ░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░
`));
}
function showTitle() {
c();
c(chalk.hex('#EEEEEE')(`  ▄███████▄  ▄█        ▄█ ▀████    ▐████▀`));
c(chalk.hex('#DEDEDE')(` ███    ███ ███       ███   ███▌   ████▀ `));
c(chalk.hex('#CECECE')(` ███    ███ ███       ███▌   ███  ▐███   `));
c(chalk.hex('#BEBEBE')(` ███    ███ ███       ███▌   ▀███▄███▀   `));
c(chalk.hex('#AEAEAE')(`▀█████████▀ ███       ███▌    ████▀██▄   `));
c(chalk.hex('#AEAEAE')(` ███        ███       ███    ▐███  ▀███   `));
c(chalk.hex('#AEAEAE')(` ███        ███▌    ▄ ███   ▄███     ███▄ `));
c(chalk.hex('#AEAEAE')(`▄████▀      █████▄▄██ █▀   ████       ███▄`));
c(chalk.hex('#AEAEAE')(`                ▀           ▀`));
c(chalk.bold.green(`Build a blog with markdown ${pjson.version}`));
showHelp();
c();
}

function showHelp() {
  c(chalk.yellow(`
Try these commands:`));
  c(chalk.magenta(`${appName} new my-epic-plix-blog-2020`), chalk.blue(` - Creates a plix blog`));
  c(chalk.magenta(`${appName} page page-of-amazing-content`), chalk.blue(` - Adds a page to your blog`));
  c(chalk.magenta(`${appName} deploy`), chalk.blue(` - Send your blog to the clouds`));
  c(chalk.magenta(`${appName} build`), chalk.blue(` - Generate html in the output folder`));
}

function getConfig() {
  if (fs.existsSync('plix.json')) {
    return JSON.parse(fs.readFileSync('plix.json'));
  } else {
    showError();
    c(chalk.red('Plix config not found'));
    c(chalk.magenta(`${appName} new my-epic-plix-blog-2020`), chalk.blue(` - Creates a plix blog`));
    process.exit();
  }
}

if (args[0]) { //we need a command to run anything at all
  const command = args[0]; //

  if (!['help', 'new', 'page', 'deploy', 'build', 'serve'].includes(command)) {
    showError();
    c(chalk.red('You gave a command that does not exist.'));
    showHelp();
  }
  let subject = null;
  if (args[1]) {
    subject = args[1];
  }
  if (args[2]) {
    showError();
    c(chalk.red('Too many commands, you give a single command and a subject'));
    showHelp();
    process.exit();
  }

  // this command creates required configs and folders in the current folder
  if (command === 'help') {
    showTitle();
  }
  // this command creates required configs and folders in the current folder
  if (command === 'new') {

    // to run this command we need a blog name
    if (!subject) {
      showError();
      c(chalk.red('No blog name provided'));
      c(chalk.blue(`Try: ${appName} new my-epic-blog-2020`));
    }

    // we allow lower case letters, hyphens and numbers
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (subject && slugRegex.test(subject)) { //testing to see

      //send payload to new blog directory
      fs.copySync(appRoot + '/payload', subject);

      c(chalk.green('Created blog: ' + subject));

    } else {
      showError();
      c(chalk.red('Blog is not a valid file name. Blog name must-be-in-slug-format.'));
      c(chalk.blue('Try lower case, dashes and numbers only.'));
    }

    process.exit();
  }

  // This command creates a page with the correct headers in the input folder
  if (command === 'page') {

    // to run this command we need a page name
    if (!subject) {
      showError();
      c(chalk.red('No page provided'));
      c(chalk.blue(`Try: ${appName} page my-first-page`));
    }

    // we allow lower case letters, hyphens and numbers
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (subject && slugRegex.test(subject)) {

      // verify we are in the right place, we should have a config json here
      if (fs.existsSync('plix.json')){


        const siteConfig = getConfig();

        const now = new Date().toISOString();
        const markdownContent = `
[blog-date]: <> (${now})
[blog-title]: <> (Page Title)
[blog-author]: <> (${siteConfig.author})
[blog-featured]: <> (assets/images/default_featured.gif)

Write your page content here.
        `;

        const fileName = appDirIn + '/' + subject + '.md';

          if (fs.existsSync(fileName)){
            showError();
            c(chalk.red('Page already exists'));
            process.exit()
          }

          fs.writeFileSync(fileName, markdownContent, 'utf8', function (err) {
              if (err) {
                  c(`An error occured while writing ${fileName} config to File.`);
                  return c(err);
              }

              c(chalk.green(`${subject}.md markdown created`));
          });
        }


      c(chalk.green('Creating page: ' + subject));
      // TODO: create page here in markdown folder

    } else {
      showError();
      c(chalk.red('Page is not a valid file name. Pages must-be-in-slug-format.'));
      c(chalk.blue('Try lower case, dashes and numbers only.'));
    }
    process.exit()
  }
  if (command === 'deploy') {
    const siteConfig = getConfig();
    c(chalk.green('Deploying'), siteConfig.title);
    // TODO: send the output folder contents to an s3 bucket, ftp, etc.
    process.exit()
  }
  if (command === 'build') {
    const siteConfig = getConfig();
    c(chalk.green('Building'), siteConfig.title);
    plix.build(appDirIn, appDirOut, siteConfig);
    // TODO: build the files to the output folder
    process.exit()
  }
  if (command === 'serve') {
    const siteConfig = getConfig();
    c(chalk.green('Building and serving'), siteConfig.title);
    // TODO: basic webserver for the files in the build folder
    process.exit()
  }

} else {
  showTitle();
  process.exit()
}

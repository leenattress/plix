#!/usr/bin/env node
const chalk = require('chalk');
const ctx = new chalk.constructor({level: 0});

const args = process.argv.slice(2); //remove the first two things in the args
const appName = 'plix';
const c = console.log;

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
 c(chalk.hex('#AEAEAE')(`                ▀`));
c(chalk.bold.green(`Build a blog with markdown`));
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

if (args[0]) { //we need a command to run anything at all
  const command = args[0]; //

  if (!['new', 'page', 'deploy', 'build'].includes(command)) {
    c(chalk.red('You gave a command that does not exist.'));
    showHelp();
  }
  let subject = null;
  if (args[1]) {
    subject = args[1];
  }
  if (args[2]) {
    c(chalk.red('Too many commands, you give a single command and a subject'));
    showHelp();
    process.exit();
  }

  // this command creates required configs and folders in the current folder
  if (command === 'new') {

    // to run this command we need a blog name
    if (!subject) {
      c(chalk.red('No blog name provided'));
      c(chalk.blue(`Try: ${appName} new my-epic-blog-2020`));
    }

    // we allow lower case letters, hyphens and numbers
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (subject && slugRegex.test(subject)) { //testing to see
      c(chalk.green('Create blog: ' + subject));
      // TODO: create json object in project root with config options
      // TODO: create folders for the markdown and output
      // TODO: create a theme folder and put the starter theme in it
    } else {
      c(chalk.red('Blog is not a valid file name. Blog name must-be-in-slug-format.'));
      c(chalk.blue('Try lower case, dashes and numbers only.'));
    }

    process.exit();
  }

  // This command creates a page with the correct headers in the input folder
  if (command === 'page') {

    // to run this command we need a page name
    if (!subject) {
      c(chalk.red('No page provided'));
      c(chalk.blue(`Try: ${appName} page my-first-page`));
    }

    // we allow lower case letters, hyphens and numbers
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (subject && slugRegex.test(subject)) {

      c(chalk.green('Creating page: ' + subject));
      // TODO: create page here in markdown folder

    } else {
      c(chalk.red('Page is not a valid file name. Pages must-be-in-slug-format.'));
      c(chalk.blue('Try lower case, dashes and numbers only.'));
    }
    process.exit()
  }
  if (command === 'deploy') {
    c(chalk.green('Deploying to website'));
    // TODO: send the output folder contents to an s3 bucket, ftp, etc.
    process.exit()
  }
  if (command === 'build') {
    c(chalk.green('Building files'));
    // TODO: build the files to the output folder
    process.exit()
  }
  if (command === 'serve') {
    c(chalk.green('Building files and serving'));
    // TODO: basic webserver for the files in the build folder
    process.exit()
  }

} else {
  showTitle();
  process.exit()
}

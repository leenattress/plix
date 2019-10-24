const fs = require('fs-extra')
var mkdirp = require('mkdirp');
const dirTree = require("directory-tree");
const MarkdownIt = require('markdown-it'),
md = new MarkdownIt();
const attrs = require('markdown-it-attrs');
md.use(attrs);

const nunjucks = require('nunjucks');
nunjucks.configure({ autoescape: true });

//var ncp = require("ncp");
const appRoot = require('app-root-path');

function render(node, inFolder, outFolder) {
    //console.log(node, inFolder, outFolder);

    // replace all helper
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    // get the contents of the template file
    var template = fs.readFileSync(appRoot + '/theme/page.html', 'utf8');

    node.forEach((page) => {

      if (page.type === 'file') {

        // get the contents of the file
        var contents = fs.readFileSync(page.path, 'utf8');
        console.log(); //random gap

        // extract title
        var reg = /\[blog-title\]: <>\s\(*(.+)\)\s*/
        let titleData = (contents.match(reg) || []).map(e => e.replace(reg, '$1'));
        console.log('Title: ', titleData[0]);

        // extract Author
        var reg = /\[blog-author\]: <>\s\(*(.+)\)\s*/
        let authorData = (contents.match(reg) || []).map(e => e.replace(reg, '$1'));
        console.log('Author: ', authorData[0]);

        if (titleData[0] && authorData[0]) {

          // render the markdown to html
          var htmlResult = md.render(contents);

          //var htmlRender = template.replace('{{pageContent}}', htmlResult);
          //var htmlRender = htmlRender.replaceAll('{{pageTitle}}', titleData[0]); //title
          //var htmlRender = htmlRender.replaceAll('{{pageAuthor}}', authorData[0]); //author

          // replace md in the filename for html
          filename = page.name.substr(0, page.name.lastIndexOf(".")) + ".html";

          const htmlRender = nunjucks.renderString(template,
            {
              pageTitle: titleData[0],
              pageAuthor: authorData[0],
              pageContent: htmlResult
            }
          );
  
          // write the file back to disk
          fs.writeFileSync(outFolder + '/' + filename, htmlRender);
          console.log(outFolder + '/' + filename + ' written.');

        }

      }

    });

  }

function build (inFolder, outFolder, themeFolder) {

  try {
    fs.copySync(appRoot + '/theme/assets', outFolder + '/assets')
    const tree = dirTree(inFolder);
    if (tree.children && inFolder && outFolder) {
      this.render(tree.children, inFolder, outFolder);
    }
  } catch (err) {
    console.error(err)
  }

}

module.exports = {
  render: render,
  build: build
}

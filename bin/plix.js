const fs = require('fs-extra')
var mkdirp = require('mkdirp');
const dirTree = require("directory-tree");
const MarkdownIt = require('markdown-it'),
md = new MarkdownIt();
const attrs = require('markdown-it-attrs');
md.use(attrs);

const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');

let env = nunjucks.configure({ autoescape: true });
env.addFilter('date', dateFilter);
//var ncp = require("ncp");
const appRoot = require('app-root-path');

function render(node, inFolder, outFolder) {

    // replace all helper
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    // get the contents of the template file
    var template = fs.readFileSync(appRoot + '/theme/page.html', 'utf8');
    //console.log(node);
    //set indexes and sort by date
    node.map((page, index) => {
      if (page.path && page.type === 'file') {
        console.log(page.path);
        var contents = fs.readFileSync(page.path, 'utf8');
        page.contents = contents;
        page.index = index;

        //get the date from this file
        var reg = /\[blog-date\]: <>\s\(*(.+)\)\s*/
        let authorDate = (contents.match(reg) || []).map(e => e.replace(reg, '$1'));
        if (authorDate && authorDate[0]) {
          page.date = authorDate[0];
          return page;
        }
      }
    });
    node.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.date) - new Date(b.date);
    });

    node.forEach((page, index) => {

      if (page.type === 'file') {

        // get the contents of the file
        //var contents = fs.readFileSync(page.path, 'utf8');
        contents = page.contents;
        console.log(); //random gap

        // extract title
        var reg = /\[blog-title\]: <>\s\(*(.+)\)\s*/
        let titleData = (contents.match(reg) || []).map(e => e.replace(reg, '$1'));
        console.log('Title: ', titleData[0]);

        // extract Author
        var reg = /\[blog-author\]: <>\s\(*(.+)\)\s*/
        let authorData = (contents.match(reg) || []).map(e => e.replace(reg, '$1'));
        console.log('Author: ', authorData[0]);

        console.log('Date: ', page.date);

        if (titleData[0] && authorData[0]) {

          // render the markdown to html
          var htmlResult = md.render(contents);

          // replace md in the filename for html
          filename = page.name.substr(0, page.name.lastIndexOf(".")) + ".html";

          //previous and next links
          let linkPrev = null, linkNext = null
          if (node[index-1]) { linkNext = node[index-1].name.substr(0, node[index-1].name.lastIndexOf(".")) + ".html"; }
          if (node[index+1]) { linkPrev = node[index+1].name.substr(0, node[index+1].name.lastIndexOf(".")) + ".html"; }

          const htmlRender = nunjucks.renderString(template,
            {
              pageTitle: titleData[0],
              pageAuthor: authorData[0],
              pageContent: htmlResult,
              pageIndex: page.index,
              linkNext: linkNext,
              linkPrev: linkPrev,
              related: [
                {
                  pageTitle: 'A Test Page',
                  pageAuthor: 'Lee Nattress',
                  pageDate: '2019-10-24T17:58:18.996Z',
                  pageLink: 'caketime.html'
                },
                {
                  pageTitle: 'A Test Page 2',
                  pageAuthor: 'Lee Nattress',
                  pageDate: '2019-10-24T17:58:18.996Z',
                  pageLink: 'caketime2.html'
                }
              ]
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
    fs.copySync(inFolder + '/assets/images', outFolder + '/assets/images')
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

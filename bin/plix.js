const fs = require('fs-extra')
var mkdirp = require('mkdirp');
const dirTree = require("directory-tree");
const MarkdownIt = require('markdown-it'),
md = new MarkdownIt();
const attrs = require('markdown-it-attrs');
md.use(attrs);

const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
dateFilter.setDefaultFormat('dddd, MMMM Do YYYY, h:mm:ss a');
let env = nunjucks.configure({ autoescape: true });
env.addFilter('date', dateFilter);

//var ncp = require("ncp");
const appRoot = require('app-root-path');

function getMeta(contents, meta) {
  var regStr = `\\[blog-${meta}\\]: <>\\s\\(*(.+)\\)\\s*`;
  //console.log(regStr);
  var reg = new RegExp(regStr);
  const stringReturn = (contents.match(reg) || []).map(e => e.replace(reg, '$1'));
  if (stringReturn[0]) {
    return stringReturn[0];
  } else {
    return null;
  }
}

function render(node, inFolder, outFolder, themeFolder) {

    // replace all helper
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    // get the contents of the template file
    var template = fs.readFileSync('theme/'+ themeFolder +'/page.html', 'utf8');

    let pages = [];
    let pageIndex = 0;
    node.forEach((page) => {
      if (page.path && page.type === 'file' && page.extension === '.md') {
        console.log(page.path);

        // get contents of markdown from disk
        var contents = fs.readFileSync(page.path, 'utf8');

        //get the meta info from this file
        let metaDate = getMeta(contents, 'date');
        let metaAuthor = getMeta(contents, 'author');
        let metaTitle = getMeta(contents, 'title');
        let metaFeaturedImage = getMeta(contents, 'featured');

        // we need a date, a title and an author for a page to be returned
        if (contents && metaDate && metaAuthor && metaTitle) {

          // render the markdown to html
          var htmlResult = md.render(contents);

          // replace md in the filename for html
          filename = page.name.substr(0, page.name.lastIndexOf(".")) + ".html";

          //previous and next links
          let linkPrev = null, linkNext = null
          if (node[pageIndex-1]) { linkNext = node[pageIndex-1].name.substr(0, node[pageIndex-1].name.lastIndexOf(".")) + ".html"; }
          if (node[pageIndex+1]) { linkPrev = node[pageIndex+1].name.substr(0, node[pageIndex+1].name.lastIndexOf(".")) + ".html"; }

          // add to the page array
          pages.push({
            pageTitle: metaTitle,
            pageAuthor: metaAuthor,
            pageDate: metaDate,
            pageContent: htmlResult,
            pageIndex: pageIndex,
            pageLink: filename,
            pageFeaturedImage: metaFeaturedImage,
            linkNext: linkNext,
            linkPrev: linkPrev,
            contents: contents,
            filename: filename
          });
          pageIndex ++; //add one to the page index
        }
      }
    });
    pages.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.pageDate) - new Date(b.pageDate);
    });

    pagesCopy = JSON.parse(JSON.stringify(pages))
    pages.forEach((page) => {

          // attach all items to history for in page rendering.
          page.history = pagesCopy;

          // render the markdown to html
          var htmlResult = md.render(page.contents);

          // final rengered page with html and data
          //console.log(page);
          const htmlRender = nunjucks.renderString(template,page);

          // write the file back to disk, at the moment, flat file structure
          fs.writeFileSync(outFolder + '/' + page.filename, htmlRender);
          console.log(outFolder + '/' + page.filename + ' written.');

    });

  }

function build (inFolder, outFolder, themeFolder) {

  try {
    fs.copySync(inFolder + '/assets/images', outFolder + '/assets/images')
    const tree = dirTree(inFolder);
    if (tree.children && inFolder && outFolder) {
      this.render(tree.children, inFolder, outFolder, themeFolder);
    }
  } catch (err) {
    console.error(err)
  }

}

module.exports = {
  render: render,
  build: build
}

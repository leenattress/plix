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

function getMeta(contents, meta) {
  var regStr = `\\[meta-${meta}\\]: <>\\s\\(*(.+)\\)\\s*`;
  var reg = new RegExp(regStr);
  const stringReturn = (contents.match(reg) || []).map(e => e.replace(reg, '$1'));
  if (stringReturn[0]) {
    return stringReturn[0];
  } else {
    return null;
  }
}

function render(node, inFolder, outFolder, siteConfig) {

    // get the contents of the template file
    var template = fs.readFileSync('themes/'+ siteConfig.theme +'/page.html', 'utf8');

    let pages = [];

    node.forEach((page) => {
      if (page.path && page.type === 'file' && page.extension === '.md') {

        // get contents of markdown from disk
        var contents = fs.readFileSync(page.path, 'utf8');

        //get the meta info from this file
        let metaDate = getMeta(contents, 'date');
        let metaTitle = getMeta(contents, 'title');
        let metaFeaturedImage = getMeta(contents, 'featured');

        // we need a date, a title and an author for a page to be returned
        if (contents && metaDate && metaTitle) {

          // render the markdown to html
          var htmlResult = md.render(contents);

          // replace md in the filename for html
          filename = page.name.substr(0, page.name.lastIndexOf(".")) + ".html";

          // add to the page array
          pages.push({
            pageTitle: metaTitle,
            pageDate: metaDate,
            pageContent: htmlResult,
            pageLink: filename,
            pageFeaturedImage: metaFeaturedImage,
            filename: filename,
            siteConfig: siteConfig
          });
        }
      }
    });
    pages.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.pageDate) - new Date(b.pageDate);
    });

    pagesCopy = JSON.parse(JSON.stringify(pages)); // for the history included in each page

    pagesCopy.forEach((specialPage) => { // special cases like index and 404, separated out here

        if (['404.html', 'index.html'].includes(specialPage.pageLink)) {
            // attach all items to history for in page rendering.
            specialPage.history = pagesCopy.filter((page) => { // remove index and 404 from the history
                if (!['404.html', 'index.html'].includes(page.pageLink)) {
                    return page;
                }
            }).sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(a.pageDate) - new Date(b.pageDate);
            });

            // final rendered page with html and data
            const htmlRender = nunjucks.renderString(template, specialPage);

            // write the file back to disk, at the moment, flat file structure
            fs.writeFileSync(outFolder + '/' + specialPage.filename, htmlRender);

            // log it out
        }
    });

    pagesCopy = pagesCopy.filter((page) => { // remove index and 404 from the history
        if (!['404.html', 'index.html'].includes(page.pageLink)) {
            return page;
        }
    });
    pagesCopy = pagesCopy.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.pageDate) - new Date(a.pageDate);
    });

    let pageIndex = 0;
    pagesCopy.forEach((page) => {

        //previous and next links
        let linkPrev = null, linkNext = null;
        if (pagesCopy[pageIndex + 1]) {
            linkPrev = pagesCopy[pageIndex + 1].pageLink;
        }
        if (pagesCopy[pageIndex - 1]) {
            linkNext = pagesCopy[pageIndex - 1].pageLink;
        }

        // attach all items to history for in page rendering.
        page.history = pagesCopy.reverse();
        page.pageIndex = pageIndex;
        page.linkPrev = linkPrev;
        page.linkNext = linkNext;

        // final rendered page with html and data
        const htmlRender = nunjucks.renderString(template, page);

        // write the file back to disk, at the moment, flat file structure
        fs.writeFileSync(outFolder + '/' + page.filename, htmlRender);
        console.log(outFolder + '/' + page.filename + ' written.');
        pageIndex ++; //add one to the page index
    });

  }

function build (inFolder, outFolder, siteConfig) {

  try {
      fs.copySync(inFolder + '/assets/images', outFolder + '/assets/images');
      fs.copySync('themes/'+ siteConfig.theme + '/assets/css', outFolder + '/assets/css');
      fs.copySync('themes/'+ siteConfig.theme + '/assets/js', outFolder + '/assets/js');
    const tree = dirTree(inFolder);
    if (tree.children && inFolder && outFolder) {
      this.render(tree.children, inFolder, outFolder, siteConfig);
    }
  } catch (err) {
    console.error(err)
  }

}

module.exports = {
  render: render,
  build: build
}

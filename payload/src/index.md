
[meta-date]: <> (2019-10-29T11:44:46.073Z)
[meta-title]: <> (Page Title)

# PLIX for cake? 🍰
## Markdown driven blogging

[![Version](https://img.shields.io/npm/v/plix.svg)](https://www.npmjs.com/package/plix)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/leenattress/plix#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/leenattress/plix/graphs/commit-activity)
[![License: ISC](https://img.shields.io/github/license/leenattress/plix)](https://github.com/leenattress/plix/blob/master/LICENSE)
[![Twitter: leenattress](https://img.shields.io/twitter/follow/leenattress.svg?style=social)](https://twitter.com/leenattress)

> Minimal markdown blog builder.

![plix terminal header](images/plix_readme.PNG)


### 🏠 [Homepage](https://github.com/leenattress/plix)

## Quickstart

```sh
npm i plix -g
plix new my-fabulous-blog
cd my-fabulous-blog
plix page my-first-page
plix build
```

## plix.json

In the root of your generated blog you will find the `plix.json` file.

Here is the default:

```
{
  "title": "My New Plix Blog",
  "theme": "simplest",
  "themeData": {
    "headerOverlayColour": "rgba(59, 48, 84, 0.6)"
  },
  "author": {
    "name": "Blog Owner",
    "bio": "Insert your bio here",
    "photo": "https://i.pravatar.cc/300",
    "job": "Describe your job here."
  },
  "social": {
    "Twitter": "leenattress",
    "Github": "leenattress",
    "LinkedIn": "leenattress"
  },
  "links": {
    "Home": "/",
    "Github": "https://www.npmjs.com/package/plix",
    "NPM": "https://www.npmjs.com/package/plix"
  }
}
```

This file is passed into every page, its a good place to keep global key/values such as settings specific to your blog.

## Template language and concepts

Plix uses [Nunjucks](https://mozilla.github.io/nunjucks/) for it's templates and you will find only a single file in the theme folder: `page.html`.

This page contains all the necessary logic to create not only the homepage and it's numbered indexes, but the blog content page. Remember that Plix is a minimal blog engine, so we deliberately dont get complicated. We want the simplest possible blog.

Each markdown you'll notice has some metadata at the top. This is not rendered as part of the page, but rather extracted and available in the Nunjucks template. This is the structure of the data available in the Nunjucks page:

- `{{pageTitle}}` is the title found in the markdown meta-data.
- `{{pageDate}}` is the data found in the markdown meta-data.
- `{{pageContent}}` is the html, rendered using the markdown found in the remainder of the file.
- `{{pageLink}}` is the filename of this file, with a html extension.
- `{{pageFeaturedImage}}` is the path to a featured image for this blog entry.
- `{{siteConfig}}` is the config, found in `plix.json`

`{{siteConfig}}`, by default contains the title of your blog, as well as any data you see fit to put in there.

You can access the data like this: `{{siteConfig.title}}` or `{{siteConfig.author.name}}`.

For more help creating a template in Nunjucks [see here](https://mozilla.github.io/nunjucks/templating.html), or open `page.html` in your favourite editor to take a look at a simple example, with loops and conditional statements in Nunjucks.

## Author

👤 **Lee Nattress <leenattress1981@gmail.com> (http://leenattress.com)**

* Twitter: [@leenattress](https://twitter.com/leenattress)
* Github: [@leenattress](https://github.com/leenattress)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/leenattress/plix/issues).

## Show your support

Give a ⭐️ if this project helped you!


## 📝 License

Copyright © 2019 [Lee Nattress <leenattress1981@gmail.com> (http://leenattress.com)](https://github.com/leenattress).

This project is [ISC](https://github.com/leenattress/plix/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_


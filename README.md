<h1 align="center">irasutoya</h1>

<h5 align="center">いらすとや (http://www.irasutoya.com/) client</h5>

<div align="center">
  <a href="http://travis-ci.org/cheeriojs/cheerio">
    <img src="https://secure.travis-ci.org/cheeriojs/cheerio.svg?branch=master" alt="Travis CI" />
  </a>
  <a href="http://badge.fury.io/js/irasutoya">
    <img src="https://badge.fury.io/js/irasutoya.svg" alt="npm version" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green.svg?style=flat-square" alt="license:MIT" />
  </a>
</div>

<br />



# Installation

```bash
npm install irasutoya
```

# Usage

## Get a random image

```js
const irasutoya = require("irasutoya");

(async () => {
    const imgInfo = await irasutoya.randomImage();
    console.log(imgInfo.title); // => 整えられたヒゲのイラスト
    console.log(imgInfo.description); // => 上品に整えられた、きれいに髭を生やした男性のイラストです。
    console.log(imgInfo.imageUrl); // => https://.../hige_kirei.png
    console.log(imgInfo.categories); // => ["マナー", "美容"]
})();
```

## Search images

```js
const images = await irasutoya.search("猫");
console.log(images[0]); // => { title: "猫の魚屋のイラスト", imageUrl: "https://...",  }
```

## API Server

```js
const server = new irasutoya.Server();
server.listen();
```



# Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

# License

irasutoya is released under the MIT license. See LICENSE for details.

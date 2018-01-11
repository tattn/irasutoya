<h1 align="center">irasutoya</h1>

<h5 align="center">いらすとや (http://www.irasutoya.com/) client</h5>

<div align="center">
  <a href="https://travis-ci.org/tattn/irasutoya">
    <img src="https://travis-ci.org/tattn/irasutoya.svg?branch=master" alt="Travis CI" />
  </a>
  <a href="http://badge.fury.io/js/irasutoya">
    <img src="https://badge.fury.io/js/irasutoya.svg" alt="npm version" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green.svg?style=flat-square" alt="license:MIT" />
  </a>
</div>

<br />

NOTE: Irasutoya is a famous free illustration material service in Japan.

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
or run the following script:

```bash
$ irasutoya-server
```


|End Point|Parameter|Description|
|:---|:---|:---|
|`GET /random`|(*optional*)`raw`[bool]: the response becomes a raw image if true|Get a random image|
|`GET /search`|`query`[string]: a search query|Search images by the query|

# Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

# License

irasutoya is released under the MIT license. See LICENSE for details.

# Thanks

いらすとや, Thank you for wonderful illustrations!

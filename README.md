# dog.ceo API

This current version is using cloudflare workers. [The old PHP version can be found here](https://github.com/ElliottLandsborough/dog-ceo-api).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Maintainability](https://api.codeclimate.com/v1/badges/350767ac49221209a1e3/maintainability)](https://codeclimate.com/github/dog-ceo/dog-ceo-node-worker/maintainability)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=dog-ceo_dog-ceo-node-worker&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=dog-ceo_dog-ceo-node-worker)
[![codecov](https://codecov.io/gh/dog-ceo/dog-ceo-node-worker/branch/main/graph/badge.svg?token=C5J8DCB12S)](https://codecov.io/gh/dog-ceo/dog-ceo-node-worker)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/dog-ceo/dog-ceo-node-worker/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/dog-ceo/dog-ceo-node-worker/tree/main)

## Info

- To add your own images submit a pull request to https://github.com/jigsawpieces/dog-api-images

## Examples

- Vanilla JS: https://codepen.io/elliottlan/pen/MNEWNx
- Jquery: https://codepen.io/elliottlan/pen/KOXKLG
- Flutter: https://github.com/LIVELUCKY/dogs
- Node.js: https://github.com/mrbrunelli/dog-time-decorator

## Stats

![Screenshot of statistics page](https://github.com/ElliottLandsborough/dog-ceo-api/blob/master/stats.png?raw=true)

## Dependencies

- npm

### Develop

```bash
npm install
npm run dev:remote
```

### Deploy

```bash
npm run deploy
```

### Test

```bash
npm run test
```

## Endpoints

#### /breeds/list/all

List all breed names including sub breeds.

#### /breeds/list/all/random

Get random breed including any sub breeds.

#### /breeds/list/all/random/10

Get 10 random breeds including any sub breeds.

#### /breeds/list

List all master breed names.

#### /breeds/list/random

Get single random master breed.

#### /breeds/list/random/10

Get 10 random master breeds.

#### /breed/{breed}/list

List sub breeds.

#### /breed/{breed}/list/random

List random sub breed.

#### /breed/{breed}/list/random/10

List 10 random sub breeds.

#### /breed/{breed}

Get master breed info (data is incomplete, see content folder).

#### /breed/{breed}/{breed2}

Get sub breed info (data is incomplete, see content folder).

#### /breeds/image/random

Random image from any breed.

#### /breeds/image/random/3

Get 3 random images from any breed (max. 50)

#### /breed/{breed}/images

Get all breed images.

#### /breed/{breed}/images/random

Get random image from a breed (and all its sub-breeds).

#### /breed/{breed}/images/random/4

Get 4 random images from a breed (and all its sub-breeds).

#### /breed/{breed}/{breed2}/images

Get all images from a sub breed.

#### /breed/{breed}/{breed2}/images/random

Get random image from a sub breed.

#### /breed/{breed}/{breed2}/images/random/5

Get 5 random images from a sub breed.

## Unfinished Endpoints

These endpoints might change in the future...

### Alt tags

```
https://dog.ceo/api/breeds/image/random/alt
https://dog.ceo/api/breeds/image/random/1/alt
https://dog.ceo/api/breeds/image/random/9/alt
```

```
https://dog.ceo/api/breed/hound/images/alt
https://dog.ceo/api/breed/hound/images/random/1/alt
https://dog.ceo/api/breed/hound/images/random/9/alt
```

```
https://dog.ceo/api/breed/hound/afghan/images/alt
https://dog.ceo/api/breed/hound/afghan/images/random/alt
```

### XML Responses

Add 'Content-Type' request header containing 'application/xml' to any endpoint.

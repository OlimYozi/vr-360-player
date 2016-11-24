# Virtual Reality 360 Degree Player
Virtual reality 360 degree player for 36 Technology Ltd, INC. by Trutoo AB.

## Installation & Scripts
To get started you are going to need [Node v6.0+](https://nodejs.org/en/) and [BASH](https://en.wikipedia.org/wiki/Bash_%28Unix_shell%29) (only for deploying).
Windows users can use a tool like: [CASH](https://github.com/dthree/cash) or [Cygwin](https://www.cygwin.com/).
Then clone this repository either with a GUI or with the following command:

  `$ git clone https://github.com/trutoo/vr-360-player`

Finally install all dependencies with:

  `$ npm install`

Bellow are a list of NPM scripts that you can run to aid development.

|Command|Description|
|---|---|
|`npm start`|Compiles the game and serves a local node against the dev environment|
|`npm run build:[prod/dev]`|Compiles the game against the targeted environment|
|`npm run deploy`|Runs a bash script to deploy the latest commit to gh-pages|
<!--|`npm test`|Not yet added|-->

Now you are ready to build with ❤!

## Documentation
The available documentation can be found in this read me and in an API reference that can be found on these
[Github pages API reference](https://trutoo.github.io/vr-360-player/).

## Stage Creation
To create a new stage use [Marzipano's web based tool](http://www.marzipano.net/tool) and accompanied by your own generated images.
Supported parameters are as follows:

* Sphere (equirectangular) or cubefaces
* Equirectangular aspect ratio 2:1
* Cube filename suffixes _b, _d, _f, _l, _r, _u
* JPEG or TIFF
* Maximum sphere size 23000x11500px
* Maximum cube size 16000x16000px

### Stage Structure

```
-- Structure --

project/
│
├─ tiles/
│  └─ 0-scene-id/
│     └─ left/
│        └─ 1/
│           └─ f/
│              └─ y/
│                 └─ x.jpg
│
└─ stage.json

-- Definition --

Tiles: folder defined by stage.json for scenes, eyes, levels, faces, y, and x.
Scenes: one for each scene id set in the Marzipano tool.
Eyes: scenes must contain both a left and a right eye (must be created manually).
Levels: larger images are split n times into smaller tile levels to improve loading.
Faces: levels must contain all 6 faces [b: back, d: down, f: front, l: left, r: right, u: up].
Y: the vertical coordinate of tile.
X: the horizontal coordinate of tile and file extension jpg.

stage.json: Main stage configuration file using JSON format* described below
```
\* [JSON format](https://en.wikipedia.org/wiki/JSON)

### Stage Configuration

```json
{
  "scenes": [
    {
      "id": "0-livingroom",
      "name": "livingroom",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 1024,
      "initialViewParameters": {
        "yaw": -1.570796326794896,
        "pitch": 0,
        "fov": 2.054169029464864
      },
      "linkHotspots": [
        {
          "yaw": -2.4996301372377463,
          "pitch": 0.02247465151891248,
          "rotation": 5.497787143782138,
          "target": "2-kitchen"
        },
        {
          "yaw": 2.609813231764882,
          "pitch": 0.04549510798771905,
          "rotation": 4.71238898038469,
          "target": "1-bedroom"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 0.1561130966751321,
          "pitch": -0.1087112728817754,
          "title": "This is the view",
          "text": "The view is amazing"
        }
      ]
    }
  ]
}
```

## Example Usage
Download the project to build it or use the supplied built libraries vr360player.css and vr360player.js in for example the below format.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta content="target-densitydpi=device-dpi, width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui" name="viewport">
  <meta content="ie=edge" http-equiv="x-ua-compatible">

  <style>@-ms-viewport { width: device-width; }</style>

  <title>VR 360 Player</title>

  <!-- Player CSS Library -->
  <link href="vr360player.css" rel="stylesheet">

</head>
<body>

  <!-- Player Container -->
  <div id="vr-360-player"></div>

  <!-- Player Controls -->
  <menu class="shown" id="controls">
    <a class="icon_orientation_drag" id="sensor-toggler" style="display: none"></a>
    <a class="icon_eye_left" id="eye-toggler" style="display: none"></a>
    <a class="icon_vr" id="mode-toggler"></a>
  </menu>

  <!-- Player Crosshair -->
  <i id="crosshair"></i> 

  <!-- Player JavaScript Library -->
  <script src="vr360player.js"></script>

  <!-- Player Initialization: can be extracted to an external js file. -->
  <script>
    var player = new VR360Player.default(
      document.getElementById('vr-360-player'),
      'assets/stage.json'
    );
  </script>

</body>
</html>
```

## Player Dependencies

|Plugin|Version|
|---|---|---|
|core-js|^2.4.1|
|marzipano|git+https://github.com/google/marzipano.git|
|normalize.css|^5.0.0|

## Development Dependencies

|Plugin|Version|
|---|---|---|
|@types/core-js|^0.9.34|
|@types/node|^6.0.46|
|autoprefixer|^6.5.3|
|awesome-typescript-loader|^2.2.4|
|css-loader|^0.25.0|
|extract-text-webpack-plugin|^2.0.0-beta.4|
|file-loader|^0.9.0|
|html-webpack-plugin|^2.24.1|
|ify-loader|^1.0.3|
|node-sass|^3.11.2|
|path|^0.12.7|
|postcss-loader|^1.1.1|
|pug|^2.0.0-beta6|
|pug-loader|^2.3.0|
|raw-loader|^0.5.1|
|rimraf|^2.5.4|
|sass-loader|^4.0.2|
|typedoc|^0.5.1|
|typedoc-webpack-plugin|^1.1.3|
|typescript|^2.0.8|
|url-loader|^0.5.7|
|webpack|^2.1.0-beta.25|
|webpack-dev-server|^2.1.0-beta.10|
|webpack-merge|^0.15.0|
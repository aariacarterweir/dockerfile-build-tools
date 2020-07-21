# dockerfile-build-tools

Easy way to build, version and push your local dockerfile to docker hub

## Installation
- run `yarn add dockerfile-build-tools`
- create a file in your project root called .dockerfile-build.env
- set your IMAGE_NAME=mydockerimagename value in there
- make sure you set your version number in your package.json file in your project root
- run `yarn dockerfile-build -p` to load the version automatically from your package.json and push that version to docker hub
- run `yarn dockerfile-build -v 0.0.1 -p` to build version 0.0.1 and also push your image to docker hub

## Top Tips
- Both the `-p` and `-v` options are not required. Just running `yarn docker-file-build` will build your docker file locally and tag it
    with "latest" and also whatever version you have set in your package.json

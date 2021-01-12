#!/bin/node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const argv = require('minimist')(process.argv.slice(2));
const packageJson = require(path.resolve(process.cwd(), 'package.json'));

// alias execSync for eases of the uses
const ex = (cmd, options = {}) => execSync(cmd, { stdio: 'inherit', ...options });

// load in env file if it exists
if (fs.existsSync(path.resolve(process.cwd(), '.dockerfile-build.env'))) {
    dotenv.config({ path: path.resolve(process.cwd(), '.dockerfile-build.env') });
}

// extract args from cli / package.json
const {
    v: VERSION = packageJson.version,
    p: PUSH = false
} = argv;

// extract image details from env / package.json
const {
    IMAGE_NAME = packageJson['docker-image-name'],
    LATEST_TAG = packageJson['docker-latest-tag'] || 'latest',
} = process.env;

// build
ex(`docker build -t ${IMAGE_NAME}:${LATEST_TAG} .`);

if (VERSION) {
    ex(`docker tag ${IMAGE_NAME}:${LATEST_TAG} ${IMAGE_NAME}:${VERSION}`);
}

if (PUSH) {
    ex(`docker push ${IMAGE_NAME}:${LATEST_TAG}`);

    if (VERSION) {
        ex(`docker push ${IMAGE_NAME}:${VERSION}`)
    }
}

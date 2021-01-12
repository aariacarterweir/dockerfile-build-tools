#!/usr/bin/env node

module.exports = async (args) => {
    const { execSync } = require('child_process');
    const path = require('path');
    const fs = require('fs');
    const dotenv = require('dotenv');
    const argv = require('minimist')(args);

    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = require(packageJsonPath);

    // alias execSync for eases of the uses
    const ex = (cmd, options = {}) => execSync(cmd, {stdio: 'inherit', ...options});

    // sort out a default for v arg (version argument)
    if (! argv.v) {
        const { prompt } = require('enquirer');
        const writePkg = require('write-pkg');

        const response = await prompt({
            type: 'input',
            name: 'version',
            message: `Current version: ${packageJson.version}, new version?`
        });

        packageJson.version = response.version;
        writePkg(packageJsonPath, packageJson);
    }

    // extract args from cli / package.json
    const {
        v: VERSION = packageJson.version,
        p: PUSH = false
    } = argv;

    // load in env file if it exists
    if (fs.existsSync(path.resolve(process.cwd(), '.dockerfile-build.env'))) {
        dotenv.config({path: path.resolve(process.cwd(), '.dockerfile-build.env')});
    }

    // extract image details from env / package.json
    const {
        IMAGE_NAME = packageJson['docker-image-name'],
        LATEST_TAG = packageJson['docker-latest-tag'] || 'latest',
    } = process.env;

    // build & tag
    ex(`docker build -t ${IMAGE_NAME}:${LATEST_TAG} .`);
    ex(`docker tag ${IMAGE_NAME}:${LATEST_TAG} ${IMAGE_NAME}:${VERSION}`);

    // Push
    if (PUSH) {
        ex(`docker push ${IMAGE_NAME}:${LATEST_TAG}`);
        ex(`docker push ${IMAGE_NAME}:${VERSION}`)
    }
}

module.exports(process.argv.slice(2));

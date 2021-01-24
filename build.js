#!/usr/bin/env node

module.exports = async (...args) => {
    const { execSync } = require('child_process');
    const path = require('path');
    const fs = require('fs');
    const dotenv = require('dotenv');
    const ex = (cmd, options = {}) => execSync(cmd, {stdio: 'inherit', ...options});

    // parse args
    const argv = require('minimist')(args, {
        boolean: [
            'non-interactive',
        ],
    });

    const workingDir = argv['working-dir'] || process.cwd();
    const packageJsonPath = path.resolve(workingDir, 'package.json');
    const packageJson = require(packageJsonPath);

    interactive: {
        if (argv['non-interactive']) {
            break interactive;
        }

        // sort out a default for v arg (version argument)
        if (! argv.v) {
            const { prompt } = require('enquirer');
            const writePkg = require('write-pkg');

            const response = await prompt({
                type: 'input',
                name: 'version',
                message: `Current version: ${packageJson.version}, new version?`,
                initial: packageJson.version,
            });

            argv.v = response.version;
            packageJson.version = response.version;
            writePkg(packageJsonPath, packageJson);

            console.log('updated package json with new version');
        }
    }

    // extract args from cli / package.json
    const {
        v: VERSION = false,
        p: PUSH = false
    } = argv;

    // load in env file if it exists
    if (fs.existsSync(path.resolve(workingDir, '.dockerfile-build.env'))) {
        dotenv.config({path: path.resolve(workingDir, '.dockerfile-build.env')});
    }

    // extract image details from env / package.json
    const {
        IMAGE_NAME = packageJson['docker-image-name'],
        LATEST_TAG = packageJson['docker-latest-tag'] || 'latest',
    } = process.env;

    // build & tag
    ex(`docker build -t ${IMAGE_NAME}:${LATEST_TAG} ${workingDir}`);

    if (VERSION) {
        ex(`docker tag ${IMAGE_NAME}:${LATEST_TAG} ${IMAGE_NAME}:${VERSION}`);
    }

    // Push
    if (PUSH) {
        ex(`docker push ${IMAGE_NAME}:${LATEST_TAG}`);
        ex(`docker push ${IMAGE_NAME}:${VERSION}`)
    }

    return {
        IMAGE_NAME,
        LATEST_TAG,
        VERSION,
        PUSH,
    };
}

// if file run directly, run the function
if (module === require.main) {
    module.exports(...process.argv.slice(2));
}


# dockerfile-build-tools

Easy way to build, version and push your local dockerfile to docker hub

## Installation
- run `yarn add dockerfile-build-tools`
- Either:
    - Set up your package json with the name, docker-username & version fields matching the image name and
        version of your docker hub target image
        ```json
          {
            "name": "docker-node-yarn",
            "docker-username": "aariacarterweir",
            "version": "0.1.4"
          }       
        ```
    - create a .dockerfile-build.env and set the following values
        ```dotenv
          IMAGE_NAME=yourdocker/imagename
          # optional setting of latest tag, defaults to "latest"
          LATEST_TAG=latest
        ```
    - Or do a mix of both. Anything set in the env file will be given precedence over anything else
- run `yarn dockerfile-build-tools` to build your Dockerfile and tag it as latest
- run `yarn dockerfile-build-tools -v 0.2.1` to manually set a specific version
- run `yarn dockerfile-build-tools -p` to push your versioned docker image to docker-hub
- run `yarn dockerfile-build-tools -v 0.2.2 -p` to combine a manual version override and also
    push your image to docker-hub

## Top Tips
- If you restart your terminal after adding this package,
    you can just run `dockerfile-build-tools` instead of prefixing the command with `yarn`

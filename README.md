# dockerfile-build-tools

Easy way to build, version and push your local dockerfile to docker hub

## Installation
- run `yarn add dockerfile-build-tools`
- Either:
    - Set up your package json with the docker-image-name of your docker target image
        ```json
          {
            "docker-image-name": "aariacarterweir/docker-node-yarn"
          }
        ```
    - create a .dockerfile-build.env and set the following values
        ```dotenv
          IMAGE_NAME=yourdocker/imagename
          # optional setting of latest tag, defaults to "latest"
          LATEST_TAG=latest
        ```
- run `yarn dockerfile-build-tools` to build your Dockerfile and tag it as latest
- run `yarn dockerfile-build-tools -v 0.2.1` to manually set a specific version
- run `yarn dockerfile-build-tools -p` to push your versioned docker image to docker-hub (it will ask you for a new version)
- run `yarn dockerfile-build-tools -v 0.2.2 -p` to combine a manual version override and also
  push your image to docker-hub
- run `yarn dockerfile-build-tools --working-dir="/Users/me/my-project"` to set a different working directory than cwd.

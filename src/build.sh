#!/bin/bash

# EXAMPLE USAGE
# sh build.sh -v 1.0.11 -p

# CONFIG
if [ -f "./.dockerfile-build.env" ]; then
  . ./.dockerfile-build.env
fi

# PARSE ARGS
while getopts pv: option
do
    case "${option}" in
        v) VERSION=${OPTARG};;
        p) PUSH='true';;
    esac
done

# GET SCRIPT PATH
SCRIPT_PATH=$(dirname $(realpath $0))
READ_PACKAGE="$SCRIPT_PATH"/read-package.js

if [ ! "$VERSION" ]; then
  VERSION=$("$READ_PACKAGE" version)
fi

if [ ! "$IMAGE_NAME" ]; then
  IMAGE_NAME=$("$READ_PACKAGE" docker-username)/$("$READ_PACKAGE" name)
fi

if [ ! "$LATEST_TAG" ]; then
  LATEST_TAG=latest
fi

# DO BUILD
docker build -t "${IMAGE_NAME}:${LATEST_TAG}" .

if [ "$VERSION" ]; then
    docker tag "${IMAGE_NAME}:${LATEST_TAG}" "${IMAGE_NAME}:${VERSION}"
fi

# DO PUSH
if [ "$PUSH" ]; then
    docker push "${IMAGE_NAME}:${LATEST_TAG}"

    if [ "$VERSION" ]; then
        docker push "${IMAGE_NAME}:${VERSION}"
    fi
fi

#!/bin/sh

# EXAMPLE USAGE
# sh build.sh -v 1.0.11 -p

# CONFIG
. ./.dockerfile-build.env

# PARSE ARGS
while getopts pv: option
do
    case "${option}" in
        v) VERSION=${OPTARG};;
        p) PUSH='true';;
    esac
done

# DO BUILD
docker build -t "${IMAGE_NAME}:latest" .

if [ "$VERSION" ]; then
    docker tag "${IMAGE_NAME}:latest" "${IMAGE_NAME}:${VERSION}"
fi

# DO PUSH
if [ "$PUSH" ]; then
    docker push "${IMAGE_NAME}:latest"

    if [ "$VERSION" ]; then
        docker push "${IMAGE_NAME}:${VERSION}"
    fi
fi

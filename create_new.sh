#!/bin/bash

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "Provide a name for the new folder! ( ./create_new.sh MY_NEW_PROJECT )"

rsync -av --progress project-boilerplate/ $1 --exclude node_modules

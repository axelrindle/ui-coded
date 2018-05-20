#!/bin/bash

# Die on error
die () {
    echo >&2 "$@"
    exit 1
}

# Make sure one argument is provided
[ "$#" -eq 1 ] || die "Provide a name for the new folder! ( ./create_new.sh MY_NEW_PROJECT )"

# Copy the boilerplate to the new project folder
rsync -av --progress project-boilerplate/ $1 --exclude node_modules

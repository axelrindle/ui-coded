#!/bin/bash

# Die on error
die () {
    echo >&2 "$@"
    exit 1
}

# Make sure one argument is provided
[ "$#" -eq 1 ] || die "Provide a name for the new folder! ( ./create_new.sh MY_NEW_PROJECT )"

# Validate argument to be an alphanumeric string
! [[ "$1" =~ [^a-zA-Z0-9_-] ]] || die "'$1' must only contain letters, numbers, hyphens or underscores!"

# Copy the boilerplate to the new project folder
rsync -av --progress project-boilerplate/ $1 --exclude node_modules

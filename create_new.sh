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

echo " >  Creating new project at '$1'..."
rsync -aq --progress project-boilerplate/ $1 --exclude node_modules

echo " >  Running 'npm install'..."
cd $1 && npm install

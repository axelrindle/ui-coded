#!/bin/bash

DIRS=($(ls -d packages/*))

for dir in "${DIRS[@]}"
do
  name=$(basename $dir)
  cat project-boilerplate/package.json | jq '.name = "'$name'"' > $dir/package.json
done

echo "Updated "${#DIRS[@]}" packages."

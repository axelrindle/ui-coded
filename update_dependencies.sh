#!/bin/bash

#-------- Update the boilerplate --------#

BOILERPLATE="project-boilerplate"

echo " >  Processing '$BOILERPLATE'..."
cd $BOILERPLATE

echo " >  Updating dependencies..."
npm update

echo " >  Auditing vulnerabilities..."
npm audit fix

cd ..


#-------- Update all other projects by applying the boilerplate updates --------#

DIRS=($(ls -d */ | grep -v "project-boilerplate"))

for dir in "${DIRS[@]}"
do
  echo
  echo " >  Processing '$dir'..."
  
  echo " >  Deleting 'node_modules'..."
  rm -rf $dir/node_modules
  
  echo " >  Replace 'package.json' and 'package-lock.json'..."
  cp $BOILERPLATE/package.json $dir/package.json
  cp $BOILERPLATE/package-lock.json $dir/package-lock.json
  
  echo " >  Installing dependencies..."
  cd $dir && npm install
  cd ..
done

echo
echo " >  Done."
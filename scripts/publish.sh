#!/bin/sh

if [ -z "$1" ]
  then
    echo "ERROR: No argument supplied"
    exit 1
fi

VERSION=$1

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc

# update url to GITHUB
node -e "require('fs').writeFileSync('./package.json', JSON.stringify(Object.assign(require('./package.json'), {repository:{type:'git',url:'$GITHUB_URL'}}), null, 2), 'utf8')"

# update 
node -e "require('fs').writeFileSync('./package.json', JSON.stringify(Object.assign(require('./package.json'), {version: '$VERSION'}), null, 2), 'utf8')"

# publish
npm publish

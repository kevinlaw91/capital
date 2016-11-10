#Capital

## Install

    npm install --only=dev

## Build DLL bundle
This will speed up webpack build time. Do this:

- Before performing first app build
- Everytime after updating app dependencies


    npm run build:dll

## Start webpack-dev-server

To run test build in webpack-dev-server:

    npm start

App will be hosted at [localhost:8080](http://localhost:8080/)

## Build

Development build:

    npm run-script build-dev

Production build:

    npm run-script build

Clean "build/" dir:

    gulp clean
        
## v0.4
Old 0.4 branch was tagged as "archive/0.4"
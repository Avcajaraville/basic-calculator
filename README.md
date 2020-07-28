# Basic calculator

This project is a technical demo of a basic calculator.

## Features

- Compile and transpile ES6 JS code via babel.
- Testing suite via jest with code coverage.
- Compiles SASS files into a CSS file.
- Development and production scripts.
- Prettify code.
- Linting code.

## Getting started

On the console, go to the root of the project, make sure you have `node` & `npm install` and type `npm install`.

This will do (in order):
- Install project dependencies.
- Run all unit tests.
- Generate a coverage report in `/coverage` folder.
- Build a "production" ready version of the project on `/dist` folder.

You can now go to `/dist` folder and double click (open in a browser) the `index.html` file.

This will open a compiled and minified version of the project.

Find below a list of other available scripts.

## Scripts

To run these scripts, you need to:
1. `npm install`: to install all the required dependencies.
1. `npm run [script_name]`: where script name is one of:
    - `build`: build all assets. Will generate an `index.html` file inside the `dist` folder, with all assets (CSS & JS) already minified. This is the script you want to use when deploying/building.
    - `dev`: will start `webpack-dev-server` with livereload and sourcemaps ready to be used while developing. This is the script you want to use when developing.
    - `lint`: JS linter tool using `eslint`.
    - `prettier`: prettify all your code using `prettier`.
    - `test`: run all test files (files containing `*.spec.js` extension) and generate a coverage report under `coverage` folder. It's done via `jest`.
    - `test:watch`: same as before but watching for changes.

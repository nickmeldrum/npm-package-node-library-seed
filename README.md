# npm-package-node-library-seed

A seed project to create a new "npm package node library" repository using jest and travis

## Opinions/ Conventions:

 * use this to build a public foss *npm package* node library
 * *lints/ formats* using `airbnb` recommmended es6 and `prettier` rules
 * unit *tests* and code coverage reports using `jest`
 * *checks* using `husky` and `lint-staged` to ensure no commits fail linting or tests
 * *builds* automatically on `travis` after every master commit to remote
 * *tracks* code coverage using `coveralls`
 * *deploys* automatically to `npm` if the commit is tagged

## Prerequisites

 * a github account
 * a travis account linked to your github account
 * a coveralls account linked to your github account
 * an npm account
 * node and yarn installed locally

## Setup:

 * Get a github personal access token and set it to the environment variable: `GITHUB_TOKEN`
 * Get a travis personal access token and set it to the environment variable: `TRAVIS_TOKEN`
 * Get an npm token and encrypt it with `travis encrypt` and set it to the environment variable: `NPM_TOKEN`
 * If you are behind a proxy, set a `PROXY` environment variable as e.g.: `http://proxy.hostname.com:8000`
 * Set the config values to your project setup values in `config.json` (see example config in root of repo)
 * Install template build dependencies by running: `yarn`

## Running it:

 * Run `yarn start init`
 * This will:
   * create the github repo
   * create the local templated files
   * create the local git repo and start tracking the remote
   * sync travis and activate the travis repo
 * You should now have:
   * A boilerplate git repo
   * in github
   * being build automatically by travis
   * with code coverage monitored by coveralls
   * and published to npm when a pushed commit is tagged

### Undoing:

 * Run `yarn start clean`
 * This will:
   * remove the github repo
   * remove the local folder
   * resync travis cleaning up the removed github repo

## Todo:

 * remove duplication in api based modules (use of got/ proxy etc.)
 * move workingDir into shared place - i.e. config has some derived values?
 * allow for HTTPS proxy
 * all modules should have their options passed in instead of depending on config directly
   * then we can have config got from CLI options/ questions as well as ENV or config.json
     * allow proxy/ tokens set by CLI args?
   * and modules could be separated out to own packages
 * look at alternatives to coveralls - not responding to issues
 * add some tests!

## Future:

 * maybe have a switch for foss (ISC) based or private (no license) based repo/package?
 * have an mjs version? or a ts version?
 * allow for setting node engine
 * allow switch for adding repo to org instead of user
 * have a version for an internal module - i.e. not published to npm

## Big ideas

### predefine the whole API?

Allow the whole API to be defined in config - to autofill the 'TODO's in the template README - i.e. the:

    * basic usage description
    * basic usage example
    * array of api methods:
      * name
      * description
        * array of method arguments:
          * name
          * description
          * type
          * required|optional
    * array of possible errors
      * name
      * description
    * array of examples
      * description
      * code

This would allow us to autogenerate:

  * The README in detail
  * the index.js exports?
  * the test file?

### This project can "upgrade" as well as "bootstrap" a package:

This would require us to have a well defined format for everything that can be parsed in like the template and then upgraded to the latest version.
Which means we need to be able to upgrade from previous versions to new versions of course.
Very powerful, but can it be made reliable without momentous effort?

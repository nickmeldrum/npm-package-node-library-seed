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
 * Set the config values to your project setup values
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
   * resync travis removing the removed github repo

## Todo:

 * allow proxy/ tokens set by CLI args?
 * allow config set by CLI/ questions?
 * allow for HTTPS proxy
 * improve the initialisation of child modules (injecting config?) - removal of "setup" method
 * remove duplication in api based modules (use of got/ proxy etc.)
 * move workingDir into shared place - i.e. config has some derived values?
 * create coveralls project?

## Example generator config:

```
{
    "github": {
        "user": "nickmeldrum",
        "repo": "list-subdirectories-node",
        "description": "A simple function that allows you to pass in a path to a directory and it will return a string array of subdirectories."
    },
    "npm": {
        "email": "npm@nickmeldrum.com",
        "apikey": "V8o3pjyls2Av7tpffdXlRHiPZkff3FtndsBXGl+o7HbeWgWt6I1KM2iHAHdWrHzXPAtJkt1kiR/tCdLxMHIHdcDx6dUsV8+wWc/NcFLrliC5gU3t5EJVGtk6BT2GlX4NS1KYLwzG57cVqVtb/kT3T5HVaMRuLNBQWevd6Y9UYpScFakzfNLV/5lAH0biaTrnRyQh4jyGrMNA8K9djo96XkhidibFoO4+7Shj0u3KbaqDdIBt9/6B+3AGkB1+gsAOz6nTxfPyDylhYig00+7qdTcW+XLl5en7fwOv+I+fHCxn94eVj7lxV8HBXrR/WRgFkWWgSer9bmaf7hiHJHU/cQ2LGE0nm5BrkAJjmqPWA9pJqgGx+z++r93PXIxmHuSNQqcFbeVmntiZwQicMy/VUYqlYE0trIdLhGwZSVVL4XN4bjV1QYsjzz0cQE7DxvvRjygFtNhFd0+HP6DCKCNwbqyewQrCSxC+w4JckfER4BZ+54OUcd6XsQB2vcIuV0QvmdzDsOnJHVUjYAaw7SmjBtO+zQAQdk2NfgLW2nCsE+1R6Aetp10oYf5Y8VOsdzion9/m0fzGBHnOKM1VGTPEYSmRWNmoTe8ESd+0pvgbIy7Cv28C2M8XQ0WfvbrQZJzVtoDlytiNeLXgcB+EFQdA2XFKcJPOHQNBIcW7JQb01s4="
        "name": "list-subdirectories",
        "keywords": [
            "filesystem",
            "recursive"
        ]
    },
    "author": {
        "name": "Nick Meldrum",
        "email": "nick@nickmeldrum.com",
        "website": "https://nickmeldrum.com/"
    }
}
```

## future:

 * maybe have a switch for foss (ISC) based or private (no license) based repo/package?
 * support https proxies
 * allow for setting node engine
 * have an mjs version? or a ts version?
 * allow switch for adding a proxy server
 * allow switch for adding repo to org instead of user

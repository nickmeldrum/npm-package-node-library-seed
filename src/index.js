/* eslint-disable no-console */
const m = require('./modules-with-config')

const clean = async () => {
  m.ghSetup()
  console.log('removing the github repo...')
  await m.ghDelete()
  console.log('cleaning the filesystem...')
  await m.fsClean()
  console.log('syncing travis...')
  await m.travisSync()
}

const setup = async () => {
  m.ghSetup()
  console.log('creating github repo...')
  await m.ghCreate()
  console.log('building local files from template...')
  await m.fsInit()
  console.log('setting up git repo and tracking remote...')
  await m.gitInitialSetup()
  console.log('syncing and activating travis...')
  await m.trySyncAndActivate()
}

/* eslint-disable no-unused-expressions */
require('yargs')
  .command(['clean', 'delete'], 'Clean up all created resources', () => {}, clean)
  .command(['init', 'setup'], 'setup the project', () => {}, setup)
  .demandCommand(1, 1).argv
/* eslint-enable no-unused-expressions */

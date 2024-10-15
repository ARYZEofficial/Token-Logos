import {build} from './services/build';

async function main() {
  await build('DEV');
  await build('PROD');
}
main();

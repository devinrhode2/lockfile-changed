# lockfile-changed

This package is a quick and easy way of figuring out whether or not `package.json` has been modified.

It contains mainly code extracted from [install-changed](https://github.com/ninesalt/install-changed).

`install-changed` will run `npm install` when dependencies have changed. `lockfile-changed` also provides this functionality. However, it does give you **more control** on what should happen when dependencies in your package.json file have changed.

## Install

You can find this package on `npm` and can install it with:

`npm install lockfile-changed`

However, you can use it without having to install it using `npx`:

`npx lockfile-changed`

## Documentation

### CLI

Use **lockfile-changed** simply by running following from your project root:

`npx lockfile-changed`

This is, in fact, a shorthand for the following commands:

`npx lockfile-changed run "npm install"`

or if you have an **environmental variable** `CI` with value set to `true` then it will run:

`npx lockfile-changed run "npm ci"`

However, using the `run` command you can specify any command which you want to run in case your dependencies have changed since the last run.

```
npx lockfile-changed run "echo 'Run any command when your package has changed'"
```

#### All CLI options

**lockfile-changed**

```
Options:
  --cwd [cwd]                 Current working directory.
  --hash-filename [filename]  Filename where hash of dependencies will be written to
  -h, --help                  display help for command

Commands:
  run [command]
  install [options]
  help [command]              display help for command
```

**lockfile-changed install**

```
Usage: lockfile-changed install [options]

Options:
  --ci        Run 'npm ci' instead of 'npm i'. Even when package is not changed. Default when env.CI=true
  -r, --registry <registry>  npm registry url to use
  -h, --help  display help for command
```

**lockfile-changed run**

```
Usage: lockfile-changed run [options] [command]

Options:
  -h, --help  display help for command
```

### Javascript API

```javascript
isPackageChanged(
  options?: PackageChangedOptions,
  callback?: (result: PackageChangedCallbackResult) => Promise<boolean>,
): Promise<PackageChangedResult>;
```

#### Example usage

```javascript
const {
  isPackageChanged
} = require('lockfile-changed')

// run with default options
const {
  isChanged,
} = isPackageChanged();

// or run with custom options
const {
  isChanged,
  writeHash,
} = await isPackageChanged({
  hashFilename: '.packagehash',
});

if (isChanged) {
  // dependencies in your package.json have changed since last run
  ...
  // call writeHash to write the latest package hash to your disk
  writeHash();
}

// or use the callback argument
isPackageChanged(
  undefined, // using default options
  ({isChanged}) => {
    // ...

    return true; // or false if you don't want the hash to be written
  },
);
```

**PackageChangedOptions**
| Property     | Type   | Description                                             | Required | Default          |
| ------------ | ------ | ------------------------------------------------------- | -------- | ---------------- |
| cwd          | string | Current working directory                               | false    | `process.cwd()`  |
| hashFilename | string | Filename where hash of dependencies will be written to. | false    | `'.packagehash'` |


**PackageChangedCallbackResult**
| Property  | Type                | Description                                                                       |
| --------- | ------------------- | --------------------------------------------------------------------------------- |
| isChanged | boolean             | Filename where hash of dependencies will be written to.                           |
| hash      | string              | The hash for the current listed dependencies in `package.json`                    |
| oldHash   | string \| undefined | The hash used to compare newHash with. `undefined` if no previous hash was found. |


**PackageChangedResult**
| Property  | Type                | Description                                                                       |
| --------- | ------------------- | --------------------------------------------------------------------------------- |
| isChanged | boolean             | Filename where hash of dependencies will be written to.                           |
| hash      | string              | The hash for the current listed dependencies in `package.json`                    |
| oldHash   | string \| undefined | The hash used to compare newHash with. `undefined` if no previous hash was found. |
| writeHash | function            | Function which needs to be called after the cache has been succesfully restored.  |




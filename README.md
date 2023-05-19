# Estonian personal ID (isikukood)

[![License MIT](https://img.shields.io/npm/l/isikukood)](https://github.com/dknight/Isikukood-js/blob/main/LICENSE)
[![Build](https://github.com/dknight/Isikukood-js/actions/workflows/node.js.yml/badge.svg)](https://github.com/dknight/Isikukood-js/actions/workflows/node.js.yml)
[![Version](https://img.shields.io/npm/v/isikukood)](https://www.npmjs.com/package/isikukood)

JavaScript class for both browser and Node. Generates and validates Estonian personal IDs.

[Check demo](https://dknight.github.io/Isikukood-js)

## Version 3

- Fully backwards compatible with previous major versions 2.x.x and 1.x.x.
- Migrated to TypeScript.
- Removed CommonJS support, use ESModules.

## Version 2

- Fully backwards compatible with previous major versions 1.x.x.

## Install

Install via npm, yarn or pnpm.

```sh
npm install isikukood
yarn install isikukood
pnpm install isikukood
```

Download and include JS file into your HTML.

```html
<script src="./dist/isikukood.esm.js" type="module"></script>
```

Using ES Modules

```js
import {Isikukood} from './dist/isikukood.esm.js';
```

## Usage

Usage example.

```javascript
// Validation
const ik = new Isikukood('47502124911');
const isValid = ik.validate(); // true is valid, false isn't valid
const sex = ik.getGender(); // "male" or "female"
const age = ik.getAge(); // person's age
const birthday = ik.getBirthday(); // person's birthday

// Generation
const validIk = Isikukood.generate(); // "49002124277"

// Generate with parameters
const maleIk = Isikukood.generate({
  gender: 'male',
  birthDay: 23,
  birthMonth: 3,
  birthYear: 1984,
});
```

## API

### Instance methods

| Method             | Description                                   | Arguments        | Return       |
| ------------------ | --------------------------------------------- | ---------------- | ------------ |
| new Isikukood()    | constructor                                   | number \| string | Isikukood    |
| validate()         | Validates personal ID                         | -                | boolean      |
| generate()         | Static function generates a valid personal ID | GenerateInput    | string       |
| getGender()        | Get the gender of a person                    | -                | Gender       |
| getBirthday()      | Get the birthday of a person                  | -                | Date         |
| getAge()           | Get the birthday of a person in years         | -                | number       |
| getControlNumber() | Gets the control number of personal ID        | -                | number       |
| parse()            | Parses the code                               | -                | PersonalData |

### Static methods

| Method  | Description     | Arguments        | Return       |
| ------- | --------------- | ---------------- | ------------ |
| parse() | Parses the code | number \| string | PersonalData |

## Development

Be sure that your [GNU Make](https://www.gnu.org/software/make/) software is installed on your system. Development commands are very simple.

### Everything

```sh
make
```

### Build

```sh
make build
```

### Test

```sh
make test
```

## Contribution

Any help is appreciated. Found a bug, typo, inaccuracy, etc.? Please do not hesitate to make a pull request or file an issue.

## License

[MIT License](https://mit-license.org/) 2014-2023

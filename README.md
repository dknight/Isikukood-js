# Estonian personal ID (isikukood) JavaScript class

Version 2.0.0 is fully compatible with previous major versions 1.X.X.

## Install
Install via npm
```sh
npm install isikukood
```

Download and include JS file into your HTML.
```html
<script src="./dest/isikukood.js"></script>
```

Using ES Modules
```html
import {Isikukood} from './dest/isikukood.mjs';
```

## Usage
Usage example.
```javascript
// Validation
var ik = new Isikukood('47502124911');
var isValid = ik.validate(); // true is valid, false isn't valid
var sex = ik.getGender(); // "male" or "female"
var age = ik.getAge(); // person's age
var birthday = ik.getBirthday(); // person's birthday

// Generation
var validIk = Isikukood.generate(); // "49002124277"

// Generate with parameters
var maleIk = Isikukood.generate({
  gender: "male",
  birthDay: 23,
  birthMonth: 3,
  birthYear: 1984
});
```

## API
<table class="table1">
  <tr>
    <th>Method</th>
    <th>Description</th>
    <th>Arguments</th>
    <th>Return</th>
  </tr>
  <tr>
    <td>Isikukood</td>
    <td>Creates an instance of Isikukood object.</td>
    <td>Number|String required</td>
    <td>Function</td>
  </tr>
  <tr>
    <td>validate()</td>
    <td>Validates personal ID</td>
    <td>-</td>
    <td>Boolean</td>
  </tr>
  <tr>
    <td>generate()</td>
    <td>Static function generates a valid personal ID.</td>
    <td>Object { gender: "male|female", birthDay: day, birthMonth: month, birthYear: year }.r Month are beginning from 1, eg. 1 is January, 2 is February etc.</td>
    <td>string</td>
  </tr>
  <tr>
    <td>getGender()</td>
    <td>Get the gender of a person.</td>
    <td>-</td>
    <td>string</td>
  </tr>
  <tr>
    <td>getBirthday()</td>
    <td>Get the birthday of a person.</td>
    <td>-</td>
    <td>Date</td>
  </tr>
  <tr>
    <td>getAge()</td>
    <td>Get the birthday of a person in years.</td>
    <td>-</td>
    <td>number</td>
  </tr>
  <tr>
    <td>getControlNumber()</td>
    <td>Gets the control number of personal ID</td>
    <td>-</td>
    <td>number</td>
  </tr>
    <tr>
    <td>parse()</td>
    <td>Parses the code and return it's data as object.</td>
    <td>-</td>
    <td>object</td>
  </tr>
</table>

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

## License
[MIT License](https://mit-license.org/) 2022

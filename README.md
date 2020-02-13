# `dualbounce`

Debounce stuttering changes into a single change.

## Installation

```
npm install dualbounce
```

or

```
yarn add dualbounce
```

## Example

``` js
import dualbounce from "dualbounce";

const fn = dualbounce(
    (newValue, oldValue) => console.log("From", oldValue, "to", newValue),
    1000
);

for (var i = 0; i < 10; i++) {
    fn(i + 1, i);
}

// After 1 second: "From 0 to 10"
```

Returning values is supported too:

``` js
const fn = dualbounce(
    (newValue, oldValue) => `From ${oldValue} to ${newValue}`,
    1000
);

const promise = fn("Erica", "Monica");
fn("Rita", "Erica");
fn("Tina", "Rita")

console.log(await promise);
// After 1 second: "From Monica to Tina"
```

All invocations of the dualbounced function within the wait period will
return the same promise.

## API

### `debounce(func, wait)`

- **`func`**: `(newValue, oldValue) => returnValue`

  The function that will execute once the wait time is up. It will always be
  executed with the *last* value of `newValue` in the wait period, and the
  *first* value of `oldValue` in the wait period. `returnValue` can be a `Promise`!
- **`wait`**: `number`

  The number of milliseconds to wait.
- **Returns**: `(newValue, oldValue) => Promise<typeof returnValue>`

  A dualbounced `func`. The `Promise` will resolve `wait` milliseconds after the last invocation.

## License

MIT
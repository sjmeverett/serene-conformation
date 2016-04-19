# serene-conformation

Validation middleware for [Serene](https://www.npmjs.com/package/serene), using [Conformation](https://www.npmjs.com/package/conformation).

## Example

```js
import Schema from 'conformation';
import Serene from 'serene';
import SereneConformation from 'serene-conformation';
import SereneResources from 'serene-resources';


let service = new Serene();

let resources = {
  widgets: {
    schema: Schema.object().keys({
      name: Schema.string().required(),
      description: Schema.string()
    })
  }
};

// this package depends on SereneResources, which must be registered first
serene.use(new SereneResources(resources));

serene.use(new SereneConformation());

serene.use(function (request, response) {
  // this only runs if the request is valid
});
```

The middleware only validates requests with a body, that is:
  * create
  * update
  * replace

It wraps the `schema` found in the resource definition with a `attributes` field, so that it
conforms to the [SuperAPI](https://github.com/stugotech/super-api) spec, and automatically unwraps
the request payload from the `attributes` field.

See tests for more details.

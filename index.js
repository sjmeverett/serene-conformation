
var BadRequestError = require('http-status-errors').BadRequestError;
var Schema = require('conformation');

module.exports = SereneConformation;

function SereneConformation() {

}

SereneConformation.prototype.handle = function (request, response) {
  if (request.operation.body && request.resource && request.resource.schema) {
    var schema = Schema.object().keys({
      attributes: request.resource.schema.required()
    });

    var validationContext = {
      strict: 'semi',
      request
    };

    return schema
      .validateAsync(request.body, validationContext)
      .then(function (validation) {
        if (!validation.valid) {
          throw new BadRequestError('body validation failed', {details: validation.errors});

        } else {
          request.body = validation.value.attributes;
          request.validationContext = validationContext;
        }
      });
  }
};

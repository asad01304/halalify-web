module.exports = function ( errorCodeOnly ){
  return errorCodeOnly ? {
    // type
    isArray        : '10',
    isAlpha        : '11',
    isAlphanumeric : '12',
    isDate         : '13',
    isDecimal      : '14',
    isFloat        : '14', // alias for isDecimal
    isNumeric      : '15',
    isInt          : '16',
    isNull         : '17',
    notNull        : '18',
    // format
    isCreditCard   : '20',
    isEmail        : '21',
    isIP           : '22',
    isLowercase    : '23',
    isUppercase    : '24',
    isUrl          : '25', // http, https, ftp
    isUUID         : '26',
    // content
    required       : '30',
    notEmpty       : '31',
    contains       : '32',
    notContains    : '33',
    is             : '34', // alias for regex
    regex          : '34',
    not            : '35', // alias for noregex
    notRegex       : '35',
    isIn           : '36', // array or string
    notIn          : '37', // array or string
    equals         : '38',
    isAfter        : '39', // date
    isBefore       : '310', // date
    len            : '311', // array or string, max is optional
    max            : '312',
    min            : '313',
    maxLength      : '312',
    minLength      : '313',
    custom         : '0'
  } : {
    // type
    isArray        : '%s is not an array',
    isAlpha        : '%s contains non-letter characters',
    isAlphanumeric : '%s contains non alpha-numeric characters',
    isDate         : '%s is not a valid date',
    isDecimal      : '%s is not a decimal',
    isFloat        : '%s is not a decimal', // alias for isDecimal
    isNumeric      : '%s is not a number',
    isInt          : '%s is not an integer',
    isNull         : '%s is not null',
    notNull        : '%s is null',
    // format
    isCreditCard   : '%s is not a credit card number',
    isEmail        : '%s is not an email address',
    isIP           : '%s is not an IP address',
    isLowercase    : '%s contains uppercase letters',
    isUppercase    : '%s contains lowercase letters',
    isUrl          : '%s is not an URL', // http, https, ftp
    isUUID         : '%s is not an UUID',
    // content
    required       : '%s is required',
    notEmpty       : '%s has no value or is only whitespace',
    contains       : '%s does not contain required characters',
    notContains    : '%s contains invalid characters',
    is             : '%s has invalid characters', // alias for regex
    regex          : '%s has invalid characters',
    not            : '%s has invalid characters', // alias for noregex
    notRegex       : '%s has invalid characters',
    isIn           : '%s has invalid characters', // array or string
    notIn          : '%s has invalid characters', // array or string
    equals         : '%s does not equal to %t',
    isAfter        : '%s is not a valid date', // date
    isBefore       : '%s is not a valid date', // date
    len            : '%s is not in range', // array or string, max is optional
    max            : '%s is invalid',
    min            : '%s is invalid',
    maxLength      : '%s is too long',
    minLength      : '%s is too short',
    custom         : '%s is invalid'
  }
};

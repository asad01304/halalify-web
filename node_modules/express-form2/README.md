# Express Form2

Express Form provides data filtering and validation as route middleware to your Express applications.



## Requires

Checkout `package.json` for dependencies.



## Installation

Install express-form2 through npm

    npm install express-form2



## API

- field( name ).isArray( msg );
- field( name ).isAlpha( msg );
- field( name ).isAlphanumeric( msg );
- field( name ).isDate( msg );
- field( name ).isDecimal( msg );
- field( name ).isFloat( msg );
- field( name ).isNumeric( msg );
- field( name ).isInt( msg );
- field( name ).isNull( msg );
- field( name ).notNull( msg );
- field( name ).isCreditCard( msg );
- field( name ).isEmail( msg );
- field( name ).isIP( msg );
- field( name ).isLowercase( msg );
- field( name ).isUppercase( msg );
- field( name ).isUrl( msg );
- field( name ).isUUID( version );
- field( name ).required( msg );
- field( name ).notEmpty( msg );
- field( name ).contains( val, msg );
- field( name ).notContains( val, msg );
- field( name ).is( pattern, modifiers, msg );
- field( name ).regex( pattern, modifiers, msg );
- field( name ).not( pattern, modifiers, msg );
- field( name ).notRegex( pattern, modifiers, msg );
- field( name ).isIn( opt, msg );
- field( name ).notIn( opt, msg );
- field( name ).equals( eql, msg );
- field( name ).isAfter( date, msg );
- field( name ).isBefore( date, msg );
- field( name ).len( min, max, msg );
- field( name ).max( val, msg );
- field( name ).min( val, msg );
- field( name ).maxLength( val, msg );
- field( name ).minLength( val, msg );
- field( name ).custom( func, msg );
- field( name ).ifNull( replace );
- field( name ).entityDecode();
- field( name ).entityEncode();
- field( name ).ltrim( chars );
- field( name ).rtrim( chars );
- field( name ).toFloat();
- field( name ).toInt();
- field( name ).toBoolean();
- field( name ).toBooleanStrict();
- field( name ).trim( chars );
- field( name ).xss( opt );
- field( name ).toArray();
- field( name ).toUpper();
- field( name ).toLower();
- field( name ).truncate( len );



## Usage

### Example

    var form    = require( 'express-form' );
    var field   = form.field;
    var express = require( 'express' );
    var app     = express.createServer();

    app.configure( function(){
      app.use( express.bodyDecoder());
      app.use( app.router );
    });

    app.post(

      // Route
      '/user',

      // Form filter and validation middleware
      form(
        field( 'username' ).trim().required().is( /^[a-z]+$/ ),
        field( 'password' ).trim().required().is( /^[0-9]+$/ ),
        field( 'email' ).trim().isEmail()
      ),

      // Express request-handler now receives filtered and validated data
      function( req, res ){
        if( !req.form.isValid ){
          // Handle errors
          console.log( req.form.errors );
        }else{
          // Or, use filtered form data from the form object:
          console.log( 'Username:', req.form.username );
          console.log( 'Password:', req.form.password );
          console.log( 'Email:', req.form.email );
        }
      }
    );



### Module

The Express Form **module** returns an Express [Route Middleware](http://expressjs.com/guide.html#Route-Middleware) function. You specify filtering and validation by passing filters and validators as arguments to the main module function. For example:

    var form = require( 'express-form' );

    app.post( '/user',

      // Express Form Route Middleware: trims whitespace off of
      // the `username` field.
      form( form.field( 'username' ).trim()),

      // standard Express handler
      function ( req, res ){
        // ...
      }
    );



#### http.ServerRequest.prototype.form

Express Form adds a `form` object with various properties to the request.

    isValid -> Boolean

    errors  -> Array

    flashErrors(name) -> undefined

        Flashes all errors. Configurable, enabled by default.

    getErrors(name) -> Array or Object if no name given
    - fieldname (String): The name of the field

        Gets all errors for the field with the given name.

        You can also call this method with no parameters to get a map of errors for all of the fields.

    Example request handler:

    function ( req, res ){
      if( !req.form.isValid ){
        console.log( req.form.errors );
        console.log( req.form.getErrors( 'username' ));
        console.log( req.form.getErrors());
      }
    }



#### Options / Configuration
Express Form has various configuration options, but aims for sensible defaults for a typical Express application.

    form.configure(options) -> self
    - options (Object): An object with configuration options.

    flashErrors (Boolean): If validation errors should be automatically passed to Express’ flash() method. Default: true.

    autoLocals (Boolean): If field values from Express’ request.body should be passed into Express’ response.locals object. This is helpful when a form is invalid an you want to repopulate the form elements with their submitted values. Default: true.

    Note: if a field name dash-separated, the name used for the locals object will be in camelCase.

    dataSources (Array): An array of Express request properties to use as data sources when filtering and validating data. Default: ["body", "query", "params"].

    autoTrim (Boolean): If true, all fields will be automatically trimmed. Default: false.

    passThrough (Boolean): If true, all data sources will be merged with `req.form`. Default: false.

    errorCodeOnly (Boolean): If true the error msg will only return error code.
    Default: false.



### Fields

The `field` property of the module creates a filter/validator object tied to a specific field.

    var form  = require( 'express-form' );
    var field = form.field;

    field( fieldname[, label ]);

You can access nested properties with either dot or square-bracket notation.

    field( 'post.content' ).minLength( 50 );
    field( 'post[ user ][ id ]' ).isInt();
    field( 'post.super.nested.property' ).required();

Simply specifying a property like this, makes sure it exists. So, even if `req.body.post` was undefined, `req.form.post.content` would be defined. This helps avoid any unwanted errors in your code.

The API is chainable, so you can keep calling filter/validator methods one after the other:

    field( 'username' ).trim().toLower().truncate( 5 ).required().isAlphanumeric();

## Sanitization / Filters

### field( name ).ifNull( replace );
    ', undefined and null get replaced by `replacement`

### field( name ).entityDecode();
    Decode HTML entities

### field( name ).entityEncode();
    Encodes HTML entities

### field( name ).ltrim( chars );
### field( name ).rtrim( chars );
### field( name ).toFloat();
    Number

### field( name ).toInt();
    Number, rounded down

### field( name ).toBoolean();
    Boolean from truthy and falsy values. True unless str = '0', 'false', or str.length == 0

### field( name ).toBooleanStrict();
    Only true, 'true', 1 and '1' are `true`. False unless str = '1' or 'true'

### field( name ).trim( chars );
    Trim optional `chars`, default is to trim whitespace ( \r\n\t\s )

### field( name ).xss( opt );
    Remove common XSS attack vectors from text ( true from images )

### field( name ).toArray();
    Using the toArray() flag means that field always gives an array. If the field value is an array, but there is no flag, then the first value in that array is used instead.

        This means that you don't have to worry about unexpected post data that might break your code. Eg/ when you call an array method on what is actually a string.

        field( 'project.users' ).toArray(),
        // undefined => [], '' => [], 'q' => [ 'q' ], [ 'a', 'b' ] => [ 'a', 'b' ]

        field( 'project.block' ),
        // project.block : [ 'a', 'b' ] => 'a'. No 'toArray()', so only first value used.

        In addition, any other methods called with the array method, are applied to every value within the array.

        field( 'post.users' ).toArray().toUpper()
        // post.users : [ 'one', 'two', 'three' ] => [ 'ONE', 'TWO', 'THREE' ]

### field( name ).toUpper();
### field( name ).toLower();
### field( name ).truncate( len );
    Chops value at (length - 3), appends `...`

## Validations

**Validation messages**: each validator has its own default validation message. These can easily be overridden at runtime by passing a custom validation message to the validator. The custom message is always the **last** argument passed to the validator.

Use '%s' in the message to have the field name or label printed in the message:

    field( 'username' ).required()
    // -> 'username is required'

    field( 'username' ).required( 'What is your %s?' )
    // -> 'What is your username?'

    field( 'username', 'Username' ).required( 'What is your %s?' )
    // -> 'What is your Username?'

> By type

### field( name ).isArray( msg );
### field( name ).isAlpha( msg );
### field( name ).isAlphanumeric( msg );
### field( name ).isDate( msg );
    Uses Date.parse() - regex is probably a better choice

### field( name ).isDecimal( msg );
### field( name ).isFloat( msg );
    Alias for isDecimal

### field( name ).isNumeric( msg );
### field( name ).isInt( msg );
    isNumeric accepts zero padded numbers, e.g. '001', isInt doesn't

### field( name ).isNull( msg );
### field( name ).notNull( msg );

> By format

### field( name ).isCreditCard( msg );
    Will work against Visa, MasterCard, American Express, Discover, Diners Club, and JCB card numbering formats

### field( name ).isEmail( msg );
### field( name ).isIP( msg );
### field( name ).isLowercase( msg );
### field( name ).isUppercase( msg );
### field( name ).isUrl( msg );
    Accepts http, https, ftp

### field( name ).isUUID( version );
    Version can be 3 or 4 or empty, see http://en.wikipedia.field( name ).org/wiki/Universally_unique_identifier

> By content

### field( name ).required( msg );
    Checks that the field is present in form data, and has a value.

### field( name ).notEmpty( msg );
    Checks if the value is not just whitespace.

### field( name ).contains( val, msg );
    - val (String): The value to test for.

      Checks if the field contains `value`.

### field( name ).notContains( val, msg );
    - value (String): A value that should not exist in the field.

        Checks if the field does NOT contain `value`.

### field( name ).is( pattern, modifiers, msg );
    Alias for regex()

### field( name ).regex( pattern, modifiers, msg );
    regex( pattern[, modifiers[, message ]])
    - pattern (RegExp|String): RegExp (with flags) or String pattern.
    - modifiers (String): Optional, and only if `pattern` is a String.
    - message (String): Optional validation message.

        alias: is

        Checks that the value matches the given regular expression.

        Example:

        field( 'username' ).is( '[a-z]', 'i', 'Only letters are valid in %s' );
        field( 'username' ).is( /[a-z]/i, 'Only letters are valid in %s' );

### field( name ).not( pattern, modifiers, msg );
    Alias for notRegex()

### field( name ).notRegex( pattern, modifiers, msg );
    notRegex( pattern[, modifiers[, message ]])
    - pattern (RegExp|String): RegExp (with flags) or String pattern.
    - modifiers (String): Optional, and only if `pattern` is a String.
    - message (String): Optional validation message.

        alias: not

        Checks that the value does NOT match the given regular expression.

        Example:

        field( 'username' ).not( '[a-z]', 'i', 'Letters are not valid in %s' );
        field( 'username' ).not( /[a-z]/i, 'Letters are not valid in %s' );

### field( name ).isIn( opt, msg );
    Accepts an array or a string

### field( name ).notIn( opt, msg );
    Accepts an array or a string

### field( name ).equals( eql, msg );
    equals( value [, message])
    - value (String): A value that should match the field value OR a fieldname
                      token to match another field, ie, `field::password`.

        Compares the field to `value`.

        Example:
        field( 'username' ).equals( 'admin' );

        field( 'password' ).is( /^\w{6,20}$/ );
        field( 'password_confirmation' ).equals( 'field::password' );

### field( name ).isAfter( date, msg );
    Argument is optional and defaults to today

### field( name ).isBefore( date, msg );
    Argument is optional and defaults to today

### field( name ).len( min, max, msg );
    For both str & arr, max is optional

### field( name ).max( val, msg );
### field( name ).min( val, msg );
### field( name ).maxLength( val, msg );
### field( name ).minLength( val, msg );
### field( name ).custom( func, msg );
    custom( function[, message ])
    - function (Function): A custom filter or validation function.

        This method can be utilised as either a filter or validator method.

        If the function throws an error, then an error is added to the form. (If `message` is not provided, the thrown error message is used.)

        If the function returns a value, then it is considered a filter method, with the field then becoming the returned value.

        If the function returns undefined, then the method has no effect on the field.

        Examples:

        If the `name` field has a value of 'hello there', this would
        transform it to 'hello-there'.

        field( 'name' ).custom( function ( value ){
          return value.replace( /\s+/g, '-' );
        });

        Throws an error if `username` field does not have value 'admin'.

        field( 'username' ).custom( function ( value ){
            if(value !== 'admin' ){
              throw new Error( '%s must be `admin`.' );
            }
        });

## Error Code

- By type
    - 10 : isArray
    - 11 : isAlpha
    - 12 : isAlphanumeric
    - 13 : isDate
    - 14 : isDecimal
    - 14 : isFloat
    - 15 : isNumeric
    - 16 : isInt
    - 17 : isNull
    - 18 : notNull

- By format
    - 20 : isCreditCard
    - 21 : isEmail
    - 22 : isIP
    - 23 : isLowercase
    - 24 : isUppercase
    - 25 : isUrl
    - 26 : isUUID

- By content
    - 30  : required
    - 31  : notEmpty
    - 32  : contains
    - 33  : notContains
    - 34  : is
    - 34  : regex
    - 35  : not
    - 35  : notRegex
    - 36  : isIn
    - 37  : notIn
    - 38  : equals
    - 39  : isAfter
    - 310 : isBefore
    - 311 : len
    - 312 : max
    - 312 : maxLength
    - 313 : min
    - 313 : minLength
    - 0   : custom



## Runing Tests

    npm install expresso
    cd /path/to/the/project/root
    expresso



## Credits

Currently, Express Form uses many of the validation and filtering functions provided by Chris O'Hara's [node-validator]( https://github.com/chriso/node-validator ).



## License

(The MIT License)

Copyright (c) 2011 dreamerslab &lt;ben@dreamerslab.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software' ), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

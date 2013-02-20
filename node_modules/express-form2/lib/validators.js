var utils              = require( './utils' );
var validator          = require( 'validator' );
var ValidatorPrototype = validator.Validator.prototype;
var externalValidator  = new validator.Validator();
var validators         = {};

Object.keys( ValidatorPrototype ).forEach( function ( name ){
  if( name.match( /^(contains|notContains|equals|check|validate|assert|error|len|isNumeric|isDecimal|isFloat|regex|notRegex|is|not)$/ )){
    return;
  }

  validators[ name ] = function ( msg ){
    var args = arguments;
    msg = msg || this.msg[ name ];

    return this.add( function ( val ){
      try{
        ValidatorPrototype[ name ].
          apply( externalValidator.check( val, msg ), args );
      }catch( e ){
        return { error : msg };
      }

      return { valid : true };
    });
  };
});

validators.contains = function ( test, msg ){
  msg = msg || this.msg.contains;

  return this.add( function ( val ){
    try{
      ValidatorPrototype.contains.call( externalValidator.check( val, msg ), test );
    }catch( e ){
      return { error : msg };
    }

    return { valid : true };
  });
};

validators.notContains = function ( test, msg ){
  msg = msg || this.msg.notContains;

  return this.add( function ( val ){
    try{
      ValidatorPrototype.notContains.call( externalValidator.check( val, msg ), test );
    }catch( e ){
      return { error : msg };
    }

    return { valid : true };
  });
};

validators.equals = function ( other, msg ){
  var self = this;

  if( utils.typeof( other ) === 'string' && other.match( /^field::/ )){
    this.__required = true;
  }

  return this.add( function ( val, src ){
    // If other is a field token ( field::fieldname), grab the val of fieldname
    // and use that as the OTHER val.
    var test = other;

    if( utils.typeof( other ) === 'string' && other.match( /^field::/ )){
      test = utils.get( other.replace( /^field::/, '' ), src );
    }

    return val == test ?
      { valid : true } :
      { error : ( msg || self.msg.equals ).replace( /%t/, String( test ))};
  });
};

validators.len = function ( min, max, msg ){
  msg = msg || this.msg.len;

  return this.add( function ( val ){
    try{
      ValidatorPrototype.len.
        call( externalValidator.check( val, msg ), min, max );
    }catch( e ){
      return { error : msg };
    }

    return { valid : true };
  });
};

validators.isArray = function ( msg ){
  var args = arguments;

  msg = msg || this.msg.isArray;

  this.__isArray = true;

  return this.add( function ( val ){
    try{
      ValidatorPrototype.isArray.call( externalValidator.check( val, msg ), args );
    }catch( e ){
      return { error : msg };
    }

    return { valid : true };
  });
};

// node-validator's numeric validator seems unintuitive. All numeric values should be valid, not just int.
validators.isNumeric = function ( msg ){
  msg = msg || this.msg.isNumeric;

  return this.add( function ( val ){
    return ( utils.typeof( val ) === 'number' ||
           ( utils.typeof( val ) === 'string' &&
             val.match( /^[-+]?[0-9]*\.?[0-9]+$/ ))) ?
               { valid : true } :
               { error : msg };
  });
};

// node-validator's decimal/float validator incorrectly thinks Ints are valid.
validators.isFloat = validators.isDecimal = function ( msg ){
  msg = msg || this.msg.isFloat;

  return this.add( function ( val ){
    return ( utils.typeof( val ) === 'number' && val % 1 == 0 ) ||
      ( utils.typeof( val ) === 'string' && val.match( /^[-+]?[0-9]*\.[0-9]+$/ )) ?
        { valid : true } :
        { error : msg }
  });
};

validators.regex = validators.is = function ( pattern, modifiers, msg ){
  // regex( /pattern/ )
  // regex( /pattern/, 'msg' )
  // regex( 'pattern' )
  // regex( 'pattern', 'modifiers' )
  // regex( 'pattern', 'msg' )
  // regex( 'pattern', 'modifiers', 'msg' )
  var self = this;

  if( pattern instanceof RegExp ){
    if(( utils.typeof( modifiers ) === 'string' ) && modifiers.match( /^[gimy]+$/ )){
      throw new Error( 'Invalid arguments: `modifiers` can only be passed in if `pattern` is a string.' );
    }

    msg       = modifiers;
    modifiers = undefined;
  }else if( utils.typeof( pattern ) === 'string' ){
    if( arguments.length == 2 && !modifiers.match( /^[gimy]+$/ )){
      // 2nd arg doesn't look like modifier flags, it's the msg (might also be undefined)
      msg       = modifiers;
      modifiers = undefined;
    }

    pattern = new RegExp( pattern, modifiers );
  }

  return this.add( function ( val ){
    return pattern.test( val ) === false ?
      { error : msg || self.msg.regex } :
      { valid : true };
  });
};

validators.notRegex = validators.not = function( pattern, modifiers, msg ){
  // notRegex( /pattern/ )
  // notRegex( /pattern/, 'msg' )
  // notRegex( 'pattern' )
  // notRegex( 'pattern', 'modifiers' )
  // notRegex( 'pattern', 'msg' )
  // notRegex( 'pattern', 'modifiers', 'msg' )
  var self = this;

  if( pattern instanceof RegExp){
    if(( utils.typeof( modifiers ) === 'string' )&& modifiers.match( /^[gimy]+$/ )){
      throw new Error( 'Invalid arguments: `modifiers` can only be passed in if `pattern` is a string.' );
    }

    msg       = modifiers;
    modifiers = undefined;

  }else if( utils.typeof( pattern )){
    if( arguments.length == 2 && !modifiers.match( /^[gimy]+$/ )){
      // 2nd arg doesn't look like modifier flags, it's the message (might also be undefined)
      msg = modifiers;
      modifiers = undefined;
    }
    pattern = new RegExp( pattern, modifiers );
  }

  return this.add( function( val ){
    return pattern.test( val ) === true ?
      { error : msg || self.msg.notRegex } :
      { valid : true };
  });
};

validators.minLength = function ( len, msg ){
  msg = msg || this.msg.minLength;

  return this.add( function ( val ){
    return ( val || '' ).toString().length < len ?
      { error : msg } :
      { valid : true };
  });
};

validators.maxLength = function ( len, msg ){
  msg = msg || this.msg.maxLength;

  return this.add( function ( val ){
    return ( val || '' ).toString().length > len ?
      { error : msg } :
      { valid : true };
  });
};

validators.required = function ( placeholderValue, msg ){
  msg = msg || this.msg.required;

  this.__required = true;

  return this.add( function ( val ){
    return !utils.hasValue( val ) || val == placeholderValue ?
      { error : msg } :
      { valid : true };
  });
};



module.exports = validators;



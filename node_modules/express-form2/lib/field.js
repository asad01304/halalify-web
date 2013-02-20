var extend          = require( 'node.extend' );
var utils           = require( './utils' );
var filters         = require( './filters' );
var validators      = require( './validators' );
var validator       = require( 'validator' );
var FilterPrototype = validator.Filter.prototype;
var externalFilter  = new validator.Filter();

var Field = function ( prop, label, msg ){
  var self  = this;
  var tasks = [];

  label = label || prop;

  this.name       = prop;
  this.__required = false;
  this.__isArray  = false;
  this.msg        = msg;

  this.add = function ( func ){
    tasks.push( func );
    return this;
  };

  this.run_tasks = function ( val ){
    tasks.forEach( function ( rule ){
      var result = rule( val, self.src ); // Pass src for 'equals' rule.

      if( result === undefined ) return;
      if( result.valid ) return;
      if( result.error ){
        // If this field is not required and it doesn't have a val, ignore error.
        if( !utils.hasValue( val ) && !self.__required ) return;

        return self.errors.push( result.error.replace( '%s', label ));
      }

      val = result;
    });

    return val;
  };

  this.run = function ( src, form, opt ){
    var val = utils.get( prop, form ) || utils.get( prop, src );

    this.src    = src;
    this.errors = [];

    if( opt.autoTrim ){
      tasks.unshift( function ( val ){
        return utils.typeof( val ) === 'string' ?
          FilterPrototype.trim.apply( externalFilter.sanitize( val )) :
          val;
      });
    }

    if( self.__isArray ){
      if( !utils.hasValue( val )) val = [];
      if( !Array.isArray( val ))  val = [ val ];

      val = val.map( this.run_tasks );
    }else{
      val = Array.isArray( val ) ?
        val.map( this.run_tasks ) :
        this.run_tasks( val );
    }

    utils.set( prop, form, val );

    if( this.errors.length ) return this.errors;
  };
};

extend( Field.prototype, filters );
extend( Field.prototype, validators );

module.exports = Field;

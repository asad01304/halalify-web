/*!
 * express-form2
 * Copyright(c) 2011 Ben Lin <ben@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 *
 */

var extend     = require( 'node.extend' );
var inflection = require( 'inflection' );
var utils      = require( './utils' );
var Field      = require( './field' );
var msg        = require( './msg' );

function form (){
  var self  = this;
  var opt   = form._opt;
  var tasks = [].slice.call( arguments );

  return function ( req, res, next ){
    var map          = {};
    var flashed      = {};
    var mergedSource = {};

    opt.dataSources.forEach( function ( src ){
      extend( mergedSource, req[ src ]);
    });

    if( !req.form ) req.form = {};

    if( opt.passThrough ) req.form = extend( mergedSource );

    if( opt.autoLocals ){
      for( var prop in req.body ){
        if( !req.body.hasOwnProperty( prop )) continue;

        if( typeof res.local === 'function' ){ // Express 2.0 Support
          res.local( inflection.camelize( prop ), req.body[ prop ]);
        }

        if( !res.locals ) res.locals = {};
        res.locals[ inflection.camelize( prop )] = req.body[ prop ];
      }
    }

    Object.defineProperties( req.form, {
      'errors' : {
        value      : [],
        enumerable : false
      },
      'getErrors' : {
        value : function ( name ){
          if( !name ) return map;

          return map[ name ] || [];
        },
        enumerable : false
      },
      'isValid' : {
        get : function (){
          return this.errors.length === 0;
        },
        enumerable : false
      },
      'flashErrors' : {
        value : function (){
          if( typeof req.flash !== 'function' ) return;

          this.errors.forEach( function ( error ){
            if( flashed[ error ]) return;

            flashed[ error ] = true;
            req.flash( 'error', error );
          });
        },
        enumerable : false
      }
    });

    tasks.forEach( function ( task ){
      var result = task.run( mergedSource, req.form, opt );

      if( !Array.isArray( result ) || !result.length ) return;

      var name = task.name;

      req.form.errors = req.form.errors || [];
      map[ name ]     = map[ name ] || [];

      result.forEach( function ( error ){
        req.form.errors.push( error );
        map[ name ].push( error );
      });
    });

    if( opt.flashErrors ) req.form.flashErrors();
    if( next ) next();
  };
};

form._opt = {
  dataSources   : [ 'body', 'query', 'params' ],
  autoTrim      : false,
  autoLocals    : true,
  passThrough   : false,
  flashErrors   : true,
  errorCodeOnly : false
};

form.field = function ( prop, label ){
  return new Field( prop, label, msg( form._opt.errorCodeOnly ));
};

form.configure = function ( opt ){
  var self = this;

  Object.keys( opt ).forEach( function ( key ){
    if( !Array.isArray( opt[ key ]) && key === 'dataSources' ){
      opt[ key ] = [ opt[ key ]];
    }

    self._opt[ key ] = opt[ key ];
  });

  return this;
};

form.filter = form.validate = form.field;

module.exports = form;

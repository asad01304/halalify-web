/*!
 * express-form2
 * Copyright(c) 2012 Ben Lin <ben@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * Utility functions.
 */

module.exports = {

/**
 * Convert square-bracket to dot notation.
 * @public
 * @this {utils}
 * @param {String} str The target string of the property name.
 * @returns {String} Returns the converted property name.
 * @example
 *
 *     var name = utils.convert( 'nested[name]' ); // => nested.name
 */
  convert : function ( str ){
    return str.replace( /\[((.)*?)\]/g, '.$1' );
  },

/**
 * Gets nested properties without throwing errors.
 * @public
 * @this {utils}
 * @param {String} prop The property name of the object to get.
 * @param {Object} obj The target object.
 * @returns {String} Returns the object property value.
 * @example
 *
 *     var val = utils.get( 'nested.name', obj );
 */
  get : function ( prop, obj ){
    var levels = this.convert( prop ).split( '.' );

    while( obj != null && levels[ 0 ]){
      obj = obj[ levels.shift()];
    }

    return obj;
  },

  hasValue : function ( val ){
    return !( undefined === val || null === val || '' === val );
  },

/**
 * Sets nested properties.
 * @public
 * @this {utils}
 * @param {String} prop The property name of the object to set.
 * @param {Object} obj The target object.
 * @param {Any} val The value of the property.
 * @returns {String} Returns the obj with new prop val.
 * @example
 *
 *     var new_obj = utils.set( 'nested.name', obj, 10 );
 */
  set : function ( prop, obj, val ){
    var levels = this.convert( prop ).split( '.' );

    while( levels[ 0 ]){
      var p = levels.shift();

      if( typeof obj[ p ] !== 'object' ) obj[ p ] = {};
      if( !levels.length )               obj[ p ] = val;
      obj = obj[ p ];
    }

    return obj;
  },

/**
 * Use this instead of the untrusted typeof.
 * @public
 * @this {utils}
 * @param {Object} obj The target object.
 * @returns {String} Returns the capitalized type name.
 * @example
 *
 *     var type = utils.typeof( 'i\'m a string' );
 */
  typeof : function ( obj ){
    if( obj === undefined ) return 'undefined';

    return {}.toString.call( obj ).
      replace( /(\[object )|\]/g, '' ).
      toLowerCase();
  }
};
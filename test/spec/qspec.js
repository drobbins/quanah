//- JavaScript source code

//- qspec.js ~~
//
//  Jasmine (http://pivotal.github.com/jasmine/) BDD Specs for Quanah, written
//  in an effort to:
//    * Provide a degree of documentation
//    * Learn the damn thing
//    * Provide a way to catch changes made in Quanah's API
//
//                                                      ~~ (c) DER, 6 Apr 2012

(function(){
  "use strict";
  var getAvars, toType;

  // Pragmas for JSHint
  /*globals describe:false it:false beforeEach:false expect:false Q:false*/

  // Utility Additions and functions
  getAvars = function getAvars(){
    // Returns an array with each of the arguments as the val of an avar
    var avars = [], arg, args, i;
    if ( toType(arguments[0]) === "array" ) args = arguments[0];
    else args = arguments;
    for ( i in args) {
      if ( args.hasOwnProperty(i) === false ) continue;
      arg = args[i];
      avars.push( Q.avar({ val:arg }) );
    }
    return avars;
  };

  toType = function toType(obj) {
        return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
  };

  beforeEach(function(){

    var customMatchers, setMatcherMessage;

    setMatcherMessage = function(message, matcher_context){
          matcher_context.message = function(){return message;};
    };

    customMatchers = {};

    customMatchers.toBeA = function toBeA(expected_type){
      return toType(this.actual) === expected_type;
    };

    customMatchers.toBeAFunction = function toBeAFunction(){
      return toType(this.actual) === 'function';
    };

    customMatchers.toBeAObject = function toBeAObject(){
      return toType(this.actual) === 'object';
    };

    customMatchers.toBeAUuid = function toBeAUuid(){
      return (this.actual.match(/[0-9abcdef]{32}/)) !== null;
    };

    customMatchers.toContainPrefixes = function toContainPrefixes(expected){
      var key;
      for (key in expected){
        if (expected.hasOwnProperty(key) && this.actual[key] !== expected[key]){
          setMatcherMessage(
              "Expected "+this.actual[key]+" to be "+expected[key]+", with prefix "+key+".",
              this
          );
          return false;
        }
      }
      return true;
    };

    this.addMatchers(customMatchers);

  });

  // The Overall Spec
  describe("Quanah", function(){

    it("should be awesome", function(){
      expect(true).toBeTruthy();
    });

    it("should place function Q on the Object prototype", function(){
      expect(Object.prototype.hasOwnProperty('Q')).toBeTruthy();
    });

    it("shoud provide the quanah API", function(){
      //Needs a better "should" string...
      var api, thing;
      api = {
        avar : 'function'
      };
      for ( thing in api ){
        if (api.hasOwnProperty(thing)){
          expect(typeof Q[thing]).toBe(api[thing]);
        }
      }
    });

  });

  describe("Quanah Avars", function(){

    it("should allow creation of Avars with no spec", function(){
      var x = Q.avar();
      expect(x).toBeAObject();
      expect(x.key).toBeAUuid();
      expect(x.val).toBeNull();
    });

    it("should allow creation of Avars with only a key", function(){
      var x = Q.avar({ key : "a" });
      expect(x).toBeAObject();
      expect(x.key).toEqual("a");
      expect(x.val).toBeNull();
    });

    it("should allow creation of Avars with only a val", function(){
      var x = Q.avar({ val : "a" });
      expect(x).toBeAObject();
      expect(x.key).toBeAUuid();
      expect(x.val).toEqual("a");
    });

    it("should allow creation of Avars with a key and val", function(){
      var x = Q.avar({ key : "a", val : 12345 });
      expect(x).toBeAObject();
      expect(x.key).toEqual("a");
      expect(x.val).toEqual(12345);
    });

  });


}());

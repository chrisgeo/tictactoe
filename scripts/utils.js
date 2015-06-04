var _ = _ || undefined;
if(!_){
  // hacks for node tests
  _ = require('./lodash.min.js');
}

_.mixin({
  indexOfObj: function(arr, obj){
    var inIndex = -1;
    arr.some(function(val, idx, arr){
      if(_.isEqual(val, obj)){
        inIndex = idx;
        return inIndex;
      }
    });

    return inIndex;
  }
});

if(!Array.prototype.deleteObject){
  Array.prototype.deleteObject = function(object){
    // depend on lodash
    return this.filter(function filterObjects(val){
      // filter out objects that
      // are not equal to the ``` object ```
      return !_.isEqual(val, object);
    });
  };
}

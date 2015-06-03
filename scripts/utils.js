if(!Array.deleteObject){
  Array.prototype.deleteObject = function(object){
    // depend on lodash
    return this.filter(function filterObjects(val){
      // filter out objects that
      // are not equal to the ``` object ```
      return !_.isEqual(val, object);
    });
  };
}

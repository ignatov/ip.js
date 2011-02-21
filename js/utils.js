/**
 * User: ignatov
 * Date: 21.02.2011
 */

String.prototype.replaceAll = function(searchValue, replaceValue) {
  var temp = this;
  var index = temp.indexOf(searchValue);
  while (index != -1) {
    temp = temp.replace(searchValue, replaceValue);
    index = temp.indexOf(searchValue);
  }
  return temp;
};
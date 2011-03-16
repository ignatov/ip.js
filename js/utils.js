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

Array.prototype.median = function () {
  var ary = this.slice();
  if (ary.length == 0)
    return [];
  ary.sort(function (a, b) {
    return a - b
  });
  var mid = Math.floor(ary.length / 2);
  if ((ary.length % 2) == 1)
    return ary[mid];
  else
    return (ary[mid - 1] + ary[mid]) / 2;
};
/**
 * User: ignatov
 * Date: 21.02.2011
 */

function Filter(name, kernel, divider) {
  this.name = name;
  this.kernel = kernel;
  this.divider = divider;
  this.id = this.name.replaceAll(" ", "_").toLowerCase();
}

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function saveFilterToLocalStorage(filter) {
  if (localStorage.getItem(filter.id) == null) {
    localStorage.setItem(filter.id, JSON.stringify(filter));
    return true;
  }
  return false;
//
//  var retrievedObject = localStorage.getItem('testObject');
//
//  console.log('retrievedObject: ', JSON.parse(retrievedObject));
}

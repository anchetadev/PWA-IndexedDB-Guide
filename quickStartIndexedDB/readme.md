# Quick start to IndexedDB (all CRUD operations)

Screenshot of app located at bottom

I always start with something that makes sense, in this case we should check if the user has indexedDB available, if not we let them know that this will not work (offline use)

```
if (!window.indexedDB) {
  console.log("Your browser doesn't support a stable version of IndexedDB. Offline features will not be available.");
}
```
Now let's get into the more complex stuff, starting with making a connection to indexedDB. For now we can think of indexedDB as something like localstorage in context of PWA. We are using this so that we can enable offline features. Even if the user has no internet they will still have access to the browser's indexedDB (like localstorage). Unlike localstorage, indexedDB can store all types of different data types such as object and arrays whereas localstorage only accepted strings.

```
const request = window.indexedDB.open("toDoList", 1);
var db; //this is a variable we will use throughout the file so I've decalred this globally
```
# Quick start to IndexedDB (all CRUD operations) 

Screenshot of app located at bottom

The whole poing of using indexedDB is so that we have a tool in the browser that can keep track of data so that when we implement some feature for offline use, we won't have MongoDB to solely rely on (MongoDB or any other DB which is using a virtual instance in production will _not_ work offline so this is our backup)

I always start with something that makes sense, in this case we should check if the user has indexedDB available, if not we let them know that offline use will not work

```js
if (!window.indexedDB) {
  alert("Your browser doesn't support a stable version of IndexedDB. Offline features will not be available.");
}
```
Now let's get into the more complex stuff, starting with making a connection to indexedDB. For now we can think of indexedDB as something like localstorage in context of PWA. We are using this so that we can enable offline features. Even if the user has no internet they will still have access to the browser's indexedDB (like localstorage). Unlike localstorage, indexedDB can store all types of different data types such as object and arrays whereas localstorage only accepted strings.

```js
const request = window.indexedDB.open("toDoList", 1);
var db; //this is a variable we will use throughout the file so I've decalred this globally
```

Just like in jQuery, we want to add listeners to handle different types of events. Let's add in an onsuccess event handler so we can handle what happens when line 7 executes properly. 

```js
request.onsuccess = function (event) {
  console.log("check out some data about our opened db: ", request.result);
  db = event.target.result; // result of opening the indexedDB instance "toDoList"
  getTasks() //this function retrieves data from indexedDB so that if there is anything in there we can have it for our list
};
```

Of course, if something went wrong we should handle it

```js
request.onerror = function (event) {
  console.log("Uh oh something went wrong :( ", request.error);
};
```

Let's move on to a more complex event listener: onupgradeneeded. If you've worked in Ruby on Rails or Python and Django you might be familiar with a term called database migrations. If not that's okay! Basically we can compare this next event listener to a database migration since it basically is our listener which is going to execute whenever we need to make a change to our database. We must manually change the version number everytime we change code in here or indexedDB will freak out! Refer to line 7 (the second argument after the database name is the version number of our database instance) Sometimes I've found it helpful to just delete and clear the db if I get version number errors or if I see strange behavior in the db (In this case the version number gets set back to 1)

```js
request.onupgradeneeded = function (event) {
  // create object store from db or event.target.result
  db = event.target.result;
  let store = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
  // createIndex can take up to three parameters: (name, keyPath, options)
  store.createIndex("name", "name", {unique: false});
};
```
Before we jump into CRUD operations it's important to know that in order to do anything related to the toDoList DB we must open up a transaction object from the DB. Here are a couple generic examples: 
```   js
   var transaction = db.transaction(storeName, mode);
   var transaction = db.transaction(storeNamesArray, mode);
// In context with our set up that would look like this:
   var transaction = db.transaction("tasks", mode);
// If there were multiple sets of data we wanted to manipulate
   var transaction = db.transaction(["tasks", "someOtherThing"], mode); 
```
As you can see, storename = the object store we want to access and the mode = what exactly we intend to do. 
Mode is optional and can be one of three things: 
- readonly -> if we do not specify it defaults to this
- readwrite -> this one I used everywhere it's just more convenient
- versionchange

## Getting data (here is the R part of 'CRUD'!)

Function for retrieving the data 
```js
function getTasks(){
  var transaction = db.transaction("tasks", "readwrite");
  var tasksStore = transaction.objectStore("tasks");
  var retrievedb = tasksStore.getAll()
  retrievedb.onsuccess = function(){
    console.log(retrievedb.result)
    $(".list-group").empty()

    retrievedb.result.map(function(item){
      console.log(item)
      $(".list-group").append("<li class='list-group-item'>" + item.id + ": " + item.name + "<button style='float: right' type='button' idNo="+ item.id + " class='btn btn-danger deleteBtn'>Delete Task</button>")
    })
    

  }
}
```
## Creating data (here is the C part of 'CRUD'!)

Click listener for the submit button to create a new task
```js
$("#newTask").click(function(){
  // console.log($("#taskName").val())
  var task = $("#taskName").val().trim()

  //give ourselves permission to read and write to the db
  var transaction = db.transaction("tasks", "readwrite");

  // open up a transaction for that particular store (What table/schema do we want to use?)
  var tasksStore = transaction.objectStore("tasks");
  let addReq =tasksStore.add({name: task});

  //when the task is added clear the form and retrieve from db (notice we can add an event listener to the above line!)
  addReq.onsuccess = function (e){
    $("#taskName").val("")
    getTasks()
  }
})
```
## Updating data (here is the U part of 'CRUD'!)

This part may seem a little complicated, but don't worry! Let's break it down in a few basic steps:

User clicks edit button -> we "get" that specific item -> we prepopuluate the edit form with the data -> user changes something and presses the save button -> update is finalized with the put method

Sidenote: using .on syntax since these buttons appear after page load

```js
$(document).on("click", ".editBtn", function () {
  // open a transaction so that we can retrieve or get the specific item we are going to update
  let transaction = db.transaction("tasks", "readwrite");
  let tasksStore = transaction.objectStore("tasks");
  // in this example I stored the item's ID in the button itself in an attribute called idNo
  let taskId = $(this).attr("idNo");
  // attempt to retrieve that item
  var requestForItem = tasksStore.get(Number(taskId));
  requestForItem.onsuccess = function () {
    //give modal the old data and the store so that it can prepopulate the input
    $(".editInput").val(requestForItem.result.name);

    $(".saveBtn").click(function () {
      // we must open a new transaction within this click listener
      // it may be redundant but it is because the transaction closes once we do something else
      // in this case we are in a different click listener so the transaction we opened from before is now closed
      // Thanks to Joshua Bell in StackOverflow for helping me with this part! Check the link below:
      // https://stackoverflow.com/questions/61296252/failed-to-execute-put-on-idbobjectstore-the-transaction-has-finished
      let transaction = db.transaction("tasks", "readwrite");
      let tasksStore = transaction.objectStore("tasks");
      //we edit the item's name and change it to whatever the user entered in the input
      requestForItem.result.name = $(".editInput").val().trim();
      console.log("this is what you changed it to", requestForItem.result);
      // Specified auto increment for our tasks so we just pass the whole updated object back to indexedDB, we don't have to manually change the ID
      var updateNameRequest = tasksStore.put(
        requestForItem.result
      );
      updateNameRequest.onerror = function () {
        console.log("something went wrong");
        console.log(updateNameRequest.error);
      };
      updateNameRequest.onsuccess = function () {
        console.log("you updated some entry!");
        // empty the input and close the modal
        $(".editInput").val("");
        $('#exampleModalCenter').modal("toggle");
        // update our page with all tasks again
        getTasks();
      };
    });
  };
});
```

## Deleting data (here is the D part of 'CRUD'!)

Delete button for created tasks (D of 'crud') Same process as adding something except here we are deleting!

```js
$(document).on("click",".deleteBtn",function(){
  var transaction = db.transaction("tasks", "readwrite");
  const store = transaction.objectStore('tasks')

  // I put the ID of the task in the delete button so here we retrieve it
  let taskId = $(this).attr("idNo")
  console.log(taskId)
  // here is the method for deletion
  var deleteReq = store.delete(Number(taskId))

  //after the above is successful we retrieve all the stuff in the db!
  deleteReq.onsuccess = function(){
    getTasks()
  }
})
```

It is also noteworthy that IndexedDB has some criticisms since it is using this outdated event listener technique to keep track of what's happening (onsuccess, onerror, onupgradeneeded, etc). IndexedDB was invented before promises and so that's why there's not any .then blocks anywhere even though now it makes a lot of sense to just use a .then. There is workaround though! 

[This is an NPM package which is basically just IndexedDB with promises!](https://www.npmjs.com/package/idb "IndexedDB but make it this decade")

Here is what the app looks like!
![Nice Photo](./assets/myCoolWebsite.png) 

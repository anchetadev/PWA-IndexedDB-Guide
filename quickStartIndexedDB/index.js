if (!window.indexedDB) {
  console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

//TODO: implement a todo list which works offline
//Saves to indexedDB
const request = window.indexedDB.open("toDoList", 2);
var db;

request.onsuccess = function (event) {
  console.log("check out some data about our opened db: ", request.result);
  db = event.target.result; // === request.result
  getTasks()
};

request.onerror = function (event) {
  console.log("Uh oh something went wrong :( ", request.error);
};

// onupgradeneeded event is triggered when we are trying to create a new database or trying to upgrade the database with a new version.
// whenever we make changes to db we must change the version number
// like db migrations
//  This is a great place to create the object store.

request.onupgradeneeded = function (event) {
  // create object store from db or event.target.result
  db = event.target.result;
  let store = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
  store.createIndex("name", "name", {unique: false});

  // To insert or do any operations on database, we need to get the transaction object from the database.
  // That can be done by using the transaction method in the database with one of the following signatures.
  //   var transaction = db.transaction(storeName, mode);
  //   var transaction = db.transaction(storeNamesArray, mode);
  // In the above syntax, the first parameter is the name of the object store or the array of names of the object stores.
  // If you specify the array of store names, then you get permission to perform database operations on multiple stores.
  // The second mode parameter is optional. mode can be either readonly, readwrite, or versionchange.
  // By default, readyonly is the default mode. While doing read only operations, you should use readonly mode for performance benefits.

  //   To perform an operation in any store, we need to get the object store from the transaction with the below syntax.
  //   var objectStore = transaction.objectStore(storeName);
};

function getTasks(){
  var transaction = db.transaction("tasks", "readwrite");
  var tasksStore = transaction.objectStore("tasks");
  var retrievedb = tasksStore.getAll()
  retrievedb.onsuccess = function(){
    console.log(retrievedb.result)
    $(".list-group").empty()

    retrievedb.result.map(function(item){
      console.log(item)
      $(".list-group").append("<li class='list-group-item'>" + item.id + ": " + item.value + "<button style='float: right' type='button' idNo="+ item.id + " class='btn btn-danger deleteBtn'>Delete Task</button>" +"<button style='float: right; margin-right:5px;' type='button' idNo="+ item.id + " class='btn btn-info editBtn' data-toggle='modal' data-target='#exampleModalCenter'>Edit Task</button>")
    })
    

  }
}

$("#newTask").click(function(){
  // console.log($("#taskName").val())
  var task = $("#taskName").val().trim()
  var transaction = db.transaction("tasks", "readwrite");
  var tasksStore = transaction.objectStore("tasks");
  let addReq =tasksStore.add({value: task});
  addReq.onsuccess = function (e){
    $("#taskName").val("")
    getTasks()
  }
})


$(document).on("click",".deleteBtn",function(){
  var transaction = db.transaction("tasks", "readwrite");
  const store = transaction.objectStore('tasks')
  let taskId = $(this).attr("idNo")
  console.log(taskId)
  var deleteReq = store.delete(Number(taskId))
  deleteReq.onsuccess = function(){
    getTasks()
  }
})
$(document).on("click",".editBtn",function(){
  var transaction = db.transaction("tasks", "readwrite");
  const store = transaction.objectStore('tasks')
  let taskId = $(this).attr("idNo")

  var requestForItem = store.get(Number(taskId));
  requestForItem.onsuccess = function() {
    console.log(requestForItem.result)
    //give modal the old data and the store so that it can prepolulate the input and complete the transaction
    editModal(requestForItem.result, store)
    // var data = requestForItem.result
    // data.name = $(".editInput").val().trim()

  }

  function editModal(oldData, store){
    console.log(oldData.id)
    $(".editInput").val(oldData.value)
    
    $(".saveBtn").click(function(){
      // var newData =$(".editInput").val().trim()
      oldData.value = $(".editInput").val().trim()
      console.log(oldData)
      var updateNameRequest = store.put(oldData, Number(oldData.id))
      updateNameRequest.onerror = function() {
        console.log("something went wrong")
        console.log(updateNameRequest.error)
      };
      updateNameRequest.onsuccess = function() {
        $(".editInput").val("")
        getTasks();
      };

    })
  }

  // console.log(taskId)
  // var deleteReq = store.put(Number(taskId))
  // deleteReq.onsuccess = function(){
  //   getTasks()
  // }
  console.log("edit button")
})

// used to be in request.onsuccess
  // var tasks = [
  //   { id: 1, name: "Mop living room" },
  //   { id: 2, name: "Shower Today" },
  //   { id: 3, name: "Write some code" },
  // ];
  // create transaction from database
  // var transaction = db.transaction("tasks", "readwrite");


  // transaction.onsuccess = function (event) {
  //   console.log("[Transaction] ALL DONE!");
  // };
  // get store from transaction
  // returns IDBObjectStore instance
  // var tasksStore = transaction.objectStore("tasks");
  // // put tasks data in tasksStore
  // tasks.forEach(function (task) {
  //   var db_op_req = tasksStore.add(task); // IDBRequest
  // });

//------------------------------>
// const statusIndex = tasksStore.index("name");

// // Return an item by keyPath
// const getRequest = statusIndex.get("Shower Today");
// getRequest.onsuccess = () => {
//   console.log("here is the result----------------------------------")
//   console.log(getRequest.result);
// };
// getRequest.onerror = (e) => {
//   console.log("here is the error----------------------------------")
//   console.log(getRequest.error);
// };

// Return an item by index
// const getRequestIdx = statusIndex.getAll("complete");
// getRequestIdx.onsuccess = () => {
//   console.log(getRequestIdx.result); 
// }; 
// ------------------------------>
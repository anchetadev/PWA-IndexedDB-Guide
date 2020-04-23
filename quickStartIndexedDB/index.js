if (!window.indexedDB) {
  alert(
    "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
  );
}
// open a request for the toDoList db instance
const request = window.indexedDB.open("toDoList", 2);
var db;

//if we are successful then we save the instance into a variable called db
request.onsuccess = function (event) {
  console.log("check out some data about our opened db: ", request.result);
  db = event.target.result; // result of opening the indexedDB instance "toDoList"
  getTasks();
};

request.onerror = function (event) {
  alert("Uh oh something went wrong :( ", request.error);
};

// onupgradeneeded event is triggered when we are trying to create a new database or trying to upgrade the database with a new version.
// whenever we make changes to db we must change the version number
// like db migrations
// This is a great place to create the object store.

request.onupgradeneeded = function (event) {
  // create object store from db
  db = event.target.result;
  let store = db.createObjectStore("tasks", {
    keyPath: "id",
    autoIncrement: true,
  });
  store.createIndex("name", "name", { unique: false });

  // To insert or do any operations on database, we need to get the transaction object from the database.
  // That can be done by using the transaction method in the database with one of the following signatures.
  //   var transaction = db.transaction(storeName, mode);
  //   var transaction = db.transaction(storeNamesArray, mode);
  // In the above syntax, the first parameter is the name of the object store or the array of names of the object stores.
  // If you specify the array of store names, then you get permission to perform database operations on multiple stores.
  // The second mode parameter is optional. mode can be either readonly, readwrite, or versionchange.
  // By default, readonly is the default mode. While doing read only operations, you should use readonly mode for performance benefits.

  //   To perform an operation in any store, we need to get the object store from the transaction with the below syntax.
  //   var objectStore = transaction.objectStore(storeName);
};

function getTasks() {
  var transaction = db.transaction("tasks", "readwrite");
  var tasksStore = transaction.objectStore("tasks");
  var retrievedb = tasksStore.getAll();
  retrievedb.onsuccess = function () {
    console.log(retrievedb.result);
    $(".list-group").empty();
    retrievedb.result.map(function (item) {
      console.log(item);
      $(".list-group").append(
        "<li class='list-group-item'>" +
          item.id +
          ": " +
          item.name +
          "<button style='float: right' type='button' idNo=" +
          item.id +
          " class='btn btn-danger deleteBtn'>Delete Task</button>" +
          "<button style='float: right; margin-right:5px;' type='button' idNo=" +
          item.id +
          " class='btn btn-info editBtn' data-toggle='modal' data-target='#exampleModalCenter'>Edit Task</button>"
      );
    });
  };
}

$("#newTask").click(function () {
  var task = $("#taskName").val().trim();
  var transaction = db.transaction("tasks", "readwrite");
  var tasksStore = transaction.objectStore("tasks");
  let addReq = tasksStore.add({ name: task });
  addReq.onsuccess = function (e) {
    $("#taskName").val("");
    getTasks();
  };
});

$(document).on("click", ".deleteBtn", function () {
  var transaction = db.transaction("tasks", "readwrite");
  const store = transaction.objectStore("tasks");
  let taskId = $(this).attr("idNo");
  console.log(taskId);
  var deleteReq = store.delete(Number(taskId));
  deleteReq.onsuccess = function () {
    getTasks();
  };
});


$(document).on("click", ".editBtn", function () {
  let transaction = db.transaction("tasks", "readwrite");
  let tasksStore = transaction.objectStore("tasks");
  console.log(tasksStore);
  let taskId = $(this).attr("idNo");

  var requestForItem = tasksStore.get(Number(taskId));
  requestForItem.onsuccess = function () {
    //give modal the old data and the store so that it can prepopulate the input and complete the transaction
    $(".editInput").val(requestForItem.result.name);

    $(".saveBtn").click(function () {
      // we must open a new transaction within this click listener
      let transaction = db.transaction("tasks", "readwrite");
      let tasksStore = transaction.objectStore("tasks");
      // var newData =$(".editInput").val().trim()
      requestForItem.result.name = $(".editInput").val().trim();
      console.log(requestForItem.result);
      // Specified auto increment for our tasks so we just pass the whole updated object back to indexedDB
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
        getTasks();
      };
    });
  };
});

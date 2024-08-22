// Check if the browser supports IndexedDB
if (!window.indexedDB) {
  alert(
    "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
  );
}

// Open or create an IndexedDB database named "toDoListWithSW" with the version number (in this case 2)
const request = window.indexedDB.open("toDoListWithSW", 2);
var db;

// Event handler for successful database connection
request.onsuccess = function (event) {
  console.log("Check out some data about our opened db: ", request.result);
  db = event.target.result; 
  getTasks(); // Fetch and display tasks stored in the database
};

// Event handler for database connection errors
request.onerror = function (event) {
  alert("Uh oh something went wrong :( ", request.error); // Notify user of the error
};

// Event handler for database upgrade (e.g., first time creation or version change)
request.onupgradeneeded = function (event) {
  db = event.target.result;
  // Create an object store (table) named "tasks" with an auto-incrementing id key
  let store = db.createObjectStore("tasks", {
    keyPath: "id",
    autoIncrement: true,
  });
  // Create an index on the "name" field to allow searching by task name
  store.createIndex("name", "name", { unique: false });
};

// Function to fetch and display tasks from the "tasks" object store
function getTasks() {
  var transaction = db.transaction("tasks", "readwrite"); // This lets us read and write to the db
  var tasksStore = transaction.objectStore("tasks"); // Access the tasks 
  var retrievedb = tasksStore.getAll(); // Retrieve all records from the store

  // Event handler for successful retrieval of tasks
  retrievedb.onsuccess = function () {
    console.log(retrievedb.result);
    $(".list-group").empty(); // Clear the existing task list in the UI

    // Loop through the retrieved tasks and append each to the task list in the UI
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

// Event handler for adding a new task when the "newTask" button is clicked
$("#newTask").click(function () {
  var task = $("#taskName").val().trim(); // Get the task name from the input field
  var transaction = db.transaction("tasks", "readwrite"); // This lets us read and write to the db
  var tasksStore = transaction.objectStore("tasks"); // Access the tasks
  let addReq = tasksStore.add({ name: task }); // Add the new task to the store

  // Event handler for successful addition of the task
  addReq.onsuccess = function (e) {
    $("#taskName").val(""); // Clear the input field
    getTasks(); // Refresh the task list
  };
});

// Event handler for deleting a task when the "deleteBtn" button is clicked
$(document).on("click", ".deleteBtn", function () {
  var transaction = db.transaction("tasks", "readwrite"); // This lets us read and write to the db
  const store = transaction.objectStore("tasks"); // Access the tasks
  let taskId = $(this).attr("idNo"); // Get the ID of the task to delete
  console.log(taskId);
  var deleteReq = store.delete(Number(taskId)); // Delete the task from the store

  // Event handler for successful deletion of the task
  deleteReq.onsuccess = function () {
    getTasks(); // Refresh the task list
  };
});

// Event handler for editing a task when the "editBtn" button is clicked
$(document).on("click", ".editBtn", function () {
  let transaction = db.transaction("tasks", "readwrite"); // This lets us read and write to the db
  let tasksStore = transaction.objectStore("tasks"); // Access the "tasks" object store
  let taskId = $(this).attr("idNo"); // Get the ID of the task to edit
  var requestForItem = tasksStore.get(Number(taskId)); // Retrieve the task from the store
  console.log("You are editing this item: ", requestForItem);

  // Event handler for successful retrieval of the task to edit
  requestForItem.onsuccess = function () {
    $(".editInput").val(requestForItem.result.name); // Populate the edit input field with the task name

    // Event handler for saving the edited task when the "saveBtn" button is clicked
    // POSSIBLE IMPROVEMENT: might be better to make the event listener tied to form submission so that users can also just hit "Enter" on their keyboard to save a task
    $(".saveBtn").click(function () {
      let transaction = db.transaction("tasks", "readwrite"); // This lets us read and write to the db
      let tasksStore = transaction.objectStore("tasks"); // Access the tasks
      requestForItem.result.name = $(".editInput").val().trim(); // Update the task name
      console.log("This is what you changed it to: ", requestForItem.result);
      var updateNameRequest = tasksStore.put(requestForItem.result); // Save the updated task

      // Event handler for handling errors during the update
      updateNameRequest.onerror = function () {
        console.log("Something went wrong");
        console.log(updateNameRequest.error);
      };

      // Event handler for successful update of the task
      updateNameRequest.onsuccess = function () {
        console.log("You updated some entry!");
        $(".editInput").val(""); // Clear the edit input field
        $("#exampleModalCenter").modal("toggle"); // Close the edit modal
        getTasks(); // Refresh the task list
      };
    });
  };
});
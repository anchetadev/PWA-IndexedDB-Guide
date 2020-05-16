if (!window.indexedDB) {
  alert(
    "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
  );
}

const request = window.indexedDB.open("toDoListWithSW", 2);
var db;


request.onsuccess = function (event) {
  console.log("check out some data about our opened db: ", request.result);
  db = event.target.result; 
  getTasks();
};

request.onerror = function (event) {
  alert("Uh oh something went wrong :( ", request.error);
};

request.onupgradeneeded = function (event) {
  db = event.target.result;
  let store = db.createObjectStore("tasks", {
    keyPath: "id",
    autoIncrement: true,
  });
  store.createIndex("name", "name", { unique: false });
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
  let taskId = $(this).attr("idNo");
  var requestForItem = tasksStore.get(Number(taskId));
  console.log("You are editing this item: ", requestForItem);

  requestForItem.onsuccess = function () {
    $(".editInput").val(requestForItem.result.name);
    $(".saveBtn").click(function () {
      let transaction = db.transaction("tasks", "readwrite");
      let tasksStore = transaction.objectStore("tasks");
      requestForItem.result.name = $(".editInput").val().trim();
      console.log("this is what you changed it to", requestForItem.result);
      var updateNameRequest = tasksStore.put(requestForItem.result);
      updateNameRequest.onerror = function () {
        console.log("something went wrong");
        console.log(updateNameRequest.error);
      };
      updateNameRequest.onsuccess = function () {
        console.log("you updated some entry!");
        $(".editInput").val("");
        $("#exampleModalCenter").modal("toggle");
        getTasks();
      };
    });
  };
});

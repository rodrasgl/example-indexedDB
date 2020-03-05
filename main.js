
var request = indexedDB.open("videos");
var buttonVideo = document.getElementById('videobutton');

buttonVideo.addEventListener('click', function () {
  recoverVideo(request);
})


request.onerror = function (event) {
  console.log("El navegador no soporta el uso de indexedDB", event);
};


request.onupgradeneeded = function (event) {
  var db = event.target.result;
  createDatabase(db);
}

request.onsuccess = function (event) {
  var db = event.target.result;
  console.log('Los datos se han guardado correctamente');
  fetch('video/bunny.mp4').then(a => a.blob()).then(blob => addData(db, blob))

};

request.onerror = function (event) {
  console.log('The data has been written failed');
}


function createDatabase(db) {
  var objectStore = db.createObjectStore('video');

}

function recoverVideo() {
  getDatabase().then(db => {
    db.onerror = function (event) {
      console.log('Unable to recover the video' + event);
    };

    db.onsuccess = function (event) {
      console.log("The video has been recovered" + request.result.name);
    };

    db.oncomplete = function (event) {
      note.innerHTML += '<li>Transaction completed.</li>';
    };

    var transaction = db.transaction(["video"]);
    var objectStore = transaction.objectStore("video");
    var request = objectStore.get("blob");

    request.onsuccess = function (request) {
      var videoUrl = URL.createObjectURL(request.srcElement.result);
      var video = document.createElement('video');
      video.controls = true;
      video.type = 'video/mp4';
      video.src = videoUrl;
      video.autoplay = true;
      document.getElementById('video').appendChild(video);
    }
  });
}

function addData(db, video) {
  var transaction = db.transaction(["video"], "readwrite");
  var objectStore = transaction.objectStore('video');
  var request = objectStore.put(video, 'blob');

  request.onsuccess = function () {
    console.log('El video se ha guardado correctamente');
  }
}

function getDatabase() {
  var request = window.indexedDB.open('videos');
  return new Promise((success, reject) => {
    request.onsuccess = function (event) {
      var db = event.target.result;
      success(db);
    };

  });
}

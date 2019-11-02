var zipFolder = require("zip-folder");
var path = require("path");
var fs = require("fs");
var request = require("request");

var rootFolder = path.resolve(".");
var zipPath = path.resolve(rootFolder, "../wisehire.zip");
var kuduApi = "https://wisehire.scm.azurewebsites.net/api/zip/site/wwwroot";
var userName = "$wisehire";
var password = "1FdT3smWncpn3v8mYWxFXy9iHxAn7qE9GjkGonax9qvn5YDdHqZKBEwE8Wou";

function uploadZip(callback) {
  console.log("reading the zip file for uploading to azure");
  fs.createReadStream(zipPath)
    .pipe(
      request.put(kuduApi, {
        auth: {
          username: userName,
          password: password,
          sendImmediately: true
        },
        headers: {
          "Content-Type": "applicaton/zip"
        }
      })
    )
    .on("response", function(resp) {
      console.log("resp.statusCode from azure " + resp.statusCode);
      if (resp.statusCode >= 200 && resp.statusCode < 300) {
        fs.unlink(zipPath, function(err) {
          if (err) {
            console.log(" failed to delete file");
            throw err;
          } else {
            // if no error, file has been deleted successfully
            console.log("File deleted!");
          }
        });
        callback(null);
      } else if (resp.statusCode >= 400) {
        callback(resp);
      }
    })
    .on("error", function(err) {
      console.log("Failed to publish to azure " + err);
      callback(err);
    });
}

function publish(callback) {
  console.log("zipping the folder");
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      console.log("zipped successfully");
      uploadZip(callback);
    } else {
      console.log("failed to zip");
      callback(err);
    }
  });
}

function publishResponseCB(err) {
  if (!err) {
    console.log("wisehire publish successful");
  } else {
    console.error("failed to publish wisehire", err);
  }
}

publish(publishResponseCB);

var Promise = require("Promise");

function fetchModel(url) {    
  return new Promise(function(resolve, reject) {      
      let xhr = new XMLHttpRequest;
      xhr.open("GET", url);
      xhr.send(); 
      xhr.onreadystatechange = function() {
        // If not done, return
        if(this.readyState !== 4) return;  
        
        // If error, call the reject function with an object containting the status and statusText
        if(this.status !== 200)
          reject({status: xhr.status, statusText: xhr.statusText});
        // If success, send back the JSON as a JS object with the value
        else
          resolve({data: JSON.parse(this.responseText)});
      }
  });
}

export default fetchModel;
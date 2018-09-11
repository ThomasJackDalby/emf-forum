const request = require('request');

api_url = "http://52.169.72.106:80"

if (false){
    request.get(api_url+"/threads", { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      console.log(body);
    });
}
if (false){
    request.get(api_url+"/threads/2", { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      console.log(body);
    });
}
if (true){
    request.post({
        url: api_url+"/threads",
        form: {
            title: "This is a test thread"
        }}, function(error, response, body){
        console.log(body);
    });
}
if (false){
    request.post({
        url: api_url+"/threads/2",
        form: {
            comment: "Ahhhh a new comment"
        }}, function(error, response, body){
        console.log(body);
    });
}
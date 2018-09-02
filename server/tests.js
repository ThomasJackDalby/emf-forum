const request = require('request');

if (true){
    request.get('http://localhost/threads', { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      console.log(body);
    });
}
if (true){
    request.get('http://localhost/threads/2', { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      console.log(body);
    });
}
if (false){
    request.post({
        url: 'http://localhost/threads',
        form: {
            title: "This is a test thread"
        }}, function(error, response, body){
        console.log(body);
    });
}
if (false){
    request.post({
        url: 'http://localhost/threads/2',
        form: {
            comment: "Ahhhh a new comment"
        }}, function(error, response, body){
        console.log(body);
    });
}
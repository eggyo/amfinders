
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

// iOS push testing
Parse.Cloud.define("sendPush", function(request, response) {

  // request has 2 parameters: params passed by the client and the authorized user
  var params = request.params;
  var channals = request.channals;
  // Our "Message" class has a "text" key with the body of the message itself
  var message = params.message;

  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.containedIn('channals', [channals]); // targeting iOS devices only

  Parse.Push.send({
    where: pushQuery, // Set our Installation query
    data: message
  }, { success: function() {
      console.log("#### PUSH OK");
  }, error: function(error) {
      console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});

  response.success('success');
});


Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

// iOS push testing
Parse.Cloud.define("sendMessage", function(request, response) {
  var params = request.params;
  var channals = params.channals;
  var message = params.message;
  console.log("channals: "+channals+" message :"+message);


  var MessageObj = Parse.Object.extend("Message");
  var messageObj = new MessageObj();

  var senderID = message.senderID;
  var recipientID = message.recipientID;
  var timestamp = message.timestamp;
  var text = message.message.text;

  console.log("data :"+senderID+" | "+recipientID+" | "+timestamp+" | "+text);
  
/*
  messageObj.set("score", 1337);
  messageObj.set("playerName", "Sean Plott");
  messageObj.set("cheatMode", false);

  messageObj.save(null, {
    success: function(messageObj) {
      // Execute any logic that should take place after the object is saved.
      alert('New object created with objectId: ' + messageObj.id);
    },
    error: function(messageObj, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });
*/
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


Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

// iOS push testing
Parse.Cloud.define("sendMessage", function(request, response) {
  var params = request.params;
  var channels = params.channels;
  var message = params.message;
  console.log("#### call sendMessage push channels: "+channels+" message :"+message +" ####");

  var MessageObj = Parse.Object.extend("Message");
  var messageObj = new MessageObj();

  var senderID = message.senderID;
  var recipientID = message.recipientID;
  var timestamp = message.timestamp;
  var text = message.message.text;
  var attachments = message.message.attachments;

  //console.log("data :"+senderID+" | "+recipientID+" | "+timestamp+" | "+text);
  messageObj.set("senderID", senderID);
  messageObj.set("recipientID", recipientID);
  messageObj.set("timestamp", timestamp);
  messageObj.set("text", text);
  messageObj.set("attachments", attachments);
  messageObj.save(null, {
    success: function(messageObj) {
      message.mid = messageObj.id;
      console.log(message);

      var pushQuery = new Parse.Query(Parse.Installation);
      pushQuery.containedIn('channels', [channels]); // targeting iOS devices only
      Parse.Push.send({
        where: pushQuery, // Set our Installation query
        data: message
      }, { success: function() {
          console.log("#### PUSH OK");
      }, error: function(error) {
          console.log("#### PUSH ERROR" + error.message);
      }, useMasterKey: true});
      // set last mid to recipient
      var userQuery = new Parse.Query("UserStetus");
      userQuery.equalTo("user", recipientID);  // find recipientID
      userQuery.find({
        success: function(user) {
          console.log("#### User find OK : "+user[0]);
          user[0].set("lastMID", messageObj.id);
          user[0].increment("msgCount");
          user[0].save(null, {
            success: function(obj) {
              console.log("#### User save OK");
            },
            error: function(obj, error) {
              console.log("#### User save lastMID ERROR" + error.message);
              // error is a Parse.Error with an error code and message.
            }
          });
        }
      });

      response.success('success');

    },
    error: function(messageObj, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      response.error(error.message);
    }
  });


});

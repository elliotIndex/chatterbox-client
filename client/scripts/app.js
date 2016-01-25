$(document).ready(function() {
  $('.update').on('click', function() {
    var $str = '';
    $.get('https://api.parse.com/1/classes/chatterbox', function(data) {
      $.each(data.results, function(index, message) {
        $str += '<div>' + message.text + '</div>';
      });
      $('messages').html($str);
    });
  });

  var newObj = {
    username: 'gerritLovesGettingHacked',
    text: 'lets hack gerrit',
    roomname: '4chan'
  };

  $('.submit').on('click', function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(newObj),
      contentType: 'application/json',
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  });


  $('.update').click();
});

var message = {
  username: 'gerritLovesGettingHacked',
  text: 'lets hack gerrit',
  roomname: '4chan'
};

// $.ajax({
//   // This is the url you should use to communicate with the parse API server.
//   url: 'https://api.parse.com/1/classes/chatterbox',
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//     console.log(data);
//   },
//   error: function (data) {
//     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message');
//   }
// });


// Please remove below.

/*
createdAt: "2016-01-25T19:56:01.627Z"
objectId: "O9jxNOG3LT"
opponents: Object
roomname: "4chan"
text: "trololo"
updatedAt: "2016-01-25T19:56:01.627Z"
username: "shawndrost"
*/
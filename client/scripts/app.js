var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

var escapeHtml = function(string) {
  return String(string).replace(/[&<>"'\/]/g, function(s) {
    return entityMap[s];
  });
};

var updateRoomNames = function(roomNames) {
  var $options = '';
  $.each(roomNames, function(key, room) {
    $options += '<option>' + room + '</option>';
  });

  $('.rooms').html($options);
};

$(document).ready(function() {


  var $update = function() {
    var $str = '';
    var roomNames = {};

    var parseMessage = function(index, message) {
      roomNames[message.roomname] = escapeHtml(message.roomname);
      $str += '<div>' + escapeHtml(message.text) + '</div>';
    };

    $.get('https://api.parse.com/1/classes/chatterbox', function(data) {

      $.each(data.results, parseMessage);

      $('messages').html($str);

      updateRoomNames(roomNames);
    });
  };

  $('.update').on('click', $update);

  var newObj = {
    username: 'gerritLovesGettingHacked',
    text: 'lets hack gerrit',
    roomname: 'SharkTank'
  };

  $('.submit').on('click', function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(newObj),
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded;charset=ISO-8859-15',
      success: function(data) {
        $update();
      },
      error: function(data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  });

  $('select').on('change', function() {
    console.log($('option:selected').text());
  });

  $('.update').click();
});

var message = {
  username: 'gerritLovesGettingHacked',
  text: 'lets hack gerrit',
  roomname: '4chan'
};
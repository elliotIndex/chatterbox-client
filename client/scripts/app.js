var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function() {
    initialize();
  },
  send: function(message) {
    $send(message);
  },
  fetch: function() {
    $update();
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  addMessage: function(message) {
    $send(message);
  },
  addRoom: function(roomName) {
    $('#roomSelect').append('<option value="' + escapeHtml(roomName) + '">' + escapeHtml(roomName) + '</option>');
  },
  addFriend: function() {
    event.preventDefault();
    var $user = $(this).text();
    $update($user);
  },
  handleSubmit: function() {
    var $log = $('#message').val();
    console.log($log);
  }
};

// If we want to make a robust escape
// Escaping &, <, >, ", ', `, , !, @, $, %, (, ), =, +, {, }, [, and ] is almost enough

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
  $('#roomSelect').html($options);
};

var initialize = function() {

  $update();
  $('.update').on('click', $update);
  $('select').on('change', function() {});
  $('body').on('click', '.username', app.addFriend);
  $('body').on('click', '.submit', app.handleSubmit);
};

var $update = function(username) {
  var $str = '';
  var roomNames = {};

  var parseMessage = function(index, message) {
    if (!roomNames[message.roomname]) {
      roomNames[message.roomname] = escapeHtml(message.roomname);
    }
    $str += formatMessage(message);
  };
  $.get(app.server, function(data) {
    var $str = '';

    $.each(data.results, function(index, message) {
      if (message.username === username || username === undefined) {

        if (!roomNames[message.roomname]) {
          roomNames[message.roomname] = escapeHtml(message.roomname);
        }
        $str += '<div>';
        $str += '<a href="#" class="username">' + escapeHtml(message.username) + '</a>';
        $str += '<div class="message">' + escapeHtml(message.text) + '</div>';
        $str += '</div>';
      }
      // $str += formatMessage(message);
    });
    $('#chats').html($str);
    updateRoomNames(roomNames);
  });
};

var formatMessage = function(messageObj) {
  var $str = '';
  $str += '<div>';
  $str += '<div class="username">' + escapeHtml(message.username) + '</div>';
  $str += '<div class="message">' + escapeHtml(message.text) + '</div>';
  $str += '</div>';
  return $str;
};

var $send = function(messageObj) {
  $('#chats').append('<div>' + escapeHtml(messageObj.text) + '</div>');
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(messageObj),
    dataType: 'json',
    contentType: 'application/json',
    success: function(data) {
      console.log("line 100");
      $update();
    },
    error: function(data) {
      console.log('failure', data);
      console.error('chatterbox: Failed to send message');
    }
  });

};
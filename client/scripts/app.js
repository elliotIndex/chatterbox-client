var app = {
  username: window.location.search.split("=")[1],
  currentUser: undefined,
  currentRoom: undefined,
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
    app.send({
      username: app.username,
      text: 'Welcome to ' + roomName + '!',
      roomname: roomName
    });
  },
  addFriend: function() {
    event.preventDefault();
    app.currentUser = $(this).text();
    $update();
  },
  handleSubmit: function() {
    var message = {
      username: app.username,
      text: $('#message').val(),
      roomname: $('#roomSelect').val()
    };
    $send(message);
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


var initialize = function() {

  $update();
  $('.update').on('click', $update);
  $('.submit').on('click', app.handleSubmit);
  $('.addRoom').on('click', function(){
    var $room = $('#message').val();
    $('#send').submit(function(e){
      e.preventDefault();
    });
    app.addRoom($room);
  });
  $('select').on('change', function() {});
  $('body').on('click', '.username', app.addFriend);
};

var $update = function(username, currentRoom) {
  var $str = '';
  var roomNames = {};

  var updateRoomNames = function(roomNames, currentRoom) {
    var $options = '';
    $.each(roomNames, function(key, room) {
      if(currentRoom === room) {
        $options += '<option selected>' + room + '</option>';
      } else {
        $options += '<option>' + room + '</option>';        
      }
    });
    $('#roomSelect').html($options);
  };

  $.ajax({
    url: app.server,
    type: 'GET',
    data: { 'order': '-createdAt',
            'limit': 200},
    dataType: 'json',
    contentType: 'application/json',
    success: function(data) {
      var $str = '';

      $.each(data.results, function(index, message) {
        if (message.username === app.currentUser || app.currentUser === undefined) {

          if (!roomNames[message.roomname]) {
            roomNames[message.roomname] = escapeHtml(message.roomname);
          }
          $str += '<div>';
          $str += '<div class="message">' + escapeHtml(message.text) + '</div>';
          $str += '<a href="#" class="username">' + escapeHtml(message.username) + '</a>';
          $str += '</div>';
        }
        return true;
      });
      $('#chats').html($str);
      updateRoomNames(roomNames, currentRoom);
      
    },
    error: function(data) {
      $('#chats').html('<div>' + JSON.stringify(data) + '</div>');
      console.error('chatterbox: Failed to retrieve data');
    }
  });
};


var $send = function(messageObj) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(messageObj),
    dataType: 'json',
    contentType: 'application/json',
    success: function(data) {
//       console.log("successful send~!");
//       $update(messageObj.username, messageObj.roomname);
    },
    error: function(data) {
      console.log('failure', data);
      console.error('chatterbox: Failed to send message');
    }
  });

};
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function() {
    $(document).ready(initialize);
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
    var $data = $send(message);
    console.log($data);
  },
  addRoom: function(roomName) {
    $('#roomSelect').append('<option value="' + escapeHtml(roomName) + '">' + escapeHtml(roomName) + '</option>')
  }
};

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

var initialize = function() {

  $update();

  $('.update').on('click', $update);


  $('select').on('change', function() {
    // console.log($('option:selected').text());
  });

  $('.update').click();
};

var $update = function() {
  var $str = '';
  var roomNames = {};

  var parseMessage = function(index, message) {
    roomNames[message.roomname] = escapeHtml(message.roomname);
    $str += '<div>' + escapeHtml(message.text) + '</div>';
  };

  $.get(app.server, function(data) {

    $.each(data.results, parseMessage);

    $('#chats').html($str);

    updateRoomNames(roomNames);
  });
};

var $send = function(messageObj) {
  $('#chats').append('<div>' + escapeHtml(messageObj.text) + '</div>');

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(messageObj),
    dataType: 'json',
    contentType: 'application/json',
    success: function(data) {

    },
    error: function(data) {
      console.log('failure', data);
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var message = {
  username: 'gerritLovesGettingHacked',
  text: 'lets hack gerrit',
  roomname: '4chan'
};
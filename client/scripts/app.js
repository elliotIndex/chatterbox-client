var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  username: window.location.search.split("=")[1],
  currentUser: undefined,
  currentRoom: undefined,
  roomNames: {},
  friends: {},


  init: function() {
    $('.update').on('click', app.fetch);
    $('.submit').on('click', app.handleSubmit);
    $('.goHome').on('click', app.goHome);
    $('.addRoom').on('click', function() {
      if ($('#message').val().length > 0) {
        app.addRoom($('#message').val());
      }
    });
    app.$roomSpinner = $('#roomSelect');
    app.$inputBar = $('#message');
    app.$roomSpinner.on('change', function() {
      app.setRoom(escapeHtml($('#roomSelect').val()));
    });
    $('body').on('click', '.username', app.addFriend);
    $('form').submit(function(event) {
      app.handleSubmit();
      event.preventDefault();
    });

    app.fetch();
    setInterval(app.fetch, 3000);
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      dataType: 'json',
      contentType: 'application/json',
      success: function(data) {
        console.log("chatterbox: Successfully sent message");
        app.fetch();
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message');
      }
    });
    app.$inputBar.val('');
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {
        'order': '-createdAt',
        'limit': 200
      },
      dataType: 'json',
      contentType: 'application/json',
      success: function(data) {
        app.displayMessages(data.results);
        console.log("chatterbox: Successfully retrieved data");
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  displayMessages: function(messages) {
    var newMessages = '';
    var thisRoom;
    var thisUser;
    var isFriend;
    app.roomNames = {};
    $.each(messages, function(index, message) {
      thisRoom = escapeHtml(message.roomname);
      thisUser = escapeHtml(message.username);
      app.roomNames[thisRoom] = thisRoom;
      if ((thisRoom === app.currentRoom || app.currentRoom === undefined) && (thisUser === app.currentUser || app.currentUser === undefined)) {
        isFriend = (thisUser in app.friends) ? ' bold' : '';
        newMessages += '<div><div class="message' + isFriend + '">' + escapeHtml(message.text) + '</div>';
        newMessages += '<a href="#" class="username">' + thisUser + '</a></div>';
      }
    });
    if (newMessages.length <= 0) {
      newMessages = '<span>Doesn\'t look like there\'s anyone in this room</span>';
    };
    $('#chats').html(newMessages);
    app.updateRooms();
  },

  updateRooms: function() {
    app.$roomSpinner.html('');
    app.$roomSpinner
      .append($("<option>-</option>"));

    $.each(app.roomNames, function(room, name) {
      app.$roomSpinner
        .append($("<option></option>")
          // .attr("data-room-name", room)
          .text(name));
    });

  },


  addRoom: function(roomName) {
    app.send({
      username: app.username,
      text: 'Welcome to ' + roomName + '!',
      roomname: roomName
    });
  },

  setRoom: function(roomName) {
    app.currentRoom = roomName === '-' ? undefined : roomName;
    app.fetch();
  },

  goHome: function() {
    app.currentRoom = undefined;
    app.currentUser = undefined;
    app.fetch();
  },

  addFriend: function() {
    event.preventDefault();
    app.currentUser = escapeHtml($(this).text());
    app.friends[app.currentUser] = app.currentUser;
    app.fetch();
  },

  handleSubmit: function() {
    if ($('#message').val().length > 0) {
      var message = {
        username: app.username,
        text: $('#message').val(),
        roomname: $('#roomSelect').val()
      };
      app.send(message);
    };

  },

  // These two functions are just here to pass spec.
  clearMessages: function() {
    $('#chats').html('');
  },

  addMessage: function(message) {
    app.send(message);
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

$('document').ready(app.init);
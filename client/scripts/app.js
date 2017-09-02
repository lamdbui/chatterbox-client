// YOUR CODE HERE:
class App {
  constructor() {
    this.QUERY_LIMIT = 200;

    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.friends = new Set();
    this.rooms = [];
    this.messages = [];
    this.currentRoom = 'lobby';
  }

  init() {
  }

  send(message) {
    var that = this;

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        that.refresh();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch() {
    var that = this;

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server + `?limit=${that.QUERY_LIMIT}&order=-createdAt`,
      type: 'GET',
      success: function (data) {
        console.log('chatterbox: Message get');
        that.messages = data.results;
        that.handleData();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', data);
      }
    });
  }

  clearMessages() {
    $('#chats').empty();
  }

  renderMessage(message) {
    var $message = $(`<div class="message"></div>`);
    var $username = $(`<a class="username">${message.username}</a>`);
    var $messageContent = $(`<h3>${message.text}</h3>`);
    $message.append($username, $messageContent);
    $('#chats').append($message);
  }

  renderRoom() {
    var $option = $(`<option>${name}</option>`);
    $('#roomSelect').append($option);
  }
  
  handleUsernameClick(name) {
    if (name !== this.username) {
      this.friends.add(name);
    }
  }

  handleSubmit(message) {
    var messageObj = {
      username: this.username,
      text: message,
      roomname: this.currentRoom
    };
    this.send(JSON.stringify(messageObj));
  }

  handleData() {
    this.handleRooms();
    this.handleMessages();
  }

  handleRooms() {
    var roomnames = [];
    _.each(this.messages, (message) => {
      roomnames.push(message.roomname);
    });
    this.rooms = _.uniq(roomnames);
    $('#roomSelect').empty();
    $('#roomSelect').append(`<option>${this.currentRoom}</option>`);
    _.each(this.rooms, (name) => {
      if (name !== this.currentRoom) {
        var $option = $(`<option>${name}</option>`);
        $('#roomSelect').append($option);
      }
    });
  }

  handleMessages() {
    var roomMessages = _.filter(this.messages, (message) => {
      return message.roomname === this.currentRoom;
    });
    $('#chats').empty();
    _.each(roomMessages, (message) => {
      this.renderMessage(message);
    });
  }

  autoRefresh() {
    setTimeout(this.autoRefresh.bind(this), 10000);
    
    this.refresh();
  }

  refresh() {
    this.fetch();
  }
}

var app = new App();

$(document).on('click', '.username', function(event) {
  app.handleUsernameClick();
});

$(document).on('click', '.submit', function(event) {
  app.handleSubmit($('#message').val());
  $('#message').val('');
});

$(document).on('change', '#roomSelect', function(event) {
  app.currentRoom = $(this).val();
  app.handleMessages();
});

$(document).on('click', '.newChannelButton', function(event) {
  $('#dialog').dialog();
});

$(document).on('click', '.submitNewChannel', function(event) {
  app.currentRoom = $('#newChannel').val();
  app.rooms.push(app.currentRoom);
  app.handleRooms();
  $('#dialog').dialog('close');
});

$(document).ready(function() {

  var urlString = window.location.href;
  var url = new URL(urlString);
  app.username = url.searchParams.get('username');
  app.autoRefresh();

  $('#dialog').hide();
});
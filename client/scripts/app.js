// YOUR CODE HERE:
class App {
  constructor() {
    this.QUERY_LIMIT = 200;

    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.friends = new Set();
    this.rooms = [];
    this.messages = [];
    this.currentRoom = 'lobby';
    this.currentFriend = undefined;
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
    var $username = $(`<h3 class="username"><a></a></h3>`);
    var usernameNode = document.createTextNode(message.username);
    if (this.friends.has(message.username)) {
      $message.addClass('friend');
    }
    $username.append(usernameNode);
    var textNode = document.createTextNode(message.text);
    var $messageContent = $(`<p class="messageContent"></p>`);
    $messageContent.append(textNode);
    $message.append($username, $messageContent);
    $('#chats').append($message);
  }

  renderRoom() {
    var $option = $(`<option>${name}</option>`);
    $('#roomSelect').append($option);
  }
  
  handleUsernameClick(name) {
    if (name !== this.username) { 
      if (this.friends.has(name)) {
        this.friends.delete(name);
      
        var friendListItems = $('.list-group-item');
        _.find(friendListItems, (element) => {
          return element.innerText === name; 
        }).remove();
        if (app.currentFriend === name) {
          app.currentFriend = undefined;
        }

      } else {
        this.friends.add(name);
        var $newFriend = $('<a href="#" class="list-group-item list-group-item-action"></a>');
        var friendNode = document.createTextNode(name);
        $newFriend.append(friendNode);

        $('.friendList').append($newFriend);
      }
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
    var filteredMessages = _.filter(this.messages, (message) => {
      return message.roomname === this.currentRoom;
    });

    if (this.currentFriend) {
      filteredMessages = _.filter(filteredMessages, (message) => {
        return message.username === this.currentFriend;
      });
    }
    $('#chats').empty();
    _.each(filteredMessages, (message) => {
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
  app.handleUsernameClick($(this).text());
  app.handleData();
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

$(document).on('click', '.list-group-item', function(event) {
  if (app.currentFriend) {
    if (app.currentFriend === $(this).text()) {
      app.currentFriend = undefined;
    } else {
      app.currentFriend = $(this).text();
    }
  } else {
    app.currentFriend = $(this).text();
  }
  app.handleData();
});

$(document).ready(function() {

  var urlString = window.location.href;
  var url = new URL(urlString);
  app.username = url.searchParams.get('username');
  app.autoRefresh();

  $('#dialog').hide();
});
// YOUR CODE HERE:
class App {
  constructor() {
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.friends = new Set();
  }

  init() {
  
  }

  send(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: message,//JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      success: function (data) {
        console.log('chatterbox: Message get');
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
    var $username = $(`<button class="username">${message.username}</button>`);
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
      return true;
    }
    return false;
  }

  handleSubmit() {
    console.log("HANDLE SUBMIT");
    return true;
  }
}

var app = new App();

$(document).on('click', '.username', function(event) {
  app.handleUsernameClick();
});

// $(document).on('click', '.username', function(event) {
//   app.handleUsernameClick();
// });


$(document).ready(function() {

  var app = new App();

  window.rooms = [];
  window.messages = [];

  window.currentRoom = 'lobby';

  var autoRefresh = () => {
    setTimeout(() => { autoRefresh(); }, 10000);

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      success: function (data) {
        console.log('chatterbox: Message get');
        window.messages = data.results;
        handleData();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', data);
      }
    });

  };

  autoRefresh();

  var handleData = () => {
    handleRooms();
    handleMessages();
  };

  var handleRooms = () => {
    var roomnames = [];
    _.each(messages, (message) => {
      roomnames.push(message.roomname);
    });
    window.roomnames = _.uniq(roomnames);
    $('.roomList').empty();
    $('.roomList').append(`<option>${window.currentRoom}</option>`);
    _.each(window.roomnames, (name) => {
      var $option = $(`<option>${name}</option>`);
      $('.roomList').append($option);
    });
  };

  var handleMessages = () => {
    var roomMessages = _.filter(window.messages, (message) => {
      return message.roomname === window.currentRoom;
    });
    $('#chats').empty();
    _.each(roomMessages, (message) => {
      app.renderMessage(message);
    });
  };

  $('#roomSelect').change(function (event) {
    window.currentRoom = $(this).val();
    handleMessages();
  });

  // $('.username').on('click', function(event) {
  //  app.handleUsernameClick();
  // });

  // $('body').on('click', '.username', function(event) {
  //  app.handleUsernameClick();
  // });

  // $(this).on('click', '.username', function(event) {
  //   app.handleUsernameClick();
  // });

  // $('.testSendButton').on('click', function(event) {
    
 //  });

 //  $('.testGetButton').on('click', function(event) {
    
 //  });
});
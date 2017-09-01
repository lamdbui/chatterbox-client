// YOUR CODE HERE:
$(document).ready(() => {

	window.rooms = [];
	window.messages = [];

	window.currentRoom = 'lobby';

	var autoRefresh = () => {
		setTimeout(() => { autoRefresh() }, 10000);

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

	}
	autoRefresh()

	var handleData = () => {
		handleRooms();
		handleMessages();
	}

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
	}

	var handleMessages = () => {
		var roomMessages = _.filter(window.messages, (message) => {
			return message.roomname === window.currentRoom;
		});
		$('#chats').empty();
		_.each(roomMessages, (message) => {
			var $message = $(`<h3>${message.username}: ${message.text}</h3>`);
			$('#chats').append($message);
		});
	}

	var message = {
	  username: 'test',
	  text: 'trololo',
	  roomname: '4chan'
	};

	$('.roomList').change(function (event) {
		window.currentRoom = $(this).val();
    handleMessages();
  });

	$('.testSendButton').on('click', function(event) {
		$.ajax({
		  // This is the url you should use to communicate with the parse API server.
		  url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
		  type: 'POST',
		  data: JSON.stringify(message),
		  contentType: 'application/json',
		  success: function (data) {
		    console.log('chatterbox: Message sent');
		  },
		  error: function (data) {
		    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
		    console.error('chatterbox: Failed to send message', data);
		  }
		});
  })

  $('.testGetButton').on('click', function(event) {
		$.ajax({
		  // This is the url you should use to communicate with the parse API server.
		  url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
		  type: 'GET',
		  success: function (data) {
		    console.log('chatterbox: Message get');
		    console.log(JSON.stringify(data));
		  },
		  error: function (data) {
		    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
		    console.error('chatterbox: Failed to get message', data);
		  }
		});
  })

})
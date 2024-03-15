$(document).ready(function() {
	
	var emptyListInfo = $('#emptyListInfo'),
		tasksList = $('#tasksList');

	restorListFromStorage();
	restoreEventHandlers();
	handleEmptyListInfo();
	setSortableItems();
	defineAppButtonsBehaviour();

	function defineAppButtonsBehaviour(){
		$('#addBtn').click( onAddBtnClick );

		$(document).keypress(function(e){
			if ( e.keyCode == 32 && e.target == document.body ) { // spacebar
				onAddBtnClick();
			}
		});

		var closeAppBtn = $('#closeAppBtn');

		closeAppBtn.click(function(e){
			if ( e.button !== 0 ) { return; }
			save();
			window.close();
		});

		closeAppBtn.mousedown(function(e){
			if ( e.button !== 0 ) { return; }
			$(this).addClass('closeAppBtnMouseDown');
		});

		closeAppBtn.mouseup(function(e){
			if ( e.button !== 0 ) { return; }
			$(this).removeClass('closeAppBtnMouseDown');
		});

		closeAppBtn.mouseleave(function(e){
			if ( e.button !== 0 ) { return; }
			$(this).removeClass('closeAppBtnMouseDown');
		});
	}

	function setSortableItems(){
		tasksList.sortable({
		  scroll: false
		});
	}

	function handleEmptyListInfo(){
		var listIsEmpty = tasksList.children().length == 0;

		if ( listIsEmpty ) {
			emptyListInfo.show();
		} else {
			emptyListInfo.hide();
		}
	}

	function onAddBtnClick(){
		createTask();
		handleEmptyListInfo();
	}

	function createTask(){
		var li = $('<li></li>'),
			buttonsBar = $('<div class="buttonsBar"></div>'),
			checkbox = $('<input type="checkbox" name="done">'),
			taskText = $('<div class="taskText" >New empty task</div>'),
			deleteButton = $('<div class="deleteBtn">'),
			priorityButton = $('<div class="priorityBtn"></div>');

		buttonsBar.append(checkbox).append(priorityButton).append(deleteButton);
		li.append(buttonsBar).append(taskText);
		tasksList.append(li);

		deleteButton.click( deleteTask );
		checkbox.click( toggleFinishedTask );
		priorityButton.click( togglePriority );

		taskText.dblclick(function(e){
			tasksList.sortable('disable');
			e.target.contentEditable = "true";
			e.target.focus();
			if ( e.target.innerText == 'New empty task') {
				e.target.innerText = '';
			}
		});

		// taskText.mouseleave( finishEditing );

		taskText.blur(function(e){
			finishEditing(e);
			save();
		});

		taskText.keydown(function(e){
			// enter or ctr+v
			if (e.keyCode == 13) {
		      // insert 2 br tags (if only one br tag is inserted the cursor won't go to the second line)
		      document.execCommand('insertHTML', false);
		      // prevent the default behaviour of return key pressed
		      return false;
		    } else if (e.ctrlKey && e.keyCode == 86){
		    	document.execCommand('paste', false);
		    	return false;
		    }
		});
	}

	function save(){
		localStorage.userList = tasksList.html();
	}

	function restorListFromStorage(){
		if ( localStorage.userList ) {
			tasksList.html( localStorage.userList );
		}
	}

	function restoreEventHandlers(){
		if ( tasksList.children().length == 0 ) { return; }

		tasksList.find('div.deleteBtn').click( deleteTask );
		tasksList.find('input[type="checkbox"]').click( toggleFinishedTask );

		tasksList.find('input[type="checkbox"].done').prop('checked', true);

		tasksList.find('div.priorityBtn').click( togglePriority );

		var taskText = tasksList.find('div.taskText');

		taskText.dblclick( function(e){
			tasksList.sortable('disable');
			e.target.contentEditable = "true";
			e.target.focus();
			if ( e.target.innerText == 'New empty task') {
				e.target.innerText = '';
			}
		});

		// taskText.mouseleave( finishEditing );

		taskText.blur(function(e){
			finishEditing(e);
			save();
		});
	}

	function deleteTask(e){
		$(e.currentTarget.parentElement.parentElement).remove();
		handleEmptyListInfo();
		save();
	}

	function toggleFinishedTask(e){
		if ( e.target.checked ) {
			$(e.target.parentElement.parentElement).find('div.taskText').addClass('done');
			e.target.className ='done';
		} else {
			$(e.target.parentElement.parentElement).find('div.taskText').removeClass('done');
			e.target.className ='';
		}

		save();
	}

	function togglePriority(e){
		var task = $(e.target.parentElement.parentElement);
		if ( task.hasClass('highPriority') ) {
			moveTaskDown( task );
			task.removeClass('highPriority');
		} else {
			moveTaskUp( task );
			task.addClass('highPriority');
		}

		save();
	}

	function editTaskText(e){
		tasksList.sortable('disable');
	}

	function moveTaskUp( task ){
		task.prependTo( tasksList );
	}

	function moveTaskDown( task ){
		task.appendTo( tasksList );
	}

	function finishEditing(e){
		e.target.contentEditable = "false";
		tasksList.sortable('enable');
	}


});


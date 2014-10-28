//loads the generic full calendar
function displayFullCalendar(eventsFromScope) {
        //console.log(eventsFromScope);
	    var dateToday = new Date(); //TODAY
		$('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			defaultDate: dateToday,
    //this is to add an event by selecting hours or days in a selected view through a pop up
		    selectable: false,
			selectHelper: true,
			select: function(start, end) {
                console.log("select");
				var title = prompt('Event Title:');
				var eventData;
				if (title) {
					eventData = {
						title: title,
						start: start,
						end: end
					};
$('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
				}
				$('#calendar').fullCalendar('unselect');
        	},    
            
    //allows the events to be draggable or not. 
            editable: false,
			events: eventsFromScope
		
	       });

        //This is to add an event by clicking, doesn't work yet....
        $('#calendar').fullCalendar({
        eventClick: function(calEvent, jsEvent, view) {

            alert('Event: ' + calEvent.title);
            alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
            alert('View: ' + view.name);
        }});
}
    










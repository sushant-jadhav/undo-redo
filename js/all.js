$(document).ready(function(){
	var amountScrolled = 300;

	$('#body').find('h1,h2,h3,h4,h5,h6,p').attr('contenteditable',true);
	$('#body').prepend('<a href="#" class="back-to-top">Back to Top</a>');
	

	$(window).scroll(function() {
		if ( $(window).scrollTop() > amountScrolled ) {
			$('a.back-to-top').fadeIn('slow');
		} else {
			$('a.back-to-top').fadeOut('slow');
		}
	});
	$('a.back-to-top').click(function() {
		$('html, body').animate({
			scrollTop: 0
		}, 700);
		return false;
	});
	var undostack = [],
        redostack = [],
        item = [], flag = 1;

    var Switch = function () {
        var _commands = [];
        this.storeAndExecute = function (command, context) {
            _commands.push(command, context);

            command.execute(context);
        }
    };


    var Undo = function () {
        this.undoit = function () {
            
            var current_item = undostack.pop();

            if (current_item != null || current_item !== undefined) {
                item['oldValue'] = current_item.oldValue;
                item['newValue'] = current_item.newValue;
                item['context'] = current_item.context;

                if (item['oldValue'] != item['newValue']) {
                    $(item['context']).html(item['oldValue']);
                }
                redostack.push(current_item);

                console.log("Undo", undostack, redostack);

            } 

        };
        this.redoit = function (context) {
            var current_item = redostack.pop();

            if (current_item != null || current_item !== undefined) {
                item['oldValue'] = current_item.oldValue;
                item['newValue'] = current_item.newValue;
                item['context'] = current_item.context;

                if (item['oldValue'] != item['newValue']) {
                    $(item['context']).html(item['newValue']);
                }
                undostack.push(current_item);

                console.log("Redo", undostack, redostack);

            } else {


            }
            undostack.pop();
        };
    };


    var UndoCommand = function (undo) {
        this.execute = function () {

            undo.undoit();

        };
    };


    var RedoCommand = function (undo) {
        this.execute = function (context) {

            undo.redoit();

        };
    };

    var undo = new Undo();
    var undoCmd = new UndoCommand(undo);
    var redoCmd = new RedoCommand(undo);
    var s = new Switch();


	$('[contentEditable="true"]').on('focus',function(){
			
		window.startValue = $(this).text();
		

	}).on('focusout',function(){

		var startValue = window.startValue;
		var context = $(this);
		var newValue = context.text();
		undostack.push({'oldValue':startValue,'newValue':newValue,'context':context});

	});

	$(".undo-btn").click(function () {

        s.storeAndExecute(undoCmd);

    });

    $(".redo-btn").click(function () {

        s.storeAndExecute(redoCmd);

    });
});
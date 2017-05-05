var eventHandlers = {
	init: function(){
		$("#submit-button").on("click", function(){
			$(".error-message").hide();
		});
	}
};

$(document).ready( function(){
	eventHandlers.init();
});
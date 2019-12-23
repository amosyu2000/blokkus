
// ===========
//  FUNCTIONS
// ===========




// ================
//	DOCUMENT READY
// ================

$(document).ready(function() {
	$(document).mousemove(function(event) {
		let ratio = 10;
		let dx = event.pageX/ratio;
		let dy = event.pageY/ratio;
		$('.bg-pieces').css({
			left: dx,
			top: dy
		})
	});
	$('.btn').click(function() {
		$('#title').animate({marginTop:0}, 'slow', function() {
			$(this).removeClass('mt-auto');
		});
	});
});
// Rotate element function
jQuery.fn.rotate = function(degrees) {
    $(this).css({'transform' : 'rotate('+ degrees +'deg)', 'transition-duration': '.3s'});
    return $(this);
};

$(document).ready(async () => {
	var tracks = [];
	// Parse JSON Track file and generate in DOM view
	await $.getJSON('track.json', data => {
		var container = $('#tracks');
		for (var key in data) {
			if (!data.hasOwnProperty(key)) continue;
			var obj = data[key];
			var track = $('<div></div>').addClass('track shadow-sm my-4').appendTo(container);
			$('<div></div>').addClass('header').append(`<p class="text-primary">${key}</p><i class="fas fa-lg fa-chevron-down"></i>`).appendTo(track);
			var content = $('<div></div>').addClass('content').hide().appendTo(track);
			for (let i = 0; i < obj.length; i++) {
				$('<div class="shadow-sm"></div>').addClass('speak').append(`<h6>${obj[i].Titre}</h6><p>${obj[i].Nom}</p>`).appendTo(content);
			}
			tracks.push(track);
		}
	});

	// Map click function on every Track category
	$.map(tracks, (el) => el.on('click', () => {
		let block = $(el).find('.content');
		let chevron = $(el).find('.header').find('.fas');
		if (block.is( ":hidden" )) {
			block.slideDown();
			chevron.rotate(180);
		} else {
			block.slideUp();
			chevron.rotate(0);
		}	
	}));
});
// Rotate element function
jQuery.fn.rotate = function(degrees) {
    $(this).css({'transform' : 'rotate('+ degrees +'deg)', 'transition-duration': '.3s'});
    return $(this);
};

const truncate = (str) => {
	return str.length > 50 ? [str.substring(0, 20), '…', str.substring(str.length - 19)].join('') : str;
}

$(document).ready(async () => {
	var tracks = [];
	var descs = [];
	// Parse JSON Track file and generate in DOM view
	await $.getJSON('track.json', data => {
		var container = $('#tracks');
		for (var key in data) {
			if (!data.hasOwnProperty(key)) continue;
			var obj = data[key];
			var track = $('<div></div>').addClass('track shadow-sm my-4').appendTo(container);
			var header = $('<div></div>').addClass('header').append(`<p class="text-primary">${key}</p><i class="fas fa-lg fa-chevron-down"></i>`).appendTo(track);
			var content = $('<div></div>').addClass('content').hide().appendTo(track);
			for (let i = 0; i < obj.length; i++) {
				var talk = $('<div class="shadow-sm"></div>').addClass('speak').append(`<h6>${obj[i].Titre}<span> - ${obj[i].Category}</span></h6><div class="name"><p>${obj[i].Nom}</p><i class="fas fa-plus"></i></div>`).appendTo(content);
				var abstract = obj[i].Abstract.replace(/\n/g, '<br/>');
				var abstract = abstract.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, (match) => {
					return `<a href="${match}" target="_blank" rel="noreferrer">${truncate(match)} <i class="fas fa-external-link-alt"></i></a>`;
				});
				var desc = $('<div></div>').addClass('desc').append(`<p>${abstract}</p>`).hide().appendTo(talk);
				descs.push({ talk,desc });
			}
			tracks.push({header, track});
		}
	});

	// Map click function on every Track category
	$.map(tracks, (el) => {
		el.header.on('click', (e) => {
			let block = $(el.track).find('.content');
			let chevron = $(el.track).find('.header').find('.fas');
			if (block.is( ":hidden" )) {
				block.slideDown();
				chevron.rotate(180);
			} else {
				block.slideUp();
				chevron.rotate(0);
			}	
		})
	});

	$.map(descs, (el) => el.talk.on('click', () => {
		let cross = $(el.talk).find('.name').find('.fas');
		if (el.desc.is( ":hidden" )) {
			el.desc.slideDown();
			cross.rotate(135);
		} else {
			el.desc.slideUp();
			cross.rotate(0);
		}
	}));
});
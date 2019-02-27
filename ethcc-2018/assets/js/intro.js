// Wrap every letter in a span
$('.ml1 .letters').each(function(){
	$(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
  });
  
  anime.timeline({loop: false})
	.add({
	  targets: '.ml1 .letter',
	  scale: [0.3,1],
	  opacity: [0,1],
	  translateZ: 0,
	  easing: "easeOutExpo",
	  duration: 800,
	  delay: function(el, i) {
		return 70 * (i+1)
	  }
	}).add({
	  targets: '.ml1 .line',
	  scaleX: [0,1],
	  opacity: [0.5,1],
	  easing: "easeOutExpo",
	  duration: 900,
	  offset: '-=875',
	  delay: function(el, i, l) {
		return 80 * (l - i);
	  }
	});
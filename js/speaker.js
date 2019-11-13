console.log(speakers)

var speakersRowFirst = $('#speakersRowFirst');
var speakersRowRest = $('#speakersRowRest');
var speakerTemplateFirst = $('#speakerTemplateFirst');
var speakerTemplateRest = $('#speakerTemplateRest');

for (i = 0; i < 8; i ++) {
  console.log(speakers[i])
  if(speakers[i].link != undefined && speakers[i].link != '') {
    speakerTemplateFirst.find('.name').wrap('<a href="'+speakers[i].link+'"></a>');
  }

  speakerTemplateFirst.find('.name').text(speakers[i].name);
  speakerTemplateFirst.find('img').attr('src', speakers[i].picture);
  speakerTemplateFirst.find('.company').text(speakers[i].company);
  speakersRowFirst.append(speakerTemplateFirst.html());

  if (speakerTemplateFirst.find('.name').parent().is( "a" )) {
  speakerTemplateFirst.find('.name').unwrap();
  }
}

var showMore = $('#showMore');

showMore
  .one("click", function () {
    for (var i = 8; i < speakers.length; i ++) {
  if(speakers[i].link != undefined && speakers[i].link != '') {
    speakerTemplateRest.find('.name').wrap('<a href="'+speakers[i].link+'"></a>');
  }

  speakerTemplateRest.find('.name').text(speakers[i].name);
  speakerTemplateRest.find('img').attr('src', speakers[i].picture);
  speakerTemplateRest.find('.company').text(speakers[i].company);
  speakersRowRest.append(speakerTemplateRest.html());

  if (speakerTemplateRest.find('.name').parent().is( "a" )) {
    speakerTemplateRest.find('.name').unwrap();
  } }
  })
  .click(function() {
    speakersRowRest.toggle();
  })
  .on('click', function(){
    $(this).html() == "Show less" ? $(this).html('Show more') : $(this).html('Show less');
  });

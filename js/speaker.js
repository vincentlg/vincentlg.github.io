console.log(speakers)

var speakersRowFirst = $('#speakersRowFirst');
var speakersRowRest = $('#speakersRowRest');
var speakerTemplateFirst = $('#speakerTemplateFirst');
var speakerTemplateRest = $('#speakerTemplateRest');

for (i = 0; i < 8; i ++) {
  console.log(speakers[i])
  if(speakers[i].link != undefined && speakers[i].link != '') {
    speakerTemplateFirst.find('.firstName').wrap('<a href="'+speakers[i].link+'"></a>');
  }

  speakerTemplateFirst.find('.firstName').text(speakers[i].firstName);
  speakerTemplateFirst.find('.lastName').text(speakers[i].lastName);
  speakerTemplateFirst.find('img').attr('src', speakers[i].picture);
  speakerTemplateFirst.find('.company').text(speakers[i].company);
  speakersRowFirst.append(speakerTemplateFirst.html());

  if (speakerTemplateFirst.find('.firstName').parent().is( "a" )) {
  speakerTemplateFirst.find('.firstName').unwrap();
  }
}

var showMore = $('#showMore');

showMore
  .one("click", function () {
    for (var i = 12; i < speakers.length; i ++) {
  if(speakers[i].link != undefined && speakers[i].link != '') {
    speakerTemplateRest.find('.firstName').wrap('<a href="'+speakers[i].link+'"></a>');
  }

  speakerTemplateRest.find('.firstName').text(speakers[i].firstName);
  speakerTemplateFirst.find('.lastName').text(speakers[i].lastName);
  speakerTemplateRest.find('img').attr('src', speakers[i].picture);
  speakerTemplateRest.find('.company').text(speakers[i].company);
  speakersRowRest.append(speakerTemplateRest.html());

  if (speakerTemplateRest.find('.firstName').parent().is( "a" )) {
    speakerTemplateRest.find('.firstName').unwrap();
  } }
  })
  .click(function() {
    speakersRowRest.toggle();
  })
  .on('click', function(){
    $(this).html() == "Show less" ? $(this).html('Show more') : $(this).html('Show less');
  });

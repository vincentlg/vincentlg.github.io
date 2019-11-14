console.log(speakers)

var speakersRow = $('#speakersRow');
var speakerTemplate = $('#speakerTemplate');


for (i = 0; i < speakers.length; i ++) {
  console.log(speakers[i])
  if(speakers[i].link != undefined && speakers[i].link != '') {
    speakerTemplate.find('.firstName').wrap('<a href="'+speakers[i].link+'"></a>');
  }

  speakerTemplate.find('.firstName').text(speakers[i].firstName);
  speakerTemplate.find('.lastName').text(speakers[i].lastName);
  speakerTemplate.find('img').attr('src', speakers[i].picture);
  speakerTemplate.find('.company').text(speakers[i].company);
  speakersRow.append(speakerTemplate.html());

  if (speakerTemplate.find('.firstName').parent().is( "a" )) {
  speakerTemplate.find('.firstName').unwrap();
  }
}

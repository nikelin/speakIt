var spch = {};
spch.create_email = false;
spch.final_transcript = '';
spch.recognizing = false;
spch.ignore_onend;
spch.start_timestamp;
spch.recognition;
spch.inputCnt = 0;
spch.recordingInput;

spch.infoHtml = '<div id="speechInfo"> \
  <p id="info_start">Click on the microphone icon and begin speaking.</p> \
  <p id="info_speak_now">Speak now.</p> \
  <p id="info_no_speech">No speech was detected. You may need to adjust your \
    <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892"> \
      microphone settings</a>.</p> \
  <p id="info_no_microphone" style="display:none"> \
    No microphone was found. Ensure that a microphone is installed and that \
    <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892"> \
    microphone settings</a> are configured correctly.</p> \
  <p id="info_allow">Click the "Allow" button above to enable your microphone.</p> \
  <p id="info_denied">Permission to use microphone was denied.</p> \
  <p id="info_blocked">Permission to use microphone is blocked. To change, \
    go to chrome://settings/contentExceptions#media-stream</p> \
  <p id="info_upgrade">Web Speech API is not supported by this browser. \
     Upgrade to <a href="//www.google.com/chrome">Chrome</a> \
     version 25 or later.</p> \
</div>';

spch.setUpSpeech = function() {
  var speechInputs = document.querySelectorAll('[data-speech]');
  _.each(speechInputs, function(input) {
    var setup = input.dataset.speech;
    var elementType = input.nodeName.toUpperCase();
    if(!setup && 
        (elementType === "INPUT" || elementType === "TEXTAREA")
    ) {
      spch.speechUI(input);
    }
  })
  setTimeout(function(){spch.setUpSpeech()},500)
}

spch.speechUI = function(input) {
  var mic = spch.micBuilder();
  $(input).parent().css('position','relative')
  $(input).parent().append(mic);

  if(spch.inputCnt === 0) {
    $(input).parent().prepend(spch.infoHtml);
    spch.showInfo('info_start');
  }
  spch.inputCnt++;


  var elementType = input.nodeName.toUpperCase();
  if(elementType === "TEXTAREA") {
    var left = $(input).position().left + $(input).width() - 40;
    $(mic).css({top:30, left:left});
  }
  else {

  }
  $(input).width()
  console.log(input.nodeName)
  input.dataset.speech = 'true';
  console.log('settingup!!!');
}


spch.micBuilder = function() {
  var micCont = document.createElement('div');


  $(micCont).html('Record').addClass('speech-mic icon-microphone').on('click', function() {spch.startButton(event);});
  return micCont;
}

spch.showInfo = function (s) {
  speechInfo = $('#speechInfo')[0]
  if (s  && !_.isUndefined(speechInfo) ) {
    for (var child = speechInfo.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    speechInfo.style.visibility = 'visible';
  } else if (!_.isUndefined(speechInfo)) {
    speechInfo.style.visibility = 'hidden';
  }
}

spch.startButton =  function (event) {
  if (spch.recognizing) {
    spch.recognition.stop();
    return;
  }
  spch.final_transcript = '';
  // ENGLISH
  spch.recognition.lang = 6;
  spch.recognition.start();
  spch.ignore_onend = false;
  spch.final_transcript = '';
  // speech_final_span.innerHTML = '';
  // speech_interim_span.innerHTML = '';
  // start_img.src = 'mic-slash.gif';
  spch.showInfo('info_allow');
  // spch.showButtons('none');
  spch.recordingInput = $(event.target.parentElement).find('[data-speech=true]')[0];
  spch.start_timestamp = event.timeStamp;
}

if ('webkitSpeechRecognition' in window) {
  setTimeout(function() {
    spch.setUpSpeech();
  },500);

  spch.recognition = new webkitSpeechRecognition();
  spch.recognition.continuous = true;
  spch.recognition.interimResults = true;

  spch.recognition.onstart = function() {
    spch.recognizing = true;
    spch.showInfo('info_speak_now');
    $('.speech-mic').html('Recording');
  };

  spch.recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      // start_img.src = 'mic.gif';
      spch.showInfo('info_no_speech');
      spch.ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      // start_img.src = 'mic.gif';
      spch.showInfo('info_no_microphone');
      spch.ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - spch.start_timestamp < 100) {
        spch.showInfo('info_blocked');
      } else {
        spch.showInfo('info_denied');
      }
      spch.ignore_onend = true;
    }
  };

  spch.recognition.onend = function() {
    
    spch.recognizing = false;
    if (spch.ignore_onend) {
      return;
    }
    $('.speech-mic').html('Record');

    $('.speech-mic').html('Record')
    if (!spch.final_transcript) {
      spch.showInfo('info_start');
      return;
    }
    spch.showInfo('');

  };

  spch.recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        spch.final_transcript += event.results[i][0].transcript;
      } else {
        spch.interim_transcript += event.results[i][0].transcript;
      }
    }
    spch.final_transcript = spch.linebreak(spch.capitalize(spch.final_transcript));
    $(spch.recordingInput).val(spch.final_transcript);
  };
};


spch.two_line = /\n\n/g;
spch.one_line = /\n/g;
spch.linebreak = function(s) {
  return s.replace(spch.two_line, '<p></p>').replace(spch.one_line, '<br>');
}

spch.first_char = /\S/;
spch.capitalize = function(s) {
  return s.replace(spch.first_char, function(m) { return m.toUpperCase(); });
}



/*

var langs =
[['Afrikaans',       ['af-ZA']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Français',        ['fr-FR']],
 ['Galego',          ['gl-ES']],
 ['Hrvatski',        ['hr_HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['Magyar',          ['hu-HU']],
 ['Nederlands',      ['nl-NL']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Türkçe',          ['tr-TR']],
 ['български',       ['bg-BG']],
 ['Pусский',         ['ru-RU']],
 ['Српски',          ['sr-RS']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['Lingua latīna',   ['la']]];

for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 6;
updateCountry();
select_dialect.selectedIndex = 6;
showInfo('info_start');


var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    showInfo('info_speak_now');
    start_img.src = 'mic-animate.gif';
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = 'mic.gif';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = 'mic.gif';
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
    if (create_email) {
      create_email = false;
      createEmail();
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
      showButtons('inline-block');
    }
  };
}

function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function createEmail() {
  var n = final_transcript.indexOf('\n');
  if (n < 0 || n >= 80) {
    n = 40 + final_transcript.substring(40).indexOf(' ');
  }
  var subject = encodeURI(final_transcript.substring(0, n));
  var body = encodeURI(final_transcript.substring(n + 1));
  window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
}

function copyButton() {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  }
  copy_button.style.display = 'none';
  copy_info.style.display = 'inline-block';
  showInfo('');
}

function emailButton() {
  if (recognizing) {
    create_email = true;
    recognizing = false;
    recognition.stop();
  } else {
    createEmail();
  }
  email_button.style.display = 'none';
  email_info.style.display = 'inline-block';
  showInfo('');
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_img.src = 'mic-slash.gif';
  showInfo('info_allow');
  showButtons('none');
  start_timestamp = event.timeStamp;
}

function showInfo(s) {
  // if (s) {
  //   for (var child = info.firstChild; child; child = child.nextSibling) {
  //     if (child.style) {
  //       child.style.display = child.id == s ? 'inline' : 'none';
  //     }
  //   }
  //   info.style.visibility = 'visible';
  // } else {
  //   info.style.visibility = 'hidden';
  // }
}

var current_style;
function showButtons(style) {
  if (style == current_style) {
    return;
  }
  current_style = style;
  copy_button.style.display = style;
  email_button.style.display = style;
  copy_info.style.display = 'none';
  email_info.style.display = 'none';
}
*/
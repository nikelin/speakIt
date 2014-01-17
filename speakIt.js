var spch = {};
spch.create_email = false;
spch.final_transcript = '';
spch.recognizing = false;
spch.ignore_onend;
spch.start_timestamp;
spch.recognition;
spch.inputCnt = 0;
spch.recordingInput;

spch.infoHtml = '<div class="speech-cont"><div id="speechInfo"> \
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
</div> \
<i class="speakIt-mic" onClick="spch.startButton(event);"></i> \
</div>';

spch.setUpSpeech = function() {
  var speechInputs = document.querySelectorAll('[data-speech]');
  for (var i = 0, len = speechInputs.length; i < len; i++) 
  {
    var input = speechInputs[i];
    var setup = input.dataset.speech;
    var elementType = input.nodeName.toUpperCase();
    if(!setup && 
        (elementType === "INPUT" || elementType === "TEXTAREA")
    ) {
      spch.speechUI(input);
    }
  }

  setTimeout(function(){spch.setUpSpeech()},500)
}

spch.speechUI = function(input) {
  if(spch.inputCnt === 0) {
    // var xmlString = spch.infoHtml,
    //   parser = new DOMParser(), 
    //   doc = parser.parseFromString(xmlString, "text/xml");
    var doc2 = $(spch.infoHtml)[0];
    input.parentElement.insertBefore(doc2, input)
    spch.showInfo('info_start');
  }
  spch.inputCnt++;
  var elementType = input.nodeName.toUpperCase();
  input.dataset.speech = 'true';
}

spch.showInfo = function (s) {
  speechInfo = document.getElementById('speechInfo');
  if (s && speechInfo !== undefined) {
    for (var child = speechInfo.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    speechInfo.style.visibility = 'visible';
  } else if (speechInfo !== undefined) {
    speechInfo.style.visibility = 'hidden';
  }
}

spch.startButton =  function (event) {
  if (spch.recognizing) {
    spch.recognition.stop();
    return;
  }
  spch.final_transcript = '';
  // 6 = ENGLISH
  spch.recognition.lang = 6;
  spch.recognition.start();
  spch.ignore_onend = false;
  spch.final_transcript = '';
  spch.showInfo('info_allow');
  spch.recordingInput = event.target.parentElement.nextSibling;
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
    document.getElementsByClassName("speakIt-mic")[0].className += ' recording'
    document.getE
  };

  spch.recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      spch.showInfo('info_no_speech');
      spch.ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
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
    document.getElementsByClassName("speakIt-mic")[0].className = "speakIt-mic";
    if (!spch.final_transcript) {
      spch.showInfo('info_start');
      return;
    }
    spch.showInfo('');

  };

  spch.recognition.onresult = function(event) {
    var interim_transcript = '', final;
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final = true;
        spch.final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }

    if (final) {
      spch.final_transcript = spch.linebreak(spch.capitalize(spch.final_transcript));
    }
    else {
      spch.recordingInput.value = spch.linebreak(interim_transcript);
    }
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
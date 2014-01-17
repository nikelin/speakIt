speakIt
=======
speech rocognition on any page

designed for single page apps, so js loops looking for input fields with data-speech attribute.  

is there a better way to do this? for angular, ng-route change but what about non angular apps?

###usage:
- put the js, less, and png files into your project.
- add **data-speech** attribute to any input or textarea field and microphone icon should automatically appear.

###limitations:
- uses webkitSpeechRecognition, so only works on chrome desktop and mobile browsers.

###next steps:
- remove infinite loop, if possible
- make sure works with multiple input fields on a single page

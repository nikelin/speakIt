speakIt
=======
speech rocognition on any page

designed for single page apps, so js loops looking for input fields with data-speech attribute.  a better way to do this?
for angular,ng-route change but what about non angular apps?

###usage:
- include the js and less files in your project.
- add **data-speech** attribute to any input or textarea field and microphone icon should automatically appear.

###dependencies:
- some sort of **$** dom selector
- font awesome 4

###limitations:
- uses webkitSpeechRecognition, so only works on chrome desktop and mobile browsers.

###next stets:
- remove dependencies
- remove infinite loop, if possible
- make sure works with multiple input fields on a single page

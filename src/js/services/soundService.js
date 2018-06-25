'use strict';

angular.module('copayApp.services').service('soundService', function($log, $timeout, platformInfo, configService) {

  var root = {};

  /**
   * Play a sound (when enabled in the configuration) using the Cordova Media-plugin (on Mobile) or html5-audio (on Desktop) relative to the www-root
   * Make sure there is a .ogg file as well for NW.js (desktop) implementation
   * @param soundFile
   */
  root.play = function(soundFile) {
    configService.whenAvailable(function(config) {
      if (config.soundsEnabled) {
        if (platformInfo.isCordova) {
          var p = window.location.pathname;
          var device_path = p.substring(0, p.lastIndexOf('/'));
          var audio = new Media(device_path + '/' + soundFile,
              function () {
                $log.debug("playAudio(bch_sent):Audio Success");
              },
              function (err) {
                $log.debug("playAudio():Audio Error: " + err);
              }
          );
          audio.play({playAudioWhenScreenIsLocked: false}); // XX SP: "Locked" is also the mute switch in iOS
        } else {
          if (platformInfo.isNW) {
            soundFile = soundFile.substring(0, soundFile.lastIndexOf('.')) + ".ogg";
            $log.debug("Playing .ogg file ("+soundFile+"), as NW.js has no mp3 support");
          }
          new Audio(soundFile).play();
        }
      }
    });
  };

  return root;
});
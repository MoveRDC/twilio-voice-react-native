const {
  createRunOncePlugin,
  withAndroidManifest,
  withAppBuildGradle,
  withInfoPlist,
  withPlugins,
  withProjectBuildGradle,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');
const pak = require('../package.json');

const withTwilioVoiceApplyPlugin = (config) =>
  withAppBuildGradle(config, (innerConfig) => {
    const copiedInnerConfig = { ...innerConfig };

    // Check if Google Services plugin is already applied
    if (
      !copiedInnerConfig.modResults.contents.includes(
        "apply plugin: 'com.google.gms.google-services'"
      )
    ) {
      // Apply Google Services plugin
      copiedInnerConfig.modResults.contents +=
        "\napply plugin: 'com.google.gms.google-services'\n";
    }

    return copiedInnerConfig;
  });

const withTwilioVoiceBuildscriptDependency = (config) =>
  withProjectBuildGradle(config, (innerConfig) => {
    const copiedInnerConfig = { ...innerConfig };

    // Check if Google Services plugin is already included
    if (
      !copiedInnerConfig.modResults.contents.includes(
        'com.google.gms:google-services'
      )
    ) {
      // Add Google Services plugin for FCM
      copiedInnerConfig.modResults.contents =
        copiedInnerConfig.modResults.contents.replace(
          /dependencies\s*{/,
          `dependencies {
        classpath 'com.google.gms:google-services:4.3.15'`
        );
    }

    return copiedInnerConfig;
  });


const withTwilioVoicePList = (config) =>
  withInfoPlist(config, (innerConfig) => {
    const copiedInnerConfig = { ...innerConfig };

    // Add background modes
    if (!copiedInnerConfig.modResults?.UIBackgroundModes) {
      copiedInnerConfig.modResults.UIBackgroundModes = [];
    }

    if (!copiedInnerConfig.modResults.UIBackgroundModes.includes('audio')) {
      copiedInnerConfig.modResults.UIBackgroundModes.push('audio');
    }

    if (!copiedInnerConfig.modResults.UIBackgroundModes.includes('voip')) {
      copiedInnerConfig.modResults.UIBackgroundModes.push('voip');
    }

    // Add necessary permission descriptions
    copiedInnerConfig.modResults.NSMicrophoneUsageDescription =
      copiedInnerConfig.modResults?.NSMicrophoneUsageDescription ||
      'Need microphone access for VoIP calls';
    return copiedInnerConfig;
  });

const withTwilioVoice = (config) => {
  return withPlugins(config, [
    withTwilioVoiceApplyPlugin,
    withTwilioVoiceBuildscriptDependency,
    withTwilioVoicePList,
  ]);
};

module.exports = createRunOncePlugin(withTwilioVoice, pak.name, pak.version);

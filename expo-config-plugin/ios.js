const { withInfoPlist } = require('@expo/config-plugins');

const withTwilioVoiceIOS = (outerConfig) => {
  let copiedOuterConfig = { ...outerConfig };

  // Add necessary iOS permissions
  copiedOuterConfig = withInfoPlist(copiedOuterConfig, (innerConfig) => {
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

  return copiedOuterConfig;
};

module.exports = withTwilioVoiceIOS;

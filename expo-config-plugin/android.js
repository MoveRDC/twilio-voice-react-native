const {
  withProjectBuildGradle,
  withAppBuildGradle,
  withAndroidManifest,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withTwilioVoiceAndroid = (outerConfig) => {
  let copiedOuterConfig = { ...outerConfig };

  // Modify project build.gradle
  copiedOuterConfig = withProjectBuildGradle(
    copiedOuterConfig,
    (innerConfig) => {
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
    }
  );

  // Modify app build.gradle
  copiedOuterConfig = withAppBuildGradle(copiedOuterConfig, (innerConfig) => {
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

  // Add config.xml for FCM settings
  copiedOuterConfig = withAndroidManifest(
    copiedOuterConfig,
    async (innerConfig) => {
      const copiedInnerConfig = { ...innerConfig };
      const mainAppPath = path.join(
        copiedInnerConfig.modRequest.projectRoot,
        'android',
        'app',
        'src',
        'main'
      );
      const valuesPath = path.join(mainAppPath, 'res', 'values');

      if (!fs.existsSync(valuesPath)) {
        fs.mkdirSync(valuesPath, { recursive: true });
      }

      const configPath = path.join(valuesPath, 'config.xml');
      const configContent = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <bool name="twiliovoicereactnative_firebasemessagingservice_enabled">true</bool>
</resources>`;

      fs.writeFileSync(configPath, configContent);

      return copiedInnerConfig;
    }
  );

  return copiedOuterConfig;
};

module.exports = withTwilioVoiceAndroid;

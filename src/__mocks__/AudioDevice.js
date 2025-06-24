export function createNativeAudioDeviceInfo() {
    return {
        uuid: 'mock-nativeaudiodeviceinfo-uuid',
        type: 'earpiece',
        name: 'mock-nativeaudiodeviceinfo-name',
    };
}
export function createNativeAudioDevicesInfo() {
    return {
        audioDevices: [
            {
                uuid: 'mock-nativeaudiodeviceinfo-uuid-one',
                type: 'earpiece',
                name: 'mock-nativeaudiodeviceinfo-name-one',
            },
            {
                uuid: 'mock-nativeaudiodeviceinfo-uuid-two',
                type: 'speaker',
                name: 'mock-nativeaudiodeviceinfo-name-two',
            },
            {
                uuid: 'mock-nativeaudiodeviceinfo-uuid-three',
                type: 'bluetooth',
                name: 'mock-nativeaudiodeviceinfo-name-three',
            },
        ],
        selectedDevice: {
            uuid: 'mock-nativeaudiodeviceinfo-uuid-two',
            type: 'speaker',
            name: 'mock-nativeaudiodeviceinfo-name-two',
        },
    };
}

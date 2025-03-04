//Use expo-av when executing in web because expo-video don't work in web, have a CORS problem.

import { useState, useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function VideoAv({ uri, style }) {
  const video = useRef(null);
  return (
    <Video
      ref={video}
      style={[styles.video, style]}
      source={{
        uri: uri,
      }}
      useNativeControls
      isLooping
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


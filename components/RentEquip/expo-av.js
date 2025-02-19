import { useState, useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function VideoAv({ uri, style }) {
  const video = useRef(null);
  return (
    <Video
      ref={video}
      style={styles.video}
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
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


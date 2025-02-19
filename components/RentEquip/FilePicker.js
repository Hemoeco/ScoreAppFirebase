/*
  Many native device features need permissions to be granted by the device user (like the camera and 
  maps in this example app),
*/

import { Alert, Image, StyleSheet, View, Text, Platform } from "react-native";
/*
  "launchCameraAsync" will launch the device camera and wait for us to take an image.
  "useCameraPermissions" to control the permissions by ourselfs, mostly for iOS this is needed.
  "PermissionStatus" get the list of possible permissions.
*/
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  PermissionStatus,
  useCameraPermissions
} from "expo-image-picker";
import { useState } from "react";
import { Colors } from "../../consts/colors";
import IconButton from "../UI/IconButton";
import { deleteImage, uploadImage } from "../../util/https";
import { createVideoPlayer, useVideoPlayer, VideoView } from "expo-video";
import VideoScreen from "./expo-video";
import VideoAv from "./expo-av";

function FilePicker({ onChangeImage, imageUri }) {
  const [pickedImage, setPickedImage] = useState(imageUri);
  const [isVideo, setIsVideo] = useState(imageUri?.includes('video'));
  //Permissions for access the camera
  const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
  //It's needed another for the gallery, but I will do this later.
  //const [] = useState();

  async function verifyPermissions(type) {
    switch (type) {
      case 'camera':
        //cameraPermissionInformation.status = PermissionStatus.GRANTED;
        if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
          /*
            This function will open a dialog and wait for the user's response.
          */
          const permissionResponse = await requestPermission();

          return permissionResponse.granted; //True if the user gave us permission, false otherwise.
        }

        if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
          Alert.alert(
            '¡Permisos insuficientes!',
            'La app necesita acceso a la cámara para su correcto funcionamiento'
          );

          return false;
        }
        break;
    }

    return true;
  }

  //To take an image with the camera
  async function takeImageHandler() {
    const hasPermission = await verifyPermissions('camera');

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      //allowsEditing: true,
      //aspect: [16, 9],
      quality: 0.5
    });

    //Need access to "assets"
    if (!image.canceled) {
      let uri = image.assets[0].uri;
      onChangeImage(uri,
        pickedImage.includes('firebasestorage') ? pickedImage : ''
      );
      setPickedImage(uri);
      console.log(image);
    }
  }

  //To select an image from gallery
  async function selectImageHandler() {
    const image = await launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      //allowsEditing: true,
      //aspect: [4, 9],
      quality: 0.6,
    });

    if (!image.canceled) {
      let uri = image.assets[0].uri;
      onChangeImage(uri,
        pickedImage.includes('firebasestorage') ? pickedImage : ''
      );
      setPickedImage(uri);
      setIsVideo(image.assets[0].type.includes('video'));
    }
  }

  //To delete the image
  function deleteImageHandler() {
    onChangeImage('',
      pickedImage.includes('firebasestorage') ? pickedImage : ''
    );
    setPickedImage('');
    setIsVideo(false);
  }

  //Temporary to do tests
  async function uploadImageHandler() {
    const url = await uploadImage(pickedImage);
    console.log(url);
  }

  //Temporary to do tests
  async function deleteImageFB() {
    try {
      const deleted = await deleteImage(pickedImage);
      console.log(deleted);
    } catch (err) {
      console.log(err);
    }
  }

  let image = <Text>Sin imagen seleccionada.</Text>;

  if (pickedImage) {
    if (isVideo) {
      if (Platform.OS == 'web') {
        image = <VideoAv uri={pickedImage} style={styles.image} />
      }
      else {
        image = <VideoScreen uri={pickedImage} style={styles.image} />
      }
    }
    else {
      image = <Image style={styles.image} source={{ uri: pickedImage }} />;
    }
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={styles.imagePreview}>
        {image}
      </View>
      <View style={styles.buttonContainer}>
        {Platform.OS != 'web' && <IconButton icon="camera" onPress={takeImageHandler} size={24} />}
        <IconButton icon="image" onPress={selectImageHandler} size={24} />
        {/*!!pickedImage && (
          <IconButton icon="cloud-upload" onPress={uploadImageHandler} size={24} />
        )}
        {!!pickedImage && (
          <IconButton icon="trash-bin" onPress={deleteImageFB} size={24} />
        )*/}
        {!!pickedImage && (
          <IconButton icon="remove-circle" onPress={deleteImageHandler} size={24} />
        )}
      </View>
    </View>
  );
}

export default FilePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: '83%',
    height: 275,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.accent400,
    backgroundColor: Colors.accent300,
    borderRadius: 4,
    overflow: 'hidden'
  },
  buttonContainer: {
    //flexDirection: 'row',
    //justifyContent: 'space-around',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
    //borderRadius: 4
  }
});
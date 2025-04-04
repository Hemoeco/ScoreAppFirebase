/*
  Many native device features need permissions to be granted by the device user (like the camera and 
  maps in this example app),
*/

import { Alert, StyleSheet, View } from "react-native";
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
import {memo, useContext, useState } from "react";
import IconButton from "../UI/IconButton";
import { AuthContext } from "../../store/auth-context";
import Slideshow from "../UI/Slideshow";
import LoadingOverlay from '../UI/LoadingOverlay';

function FilesPicker({
  onSelectedFiles,
  onDeletedFiles,
  files,
  isEditing,
  availableOffline
}) {
  console.log(files);
  const authCtx = useContext(AuthContext);
  //To know if the files are loading
  const [isLoading, setIsLoading] = useState(false);
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

  //To take an image with the camera.
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
      onSelectedFiles((curFiles) => [...curFiles, uri]);
    }
  }

  //To select an image from gallery.
  async function selectImageHandler() {
    setIsLoading(true);
    const files = await launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      //allowsEditing: true,
      //aspect: [4, 9],
      allowsMultipleSelection: true,
      quality: 0.6,
    });
    setIsLoading(false);

    if (!files.canceled) {
      const uris = Object.values(files.assets).map(file => file.uri);
      onSelectedFiles((curFiles) => [...uris, ...curFiles]);
    }
  }

  //To remove the uri of the file.
  function removeImageHandler(uri) {
    /*
      When the file is already in Firebase, we added to another array to know that we
      need to deleted from the DB too.
    */
    if (uri.includes('firebasestorage')) {
      onDeletedFiles((curFiles) => [...curFiles, uri]);
    }
    //Remove the uri from the current selected files always.
    onSelectedFiles((curFiles) => curFiles.filter(file => file !== uri));
  }

  if (isLoading) {
    return <LoadingOverlay message="Cargando archivos multimedia" />;
  }

  return (
    <View>
      <Slideshow
        files={files}
        removeImageHandler={removeImageHandler}
        isEditing={isEditing}
        availableOffline={availableOffline}
      />
      <View style={styles.buttonContainer}>
        {
          /*
            Show the button for the camera when is iOS or Android and:
              -The user have internet.
              -The user doesn't have internet but is creating a register.
              -The user doesn't have internet but is editing a register and it's available offline.
          */
          authCtx.device !== 'web' &&
          (authCtx.isConnected || (!authCtx.isConnected && (!isEditing || availableOffline))) &&
          (<IconButton icon="camera" onPress={takeImageHandler} size={24} />)
        }
        {
          /*
            Show the button to pick a file from the gallery when:
              -The user have internet.
              -The user doesn't have internet but is creating a register.
              -The user doesn't have internet but is editing a register and it's available offline.
          */
          (authCtx.isConnected || (!authCtx.isConnected && (!isEditing || availableOffline))) &&
          (<IconButton icon="image" onPress={selectImageHandler} size={24} />)
        }
      </View>
    </View>
  );
}

export default memo(FilesPicker);

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    //justifyContent: 'space-around',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
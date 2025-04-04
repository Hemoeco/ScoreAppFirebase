import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Dimensions, Platform, } from "react-native";
import VideoScreen from "../UI/expo-video";
import VideoAv from "../UI/expo-av";
import { useContext } from "react";
import { AuthContext } from "../../store/auth-context";
import { Colors } from "../../consts/colors";
import IconButton from "./IconButton";

const VIDEO_TYPES = /\.(mp4|mov|avi|mkv|webm)$/i;
const IMAGE_TYPES = /\.(jpg|jpeg|png|gif|webp|heic)$/i;

export default function Slideshow({
  files,
  removeImageHandler,
  isEditing,
  availableOffline
}) {
  const authCtx = useContext(AuthContext);
  console.log(files);

  if (files.length > 0) {
    return (
      <FlatList
        key={files.length}
        data={files}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        //showsHorizontalScrollIndicator={true}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <View style={styles.imagePreview}>
              {
                /*
                  Note: the "includes" validation works when the uris come from Firebase,
                  the VIDEO_TYPES or IMAGE_TYPES can works for Firebase's uris but they're
                  destined for the local uris.
                */
                (item.includes('video') || VIDEO_TYPES.test(item)) && authCtx.device === 'web' &&
                <VideoAv uri={item} style={styles.image} />
              }
              {
                (item.includes('video') || VIDEO_TYPES.test(item)) && authCtx.device !== 'web' &&
                <VideoScreen uri={item} style={styles.image} />
              }
              {
                (item.includes('image') || IMAGE_TYPES.test(item)) &&
                <Image source={{ uri: item }} style={styles.image} />
              }
              {//Remove button above the file
                (authCtx.isConnected || (!authCtx.isConnected && (!isEditing || availableOffline))) &&
                (<TouchableOpacity style={styles.closeButton}>
                  <IconButton icon="close" size={20} color="white" onPress={() => removeImageHandler(item)} />
                </TouchableOpacity>)
              }
            </View>
          </View>
        )}
      />
    );
  }
  else {
    return (
      <View style={styles.container}>
        <View style={styles.imagePreview}>
          <Text>Sin imagen seleccionada.</Text>
        </View>
      </View>
    );
  }
}

const SCREEN_WIDTH = Dimensions.get('window').width;
//0.80 for mobile
//0.30 for web
const width = SCREEN_WIDTH * (Platform.OS !== 'web' ? 0.83 : 0.30);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  imagePreview: {
    width: width,
    height: 275,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.accent400,
    backgroundColor: Colors.accent300,
    borderRadius: 4,
    overflow: 'hidden'
  },
  image: {
    width: width,
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semi-transparente
    borderRadius: 15,
    padding: 4,
    zIndex: 2,
  }
});
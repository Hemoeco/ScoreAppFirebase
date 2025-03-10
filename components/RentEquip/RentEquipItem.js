import { View, Image, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from "../../consts/colors";
import { useNavigation } from "@react-navigation/native";
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/auth-context";

function RentEquipItem({ rentEquip }) {
  const [thumbnail, setThumbnail] = useState();
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  let image = (
    <View style={[styles.imageContainer, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={styles.description}>
        Sin imagen disponible
      </Text>
    </View>
  );

  useEffect(() => {
    if (authCtx.device !== 'web' && rentEquip.imagen && rentEquip.imagen.includes('video')) {
      async function getThumbnail() {
        const { uri } = await VideoThumbnails.getThumbnailAsync(rentEquip.imagen, {
          time: 15000,
        });
        setThumbnail(uri);
      }
      getThumbnail();
    }
    else{
      setThumbnail(null);
    }
  }, [rentEquip]);

  if (rentEquip.imagen !== '') {
    image = <Image style={styles.imageContainer} source={{ uri: thumbnail ?? rentEquip.imagen }} />
  }

  function editEquipHandler() {
    navigation.navigate('ManageRentEquips', {
      equipData: rentEquip
    });
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      onPress={editEquipHandler}
    >
      {image}
      <View style={styles.info}>
        <Text style={styles.title}>{rentEquip.nombre}</Text>
        <Text style={styles.description}>
          {rentEquip.descripcion !== '' ? rentEquip.descripcion : 'Sin descripción del equipo.'}
        </Text>
      </View>
    </Pressable>
  );
}

export default RentEquipItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 6,
    marginVertical: 12,
    backgroundColor: Colors.accent300,
    borderWidth: 2,
    borderColor: Colors.accent300,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2
  },
  pressed: {
    opacity: 0.9
  },
  imageContainer: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    height: 100,
    borderRightWidth: 2,
    borderRightColor: Colors.accent400
  },
  info: {
    flex: 2,
    padding: 12
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.gray700
  },
  description: {
    fontSize: 14,
    color: Colors.gray700
  }
});
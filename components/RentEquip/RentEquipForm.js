import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { Colors } from "../../consts/colors";
import IconButton from "../UI/IconButton";
import FilePicker from "./FilePicker";
import { RentEquip } from "../../models/rentEquip";

function RentEquipForm({
  equipData,
  saveHandler,
  deleteHandler,
  isEditing
}) {
  //const rentEquipsCtx = useContext(RentEquipContext);
  //Used for set/update the equipment's data
  const [validName, setValidName] = useState(true);
  const [enteredName, setEnteredName] = useState(equipData ? equipData.nombre : '');
  const [enteredDesc, setEnteredDesc] = useState(equipData ? equipData.descripcion : '');
  const [selectedImage, setSelectedImage] = useState(equipData ? equipData.imagen : '');
  const [deleteImageUri, setDeleteImageUri] = useState('');
  const navigation = useNavigation();

  //Set the value entered in the name input
  function onChangeName(name) {
    setEnteredName(name);
  }

  //Set the value entered in the description input
  function onChangeDesc(desc) {
    setEnteredDesc(desc);
  }

  /*
    Set the uri for the image:
    -When the user selects or takes the image, it's the local uri.
    -When is saved in Firebase, then it's from the server.
  */
  function onChangeImage(imageUri, deleteImageUri) {
    setSelectedImage(imageUri);
    setDeleteImageUri(deleteImageUri);
  }

  /* 
    To send the data to the method which will send the data to FireBase.
    First it checks 
  */
  function onSave() {
    if (!enteredName.trim().length > 0) {
      setValidName(false);
      return;
    }
    const equip = new RentEquip(enteredName, enteredDesc, selectedImage);
    saveHandler(isEditing, equipData?.id, equip, selectedImage, deleteImageUri);
  }

  return (
    <View style={styles.form}>
      <View style={styles.buttonContainer}>
        <IconButton
          icon="arrow-undo"
          size={24}
          onPress={navigation.goBack}
        />
        <IconButton
          icon="save"
          size={24}
          onPress={onSave}
        />
        {isEditing && (
          <IconButton
            icon="trash"
            size={24}
            onPress={deleteHandler}
          />
        )}
      </View>
      <ScrollView style={styles.scrollView}>
        <View>
          <Text style={[styles.label, !validName && styles.invalidLabel]}>
            Nombre
          </Text>
          <TextInput
            style={[styles.input, !validName && styles.invalidInput]}
            onChangeText={onChangeName}
            value={enteredName}
          />
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            multiline={true}
            onChangeText={onChangeDesc}
            value={enteredDesc}
          />
          <Text style={styles.label}>Imagen</Text>
          <FilePicker 
            onChangeImage={onChangeImage} 
            imageUri={selectedImage} 
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default RentEquipForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 10,
    flex: 1,
    margin: 10
  },
  scrollView: {
    marginTop: 20
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 2,
    borderColor: Colors.accent400,
    backgroundColor: Colors.accent300,
    borderRadius: 4
  },
  invalidLabel: {
    color: 'red'
  },
  invalidInput: {
    backgroundColor: '#fa775c'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  deleteContainer: {
    marginTop: 1,
    alignItems: 'center'
  }
});
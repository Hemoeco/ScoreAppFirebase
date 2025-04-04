import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { Colors } from "../../consts/colors";
import IconButton from "../UI/IconButton";
import FilesPicker from "./FilesPicker";
import { RentEquip } from "../../models/rentEquip";
import { RentEquipContext } from "../../store/rent-equip-context";
import { AuthContext } from "../../store/auth-context";
import { useHeaderHeight } from "@react-navigation/elements";
import Checkbox from "expo-checkbox";

function RentEquipForm({
  equipData,
  isEditing
}) {
  console.log(1);
  const headerHeight = useHeaderHeight(); // Obtener la altura del header automáticamente
  const isOffline = equipData ? equipData.disponibleOffline : false;

  //Context with the functions
  const rentEquipsCtx = useContext(RentEquipContext);
  const authCtx = useContext(AuthContext);

  //Used for set/update the equipment's data
  const [validName, setValidName] = useState(true);
  const [enteredName, setEnteredName] = useState(equipData ? equipData.nombre : '');
  const [enteredDesc, setEnteredDesc] = useState(equipData ? equipData.descripcion : '');
  //To do: Find a way of set the state for the files in FilesPicker, otherwise it's re rendered when
  //the name or description change too. Solution: use React.memo in FilesPicker!!!
  const [selectedFiles, setSelectedFiles] = useState(equipData ? equipData.multimedia : []);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [availableOffline, setAvailableOffline] = useState(equipData ?
    equipData.disponibleOffline :
    !authCtx.isConnected);
  const navigation = useNavigation();

  //#region Methods
  //Set the value entered in the name input
  function onChangeName(name) {
    setEnteredName(name);
  }

  //Set the value entered in the description input
  function onChangeDesc(desc) {
    setEnteredDesc(desc);
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
    const equip = new RentEquip(enteredName, enteredDesc, selectedFiles, availableOffline);
    rentEquipsCtx.saveRentEquipData(isEditing, equipData?.id, equip, selectedFiles, deletedFiles);
  }

  //#endregion Methods

  return (
    <KeyboardAvoidingView
      behavior={authCtx.device === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight / 2} // Ajusta según la altura del header
      style={styles.form}
    >
      <ScrollView keyboardShouldPersistTaps="always">
        <View>
          <Text style={styles.label}>Multimedia</Text>
          <FilesPicker
            onDeletedFiles={setDeletedFiles}
            onSelectedFiles={setSelectedFiles}
            files={selectedFiles}
            isEditing={isEditing}
            availableOffline={isOffline}
          />
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
          <Text style={styles.label}>Disponible sin conexión</Text>
          <Checkbox
            value={availableOffline}
            onValueChange={setAvailableOffline}
            disabled={!authCtx.isConnected} //Dissabled the checkbox when the user doesn't have internet.
          />
        </View>
        <View style={styles.buttonContainer}>
          <IconButton
            icon="arrow-undo"
            size={24}
            onPress={navigation.goBack}
          />
          {(authCtx.isConnected || (!authCtx.isConnected && (!isEditing || equipData.disponibleOffline))) && (
            <IconButton
              icon="save"
              size={24}
              onPress={onSave}
            />
          )}
          {//Just allow to delete the equip when the user is editing and: have internet or it's a equip which was created totally offline.
            isEditing && (authCtx.isConnected || equipData.id.includes("offline")) && (
              <IconButton
                onPress={rentEquipsCtx.deleteEquip.bind(this, equipData)}
                icon="trash"
                size={24}
              />
            )
          }
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default RentEquipForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    margin: 10
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
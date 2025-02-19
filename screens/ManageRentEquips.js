import { useLayoutEffect, useState } from "react";
import Button from "../components/UI/Button";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { RentEquip } from "../models/rentEquip";
import { deleteImage, deleteRentEquip, saveRentEquip, updateRentEquip, uploadImage } from "../util/https";
import RentEquipForm from "../components/RentEquip/RentEquipForm";

function ManageRentEquips({ navigation, route }) {
  //Data of the equipment selected
  const equipData = route.params?.equipData;
  const imageEquipUri = equipData ? equipData.imagen : '';
  const rentEquipId = equipData ? equipData.id : '';
  //To know if the action needs to be create or update
  const isEditing = !!equipData;
  //To know if the user is submitting the info
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  //Return to the index
  function goBackToIndex() {
    navigation.reset({
      index: 1, 
      routes: [
        {
          name: 'AllRentEquips'
        }
      ]
    });

    //navigation.replace('AllRentEquips');
  }

  //Put the title depending if is editing or creating
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Actualizar equipo' : 'Añadir equipo'
    });
  }, [navigation, isEditing]);

  //Saves the info to the database
  async function saveHandler(enteredName, enteredDesc, selectedImage, deleteImageUri) {
    setIsSubmitting(true);
    try {
      const equip = new RentEquip(enteredName, enteredDesc, selectedImage);
      //console.log(deleteImageUri);
      if (deleteImageUri) {
        await deleteImage(deleteImageUri);
      }

      if (selectedImage && !selectedImage.includes('firebasestorage')) {
        const imageUrl = await uploadImage(selectedImage);
        equip.imagen = imageUrl;
      }

      if (isEditing) {
        await updateRentEquip(rentEquipId, equip);
      } else {
        await saveRentEquip(equip);
      }
      goBackToIndex();
    } catch (error) {
      console.log(error);
      setError('No se pudo guardar la información');
      setIsSubmitting(false);
    }
  }

  //Delete info from the database
  async function deleteHandler() {
    setIsSubmitting(true);
    try {
      if (imageEquipUri) {
        await deleteImage(imageEquipUri);
      }
      await deleteRentEquip(rentEquipId);
      goBackToIndex();
    } catch (error) {
      setError('No se pudo eliminar el equipo');
      setIsSubmitting(false);
    }
  }

  function errorHandler() {
    setError(null);
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} onConfirm={errorHandler} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay message="Guardando cambios" />;
  }

  return (
    <RentEquipForm
      equipData={equipData}
      cancelHandler={goBackToIndex}
      saveHandler={saveHandler}
      deleteHandler={deleteHandler}
      isEditing={isEditing}
    />
  );
}

export default ManageRentEquips;
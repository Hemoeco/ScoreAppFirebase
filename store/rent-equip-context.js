import { createContext, useContext, useReducer, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "./auth-context";
import uuid from 'react-native-uuid';

import {
  getRentEquips,
  saveRentEquip,
  updateRentEquip,
  deleteRentEquip,
} from "../util/database";

import {
  uploadImage,
  deleteImage
} from "../util/storage";
import { deleteLocalData, readLocalData, saveLocalData, updateLocalData } from "../util/local";

export const RentEquipContext = createContext({
  rentEquips: [],
  submitting: false,
  fetching: false,
  synchronizing: false,
  error: null,
  setRentEquips: async (mode) => { },
  saveRentEquipData: async ({
    isEditing, rentEquipData, selectedImage, deleteImageUri
  }) => { },
  deleteEquip: async (id) => { },
  syncData: async () => { },
  errorHandler: () => { }
});

function rentEquipsReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'SET':
      const inverted = action.payload.reverse();
      return inverted;
    case 'UPDATE':
      const updatableRentEquipIndex = state.findIndex(
        (rentEquip) => rentEquip.id === action.payload.id
      );

      const updatedRentEquips = [...state];
      updatedRentEquips[updatableRentEquipIndex] = action.payload.equip;
      return updatedRentEquips;
    case 'DELETE':
      return state.filter((rentEquip) => rentEquip.id !== action.payload);
    default:
      return state;
  }
}

function RentEquipContextProvider({ children }) {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  //For Firebase's DB. "rentEquipsState" contains the data of the online DB.
  const [rentEquipsState, dispatch] = useReducer(rentEquipsReducer, []);
  //To know if the user is submitting the info
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  //To know if the local DB contains data that must be synchronized
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  //To set an error
  const [error, setError] = useState();

  //#region FirebaseDB
  //Get the equips from Firebase's database.
  async function setRentEquips(mode) {
    if (mode == 'set') {
      setIsFetching(true);
    }

    try {
      /*
        First, we get the data from Firebase (in this method we will update the local DB too).
        In case we don't have connection, then just read the data from local DB.
      */

      const rentEquips = 
      authCtx.isConnected ?
      await getRentEquips(authCtx.isConnected) :
      await readLocalData('SELECT * FROM EquiposRenta');
      
      dispatch(({ type: 'SET', payload: rentEquips }));
      //console.log(rentEquips);
    }
    catch (error) {
      console.log(error);
    }

    if (mode == 'set') {
      setIsFetching(false);
    }
  }

  //Saves the data of the equip, could be add or update.
  async function saveRentEquipData(isEditing, rentEquipId, rentEquipData,
    selectedImage, deleteImageUri) {
    setIsSubmitting(true);

    try {
      //Only when the device has connection we will use the methods for Firebase.
      if (authCtx.isConnected) {
        //If we change or remove the file, and it was already in Firebase, then we delete that file first.
        if (deleteImageUri) {
          await deleteImage(deleteImageUri);
        }

        //If the user selected a file and it isn't yet in Firebase, then we upload it.
        if (selectedImage && !selectedImage.includes('firebasestorage')) {
          const imageUrl = await uploadImage(selectedImage);
          rentEquipData.imagen = imageUrl;
        }
      }

      /*
        "rentEquipData" doesn't have the id because it contains the info for Firebase and the id isn't necessary there
        because it's created automatically. Instead, we recieve as parameter "rentEquipId" which will be distinct of
        undefined when editing.
      */
      if (isEditing) {
        await updateRentEquip(rentEquipId, rentEquipData, authCtx.isConnected);
        rentEquipData.__setId(rentEquipId);
        /*
          Depending of the connection's status we will known if the data was created/updated 
          offline. The value is the opposite to the status, this means: "If connection equals 
          false, it means the update is offline, then the value for this will be true since it's
          the opposite."

          This can't be set before send the request because is a field that only exists locally.
        */
        rentEquipData.__updatedOffline(!authCtx.isConnected);
        dispatch({ type: 'UPDATE', payload: { id: rentEquipId, equip: rentEquipData } });
      } else {
        const equipId = await saveRentEquip(rentEquipData, authCtx.isConnected);
        rentEquipData.__setId(equipId);
        rentEquipData.__updatedOffline(!authCtx.isConnected);
        dispatch({ type: 'ADD', payload: rentEquipData });
      }

      //Check for local actions.
      await localCRUD(rentEquipData);

      navigation.goBack();
    } catch (error) {
      console.log(error);
      setError('No se pudo guardar la información');
    }

    setIsSubmitting(false);
  }

  async function deleteEquip(rentEquip) {
    setIsSubmitting(true);
    try {
      
      //Only when the device has connection and it's id doesn't containt "offline" we will use the methods for Firebase.
      if (authCtx.isConnected && !rentEquip.id.includes('offline')) {
        //If the equipment has a file, then delete it first.
        if (rentEquip.imagen) {
          await deleteImage(rentEquip.imagen);
        }

        await deleteRentEquip(rentEquip.id);
      }
      
      dispatch({ type: 'DELETE', payload: rentEquip.id });
      
      //Check for local actions.
      await localCRUD(rentEquip, true);
      
      navigation.goBack();
    } catch (error) {
      console.log(error);
      setError('No se pudo eliminar el equipo');
    }

    setIsSubmitting(false);
  }
  //#endregion FirebaseDB

  //#region LocalDB
  /**
   * Used to determine if we need to create, update or delete local data.
   * @param {*} rentEquip 
   * @param {*} isDeleting 
   */
  async function localCRUD(rentEquip, isDeleting) {
    //Would be necessary work with conditional code, isn't possible to use switch...case
    const equipExists = rentEquipsState.find(
      (equip) => equip.id === rentEquip.id
    );

    //CREATE
    if (!equipExists && rentEquip.disponibleOffline) {
      await saveLocalData(rentEquip);
    }
    //DELETE
    else if ((equipExists && !rentEquip.disponibleOffline)
      || (isDeleting && equipExists && rentEquip.disponibleOffline)) {
      await deleteLocalData(rentEquip.id);
    }
    //UPDATE
    else if (equipExists && rentEquip.disponibleOffline) {
      await updateLocalData(rentEquip, rentEquip.id);
    }
  }
  //#endregion LocalDB

  async function syncHandler() {
    await syncData();
    await setRentEquips('set');
  }

  async function syncData() {
    setIsSynchronizing(true);

    try {
      /*
        Get the equipments that have been updated without connection or which id contains "offline".
        This can be done using the array or a query to the local DB.
      */
      const equips = rentEquipsState.filter(
        (equip) => equip.actualizadoOffline || equip.id.includes('offline')
      );
      
      //For each equip make the updates.
      for (const equip of equips) {
        /*
          Check for the image first. If the url isn't empty and doesn't contains 
          "firebasestorage" it means it was changed it, so we need to upload the new one.
        */
        if (equip.imagen && !equip.imagen.includes('firebasestorage')) {
          const imageUrl = await uploadImage(equip.imagen);
          equip.imagen = imageUrl;
        }

        /*
          Copy the id to another variable and delete the properties: id and "actualizadoOffline".
          This is done because we doesn't send the id nor "actualizadoOffline" when update or create 
          a register in Firebase.
        */
        const equipId = equip.id;
        delete equip.id;
        delete equip.actualizadoOffline;

        /*
          Check if is necessary to update or create the register in Firebase.
          We can know it with the id stored locally, if contains "offline" then
          is a equip that was created without connection.
        */
        if (equipId.includes('offline')) {
          const id = await saveRentEquip(equip, authCtx.isConnected);
          equip.__setId(id);
        }
        else {
          await updateRentEquip(equipId, equip, authCtx.isConnected);
          equip.__setId(equipId);
        }

        //Update the field "actualizadoOffline" (it should be false).
        equip.actualizadoOffline = !authCtx.isConnected;

        //Finally, update the data locally.
        await updateLocalData(equip, equipId);
      }
    }
    catch (error) {
      console.log(error);
    }

    setIsSynchronizing(false);
  }

  function errorHandler() {
    setError(null);
  }

  const value = {
    rentEquips: rentEquipsState,
    submitting: isSubmitting,
    fetching: isFetching,
    synchronizing: isSynchronizing,
    error: error,
    setRentEquips: setRentEquips,
    saveRentEquipData: saveRentEquipData,
    deleteEquip: deleteEquip,
    syncData: syncHandler,
    errorHandler: errorHandler
  };

  return (
    <RentEquipContext.Provider value={value}>
      {children}
    </RentEquipContext.Provider>
  );
}

export default RentEquipContextProvider;
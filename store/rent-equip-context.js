import { createContext, useContext, useReducer, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "./auth-context";

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
  offlineRentEquips: [],
  submitting: false,
  fetching: false,
  error: null,
  //#region Firebase methods
  setRentEquips: async (mode) => { },
  saveRentEquipData: async ({
    isEditing, rentEquipData, selectedImage, deleteImageUri
  }) => { },
  deleteEquip: async (id) => { },
  //#endregion Firebase methods

  //#region LocalDB methods
  setOfflineRentEquips: async (setFeching) => { },
  //#endregion LocalDB methods

  errorHandler: () => { }
});

function rentEquipsReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      console.log(action.payload);
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
  //For Firebase's DB. "rentEquipsState" contains the data of the online DB.
  const [rentEquipsState, dispatch] = useReducer(rentEquipsReducer, []);
  //For local DB. "offRentEquipsState" contains the data for the local DB.
  const [offRentEquipsState, offlineDispatch] = useReducer(rentEquipsReducer, []);
  //To know if the user is submitting the info
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  //To set an error
  const [error, setError] = useState();
  const navigation = useNavigation();

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

      const rentEquips = authCtx.isConnected ? 
                         await getRentEquips() : 
                         await readLocalData('SELECT * FROM EquiposRenta');

      dispatch(({ type: 'SET', payload: rentEquips }));
      //await setOfflineRentEquips(false);
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
      //Check for local actions.
      await localCRUD(rentEquipData);

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

        /*
          "rentEquipData" doesn't have the id because it contains the info for Firebase and the id isn't necessary there
          because it's created automatically. Instead, we recieve as parameter "rentEquipId" which will be distinct of
          undefined when editing.
        */

        if (isEditing) {
          await updateRentEquip(rentEquipId, rentEquipData);
          rentEquipData.__setId(rentEquipId);
          dispatch({ type: 'UPDATE', payload: { id: rentEquipId, equip: rentEquipData } });
        } else {
          const equipId = await saveRentEquip(rentEquipData);
          rentEquipData.__setId(equipId)
          dispatch({ type: 'ADD', payload: rentEquipData });
        }
      }

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
      //Check for local actions.
      await localCRUD(rentEquip, true);

      //Only when the device has connection we will use the methods for Firebase.
      if (authCtx.isConnected) {
        //If the equipment has a file, then delete it first.
        if (rentEquip.imagen) {
          await deleteImage(rentEquip.imagen);
        }

        await deleteRentEquip(rentEquip.id);
        dispatch({ type: 'DELETE', payload: rentEquip.id });
      }

      navigation.goBack();
    } catch (error) {
      console.log(error);
      setError('No se pudo eliminar el equipo');
    }

    setIsSubmitting(false);
  }
  //#endregion FirebaseDB

  //#region LocalDB
  async function setOfflineRentEquips(setFeching) {
    if (setFeching) {
      setIsFetching(true);
    }

    try {
      const offlineRentEquips = await readLocalData('SELECT * FROM EquiposRenta');
      offlineDispatch(({ type: 'SET', payload: offlineRentEquips }));
    }
    catch (error) {
      console.log(error);
    }

    if (setFeching) {
      setIsFetching(false);
    }
  }

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

    /*
      Depending of the connection's status we will known if the data was created/updated 
      offline. The is the opposite to the status, this means: "If connection equals false,
      it means the update is offline, then the value for this will be true since it's
      the opposite."

      Not needed when deleting.
    */
    rentEquip.__updatedOffline(!authCtx.isConnected);

    //CREATE
    if (!equipExists && rentEquip.disponibleOffline) {
      await saveLocalData(rentEquip);
      //dispatch({ type: 'ADD', payload: rentEquip });
    }
    //UPDATE
    else if (equipExists && rentEquip.disponibleOffline) {
      await updateLocalData(rentEquip);
      //dispatch({ type: 'UPDATE', payload: { id: rentEquip.id, equip: rentEquip } });
    }
    //DELETE
    else if ((equipExists && !rentEquip.disponibleOffline)
      || (isDeleting && equipExists && rentEquip.disponibleOffline)) {
      await deleteLocalData(rentEquip.id);
      //dispatch({ type: 'DELETE', payload: rentEquip.id });
    }
  }
  //#endregion LocalDB

  function errorHandler() {
    setError(null);
  }

  const value = {
    rentEquips: rentEquipsState,
    offlineRentEquips: offRentEquipsState,
    submitting: isSubmitting,
    fetching: isFetching,
    error: error,
    setRentEquips: setRentEquips,
    saveRentEquipData: saveRentEquipData,
    deleteEquip: deleteEquip,
    setOfflineRentEquips: setOfflineRentEquips,
    errorHandler: errorHandler
  };

  return (
    <RentEquipContext.Provider value={value}>
      {children}
    </RentEquipContext.Provider>
  );
}

export default RentEquipContextProvider;
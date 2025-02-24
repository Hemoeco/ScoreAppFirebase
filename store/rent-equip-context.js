import { createContext, useReducer, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import {
  getRentEquips,
  saveRentEquip,
  updateRentEquip,
  deleteRentEquip,
  uploadImage,
  deleteImage,
} from "../util/https";

export const RentEquipContext = createContext({
  rentEquips: [],
  submitting: false,
  fetching: false,
  error: null,
  setRentEquips: async (mode) => { },
  saveRentEquipData: async ({
    isEditing, rentEquipData, selectedImage, deleteImageUri
  }) => { },
  deleteEquip: async (id) => { },
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
  const [rentEquipsState, dispatch] = useReducer(rentEquipsReducer, []);
  //To know if the user is submitting the info
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  //To set an error
  const [error, setError] = useState();
  const navigation = useNavigation();

  //Get the equips from the database.
  async function setRentEquips(mode) {
    if (mode == 'set') {
      setIsFetching(true);
    }

    try {
      const rentEquips = await getRentEquips();
      dispatch(({ type: 'SET', payload: rentEquips }));
    }
    catch (error) {
      console.log(error);
    }

    if (mode == 'set') {
      setIsFetching(false);
    }
  }

  //Saves the data of the equip, could be add or update.
  async function saveRentEquipData(isEditing, rentEquipId, rentEquipData, selectedImage, deleteImageUri) {
    setIsSubmitting(true);
    try {
      if (deleteImageUri) {
        await deleteImage(deleteImageUri);
      }

      if (selectedImage && !selectedImage.includes('firebasestorage')) {
        const imageUrl = await uploadImage(selectedImage);
        rentEquipData.imagen = imageUrl;
      }

      if (isEditing) {
        await updateRentEquip(rentEquipId, rentEquipData);
        rentEquipData.__setId(rentEquipId);
        dispatch({ type: 'UPDATE', payload: { id: rentEquipId, equip: rentEquipData } });
      } else {
        const equipId = await saveRentEquip(rentEquipData);
        rentEquipData.__setId(equipId)
        dispatch({ type: 'ADD', payload: rentEquipData });
      }
      navigation.goBack();
    } catch (error) {
      console.log(error);
      setError('No se pudo guardar la información');
    }

    setIsSubmitting(false);
  }

  async function deleteEquip(rentEquipId, imageEquipUri) {
    setIsSubmitting(true);
    try {
      if (imageEquipUri) {
        await deleteImage(imageEquipUri);
      }
      await deleteRentEquip(rentEquipId);
      dispatch({ type: 'DELETE', payload: rentEquipId });
      navigation.goBack();
    } catch (error) {
      console.log(error);
      setError('No se pudo eliminar el equipo');
    }

    setIsSubmitting(false);
  }

  function errorHandler() {
    setError(null);
  }

  const value = {
    rentEquips: rentEquipsState,
    submitting: isSubmitting,
    fetching: isFetching,
    error: error,
    setRentEquips: setRentEquips,
    saveRentEquipData: saveRentEquipData,
    deleteEquip: deleteEquip,
    errorHandler: errorHandler
  };

  return (
    <RentEquipContext.Provider value={value}>
      {children}
    </RentEquipContext.Provider>
  );
}

export default RentEquipContextProvider;
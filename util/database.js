import { ref, set, push, update, remove, get } from "firebase/database";
import uuid from 'react-native-uuid';

import { RentEquip } from "../models/rentEquip";
import { rtDatabase } from "../firebase/FirebaseConfig";
import { readLocalData, saveLocalData, updateLocalData } from "./local";

//const BACKEND_URL = 'https://score-test-4e44a-default-rtdb.firebaseio.com';
const TABLE_NAME = 'EquiposRenta'

/**
 * Retrieves the data from Firebase and updates the local data.
 * @returns 
*/
export async function getRentEquips(connection) {
  const equipments = [];
  //Get the local equipments which data hasn't been updated whithout connection.
  const localEquipments = await readLocalData('SELECT * FROM EquiposRenta WHERE actualizadoOffline = 0');
  //Get the local equipments which data has been updated whithout connection. 
  const localUpdated = await readLocalData('SELECT * FROM EquiposRenta WHERE actualizadoOffline = 1');
  //Get the equipments from Firebase.
  const reference = ref(rtDatabase, TABLE_NAME);
  const response = await get(reference);

  /*
   The ".data" is given by Axios, and is a property of the response object which holds 
   the actual data that was sent back by the server.

   For loop is used to transform the data sent back from Firebase (or other server) into
   an array of objects that have the format we want them to have.
  */
  for (const key in response.val()) {
    /*
      Add the equipments from Firebase that hasn't been updated without connection.
      This is done because we don't want to lose the data locally saved.
    */
    if (!localUpdated.find(equip => equip.id === key)) {
      const equip = response.child(key).val();
      const equipObj = new RentEquip(equip.nombre, equip.descripcion,
        equip.imagen, equip.disponibleOffline);

      equipObj.__setId(key);

      await updateLocal(equipObj, connection, localEquipments);

      equipments.push(equipObj);
    }
  }


  return [...equipments, ...localUpdated];
}

/**
 * Used to known if is necessary to create or update the local data.
 * @param {*} equip 
*/
async function updateLocal(equip, connection, localEquipments) {
  //Check if the equip must be in the local DB.
  if (equip.disponibleOffline) {
    equip.__updatedOffline(!connection);
    
    //If already in DB, then update the info (UPDATE).
    if (localEquipments.find(e => e.id === equip.id)) {
      await updateLocalData(equip);
    }
    //In case it isn't in the local DB, then add it (CREATE).
    else {
      await saveLocalData(equip);
    }
  }
}

/**
 * Create a new register in Firebase. If the user doesn't have connection then
 * returns a temporary id.
 * @param {*} equipRentData 
 * @param {*} connection 
 * @returns 
*/
export async function saveRentEquip(equipRentData, connection) {
  let id;

  if (connection) {
    //Create the reference to the table.
    const reference = ref(rtDatabase, TABLE_NAME);
    //Generates a new id.
    const newEquip = push(reference);
    //Upload the new equipment.
    await set(newEquip, equipRentData);

    id = newEquip.key; //Saves the new id only if the upload was correct.
  }
  else {
    id = `offline-${uuid.v4()}`;
  }

  return id;
}

export async function updateRentEquip(id, equipmentData, connection) {
  if (connection) {
    const reference = ref(rtDatabase, `${TABLE_NAME}/${id}`);
    await update(reference, equipmentData);
  }
}

export async function deleteRentEquip(id) {
  const reference = ref(rtDatabase, `${TABLE_NAME}/${id}`);
  await remove(reference);
}
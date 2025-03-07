import axios from "axios";
import { ref, set, push, update, remove, get } from "firebase/database";
import uuid from 'react-native-uuid';

import { RentEquip } from "../models/rentEquip";
import { rtDatabase } from "../firebase/FirebaseConfig";

const BACKEND_URL = 'https://score-test-4e44a-default-rtdb.firebaseio.com';
const TABLE_NAME = 'EquiposRenta'

export async function saveRentEquip(equipRentData, isConnected) {
  let id = uuid.v4();
  if (isConnected) {
    //Create the reference to the table.
    const reference = ref(rtDatabase, TABLE_NAME);
    //Generates a new id.
    const newEquip = push(reference);
    //Upload the new equipment.
    await set(newEquip, equipRentData);

    id = newEquip.key; //Saves the new id only if the upload was correct.
  }

  return id;
}

export async function getRentEquips() {
  const reference = ref(rtDatabase, TABLE_NAME);
  const response = await get(reference);//axios.get(`${BACKEND_URL}/${TABLE_NAME}.json`);
  //console.log(response.val());
  const equipments = [];

  /*
   The ".data" is given by Axios, and is a property of the response object which holds 
   the actual data that was sent back by the server.

   For loop is used to transform the data sent back from Firebase (or other server) into
   an array of objects that have the format we want them to have.
  */
  for (const key in response.val()) {
    const equip = response.child(key).val();
    let equipObj = new RentEquip(equip.nombre, equip.descripcion, equip.imagen);
    equipObj.__setId(key);

    equipments.push(equipObj);
  }

  return equipments;
}

export async function updateRentEquip(id, equipmentData, isConnected) {
  if (isConnected) {
    const reference = ref(rtDatabase, `${TABLE_NAME}/${id}`);
    await update(reference, equipmentData);
  }
}

export async function deleteRentEquip(id, isConnected) {
  if (isConnected) {
    const reference = ref(rtDatabase, `${TABLE_NAME}/${id}`);
    await remove(reference);
  }
}
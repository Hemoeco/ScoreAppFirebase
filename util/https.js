import axios from "axios";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import uuid from 'react-native-uuid';

import { RentEquip } from "../models/rentEquip";
import { storage } from "../firebase/FirebaseConfig";

const BACKEND_URL = 'https://score-test-4e44a-default-rtdb.firebaseio.com';
const TABLE_NAME = 'EquiposRenta'

export async function saveRentEquip(equipRentData) {
  const response = await axios.post(
    /*
      Add "/nameSegment.json" at the end of the root, we can add any segments we want there
      and will be translated as nodes or folders in the DB. 
      This is a Firebase specific to understand that we're targeting a specific node in the DB
      and doing this will create a new node in the database, in this case one named "nodes".
    */
    `${BACKEND_URL}/${TABLE_NAME}.json`,
    /*
      We don't pass an ID in this expenseData object since Firebase will be in charge of create 
      an unique ID automatically.
    */
    equipRentData
  );

  const id = response.data.name; //To get the id generated by Firebase.
  return id;
}

export async function getRentEquips() {
  const response = await axios.get(`${BACKEND_URL}/${TABLE_NAME}.json`);

  const equipments = [];

  /*
   The ".data" is given by Axios, and is a property of the response object which holds 
   the actual data that was sent back by the server.

   For loop is used to transform the data sent back from Firebase (or other server) into
   an array of objects that have the format we want them to have.
  */
  //console.log(response.data);
  for (const key in response.data) {
    const equip = response.data[key];
    let equipObj = new RentEquip(equip.nombre, equip.descripcion, equip.imagen);
    equipObj.__setId(key);

    equipments.push(equipObj);
  }

  return equipments;
}

export function updateRentEquip(id, equipmentData) {
  return axios.put(`${BACKEND_URL}/${TABLE_NAME}/${id}.json`, equipmentData);
}

export function deleteRentEquip(id) {
  return axios.delete(`${BACKEND_URL}/${TABLE_NAME}/${id}.json`);
}

export async function uploadImage(uri) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError(`Falla al recuperar la imagen desde el dispositivo: ${e}`));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  const type = blob.type.split('/');
  //console.log(storage);
  const fileRef = ref(storage, `EquiposRenta/${type[0]}-${uuid.v4()}.${type[1]}`);
  //console.log(fileRef);
  await uploadBytes(fileRef, blob);
  const url = await getDownloadURL(fileRef);
  blob.close;

  return url;
}

export async function deleteImage(uri) {
  const firstSplit = uri.split('%2F');
  const secondSplit = firstSplit[1].split('?alt');
  const fileName = secondSplit[0];

  const fileRef = ref(storage, `EquiposRenta/${fileName}`);
  const deleted = await deleteObject(fileRef);

  return deleted;
}
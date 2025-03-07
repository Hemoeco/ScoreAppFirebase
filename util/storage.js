import {  
  ref,
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";

import { storage } from "../firebase/FirebaseConfig";
import uuid from 'react-native-uuid';

const TABLE_NAME = 'EquiposRenta'

export async function uploadImage(uri, isConnected) {
  let url = uri;

  if (isConnected) {
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
    const fileRef = ref(storage, `${TABLE_NAME}/${type[0]}-${uuid.v4()}.${type[1]}`);
    //console.log(fileRef);
    await uploadBytes(fileRef, blob);
    url = await getDownloadURL(fileRef);
    blob.close;
  }

  return url;
}

export async function deleteImage(uri) {
  const firstSplit = uri.split('%2F');
  const secondSplit = firstSplit[1].split('?alt');
  const fileName = secondSplit[0];

  const fileRef = ref(storage, `${TABLE_NAME}/${fileName}`);
  const deleted = await deleteObject(fileRef);

  return deleted;
}
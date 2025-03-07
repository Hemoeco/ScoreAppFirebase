import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('score.db');

//Ensures the DB is created when the app initializes.
async function createDB() {
  const test = await db.execAsync(`
    CREATE TABLE IF NOT EXISTS EquiposRenta (
      id VARCHAR(100) PRIMARY KEY NOT NULL, 
      nombre VARCHAR(100) NOT NULL, 
      descripcion VARCHAR(100) NULL,
      imagen VARCHAR(200) NULL,
      offline BIT NOT NULL); 
  `);

  console.log(test);
}

//Read local data.
async function readLocalData() {

}

//Create or updates data locally.
async function saveLocalData() {

}

//This function will be used just to delete the data when the user uncheck "Offline" in a specific equip.
async function deleteLocalData(id) {

}
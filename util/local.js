import * as SQLite from 'expo-sqlite';
import { RentEquip } from "../models/rentEquip";

let db; //= SQLite.openDatabaseSync('score.db');

export async function openDB() {
  db = await SQLite.openDatabaseAsync('score.db');
  console.log(db)
}

export async function closeDB() {
  await db.closeAsync();
}

//Ensures the DB is created when the app initializes.
export async function createTable() {
  /*
    Notes:
      -We can use AUTOINCREMENT keyword but it's not necessary since SQLite provide us with
       RowId automatically when defining the primary key as an integer. The main difference
       between RowId and AUTOINCREMENT is RowId can reuse id of eliminated rows.
      -BIT type don't exists in SQLite so would be necessary use INTEGER type, where "1" equals
       true and "0" false.
      -VARCHAR(n) type existe in SQLite but it ignores the max lenght defined. In this case is
       better to use TEXT.
  */

  //await db.execAsync('Drop Table EquiposRenta');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS EquiposRenta (
      idLocal INTEGER PRIMARY KEY NOT NULL, 
      idFirebase TEXT NULL,
      nombre TEXT NOT NULL, 
      descripcion TEXT NULL,
      imagen TEXT NULL,
      disponibleOffline INTEGER NOT NULL,
      actualizadoOffline INTEGER NOT NULL); 
  `);
}

/**
 * Retrieves the data stored locally. Needs the query to know which registers return.
 * @param {*} query 
 * @returns 
 */
export async function readLocalData(query) {
  const equipments = [];
  const allRegisters = await db.getAllAsync(query);
  
  for (const equip of allRegisters) {
    let equipObj = new RentEquip(equip.nombre, equip.descripcion,
      equip.imagen, !!equip.disponibleOffline);
    equipObj.__setId(equip.idFirebase);
    equipObj.__updatedOffline(!!equip.actualizadoOffline);

    equipments.push(equipObj);
  }

  return equipments;
}

export async function saveLocalData(equip) {
  await db.runAsync(
    `INSERT INTO EquiposRenta (
      idFirebase,
      nombre,
      descripcion,
      imagen,
      disponibleOffline,
      actualizadoOffline
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    equip.id,
    equip.nombre,
    equip.descripcion,
    equip.imagen,
    Number(equip.disponibleOffline),
    Number(equip.actualizadoOffline)
  );
}

export async function updateLocalData(equip, id) {
  await db.runAsync(
    `UPDATE EquiposRenta SET
      idFirebase = ?,
      nombre = ?,
      descripcion = ?,
      imagen = ?,
      disponibleOffline = ?,
      actualizadoOffline = ?
    WHERE idFirebase = ?`,
    equip.id,
    equip.nombre,
    equip.descripcion,
    equip.imagen,
    Number(equip.disponibleOffline),
    Number(equip.actualizadoOffline),
    id
  );
}

export async function deleteLocalData(id) {
  const x = await db.runAsync(`
    DELETE FROM EquiposRenta 
    WHERE idFirebase = ?`, id
  );

}


export class RentEquip {
  constructor(nombre, descripcion = '', imagen = '', offline = false) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.offline = false;
  }

  __setId(id) {
    this.id = id;
  }

  __setOffline(val) {
    this.offline = val;
  }
}
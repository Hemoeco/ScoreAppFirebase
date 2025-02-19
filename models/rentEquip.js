export class RentEquip {
  constructor(nombre, descripcion = '', imagen = '') {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imagen = imagen;
  }

  __setId(id) {
    this.id = id;
  }
}
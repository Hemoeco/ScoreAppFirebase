export class RentEquip {
  constructor(nombre, descripcion = '', imagen = '', disponibleOffline = false) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.disponibleOffline = disponibleOffline;
  }

  __setId(id) {
    this.id = id;
  }

  __updatedOffline(val) {
    this.actualizadoOffline = val;
  }
}
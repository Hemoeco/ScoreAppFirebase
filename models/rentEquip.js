export class RentEquip {
  constructor(nombre, descripcion = '', multimedia = [], disponibleOffline = false) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.multimedia = multimedia;
    this.disponibleOffline = disponibleOffline;
  }

  __setId(id) {
    this.id = id;
  }

  __updatedOffline(val) {
    this.actualizadoOffline = val;
  }
}
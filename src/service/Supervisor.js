import axios from "axios";

export default class Supervisor {

  async getListaCorrelativos() {
    return await axios 
      .get('/Correlativo').then(d => d.data);
  }
  
    async agregarNuevoCorrelativo(datos) {
      return await axios 
        .post('/Correlativo',datos).then(d => d.data);
    }

  async putNroCorrelativo(datos) {
    return await axios 
      .put('/Correlativo',datos).then(d => d.data);
  }

  async getListaUsuarios(){
    return await axios
      .get('/Usuarios').then(d => d.data);
  }

  async eliminarUsuario(id){
    return await axios
      .delete('/Usuarios/'+id).then(d => d.data);
  }

  async getListaRoles(){
    return await axios
      .get('/Usuarios/roles').then(d => d.data);
  }

  async agregarRolUsuario(rol){
    return await axios
      .post('/Usuarios/roles',rol).then(d => d.data);
  }

  async eliminarRolUsuario(id){
    return await axios
      .delete('/Usuarios/roles/'+id).then(d => d.data);
  }

  async getListaRolesPorUsuario(usuario){
    return await axios
      .post('/Usuarios/rolesporusuario',usuario).then(d => d.data);
  }

}
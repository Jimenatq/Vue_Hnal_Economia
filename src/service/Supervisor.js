import axios from "axios";

export default class Supervisor {

  async getListaCorrelativos() {
    return await axios 
      .get('http://localhost:49146/api/Correlativo').then(d => d.data);
      //.get('http://192.168.36.121:8081/api/Correlativo').then(d => d.data);
  }
  
    async agregarNuevoCorrelativo(datos) {
      return await axios 
        .post('http://localhost:49146/api/Correlativo',datos).then(d => d.data);
        //.post('http://192.168.36.121:8081/api/Correlativo',datos).then(d => d.data);
    }

  async putNroCorrelativo(datos) {
    return await axios 
      .put('http://localhost:49146/api/Correlativo',datos).then(d => d.data);
      //.put('http://192.168.36.121:8081/api/Correlativo',datos).then(d => d.data);
  }

  async getListaUsuarios(){
    return await axios
      .get('http://localhost:49146/api/Usuarios').then(d => d.data);
      //.get('http://192.168.36.121:8081/api/Usuarios').then(d => d.data);
  }

  async eliminarUsuario(id){
    return await axios
      .delete('http://localhost:49146/api/Usuarios/'+id).then(d => d.data);
      //.delete('http://192.168.36.121:8081/api/Usuarios',id).then(d => d.data);
  }

  async getListaRoles(){
    return await axios
      .get('http://localhost:49146/api/Usuarios/roles').then(d => d.data);
      //.get('http://192.168.36.121:8081/api/Usuarios/roles').then(d => d.data);
  }

  async agregarRolUsuario(rol){
    return await axios
      .post('http://localhost:49146/api/Usuarios/roles',rol).then(d => d.data);
      //.post('http://192.168.36.121:8081/api/Usuarios/roles',rol).then(d => d.data);
  }

  async eliminarRolUsuario(id){
    return await axios
      .delete('http://localhost:49146/api/Usuarios/roles/'+id).then(d => d.data);
      //.delete('http://192.168.36.121:8081/api/Usuarios/roles',id).then(d => d.data);
  }

  async getListaRolesPorUsuario(usuario){
    return await axios
      .post('http://localhost:49146/api/Usuarios/rolesporusuario',usuario).then(d => d.data);
      //.post('http://192.168.36.121:8081/api/Usuarios/rolesporusuario',usuario).then(d => d.data);
  }

}
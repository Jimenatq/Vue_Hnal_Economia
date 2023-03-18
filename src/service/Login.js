import axios from "axios";

export default class Login {

  async getListaUsuarios() {
    return await axios 
      .get('http://localhost:49146/api/usuarios').then(d => d.data);
      //.post('http://192.168.36.121:8081/api/user').then(d => d.data);
  }

  async validarUsuario(user) {
    return await axios 
      .post('http://localhost:49146/api/usuarios',user).then(d => d.data);
      //.post('http://192.168.36.121:8081/api/user',user).then(d => d.data);
  }

}
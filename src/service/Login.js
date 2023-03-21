import axios from "axios";

export default class Login {

  async getListaUsuarios() {
    return await axios 
      .get('http://localhost:49146/api/usuarios').then(d => d.data);
      // .get('http://192.168.36.121:8081/api/usuarios').then(d => d.data);
  }

  async validarUsuario(user) {
    return await axios 
      .post('http://localhost:49146/api/usuarios',user).then(d => d.data);
      //.post('http://192.168.36.121:8081/api/usuarios',user).then(d => d.data);
  }

  async getUsuarioConRoles(id) {
    return await axios 
      .get('http://localhost:49146/api/usuarios/usuarioconroles/'+id).then(d => d.data);
      // .get('http://192.168.36.121:8081/api/usuarios/usuarioconroles/'+id).then(d => d.data);
  }

  // guardarToken(data){
  //   axios.defaults.headers.common['Authorization'] = 'Bearer '+ data.token;
  //   localStorage.setItem('token', data.token);
  //   localStorage.setItem('NameCompleto', data.userData.NameCompleto);
  //   localStorage.setItem('userName', data.userData.userName);
  //   localStorage.setItem('isAuthenticated','S');
  //   this.$store.commit('setAuthenticated',true);
  //   this.$store.commit('setUserData', data.userData.NameCompleto, data.userData.userName);
  // }

}
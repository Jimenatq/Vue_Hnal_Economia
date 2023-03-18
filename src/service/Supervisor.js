import axios from "axios";

export default class Supervisor {

  async getListaCorrelativos() {
    return await axios 
      //.get('http://localhost:49146/api/Correlativo').then(d => d.data);
      .get('http://192.168.36.121:8081/api/Correlativo').then(d => d.data);
  }
  
    async agregarNuevoCorrelativo(datos) {
      return await axios 
        //.post('http://localhost:49146/api/Correlativo',datos).then(d => d.data);
        .post('http://192.168.36.121:8081/api/Correlativo',datos).then(d => d.data);
    }

  async putNroCorrelativo(datos) {
    return await axios 
      //.put('http://localhost:49146/api/Correlativo',datos).then(d => d.data);
      .put('http://192.168.36.121:8081/api/Correlativo',datos).then(d => d.data);
  }

}
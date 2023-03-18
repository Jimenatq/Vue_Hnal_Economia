import axios from "axios";

export default class FondoRotatorio {

  async getListaRegistros(annio) {
    return await axios 
      //.post('http://localhost:49146/api/registros/fondorotatorio',annio).then(d => d.data);
      .post('http://192.168.36.121:8081/api/registros/fondorotatorio',annio).then(d => d.data);
  }

  async putAnularRegistros(datos) {
    return await axios 
      //.put('http://localhost:49146/api/Registros/anular',datos).then(d => d.data);
      .put('http://192.168.36.121:8081/api/Registros/anular',datos).then(d => d.data);
  }

  async getReporteRegistros(valueReport) {
    return await axios 
      //.post('http://localhost:49146/api/Report/fondorotatorio/pormesyanio',valueReport).then(d => d.data);
      .post('http://192.168.36.121:8081/api/Report/fondorotatorio/pormesyanio',valueReport).then(d => d.data);
  }

  async getReporteRegistrosPorAnnio(valueReport) {
    return await axios 
      //.post('http://localhost:49146/api/Report/fondorotatorio/poranio',valueReport).then(d => d.data);
      .post('http://192.168.36.121:8081/api/Report/fondorotatorio/poranio',valueReport).then(d => d.data);
  }

}
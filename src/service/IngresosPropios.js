import axios from "axios";

export default class IngresosPropios {

  async getListaRegistros(annio) {
    return await axios 
      //.post('http://localhost:49146/api/registros/ingpropios',annio).then(d => d.data);
      .post('http://192.168.36.121:8081/api/registros/ingpropios',annio).then(d => d.data);
  }

  async putAnularRegistros(datos) {
    return await axios 
      //.put('http://localhost:49146/api/registros/anular',datos).then(d => d.data);
      .put('http://192.168.36.121:8081/api/registros/anular',datos).then(d => d.data);
  }

  async getReporteRegistros(valueReport) {
    return await axios 
      //.post('http://localhost:49146/api/Report/ingpropios/pormesyanio',valueReport).then(d => d.data);
      .post('http://192.168.36.121:8081/api/Report/ingpropios/pormesyanio',valueReport).then(d => d.data);
  }

  async getReporteRegistrosPorAnnio(valueReport) {
    return await axios 
      //.post('http://localhost:49146/api/Report/ingpropios/poranio',valueReport).then(d => d.data);
      .post('http://192.168.36.121:8081/api/Report/ingpropios/poranio',valueReport).then(d => d.data);
  }

}
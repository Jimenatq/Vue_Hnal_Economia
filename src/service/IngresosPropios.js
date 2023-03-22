import axios from "axios";

export default class IngresosPropios {

  async getListaRegistros(annio) {
    return await axios 
      .post('/registros/ingpropios',annio).then(d => d.data);
  }

  async putAnularRegistros(datos) {
    return await axios 
      .put('/registros/anular',datos).then(d => d.data);
  }

  async getReporteRegistros(valueReport) {
    return await axios 
      .post('/Report/ingpropios/pormesyanio',valueReport).then(d => d.data);
  }

  async getReporteRegistrosPorAnnio(valueReport) {
    return await axios 
      .post('/Report/ingpropios/poranio',valueReport).then(d => d.data);
  }

}
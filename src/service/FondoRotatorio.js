import axios from "axios";

export default class FondoRotatorio {

  async getListaRegistros(annio) {
    return await axios 
      .post('/registros/fondorotatorio',annio).then(d => d.data);
  }

  async putAnularRegistros(datos) {
    return await axios 
      .put('/Registros/anular',datos).then(d => d.data);
  }

  async getReporteRegistros(valueReport) {
    return await axios 
      .post('/Report/fondorotatorio/pormesyanio',valueReport).then(d => d.data);
  }

  async getReporteRegistrosPorAnnio(valueReport) {
    return await axios 
      .post('/Report/fondorotatorio/poranio',valueReport).then(d => d.data);
  }

}
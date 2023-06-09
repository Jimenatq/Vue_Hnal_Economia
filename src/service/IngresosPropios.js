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

  async getReporteExcelPorMesAnio(mes,anio) {
    return await axios 
      .get('/Report/excelpormesyanio/'+mes+'/'+anio).then(d => d.data);
  }

  async getReporteExcelPorAnio(anio) {
    return await axios 
      .get('/Report/excelporanio/'+anio).then(d => d.data);
  }
  
  async getDescripcionClasificadoresImpresion(codClasificadorExterno) {
    return await axios 
      .get('/parametros/clasificadoresagrupados/'+codClasificadorExterno).then(d => d.data);
  }

}
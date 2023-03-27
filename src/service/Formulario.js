import axios from "axios";

export default class Formulario {

  async getListaRegistros() {
    return await axios 
      .get('/registros').then(d => d.data);
  }

  async guardarRegistro(registro) {
    return await axios 
      .post('/registros',registro).then(d => d.data);
  }

  async modificarImporteTotal(importe) {
    return await axios 
      .put('/registros/importetotal',importe).then(d => d.data);
  }

  async deleteClasificadorDefinitivamente(id) {
    return await axios 
      .get('/registros/'+id).then(d => d.data);
  }

  async getSubtiposIngresosPropios() {
    return await axios 
      .get('/Parametros/SubtiposIP').then(d => d.data);
  }

  async getSubtiposFondoRotatorio() {
    return await axios 
      .get('/Parametros/SubtiposFR').then(d => d.data);
  }

  async getClasificadores(tipoParametro) {
    return await axios 
      .get('/Parametros/Clasificadores/'+tipoParametro).then(d => d.data);
  }

  async editarRegistroIngresos(registro) {
    return await axios 
      .put('/registros',registro).then(d => d.data);
  }

  async obtenerCorrelativo(value) {
    return await axios 
      .post('/correlativo/consulta',value).then(d => d.data);
  }

  async modificarCorrelativo(value) {
    return await axios 
      .put('/correlativo/modificar',value).then(d => d.data);
  }

}
<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div v-if="this.editar.modoEditar">
          <h5>EDITAR REGISTRO DE INGRESOS</h5>
        </div>
        <div v-else>
          <h5>REGISTRO DE INGRESOS</h5>
        </div>
        <br />
        <br />
        <div class="p-fluid formgrid grid">
          <div class="field col-6">
            <label for="state">Tipo de Registro</label>
            <Dropdown id="state" v-model="ValueTipo" :options="TipoRegistro" optionLabel="Descripcion" required="true"
              placeholder="Seleccione tipo de ingreso" @change="cambioTipo()"></Dropdown>
              <!-- @date-select="cambioTipo($event)"  :locale="es"-->
          </div>
          <div class="field col-2">
            <label for="state">N° Recibo</label>
            <InputText id="input-editar" disabled="true" v-model="NroRecibo" />
          </div>
          <div class="field col-1 p-0">
            <Button id="button-editar" v-tooltip="'Editar N° recibo'" icon="pi pi-pencil" class="p-button-secondary mr-2 mt-1-8"
              @click="editarNroRecibo()" />
          </div>
          <div class="field col-3">
            <label for="state">Fecha</label>
            <Calendar dateFormat="dd/mm/yy" :showIcon="true"  :showButtonBar="true" v-model="Fecha" required="true"
              :class="{ 'p-invalid': enviar && !Fecha }" @date-select="cambioTipo()"
              @year-change="cambioTipo()" @input="cambioTipo()" />
            <small class="p-invalid text-red" v-if="enviar && !Fecha">Este campo es requerido.</small>
          </div>
          <div class="field col-12 grid" v-if="ValueTipo.Codigo == 1">
            <div class="field col-12">
              <label for="email1">Subtipo</label>
              <Dropdown id="state" v-model="ValueSubtipo" :options="SubtipoIP" required="true" optionLabel="Descripcion"
                placeholder="Seleccione subtipo del registro" :class="{ 'p-invalid': enviar && !ValueSubtipo }" />
              <small class="p-invalid text-red" v-if="enviar && !ValueSubtipo">Este campo es requerido.</small>
            </div>
            <!-- <div> -->
            
              <div class="field col-12 grid mbo-0">
                <div class="field col-12 mb-0">
                  <br />
                  <h5 class="m-0">CLASIFICADORES</h5>
                </div>
                <div class="field col-12">
                  <Button v-tooltip="'Añadir clasificador'" icon="pi pi-plus" class="p-button-success m-0"
                    @click="aniadirElemento()" />
                </div>
                <div class="field col-12 md:col-4">
                  <label for="email1">Código clasificador</label>
                </div>
                <div class="field col-12 md:col-4">
                  <label for="email1">Nombre del clasificador</label>
                </div>
                <div class="field col-12 md:col-4">
                  <label for="email1">Importe de clasif.</label>
                </div>
              </div>
              <div class="field col-12 grid" :key="i + 'neo'" v-for="(clasificador, i) of listaBoletaFormulario">
                <div class="field col-12 md:col-4">
                  <AutoComplete placeholder="Ingrese clasificador" id="dd" :dropdown="true" :multiple="false"
                    v-model="clasificador.Codigo" :suggestions="autoFilteredValue"
                    @change="cambioCodigoClasificador($event, clasificador)" @complete="BuscarCodClasificadores($event)"
                    field="CodClasificadorArea" :class="{ 'p-invalid': enviar && !clasificador.Codigo }" />
                  <small class="p-invalid text-red" v-if="enviar && !clasificador.Codigo">Este campo es
                    requerido.</small>
                </div>
                <div class="field col-12 md:col-4">
                  <AutoComplete placeholder="Ingrese clasificador" id="dd" :dropdown="false" :multiple="false"
                    v-model="clasificador.Descripcion" @change="cambioNombreClasificador($event, clasificador)"
                    :suggestions="autoFilteredValue" @complete="BuscarNombreClasificadores($event)" field="Descripcion"
                    :class="{ 'p-invalid': enviar && !clasificador.Descripcion }" />
                  <small class="p-invalid text-red" v-if="enviar && !clasificador.Descripcion">Este campo es
                    requerido.</small>
                </div>
                <div class="field col-12 md:col-3">
                  <label for="email1">{{ asignarImporteClasificador(clasificador) }}</label>
                  <label for="email1">{{ sumarImportes() }}</label>
                  <InputNumber id="price" v-model="clasificador.ImporteUnitarioClasificador" mode="currency"
                    currency="PEN" locale="es-PE"
                    :class="{ 'p-invalid': enviar && !clasificador.ImporteUnitarioClasificador }" />
                  <small class="p-invalid text-red" v-if="enviar && !clasificador.ImporteUnitarioClasificador">Este campo
                    es requerido.</small>
                </div>
                <div class="field col-12 md:col-1">
                  <Button icon="pi pi-times" v-tooltip="'Eliminar clasificador'" class="p-button-danger mr-2" @click="eliminarMedicamento(i)" />
                </div>
              </div>
              <div class="field col-12 grid">
                <div class="field col-12 md:col-4"></div>
                <div class="field col-12 md:col-4 alineacion">
                  <label for="email1">Importe total</label>
                </div>
                <div class="field col-12 md:col-3">
                  <InputNumber id="price" v-model="ImporteTotalBoleta" mode="currency" currency="PEN" disabled
                    locale="es-PE" required="true " :class="{ 'p-invalid': enviar && !ImporteTotalBoleta }" />
                  <small class="p-invalid text-red" v-if="enviar && !ImporteTotalBoleta">Este campo es
                    requerido.</small>
                </div>
              </div>
            <!-- </div> -->
            <div class="field col-12">
              <h5>GLOSA</h5>
              <br />
            </div>
            <div class="field col-12 md:col-6">
              <label for="quantity">N° de Cheque</label>
              <InputText id="quantity" v-model="NroCheque" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="quantity">Monto de Cheque</label>
              <InputNumber id="price" v-model="MontoCheque" mode="currency" currency="PEN" locale="es-PE" />
            </div>
            <div class="field col-12">
              <label>Texto adicional</label>
              <Textarea v-model="TextoGlosa" placeholder="Ingrese texto adicional en la glosa" :autoResize="true"
                rows="3" cols="30" />
            </div>
            <div class="field col-12 grid">
              <div class="field col-12 md:col-8"></div>
              <div v-if="this.editar.modoEditar" class="field col-12 md:col-4">
                <Button label="Modificar registro" class="p-button-success mt-3 mr-2 mb-2" @click="editarRegistro()" />
              </div>
              <div v-else class="field col-12 md:col-4">
                <Button label="Guardar registro" class="p-button-success mt-3 mr-2 mb-2" @click="GuardarRegistro()" />
              </div>
            </div>
          </div>
          <div class="field col-12 grid" v-if="ValueTipo.Codigo == 3">
            <div class="field col-12">
              <label for="state">Subtipo</label>
              <Dropdown id="state" v-model="ValueSubtipo" :options="SubtipoFR" required="required"
                :class="{ 'p-invalid': enviar && !ValueSubtipo }" optionLabel="Descripcion"
                placeholder="Seleccione subtipo de registro"></Dropdown>
            </div>
            <div class="field col-12 grid" :key="i + 'neo'" v-for="(clasificador, i) of listaBoletaFormulario">
              <div class="field col-12 md:col-4">
                <label for="email1">Clasificador</label>
                <AutoComplete placeholder="Ingrese clasificador" id="dd" :dropdown="true" :multiple="false"
                  v-model="clasificador.Codigo" :suggestions="autoFilteredValue"
                  @change="cambioCodigoClasificador($event, clasificador)" @complete="BuscarCodClasificadores($event)"
                  field="CodClasificadorArea" :class="{ 'p-invalid': enviar && !clasificador.Codigo }" />
                <small class="p-invalid text-red" v-if="enviar && !clasificador.Codigo">Este campo es requerido.</small>
              </div>
              <div class="field col-12 md:col-5">
                <label for="email1">Nombre del clasificador</label>
                <AutoComplete placeholder="Ingrese clasificador" id="dd" :dropdown="false" :multiple="false"
                  v-model="clasificador.Descripcion" @change="cambioNombreClasificador($event, clasificador)"
                  :suggestions="autoFilteredValue" @complete="BuscarNombreClasificadores($event)" field="Descripcion"
                  :class="{ 'p-invalid': enviar && !clasificador.Descripcion }" />
                <small class="p-invalid text-red" v-if="enviar && !clasificador.Descripcion">Este campo es
                  requerido.</small>
              </div>
              <div class="field col-12 md:col-3">
                <label for="email1">Importe de clasif.</label>
                <label for="email1">{{ asignarImporteClasificador(clasificador) }}</label>
                <label for="email1">{{ sumarImportes() }}</label>
                <InputNumber id="price" v-model="clasificador.ImporteUnitarioClasificador" mode="currency" currency="PEN"
                  locale="es-PE" :class="{ 'p-invalid': enviar && !clasificador.ImporteUnitarioClasificador }" />
                <small class="p-invalid text-red" v-if="enviar && !clasificador.ImporteUnitarioClasificador">Este campo
                  es requerido.</small>
              </div>
              <!-- <div class="field col-12 md:col-1">
							<Button icon="pi pi-times" class="p-button-danger mr-2 mt-1-8" @click="eliminarMedicamento($event,i)" />
						</div> -->
            </div>
            <div class="field col-12 grid">
              <div class="field col-12 md:col-2">
                <label for="state">IGV</label>
                <InputText id="quantity" v-model="Igv" :class="{ 'p-invalid': enviar && !Igv }" />
                <small class="p-invalid text-red" v-if="enviar && !Igv">Este campo es requerido.</small>
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Monto IGV</label>
                <label for="email1">{{ calcularMontoIgv() }}</label>
                <InputNumber id="price" v-model="MontoIgv" mode="currency" currency="PEN" disabled locale="es-PE"
                  :class="{ 'p-invalid': enviar && !MontoIgv }" />
                <small class="p-invalid text-red" v-if="enviar && !MontoIgv">Este campo es requerido.</small>
              </div>
              <div class="field col-12 md:col-4 alineacion">
                <label for="email1">Importe total</label>
              </div>
              <div class="field col-12 md:col-3">
                <InputNumber id="price" v-model="ImporteTotalBoleta" mode="currency" currency="PEN" disabled
                  locale="es-PE" :class="{ 'p-invalid': enviar && !ImporteTotalBoleta }" />
                <small class="p-invalid text-red" v-if="enviar && !ImporteTotalBoleta">Este campo es requerido.</small>
              </div>
            </div>
            <div class="field col-12" v-if="ValueSubtipo">
              <h5>GLOSA</h5>
            </div>
            <div class="field col-12 grid" v-if="ValueSubtipo.Codigo == 1">
              <div class="field col-12">
                <label for="state">VENTA DE MEDICAMENTOS AL CONTADO</label>
              </div>
              <div class="field col-12 md:col-6">
                <label for="state">N° voucher</label>
                <InputText id="quantity" v-model="NroVoucher" />
              </div>
              <div class="field col-12 md:col-6">
                <label for="state">Monto voucher</label>
                <InputNumber id="price" v-model="MontoVoucher" mode="currency" currency="PEN" locale="es-PE" />
              </div>
              <!-- <div class="field col-12 md:col-6">
                <label for="state">Nombre de Banco</label>
                <InputText id="quantity" v-model="NombreBanco" />
              </div> -->
              <div class="field col-12">
                <label for="state">DEPOSITO EN EFECTIVO BANCO DE LA NACIÓN
                  <br/>FARMACIA HOSPITAL ARZOBISPO LOAYZA</label>
              </div>
              <div class="field col-12 md:col-8"></div>
              <div v-if="this.editar.modoEditar" class="field col-12 md:col-4">
                <Button label="Modificar registro" class="p-button-success mt-3 mr-2 mb-2" @click="editarRegistro()" />
              </div>
              <div v-else class="field col-12 md:col-4">
                <Button label="Guardar registro" class="p-button-success mt-3 mr-2 mb-2" @click="GuardarRegistro()" />
              </div>
            </div>
            <div class="field col-12 grid" v-if="ValueSubtipo.Codigo == 2">
              <div class="field col-12 md:col-6">
                <label for="state">Nombre de empresa</label>
                <InputText id="quantity" v-model="NombreEmpresa" />
              </div>
              <div class="field col-12 md:col-6">
                <label for="state">Nota de Informativa</label>
                <InputText id="quantity" v-model="NotaInformativa" />
              </div>
              <div class="field col-12 md:col-4">
                <label for="state">Nombre de Factura</label>
                <InputText id="quantity" v-model="NombreFactura" />
              </div>
              <div class="field col-12 md:col-4">
                <label for="state">Fecha</label>
                <Calendar dateFormat="dd/mm/yy" :showIcon="true" :showButtonBar="true" v-model="FechaGlosa"></Calendar>
              </div>
              <div class="field col-12 md:col-4">
                <label for="state">Importe de deposito</label>
                <InputNumber id="price" v-model="ImporteDeposito" mode="currency" currency="PEN" locale="es-PE" />
              </div>
              <div class="field col-12 md:col-6">
                <label for="state">Importe de ingresos propios</label>
                <InputNumber id="price" v-model="ImporteTotalTipoIP" mode="currency" currency="PEN" locale="es-PE" />
              </div>
              <div class="field col-12 md:col-6">
                <label for="state">Importe de Fondos Rotatorios</label>
                <InputNumber id="price" v-model="ImporteTotalTipoFR" mode="currency" currency="PEN" locale="es-PE" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">N° Voucher</label>
                <InputText id="quantity" v-model="NroVoucher" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Monto Voucher</label>
                <InputNumber id="price" v-model="MontoVoucher" mode="currency" currency="PEN" locale="es-PE" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">N° Cheque</label>
                <InputText id="quantity" v-model="NroCheque" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Monto cheque</label>
                <InputNumber id="price" v-model="MontoCheque" mode="currency" currency="PEN" locale="es-PE" />
              </div>
              <div class="field col-12">
                <label for="state">Nombre de Banco</label>
                <InputText id="quantity" v-model="NombreBanco" />
                <label for="state">FARMACIA HOSPITAL ARZOBISPO LOAYZA</label>
              </div>
              <div class="field col-12 md:col-8"></div>
              <div v-if="this.editar.modoEditar" class="field col-12 md:col-4">
                <Button label="Modificar registro" class="p-button-success mt-3 mr-2 mb-2" @click="editarRegistro()" />
              </div>
              <div v-else class="field col-12 md:col-4">
                <Button label="Guardar registro" class="p-button-success mt-3 mr-2 mb-2" @click="GuardarRegistro()" />
              </div>
            </div>
            <div class="field col-12 grid" v-if="ValueSubtipo.Codigo == 3">
              <div class="field col-12 md:col-6">
                <label for="state">Nombre de empresa</label>
                <InputText id="quantity" v-model="NombreEmpresa" />
              </div>
              <div class="field col-12 md:col-6">
                <label for="state">Nota de Informativa</label>
                <InputText id="quantity" v-model="NotaInformativa" />
              </div>
              <div class="field col-12 md:col-5">
                <label for="state">Nombre de Factura</label>
                <InputText id="quantity" v-model="NombreFactura" />
              </div>
              <div class="field col-12 md:col-4">
                <label for="state">Fecha</label>
                <Calendar dateFormat="dd/mm/yy" :showIcon="true" :showButtonBar="true" v-model="FechaGlosa"></Calendar>
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Importe de deposito</label>
                <InputNumber id="price" v-model="ImporteDeposito" mode="currency" currency="PEN" locale="es-PE" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Importe de ingresos propios</label>
                <InputNumber id="price" v-model="ImporteTotalTipoIP" mode="currency" currency="PEN" locale="es-PE" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Importe de Fondos Rotatorios</label>
                <InputNumber id="price" v-model="ImporteTotalTipoFR" mode="currency" currency="PEN" locale="es-PE" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">N° Nota de Abono</label>
                <InputText id="quantity" v-model="NroNotaAbono" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Monto de Nota de Abono</label>
                <InputNumber id="price" v-model="MontoNotaAbono" mode="currency" currency="PEN" locale="es-PE" />
              </div>
              <div class="field col-12">
                <label for="state">FARMACIA HOSPITAL ARZOBISPO LOAYZA</label>
              </div>
              <div class="field col-12 md:col-8"></div>
              <div v-if="this.editar.modoEditar" class="field col-12 md:col-4">
                <Button label="Modificar registro" class="p-button-success mt-3 mr-2 mb-2" @click="editarRegistro()" />
              </div>
              <div v-else class="field col-12 md:col-4">
                <Button label="Guardar registro" class="p-button-success mt-3 mr-2 mb-2" @click="GuardarRegistro()" />
              </div>
            </div>
            <div class="field col-12 grid" v-if="ValueSubtipo.Codigo == 4">
              <div class="field col-12">
                <label for="state">Texto adicional</label>
                <Textarea v-model="TextoGlosa" placeholder="Ingrese texto adicional para la glosa" :autoResize="true"
                  rows="3" cols="30" />
                <label for="state">FARMACIA HOSPITAL ARZOBISPO LOAYZA</label>
              </div>
              <div class="field col-12 md:col-8"></div>
              <div v-if="this.editar.modoEditar" class="field col-12 md:col-4">
                <Button label="Modificar registro" class="p-button-success mt-3 mr-2 mb-2" @click="editarRegistro()" />
              </div>
              <div v-else class="field col-12 md:col-4">
                <Button label="Guardar registro" class="p-button-success mt-3 mr-2 mb-2" @click="GuardarRegistro()" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog v-model:visible="ingresoDialog" :style="{ width: '450px' }" header="Guardado" :modal="true"
        class="p-fluid" :closable="false">
        <div class="formgrid grid">
          <div class="field col">
            <label for="price">Se guardo el registro correctamente</label>
          </div>
        </div>
        <template #footer>
          <Button label="Imprimir" icon="pi pi-fw pi-file" class="p-button-text" @click="exportMatricial" />
          <Button label="Aceptar" icon="pi pi-fw pi-check" class="p-button-text" @click="closeDialog" />
        </template>
      </Dialog>
      <Dialog v-model:visible="editarDialog" :style="{ width: '450px' }" header="Modificado" :modal="true"
        class="p-fluid" :closable="false">
        <div class="formgrid grid">
          <div class="field col">
            <label for="price">Se modifico el registro correctamente</label>
          </div>
        </div>
        <template #footer>
          <Button label="Aceptar" icon="pi pi-fw pi-check" class="p-button-text" @click="closeDialog" />
        </template>
      </Dialog>
      <Dialog v-model:visible="dialogIncompleto" :style="{ width: '450px' }" header="Datos Incompletos" :modal="true"
        class="p-fluid">
        <div class="formgrid grid">
          <label for="price">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Faltan completar algunos datos.
            <br /><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Verifique el registro y vuelva a intentarlo.
          </label>
        </div>
        <template #footer>
          <Button label="Aceptar" icon="pi pi-fw pi-check" class="p-button-text" @click="dialogIncompleto = false" />
        </template>
      </Dialog>
      <Dialog v-model:visible="mensajeDialog" :style="{width: '450px'}" header="Mensaje" :modal="true">
					<div class="align-items-center justify-content-center" :style="{padding: '0 40px'}">
            <p>{{ message }}</p>
					</div>
					<template #footer>
						<Button label="Aceptar" icon="pi pi-check" class="p-button-rounded p-button-success" @click="cerrarMessageDialog()" />
					</template>
				</Dialog>
        <Dialog v-model:visible="confirmaEliminacionDialog" :style="{width: '450px'}" header="Confirmación" :modal="true">
					<div class="align-items-center justify-content-center" :style="{padding: '0 40px'}">
            <p>¿Está seguro de eliminar el clasisificador definitivamente del registro?</p>
					</div>
					<template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-rounded p-button-danger" @click="this.confirmaEliminacionDialog=false" />
						<Button label="Aceptar" icon="pi pi-check" class="p-button-rounded p-button-success" @click="eliminarClasifDefinit(clasif)" />
					</template>
				</Dialog>
    </div>
  </div>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import axios from "axios";
export default {
  props:
  {
    title: String,
    editar: String,
    actualizar: Function,
    cerrarDialog: Function,
    valorTipo: String
  },
  //["title", "editar"],
  data() {
    return {
      message: null,
      mensajeDialog:false,
      URLTipos: "http://http://192.168.36.121:8081/api/Parametros/Tipos",
      URLSubtiposIP: "http://192.168.36.121:8081/api/Parametros/SubtiposIP",
      URLSubtiposFR: "http://192.168.36.121:8081/api/Parametros/SubtiposFR",
      URLClasificadores: "http://192.168.36.121:8081/api/Parametros/Clasificadores",
      URLRegistros: "http://192.168.36.121:8081/api/registros/",
      URLCorrelativo: "http://192.168.36.121:8081/api/correlativo/consulta",
      URLCorrelativoPut: "http://192.168.36.121:8081/api/correlativo/modificar",
      TipoRegistro: null,
      SubtipoIP: null,
      SubtipoFR: null,
      Correlativo: [],
      ListaRegistros: [],
      listaBoletaJson: [],
      listaBoletaConvertida: [],
      listaBoletaFormulario: [
        {
          Codigo: '',
          Descripcion: '',
          ImporteUnitarioClasificador: null,
        }
      ],
      ListaClasificadores: null,
      ValueTipo: {
        Codigo: null,
        Descripcion: null,
        IdParametro: null
      },
      ValueSubtipo: "",
      NroRecibo: null,
      Fecha: new Date(),
      ImporteTotalBoleta: null,
      Igv: null,
      MontoIgv: null,
      NombreEmpresa: null,
      NotaInformativa: null,
      NombreFactura: null,
      FechaGlosa: null,
      ImporteDeposito: null,
      ImporteTotalTipoIP: null,
      ImporteTotalTipoFR: null,
      NroVoucher: null,
      MontoVoucher: null,
      NroCheque: null,
      MontoCheque: null,
      NroNotaAbono: null,
      MontoNotaAbono: null,
      NombreBanco: null,
      TextoGlosa: null,
      UsuarioCreacion: null,
      FechaCreacion: new Date(),
      UsuarioModificacion: null,
      FechaModificacion: null,
      Anulado: false,
      //
      IdRegistro: '',
      IdParametro: null,
      ImporteUnitarioClasificador: null,
      //
      DescripcionClasificador: null,
      ingresoDialog: false,
      ValueCorrelativo: null,
      enviar: false,
      autoFilteredValue: [],
      disabled: true,
      editarDialog: false,
      listaOpcional2: [],
      dialogIncompleto: false,
      FechaGlosaImp: null,
      dia: null,
      mes: null,
      anio: null,
      noGuardar: false,
      confirmaEliminacionDialog: false,
      clasif: null,
      id: null,
    };
  },
  methods: {
    cerrarMessageDialog(){
      this.mensajeDialog = false;
      this.confirmaEliminacionDialog = false;
    },
    async eliminarClasifDefinit(value){
      await axios
        .delete(this.URLRegistros+value.IdBoleta)
        .then(async(res)=>{
          this.listaBoletaFormulario.splice(this.id, 1);
          await this.actualizar.obtenerRegistros();
          const modifImporte ={
            IdRegistro: this.title.registro.IdRegistro,
            ImporteTotalBoleta: this.ImporteTotalBoleta
          }
          await axios
          .put(this.URLRegistros+'importetotal',modifImporte)
          .then(async(resp)=>{
            await this.actualizar.obtenerRegistros();
            this.message = res.data+resp.data;
            this.mensajeDialog = true;
          })
          .catch(error=>{
            this.message = error + ". Ha ocurrido un error, actualice la pág por favor.";
            this.mensajeDialog = true;
          })
        })
        .catch(error=>{
          this.message = error+ ". Ha ocurrido un error, actualice la pág por favor.";
          this.mensajeDialog = true;
        })
    },
    calcularMontoIgv() {
      if (this.ImporteTotalBoleta != 0 && this.Igv != undefined) {
        this.MontoIgv = (this.ImporteTotalBoleta * this.Igv / 100).toFixed(2);
        this.MontoIgv = this.MontoIgv.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
      }
    },
    eliminarMedicamento(i) {
      if (this.listaBoletaFormulario.length > 1) {
        if(this.listaBoletaFormulario[i].IdBoleta){
        this.confirmaEliminacionDialog=true;
        this.id=i;
        this.clasif= this.listaBoletaFormulario[i];
        }
        else{
          this.listaBoletaFormulario.splice(i, 1);
        }
      }
      else {
        alert("No puede eliminar cuando solo hay un clasificador")
      }
    },
    sumarImportes() {
      this.ImporteTotalBoleta = null;
      if (this.ImporteUnitarioClasificador != 0) {
        this.listaBoletaFormulario.forEach(element => {
          this.ImporteTotalBoleta += element.ImporteUnitarioClasificador;
        });
      }
    },
    aniadirElemento() {
      const clasificador = {
        Codigo: '',
        Descripcion: '',
        ImporteUnitarioClasificador: null
      }
      this.listaBoletaFormulario.push(clasificador)
    },
    asignarImporteClasificador(clasificador) {
      this.ImporteUnitarioClasificador = clasificador.ImporteUnitarioClasificador
    },
    cambioNombreClasificador(event, clasificador) {
      if (event.value.Descripcion) {
        clasificador.Codigo = event.value.CodClasificadorArea;
        this.IdParametro = clasificador.Descripcion.IdParametro;
      }
    },
    cambioCodigoClasificador(event, clasificador) {
      if (event.value.CodClasificadorArea) {
        clasificador.Descripcion = event.value.Descripcion;
        this.IdParametro = clasificador.Codigo.IdParametro;
      }
    },
    obtenerSubtiposIP() {
      const axiosInstance = axios.create({
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
      axiosInstance
        .get(this.URLSubtiposIP)
        .then((res) => {
          this.SubtipoIP = res.data;
        })
    },
    obtenerSubtiposFR() {
      const axiosInstance = axios.create({
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
      axiosInstance
        .get(this.URLSubtiposFR)
        .then((res) => {
          this.SubtipoFR = res.data;
        })
    },
    obtenerClasificadores() {
      const axiosInstance = axios.create({
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
      axiosInstance
        .get(this.URLClasificadores)
        .then((res) => {
          this.ListaClasificadores = res.data;
          // this.DescripcionClasificador = this.ListaClasificadores.map(element => {
          //   let DescripcionC = {
          //     value: element,
          //     label: element.Descripcion,
          //   }
          //   return DescripcionC
          // });
          // console.log(this.DescripcionClasificador)
        })
    },
    async obtenerCorrelativo(value,anioFecha) {
      const axiosInstance = axios.create({
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
      const valor = {
        IdParametro: value,
        Ano: anioFecha
      }
      await axiosInstance
        .post(this.URLCorrelativo,valor)
        .then((res) => {
          this.Correlativo = res.data;
          this.NroRecibo = this.Correlativo
        })
        .catch(error => {
          console.log(error)
        })
    },
    async obtenerRegistros() {
      const axiosInstance = axios.create({
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
      await axiosInstance
        .get(this.URLRegistros)
        .then((res) => {
          this.ListaRegistros = res.data;
        })
    },
    async GuardarRegistro() {
      this.enviar = true;
      if(this.Fecha){
        var anioFecha = this.Fecha.getFullYear()
        let fechaMod = this.Fecha.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      this.dia = fechaMod.slice(0,2);
      this.mes = fechaMod.slice(3,5);
      this.anio = anioFecha;
      }
      if(this.FechaGlosa){
        this.FechaGlosaImp = this.FechaGlosa.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      }
      this.listaBoletaJson= [];
      if (this.ValueTipo.Codigo == 1) {
        if (!this.NroRecibo || !this.Fecha || !this.ValueSubtipo || !this.ImporteTotalBoleta ) {
          this.dialogIncompleto = true;
        }
        else {
          for (let i = 0; i < this.listaBoletaFormulario.length; i++) {
            if (this.listaBoletaFormulario[i].Codigo.IdParametro) {
              let clasif = {
                IdParametro: this.listaBoletaFormulario[i].Codigo.IdParametro,
                ImporteUnitarioClasificador: this.listaBoletaFormulario[i].ImporteUnitarioClasificador
              }
              if (!this.listaBoletaFormulario[i].ImporteUnitarioClasificador || !this.listaBoletaFormulario[i].Codigo.IdParametro) {
                this.dialogIncompleto = true;
                break
              }
              else {
                  this.listaBoletaJson.push(clasif);
              }
            }
            else if (this.listaBoletaFormulario[i].Descripcion.IdParametro) {
              let clasif = {
                IdParametro: this.listaBoletaFormulario[i].Descripcion.IdParametro,
                ImporteUnitarioClasificador: this.listaBoletaFormulario[i].ImporteUnitarioClasificador
              }
              if (!this.listaBoletaFormulario[i].ImporteUnitarioClasificador || !this.listaBoletaFormulario[i].Descripcion.IdParametro) {
                this.dialogIncompleto = true;
                break
              }
              else{
                this.listaBoletaJson.push(clasif);
              }
            }
            else{
              this.dialogIncompleto = true;
              break
            }
          }
          if(!this.dialogIncompleto){
              const NroReciboAnterior = this.NroRecibo
          await this.obtenerCorrelativo(1,anioFecha)
          if(NroReciboAnterior!=this.NroRecibo){
            alert("El N° de recibo "+NroReciboAnterior+" ya existe, se cambio por el N° "+this.NroRecibo)
          }
          const registro = {
            IdParametroTipo: this.ValueTipo.IdParametro,
            IdParametroSubtipo: this.ValueSubtipo.IdParametro,
            NroRecibo: this.NroRecibo,
            Fecha: this.Fecha,
            ImporteTotalBoleta: this.ImporteTotalBoleta,
            Igv: this.Igv,
            MontoIgv: this.MontoIgv,
            NombreEmpresa: this.NombreEmpresa,
            NotaInformativa: this.NotaInformativa,
            NombreFactura: this.NombreFactura,
            FechaGlosa: this.FechaGlosa,
            ImporteDeposito: this.ImporteDeposito,
            ImporteTotalTipoIP: this.ImporteTotalTipoIP,
            ImporteTotalTipoFR: this.ImporteTotalTipoFR,
            NroVoucher: this.NroVoucher,
            MontoVoucher: this.MontoVoucher,
            NroCheque: this.NroCheque,
            MontoCheque: this.MontoCheque,
            NroNotaAbono: this.NroNotaAbono,
            MontoNotaAbono: this.MontoNotaAbono,
            NombreBanco: this.NombreBanco,
            TextoGlosa: this.TextoGlosa,
            UsuarioCreacion: this.UsuarioCreacion,
            FechaCreacion: this.FechaCreacion,
            UsuarioModificacion: this.UsuarioModificacion,
            FechaModificacion: this.FechaModificacion,
            listBoletas: this.listaBoletaJson,
          };
          const axiosInstance = axios.create({
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          });
          await axiosInstance
            .post(this.URLRegistros, registro)
            .then(async() => {
              this.ingresoDialog = true;
              await this.actualizar.obtenerRegistros();
              const valor = {
                IdParametro: 1,
                Ano: anioFecha
              }
              axios.put(this.URLCorrelativoPut, valor)
                .then(() => {
                })
                .catch(error => {
                  console.log(error.response.data);
                })
            })
            .catch(err => {
              console.error(err);
            })
          }
        }
      }
      else if (this.ValueTipo.Codigo == 3) {
        if (!this.NroRecibo || !this.Fecha || !this.ValueSubtipo || !this.ImporteTotalBoleta || !this.MontoIgv || !this.Igv) {
          this.dialogIncompleto = true;
        }
        else {
          for (let i = 0; i < this.listaBoletaFormulario.length; i++) {
            if (this.listaBoletaFormulario[i].Codigo.IdParametro) {
              let clasif = {
                IdParametro: this.listaBoletaFormulario[i].Codigo.IdParametro,
                ImporteUnitarioClasificador: this.listaBoletaFormulario[i].ImporteUnitarioClasificador
              }
              if (!this.listaBoletaFormulario[i].ImporteUnitarioClasificador || !this.listaBoletaFormulario[i].Codigo.IdParametro) {
                this.dialogIncompleto = true;
                break
              }
              else{
                this.listaBoletaJson.push(clasif);
              }
            }
            else if (this.listaBoletaFormulario[i].Descripcion.IdParametro) {
              let clasif = {
                IdParametro: this.listaBoletaFormulario[i].Descripcion.IdParametro,
                ImporteUnitarioClasificador: this.listaBoletaFormulario[i].ImporteUnitarioClasificador
              }
              if (!this.listaBoletaFormulario[i].ImporteUnitarioClasificador || !this.listaBoletaFormulario[i].Descripcion.IdParametro) {
                this.dialogIncompleto = true;
                break
              }
              else{
                this.listaBoletaJson.push(clasif);
              }
            }
            else{
              this.dialogIncompleto = true;
              break
            }
          }
          if(!this.dialogIncompleto){
              const NReciboAnterior = this.NroRecibo
          await this.obtenerCorrelativo(2,anioFecha)
          if(NReciboAnterior!=this.NroRecibo){
            alert("El N° de recibo "+NReciboAnterior+" ya existe, se cambio por el N° "+this.NroRecibo)
          }
          const registro = {
            IdParametroTipo: this.ValueTipo.IdParametro,
            IdParametroSubtipo: this.ValueSubtipo.IdParametro,
            NroRecibo: this.NroRecibo,
            Fecha: this.Fecha,
            ImporteTotalBoleta: this.ImporteTotalBoleta,
            Igv: this.Igv,
            MontoIgv: this.MontoIgv,
            NombreEmpresa: this.NombreEmpresa,
            NotaInformativa: this.NotaInformativa,
            NombreFactura: this.NombreFactura,
            FechaGlosa: this.FechaGlosa,
            ImporteDeposito: this.ImporteDeposito,
            ImporteTotalTipoIP: this.ImporteTotalTipoIP,
            ImporteTotalTipoFR: this.ImporteTotalTipoFR,
            NroVoucher: this.NroVoucher,
            MontoVoucher: this.MontoVoucher,
            NroCheque: this.NroCheque,
            MontoCheque: this.MontoCheque,
            NroNotaAbono: this.NroNotaAbono,
            MontoNotaAbono: this.MontoNotaAbono,
            NombreBanco: this.NombreBanco,
            TextoGlosa: this.TextoGlosa,
            UsuarioCreacion: this.UsuarioCreacion,
            FechaCreacion: this.FechaCreacion,
            UsuarioModificacion: this.UsuarioModificacion,
            FechaModificacion: this.FechaModificacion,
            listBoletas: this.listaBoletaJson,
          };
          const axiosInstance = axios.create({
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          });
          await axiosInstance
            .post(this.URLRegistros, registro)
            .then(() => {
              this.ingresoDialog = true;
              this.actualizar.obtenerRegistros();
                const valor = {
                  IdParametro: 2,
                  Ano: anioFecha
                }
                axios.put(this.URLCorrelativoPut, valor)
                  .then(() => {
                  })
                  .catch(error => {
                    console.log(error);
                  })
              })
              .catch(err => {
                console.error(err);
              })
            .catch(err => {
              console.error(err);
            })
          }
        }
      }
    },
    async cambioTipo() {
      // console.log(this.ValueTipo.Codigo)
      this.editar.modoEditar
      if(!this.editar.modoEditar){
        if (this.ValueTipo.Codigo == 1&&this.Fecha) {
          let anioFecha = this.Fecha.getFullYear()
          // le paso el (1,...) porque es idparametro = 1
          await this.obtenerCorrelativo(1,anioFecha)
        }
        else if (this.ValueTipo.Codigo == 3&&this.Fecha) {
          let anioFecha = this.Fecha.getFullYear()
          //le paso el (2,...) porque es idparametro = 2
          await this.obtenerCorrelativo(2,anioFecha)
        }
      }
    },
    BuscarCodClasificadores(event) {
      if (!event.query.trim().length) {
        this.autoFilteredValue = [...this.ListaClasificadores];
      }
      else {
        this.autoFilteredValue = this.ListaClasificadores.filter((clasificador) => {
          return clasificador.CodClasificadorArea.toString().toLowerCase().startsWith(event.query.toLowerCase())
        })
      }
    },
    BuscarNombreClasificadores(event) {
      if (!event.query.trim().length) {
        this.autoFilteredValue = [...this.ListaClasificadores];
      } else {
        this.autoFilteredValue = this.ListaClasificadores.filter((clasificador) => {
          return clasificador.Descripcion.toLowerCase().startsWith(event.query.toLowerCase())
        })
      }
    },
    async editarRegistro() {
      this.enviar = true;
      this.listaOpcional2= [];
      for (let i = 0; i < this.listaBoletaFormulario.length; i++) {
        if(this.listaBoletaFormulario[i].IdBoleta){
          if (this.listaBoletaFormulario[i].Codigo.IdParametro) {
            const elem = {
              IdBoleta: this.listaBoletaFormulario[i].IdBoleta,
              IdParametro: this.listaBoletaFormulario[i].Codigo.IdParametro,
              ImporteUnitarioClasificador: this.listaBoletaFormulario[i].ImporteUnitarioClasificador
            }
            if (!this.listaBoletaFormulario[i].ImporteUnitarioClasificador || !this.listaBoletaFormulario[i].Codigo.CodClasificadorArea || !this.listaBoletaFormulario[i].Descripcion) {
                this.dialogIncompleto = true;
                console.log("1")
                break
              }
              else {
                  this.listaOpcional2.push(elem)
              }
          }
          else if (!this.listaBoletaFormulario[i].Codigo.IdParametro) {
            const elem = {
              IdBoleta: this.listaBoletaFormulario[i].IdBoleta,
              IdParametro: this.listaBoletaFormulario[i].IdParametro,
              ImporteUnitarioClasificador: this.listaBoletaFormulario[i].ImporteUnitarioClasificador
            }
            if (!this.listaBoletaFormulario[i].ImporteUnitarioClasificador || !this.listaBoletaFormulario[i].Descripcion || !this.listaBoletaFormulario[i].Codigo.CodClasificadorArea) {
              this.dialogIncompleto = true;
              console.log("1.1")
              break
            }
            else {
              this.listaOpcional2.push(elem)
            }
          }
          else if (this.listaBoletaFormulario[i].Descripcion.IdParametro){
            const elem = {
              IdBoleta: this.listaBoletaFormulario[i].IdBoleta,
              IdParametro: this.listaBoletaFormulario[i].Descripcion.IdParametro,
              ImporteUnitarioClasificador: this.listaBoletaFormulario[i].ImporteUnitarioClasificador
            }
            if (!this.listaBoletaFormulario[i].ImporteUnitarioClasificador || !this.listaBoletaFormulario[i].Descripcion.CodClasificadorArea || !!this.listaBoletaFormulario[i].Descripcion) {
                this.dialogIncompleto = true;
                console.log("2.2")
                break
              }
              else{
                this.listaOpcional2.push(elem)
              }
          }
          else if (!this.listaBoletaFormulario[i].Descripcion.IdParametro){
            const elem = {
              IdBoleta: this.listaBoletaFormulario[i].IdBoleta,
              IdParametro: this.listaBoletaFormulario[i].IdParametro,
              ImporteUnitarioClasificador: this.listaBoletaFormulario[i].ImporteUnitarioClasificador
            }
            if (!this.listaBoletaFormulario[i].ImporteUnitarioClasificador || !this.listaBoletaFormulario[i].Descripcion || !this.listaBoletaFormulario[i].Descripcion.CodClasificadorArea) {
              this.dialogIncompleto = true;
              console.log("2")
              break
            }
            else{
              this.listaOpcional2.push(elem)
            }
          }
          else{
            this.dialogIncompleto = true;
            console.log("3")
            break
          }
        }
        else{
          if (this.listaBoletaFormulario[i].Codigo.IdParametro) {
            let clasif = {
              IdBoleta: 0,
              IdParametro: this.listaBoletaFormulario[i].Codigo.IdParametro,
              ImporteUnitarioClasificador: this.listaBoletaFormulario[i].ImporteUnitarioClasificador
            }
            if (!this.listaBoletaFormulario[i].ImporteUnitarioClasificador || !this.listaBoletaFormulario[i].Codigo.IdParametro) {
              this.dialogIncompleto = true;
              break
            }
            else {
              this.listaOpcional2.push(clasif);
            }
          }
          else if (this.listaBoletaFormulario[i].Descripcion.IdParametro) {
            let clasif = {
              IdBoleta: 0,
              IdParametro: this.listaBoletaFormulario[i].Descripcion.IdParametro,
              ImporteUnitarioClasificador: this.listaBoletaFormulario[i].ImporteUnitarioClasificador
            }
            if (!this.listaBoletaFormulario[i].ImporteUnitarioClasificador || !this.listaBoletaFormulario[i].Descripcion.IdParametro) {
              this.dialogIncompleto = true;
              break
            }
            else{
              this.listaOpcional2.push(clasif);
            }
          }
          else{
            this.dialogIncompleto = true;
            break
          }
        }
      }
      const registro = {
        IdRegistro: this.title.registro.IdRegistro,
        IdParametroTipo: this.ValueTipo.IdParametro,
        IdParametroSubtipo: this.ValueSubtipo.IdParametro,
        NroRecibo: this.NroRecibo,
        Fecha: this.Fecha,
        ImporteTotalBoleta: this.ImporteTotalBoleta,
        Igv: this.Igv,
        MontoIgv: this.MontoIgv,
        NombreEmpresa: this.NombreEmpresa,
        NotaInformativa: this.NotaInformativa,
        NombreFactura: this.NombreFactura,
        FechaGlosa: this.FechaGlosa,
        ImporteDeposito: this.ImporteDeposito,
        ImporteTotalTipoIP: this.ImporteTotalTipoIP,
        ImporteTotalTipoFR: this.ImporteTotalTipoFR,
        NroVoucher: this.NroVoucher,
        MontoVoucher: this.MontoVoucher,
        NroCheque: this.NroCheque,
        MontoCheque: this.MontoCheque,
        NroNotaAbono: this.NroNotaAbono,
        MontoNotaAbono: this.MontoNotaAbono,
        NombreBanco: this.NombreBanco,
        TextoGlosa: this.TextoGlosa,
        UsuarioCreacion: this.UsuarioCreacion,
        FechaCreacion: this.FechaCreacion,
        UsuarioModificacion: this.UsuarioModificacion,
        FechaModificacion: this.FechaModificacion,
        Anulado: this.Anulado,
        listBoletas: this.listaOpcional2
      }

      const axiosInstance = axios.create({
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
      await axiosInstance
        .put(this.URLRegistros, registro)
        .then(() => {
          // this.message= res.data;
          // this.mensajeDialog = true,
          this.actualizar.obtenerRegistros();
          this.editarDialog = true
        })
        .catch((error) => {
          this.message= error + ". Ha ocurrido un error, actualice la pág por favor.";
          this.mensajeDialog = true;
        })
    },
    editarNroRecibo() {
      this.disabled = !this.disabled;
      document.getElementById("input-editar").disabled = this.disabled;
      if (this.disabled == false) {
        document.getElementById("button-editar").classList.remove("p-button-secondary");
        document.getElementById("button-editar").classList.add("p-button-warning")
      }
      else {
        document.getElementById("button-editar").classList.remove("p-button-warning")
        document.getElementById("button-editar").classList.add("p-button-secondary");
      }
    },
    SaveIngreso() {
      this.ingresoDialog = true;
    },
    closeDialog() {
      this.ingresoDialog = false;
      this.editarDialog = false;
      this.cerrarDialog.cerrarRegistro();
    },
    exportMatricial() {
      if (this.ValueTipo.IdParametro == 1) {
        this.exportMatricialIP();
      }
      if (this.ValueTipo.IdParametro == 2) {
        if (this.ValueSubtipo.IdParametro == 11) {
          this.exportMatricialFR1();
        }
        if (this.ValueSubtipo.IdParametro == 12) {
          this.exportMatricialFR2();
        }
        if (this.ValueSubtipo.IdParametro == 13) {
          this.exportMatricialFR3();
        }
        if (this.ValueSubtipo.IdParametro == 14) {
          this.exportMatricialFR4();
        }
      }
    },
    exportMatricialIP() {
      const listCodClasif = [];
      const listDescripClasif = [];
      const listImpUniClasif = [];
      this.listaBoletaFormulario.map((clasif)=>{
        listCodClasif.push(clasif.Codigo.CodClasificadorExterno)
        listDescripClasif.push(clasif.Codigo.Descripcion)
        listImpUniClasif.push(clasif.ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}))
      })
      if (this.NroCheque && this.TextoGlosa) {
        let docDefinition = {
          pageSize: {
            width: 630,
            height: 800
          },
          defaultStyle: {
            fontSize: 10,
            bold: true
          },
          pageMargins: [ 11, 13, 10, 1 ],
          info: {
            title: this.ValueTipo.Descripcion + "-N°" + this.NroRecibo,
          },
          content: [
            {
              text: "\n\n\n\n\n\n"
            },
            {
              columns: [
                {
                  width: 126,
                  text: " "
                },
                {
                  width: 323,
                  text: this.ValueTipo.Descripcion,
                  alignment: "center",
                },
                {
                  columns:[
                    { 
                      width: 43,
                      fontSize: 9,
                      text: this.NroRecibo, alignment: "center"
                    },
                    { 
                      width: 30,
                      fontSize: 9,
                      text: this.dia, alignment: "center"
                    },
                    { 
                      width: 26,
                      fontSize: 9,
                      text: this.mes, alignment: "center"
                    },
                    { 
                      width: 27,
                      fontSize: 9,
                      text: this.anio, alignment: "center"
                    }
                  ]
                },
              ]
            },
            { text: "\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 465,
                  text: " "
                },
                {
                  width: 80,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                }
              ],
            },
            { text: "\n" },
            {
              columns: [
              {
                  width: 80,
                  text: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
                },
                {
                  width: 60,
                  alignment: "right",
                  type: "none",
                  ol: [listCodClasif]
                },
                {
                  width: 265,
                  type: "none",
                  ol: [listDescripClasif]
                },
                {
                  width: 60,
                  alignment: "right",
                  type: "none",
                  ol: [listImpUniClasif]
                },
                {
                  width: 80,
                  text: " "
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  columns: [
                    {
                      width: 80,
                      text: "CHEQUE N°"+this.NroCheque
                    },
                    {
                      width: 65,
                      text: "MONTO",
                      alignment: "center"
                    },
                    {
                      width: 13,
                      text: "S/."
                    },
                    {
                      width: 45,
                      text: this.MontoCheque.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                      alignment: "right"
                    },
                    {
                      width: "*",
                      text: " "
                    }
                  ]
                }
              ],
            },
            {
              columns: [
                {
                  width: 60,
                  text: "\n\n\n\n\n\n\n"
                },
                {
                  width: 310,
                  text: this.TextoGlosa
                }
              ]
            },
            { text: "\n" },
            {
              columns: [
                {
                  width: 55,
                  text: " "
                },
                { 
                  width: "*",
                  text: " "
                },
                {
                  width: 100,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 60,
                  text: " "
                }
              ],
            },
            { text: "\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 5,
                  text: " "
                },
                { text: "81       82" }
              ]
            },
            { text: "\n\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 70,
                  text: "11010101" 
                },
                { 
                  width: 90,
                  text: "CAJA MN" 
                },
                { 
                  width: 70,
                  text: (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                { 
                  width: 70,
                  text: "2101010501" 
                },
                { 
                  width: 90,
                  text: "IGV CTA. PROPIA" 
                },
                { 
                  width: 70,
                  text: this.MontoIgv,
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                {
                  width: 70,
                  text: "12010301" 
                },
                { 
                  width: 90,
                  text: "VTA. DE BIENES" 
                },
                { 
                  width: 70,
                  text: " "
                },
                { 
                  width: 70,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            }
          ]
        }
        pdfMake.createPdf(docDefinition).print();
      }
      else if (this.NroCheque && !this.TextoGlosa) {
        let docDefinition = {
          pageSize: {
            width: 630,
            height: 800
          },
          defaultStyle: {
            fontSize: 10,
            bold: true
          },
          pageMargins: [ 11, 13, 10, 1 ],
          info: {
            title: this.ValueTipo.Descripcion + "-N°" + this.NroRecibo,
          },
          content: [
            {
              text: "\n\n\n\n\n\n"
            },
            {
              columns: [
                {
                  width: 126,
                  text: " "
                },
                {
                  width: 323,
                  text: this.ValueTipo.Descripcion,
                  alignment: "center",
                },
                {
                  columns:[
                    { 
                      width: 43,
                      fontSize: 9,
                      text: this.NroRecibo, alignment: "center"
                    },
                    { 
                      width: 30,
                      fontSize: 9,
                      text: this.dia, alignment: "center"
                    },
                    { 
                      width: 26,
                      fontSize: 9,
                      text: this.mes, alignment: "center"
                    },
                    { 
                      width: 27,
                      fontSize: 9,
                      text: this.anio, alignment: "center"
                    }
                  ]
                },
              ]
            },
            { text: "\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 465,
                  text: " "
                },
                {
                  width: 80,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                }
              ],
            },
            { text: "\n" },
            {
              columns: [
              {
                  width: 80,
                  text: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
                },
                {
                  width: 60,
                  alignment: "right",
                  type: "none",
                  ol: [listCodClasif]
                },
                {
                  width: 265,
                  type: "none",
                  ol: [listDescripClasif]
                },
                {
                  width: 60,
                  alignment: "right",
                  type: "none",
                  ol: [listImpUniClasif]
                },
                {
                  width: 80,
                  text: " "
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  columns: [
                    {
                      width: 80,
                      text: "CHEQUE N°"+this.NroCheque
                    },
                    {
                      width: 65,
                      text: "MONTO",
                      alignment: "center"
                    },
                    {
                      width: 13,
                      text: "S/."
                    },
                    {
                      width: 45,
                      text: this.MontoCheque.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                      alignment: "right"
                    },
                    {
                      width: "*",
                      text: " "
                    }
                  ]
                }
              ],
            },
            {
              columns: [
                {
                  width: 60,
                  text: "\n\n\n\n\n\n\n"
                },
                {
                  width: 310,
                  text: " "
                }
              ]
            },
            { text: "\n" },
            {
              columns: [
                {
                  width: 55,
                  text: " "
                },
                { 
                  width: "*",
                  text: " "
                },
                {
                  width: 100,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 60,
                  text: " "
                }
              ],
            },
            { text: "\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 5,
                  text: " "
                },
                { text: "81       82" }
              ]
            },
            { text: "\n\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 70,
                  text: "11010101" 
                },
                { 
                  width: 90,
                  text: "CAJA MN" 
                },
                { 
                  width: 70,
                  text: (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                { 
                  width: 70,
                  text: "2101010501" 
                },
                { 
                  width: 90,
                  text: "IGV CTA. PROPIA" 
                },
                { 
                  width: 70,
                  text: this.MontoIgv,
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                {
                  width: 70,
                  text: "12010301" 
                },
                { 
                  width: 90,
                  text: "VTA. DE BIENES" 
                },
                { 
                  width: 70,
                  text: " "
                },
                { 
                  width: 70,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            }
          ]
        }
        pdfMake.createPdf(docDefinition).print();
      }
      else if (!this.NroCheque && this.TextoGlosa) {
        let docDefinition = {
          pageSize: {
            width: 630,
            height: 800
          },
          defaultStyle: {
            fontSize: 10,
            bold: true
          },
          pageMargins: [ 11, 13, 10, 1 ],
          info: {
            title: this.ValueTipo.Descripcion + "-N°" + this.NroRecibo,
          },
          content: [
            {
              text: "\n\n\n\n\n\n"
            },
            {
              columns: [
                {
                  width: 126,
                  text: " "
                },
                {
                  width: 323,
                  text: this.ValueTipo.Descripcion,
                  alignment: "center",
                },
                {
                  columns:[
                    { 
                      width: 43,
                      fontSize: 9,
                      text: this.NroRecibo, alignment: "center"
                    },
                    { 
                      width: 30,
                      fontSize: 9,
                      text: this.dia, alignment: "center"
                    },
                    { 
                      width: 26,
                      fontSize: 9,
                      text: this.mes, alignment: "center"
                    },
                    { 
                      width: 27,
                      fontSize: 9,
                      text: this.anio, alignment: "center"
                    }
                  ]
                },
              ]
            },
            { text: "\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 465,
                  text: " "
                },
                {
                  width: 80,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                }
              ],
            },
            { text: "\n" },
            {
              columns: [
              {
                  width: 80,
                  text: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
                },
                {
                  width: 60,
                  alignment: "right",
                  type: "none",
                  ol: [listCodClasif]
                },
                {
                  width: 265,
                  type: "none",
                  ol: [listDescripClasif]
                },
                {
                  width: 60,
                  alignment: "right",
                  type: "none",
                  ol: [listImpUniClasif]
                },
                {
                  width: 80,
                  text: " "
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: "\n\n\n\n\n\n\n\n"
                },
                {
                  width: 310,
                  text: this.TextoGlosa
                }
              ]
            },
            { text: "\n" },
            {
              columns: [
                {
                  width: 55,
                  text: " "
                },
                { 
                  width: "*",
                  text: " "
                },
                {
                  width: 100,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 60,
                  text: " "
                }
              ],
            },
            { text: "\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 5,
                  text: " "
                },
                { text: "81       82" }
              ]
            },
            { text: "\n\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 70,
                  text: "11010101" 
                },
                { 
                  width: 90,
                  text: "CAJA MN" 
                },
                { 
                  width: 70,
                  text: (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                { 
                  width: 70,
                  text: "2101010501" 
                },
                { 
                  width: 90,
                  text: "IGV CTA. PROPIA" 
                },
                { 
                  width: 70,
                  text: this.MontoIgv,
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                {
                  width: 70,
                  text: "12010301" 
                },
                { 
                  width: 90,
                  text: "VTA. DE BIENES" 
                },
                { 
                  width: 70,
                  text: " "
                },
                { 
                  width: 70,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            }
          ]
        }
        pdfMake.createPdf(docDefinition).print();
      }
      else if (!this.NroCheque && !this.TextoGlosa){
        let docDefinition = {
          pageSize: {
            width: 630,
            height: 800
          },
          defaultStyle: {
            fontSize: 10,
            bold: true
          },
          pageMargins: [ 11, 13, 10, 1 ],
          info: {
            title: this.ValueTipo.Descripcion + "-N°" + this.NroRecibo,
          },
          content: [
            {
              text: "\n\n\n\n\n\n"
            },
            {
              columns: [
                {
                  width: 126,
                  text: " "
                },
                {
                  width: 323,
                  text: this.ValueTipo.Descripcion,
                  alignment: "center",
                },
                {
                  columns:[
                    { 
                      width: 43,
                      fontSize: 9,
                      text: this.NroRecibo, alignment: "center"
                    },
                    { 
                      width: 30,
                      fontSize: 9,
                      text: this.dia, alignment: "center"
                    },
                    { 
                      width: 26,
                      fontSize: 9,
                      text: this.mes, alignment: "center"
                    },
                    { 
                      width: 27,
                      fontSize: 9,
                      text: this.anio, alignment: "center"
                    }
                  ]
                },
              ]
            },
            { text: "\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 465,
                  text: " "
                },
                {
                  width: 80,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                }
              ],
            },
            { text: "\n" },
            {
              columns: [
              {
                  width: 80,
                  text: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
                },
                {
                  width: 60,
                  alignment: "right",
                  type: "none",
                  ol: [listCodClasif]
                },
                {
                  width: 265,
                  type: "none",
                  ol: [listDescripClasif]
                },
                {
                  width: 60,
                  alignment: "right",
                  type: "none",
                  ol: [listImpUniClasif]
                },
                {
                  width: 80,
                  text: " "
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: "\n\n\n\n\n\n\n\n"
                },
                {
                  width: 310,
                  text: " "
                }
              ]
            },
            { text: "\n" },
            {
              columns: [
                {
                  width: 55,
                  text: " "
                },
                { 
                  width: "*",
                  text: " "
                },
                {
                  width: 100,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 60,
                  text: " "
                }
              ],
            },
            { text: "\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 5,
                  text: " "
                },
                { text: "81       82" }
              ]
            },
            { text: "\n\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 70,
                  text: "11010101" 
                },
                { 
                  width: 90,
                  text: "CAJA MN" 
                },
                { 
                  width: 70,
                  text: (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                { 
                  width: 70,
                  text: "2101010501" 
                },
                { 
                  width: 90,
                  text: "IGV CTA. PROPIA" 
                },
                { 
                  width: 70,
                  text: this.MontoIgv,
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                {
                  width: 70,
                  text: "12010301" 
                },
                { 
                  width: 90,
                  text: "VTA. DE BIENES" 
                },
                { 
                  width: 70,
                  text: " "
                },
                { 
                  width: 70,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            }
          ]
        }
        pdfMake.createPdf(docDefinition).print();
      }
    },
    exportMatricialFR1() {
      if (this.NroVoucher) {
        let docDefinition = {
          pageSize: {
            width: 630,
            height: 800
          },
          defaultStyle: {
            fontSize: 10,
            bold: true
          },
          pageMargins: [ 11, 13, 10, 1 ],
          info: {
            title: this.ValueTipo.Descripcion + "-N°" + this.NroRecibo,
          },
          content: [
            {
              text: "\n\n\n\n\n\n"
            },
            {
              columns: [
                {
                  width: 126,
                  text: " "
                },
                {
                  width: 318,
                  text: this.ValueTipo.Descripcion,
                  alignment: "center",
                },
                {
                  columns:[
                    { 
                      width: 43,
                      fontSize: 9,
                      text: this.NroRecibo, alignment: "center"
                    },
                    { 
                      width: 30,
                      fontSize: 9,
                      text: this.dia, alignment: "center"
                    },
                    { 
                      width: 26,
                      fontSize: 9,
                      text: this.mes, alignment: "center"
                    },
                    { 
                      width: 27,
                      fontSize: 9,
                      text: this.anio, alignment: "center"
                    }
                  ]
                },
              ]
            },
            { text: "\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 100,
                  text: this.listaBoletaFormulario[0].Codigo.Codigo
                },
                {
                  width: 305,
                  text: " "
                },
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 80,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                }
              ],
            },
            { text: "\n" },
            {
              columns: [
              { 
                  width: 100,
                  text: " "
                },
                {
                  width: 305,
                  text: this.listaBoletaFormulario[0].Codigo.CodClasificadorExterno
                  + "          " +
                  this.listaBoletaFormulario[0].Codigo.Descripcion
                  + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
                },
                {
                  width: 60,
                  text: this.ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 80,
                  text: " "
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  text: "VENTA DE MEDICAMENTOS AL CONTADO"
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  text: "VOUCHER N° "+this.NroVoucher+ "   MONTO   S/."+
                  this.MontoVoucher.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                }
              ],
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  text: "DEPOSITO EN EFECTIVO BANCO DE LA NACIÓN"+
                  "\n"+"FARMACIA HOSPITAL ARZOBISPO LOAYZA"+"\n"
                }
              ]
            },
            { text: "\n\n" },
            {
              columns: [
                {
                  width: 55,
                  text: " "
                },
                { 
                  width: "*",
                  text: 
                    "Base Imponible: 	S/." +
                    (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                    + "            IGV  " + 
                    this.Igv + "%:    " + " S/." + this.MontoIgv.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                },
                {
                  width: 100,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 60,
                  text: " "
                }
              ],
            },
            { text: "\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 5,
                  text: " "
                },
                { text: "81       82" }
              ]
            },
            { text: "\n\n\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 70,
                  text: "11010101" 
                },
                { 
                  width: 90,
                  text: "CAJA MN" 
                },
                { 
                  width: 70,
                  text: (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                { 
                  width: 70,
                  text: "2101010501" 
                },
                { 
                  width: 90,
                  text: "IGV CTA. PROPIA" 
                },
                { 
                  width: 70,
                  text: this.MontoIgv.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                {
                  width: 70,
                  text: "12010301" 
                },
                { 
                  width: 90,
                  text: "VTA. DE BIENES" 
                },
                { 
                  width: 70,
                  text: " "
                },
                { 
                  width: 70,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            }
          ]
        }
        pdfMake.createPdf(docDefinition).print();
      }
      else{
        let docDefinition = {
          pageSize: {
            width: 630,
            height: 800
          },
          defaultStyle: {
            fontSize: 10,
            bold: true
          },
          pageMargins: [ 11, 13, 10, 1 ],
          info: {
            title: this.ValueTipo.Descripcion + "-N°" + this.NroRecibo,
          },
          content: [
            {
              text: "\n\n\n\n\n\n"
            },
            {
              columns: [
                {
                  width: 126,
                  text: " "
                },
                {
                  width: 318,
                  text: this.ValueTipo.Descripcion,
                  alignment: "center",
                },
                {
                  columns:[
                    { 
                      width: 43,
                      fontSize: 9,
                      text: this.NroRecibo, alignment: "center"
                    },
                    { 
                      width: 30,
                      fontSize: 9,
                      text: this.dia, alignment: "center"
                    },
                    { 
                      width: 26,
                      fontSize: 9,
                      text: this.mes, alignment: "center"
                    },
                    { 
                      width: 27,
                      fontSize: 9,
                      text: this.anio, alignment: "center"
                    }
                  ]
                },
              ]
            },
            { text: "\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 100,
                  text: this.listaBoletaFormulario[0].Codigo.Codigo
                },
                {
                  width: 305,
                  text: " "
                },
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 80,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                }
              ],
            },
            { text: "\n" },
            {
              columns: [
              { 
                  width: 100,
                  text: " "
                },
                {
                  width: 305,
                  text: this.listaBoletaFormulario[0].Codigo.CodClasificadorExterno
                  + "          " +
                  this.listaBoletaFormulario[0].Codigo.Descripcion
                  + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
                },
                {
                  width: 60,
                  text: this.ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 80,
                  text: " "
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  text: "VENTA DE MEDICAMENTOS AL CONTADO"
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  text: "DEPOSITO EN EFECTIVO BANCO DE LA NACIÓN"+
                  "\n"+"FARMACIA HOSPITAL ARZOBISPO LOAYZA"+"\n\n"
                }
              ]
            },
            { text: "\n" },
            {
              columns: [
                {
                  width: 55,
                  text: " "
                },
                { 
                  width: "*",
                  text: 
                    "Base Imponible: 	S/." +
                    (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                    + "            IGV  " + 
                    this.Igv + "%:    " + " S/." + this.MontoIgv.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                },
                {
                  width: 100,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 60,
                  text: " "
                }
              ],
            },
            { text: "\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 5,
                  text: " "
                },
                { text: "81       82" }
              ]
            },
            { text: "\n\n\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 70,
                  text: "11010101" 
                },
                { 
                  width: 90,
                  text: "CAJA MN" 
                },
                { 
                  width: 70,
                  text: (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                { 
                  width: 70,
                  text: "2101010501" 
                },
                { 
                  width: 90,
                  text: "IGV CTA. PROPIA" 
                },
                { 
                  width: 70,
                  text: this.MontoIgv.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                {
                  width: 70,
                  text: "12010301" 
                },
                { 
                  width: 90,
                  text: "VTA. DE BIENES" 
                },
                { 
                  width: 70,
                  text: " "
                },
                { 
                  width: 70,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            }
          ]
        }
        pdfMake.createPdf(docDefinition).print();
      }
    },
    exportMatricialFR2() {  
      let docDefinition = {
          pageSize: {
            width: 630,
            height: 800
          },
          defaultStyle: {
            fontSize: 10,
            bold: true
          },
          pageMargins: [ 11, 13, 10, 1 ],
          info: {
            title: this.ValueTipo.Descripcion + "-N°" + this.NroRecibo,
          },
          content: [
            {
              text: "\n\n\n\n\n\n"
            },
            {
              columns: [
                {
                  width: 126,
                  text: " "
                },
                {
                  width: 318,
                  text: this.ValueTipo.Descripcion,
                  alignment: "center",
                },
                {
                  columns:[
                    { 
                      width: 43,
                      fontSize: 9,
                      text: this.NroRecibo, alignment: "center"
                    },
                    { 
                      width: 30,
                      fontSize: 9,
                      text: this.dia, alignment: "center"
                    },
                    { 
                      width: 26,
                      fontSize: 9,
                      text: this.mes, alignment: "center"
                    },
                    { 
                      width: 27,
                      fontSize: 9,
                      text: this.anio, alignment: "center"
                    }
                  ]
                },
              ]
            },
            { text: "\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 100,
                  text: this.listaBoletaFormulario[0].Codigo.Codigo
                },
                {
                  width: 305,
                  text: " "
                },
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 80,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                }
              ],
            },
            { text: "\n" },
            {
              columns: [
              { 
                  width: 100,
                  text: " "
                },
                {
                  width: 305,
                  text: this.listaBoletaFormulario[0].Codigo.CodClasificadorExterno
                  + "          " +
                  this.listaBoletaFormulario[0].Codigo.Descripcion
                  + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
                },
                {
                  width: 60,
                  text: this.ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 80,
                  text: " "
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  text: this.NombreEmpresa + "\n" + this.NotaInformativa + "\n"
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  columns: [
                    {
                      width: 130,
                      text: this.NombreFactura
                    },
                    {
                      width: 65,
                      text: this.FechaGlosaImp,
                      alignment: "center"
                    },
                    {
                      width: 13,
                      text: "S/."
                    },
                    {
                      width: 55,
                      text: this.ImporteDeposito.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                      alignment: "right"
                    },
                    {
                      width: "*",
                      text: " "
                    }
                  ],
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  columns: [
                    {
                      width: 130,
                      text: "INGRESOS PROPIOS"
                    },
                    {
                      width: 65,
                      text: "MONTO",
                      alignment: "center"
                    },
                    {
                      width: 13,
                      text: "S/."
                    },
                    {
                      width: 55,
                      text: this.ImporteTotalTipoIP.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                      alignment: "right"
                    },
                    {
                      width: "*",
                      text: " "
                    }
                  ]
                }
              ],
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  columns: [
                    {
                      width: 130,
                      text: "FONDO ROTATORIO"
                    },
                    {
                      width: 65,
                      text: "MONTO",
                      alignment: "center"
                    },
                    {
                      width: 13,
                      text: "S/."
                    },
                    {
                      width: 55,
                      text: this.ImporteTotalTipoFR.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                      alignment: "right"
                    },
                    {
                      width: "*",
                      text: " "
                    }
                  ]
                }
              ],
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  columns: [
                    {
                      width: 130,
                      text: "VOUCHER N° "+ this.NroVoucher
                    },
                    {
                      width: 65,
                      text: "MONTO",
                      alignment: "center"
                    },
                    {
                      width: 13,
                      text: "S/."
                    },
                    {
                      width: 55,
                      text: this.MontoVoucher.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                      alignment: "right"
                    },
                    {
                      width: "*",
                      text: " "
                    }
                  ]
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  columns: [
                    {
                      width: 130,
                      text: "CH/N° "+ this.NroCheque
                    },
                    {
                      width: 65,
                      text: "MONTO",
                      alignment: "center"
                    },
                    {
                      width: 13,
                      text: "S/."
                    },
                    {
                      width: 55,
                      text: this.MontoCheque.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                      alignment: "right"
                    },
                    {
                      width: "*",
                      text: " "
                    }
                  ]
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  text: this.NombreBanco
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 310,
                  text: "FARMACIA HOSPITAL ARZOBISPO LOAYZA"
                }
              ]
            },
            { text: "\n" },
            {
              columns: [
                {
                  width: 55,
                  text: " "
                },
                { 
                  width: "*",
                  text: 
                    "Base Imponible: 	S/." +
                    (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                    + "            IGV  " + 
                    this.Igv + "%:    " + " S/." + this.MontoIgv.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                },
                {
                  width: 100,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 60,
                  text: " "
                }
              ],
            },
            { text: "\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 5,
                  text: " "
                },
                { text: "81       82" }
              ]
            },
            { text: "\n\n\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 70,
                  text: "11010101" 
                },
                { 
                  width: 90,
                  text: "CAJA MN" 
                },
                { 
                  width: 70,
                  text: (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                { 
                  width: 70,
                  text: "2101010501" 
                },
                { 
                  width: 90,
                  text: "IGV CTA. PROPIA" 
                },
                { 
                  width: 70,
                  text: this.MontoIgv.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                {
                  width: 70,
                  text: "12010301" 
                },
                { 
                  width: 90,
                  text: "VTA. DE BIENES" 
                },
                { 
                  width: 70,
                  text: " "
                },
                { 
                  width: 70,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            }
          ]
        }
      pdfMake.createPdf(docDefinition).print();
    },
    exportMatricialFR3() {
      let docDefinition = {
        pageSize: {
          width: 630,
          height: 800
        },
        defaultStyle: {
          fontSize: 10,
          bold: true
        },
        pageMargins: [ 11, 13, 10, 1 ],
        info: {
          title: this.ValueTipo.Descripcion + "-N°" + this.NroRecibo,
        },
        content: [
          {
            text: "\n\n\n\n\n\n"
          },
          {
            columns: [
              {
                width: 126,
                text: " "
              },
              {
                width: 318,
                text: this.ValueTipo.Descripcion,
                alignment: "center",
              },
              {
                columns:[
                  { 
                    width: 43,
                    fontSize: 9,
                    text: this.NroRecibo, alignment: "center"
                  },
                  { 
                    width: 30,
                    fontSize: 9,
                    text: this.dia, alignment: "center"
                  },
                  { 
                    width: 26,
                    fontSize: 9,
                    text: this.mes, alignment: "center"
                  },
                  { 
                    width: 27,
                    fontSize: 9,
                    text: this.anio, alignment: "center"
                  }
                ]
              },
            ]
          },
          { text: "\n\n\n\n\n\n" },
          {
            columns: [
              { 
                width: 100,
                text: this.listaBoletaFormulario[0].Codigo.Codigo
              },
              {
                width: 305,
                text: " "
              },
              {
                width: 60,
                text: " "
              },
              {
                width: 80,
                text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                alignment: "right"
              }
            ],
          },
          { text: "\n" },
          {
            columns: [
            { 
                width: 100,
                text: " "
              },
              {
                width: 305,
                text: this.listaBoletaFormulario[0].Codigo.CodClasificadorExterno
                + "          " +
                this.listaBoletaFormulario[0].Codigo.Descripcion
                + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
              },
              {
                width: 60,
                text: this.ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                alignment: "right"
              },
              {
                width: 80,
                text: " "
              }
            ]
          },
          {
            columns: [
              {
                width: 60,
                text: " "
              },
              {
                width: 310,
                text: this.NombreEmpresa + "\n" + this.NotaInformativa + "\n"
              }
            ]
          },
          {
            columns: [
              {
                width: 60,
                text: " "
              },
              {
                width: 310,
                columns: [
                  {
                    width: 130,
                    text: this.NombreFactura
                  },
                  {
                    width: 65,
                    text: this.FechaGlosaImp,
                    alignment: "center"
                  },
                  {
                    width: 13,
                    text: "S/."
                  },
                  {
                    width: 55,
                    text: this.ImporteDeposito.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                    alignment: "right"
                  },
                  {
                    width: "*",
                    text: " "
                  }
                ],
              }
            ]
          },
          {
            columns: [
              {
                width: 60,
                text: " "
              },
              {
                width: 310,
                columns: [
                  {
                    width: 130,
                    text: "INGRESOS PROPIOS"
                  },
                  {
                    width: 65,
                    text: "MONTO",
                    alignment: "center"
                  },
                  {
                    width: 13,
                    text: "S/."
                  },
                  {
                    width: 55,
                    text: this.ImporteTotalTipoIP.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                    alignment: "right"
                  },
                  {
                    width: "*",
                    text: " "
                  }
                ]
              }
            ],
          },
          {
            columns: [
              {
                width: 60,
                text: " "
              },
              {
                width: 310,
                columns: [
                  {
                    width: 130,
                    text: "FONDO ROTATORIO"
                  },
                  {
                    width: 65,
                    text: "MONTO",
                    alignment: "center"
                  },
                  {
                    width: 13,
                    text: "S/."
                  },
                  {
                    width: 55,
                    text: this.ImporteTotalTipoFR.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                    alignment: "right"
                  },
                  {
                    width: "*",
                    text: " "
                  }
                ]
              }
            ],
          },
          {
            columns: [
              {
                width: 60,
                text: " "
              },
              {
                width: 310,
                columns: [
                  {
                    width: 130,
                    text: "N° ABONO: "+ this.NroNotaAbono
                  },
                  {
                    width: 65,
                    text: "MONTO",
                    alignment: "center"
                  },
                  {
                    width: 13,
                    text: "S/."
                  },
                  {
                    width: 55,
                    text: this.MontoNotaAbono.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                    alignment: "right"
                  },
                  {
                    width: "*",
                    text: " "
                  }
                ]
              }
            ]
          },
          {
            columns: [
              {
                width: 60,
                text: " "
              },
              {
                width: 310,
                text: "FARMACIA HOSPITAL ARZOBISPO LOAYZA"
              }
            ]
          },
          { text: "\n\n" },
          {
            columns: [
              {
                width: 55,
                text: " "
              },
              { 
                width: "*",
                text: 
                  "Base Imponible: 	S/." +
                  (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                  + "            IGV  " + 
                  this.Igv + "%:    " + " S/." + this.MontoIgv.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
              },
              {
                width: 100,
                text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                alignment: "right"
              },
              {
                width: 60,
                text: " "
              }
            ],
          },
          { text: "\n\n\n\n\n\n" },
          {
            columns: [
              { 
                width: 5,
                text: " "
              },
              { text: "81       82" }
            ]
          },
          { text: "\n\n\n\n\n\n\n\n\n" },
          {
            columns: [
              { 
                width: 70,
                text: "11010101" 
              },
              { 
                width: 90,
                text: "CAJA MN" 
              },
              { 
                width: 70,
                text: (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                alignment: "right"
              },
              { 
                width: "*",
                text: " ",
              },
            ]
          },
          {
            columns: [
              { 
                width: 70,
                text: "2101010501" 
              },
              { 
                width: 90,
                text: "IGV CTA. PROPIA" 
              },
              { 
                width: 70,
                text: this.MontoIgv.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
                alignment: "right"
              },
              { 
                width: "*",
                text: " ",
              },
            ]
          },
          {
            columns: [
              {
                width: 70,
                text: "12010301" 
              },
              { 
                width: 90,
                text: "VTA. DE BIENES" 
              },
              { 
                width: 70,
                text: " "
              },
              { 
                width: 70,
                text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                alignment: "right"
              },
              { 
                width: "*",
                text: " ",
              },
            ]
          }
        ]
      }
      pdfMake.createPdf(docDefinition).print();
    },
    exportMatricialFR4() {
      if(this.TextoGlosa){
        let docDefinition = {
          pageSize: {
            width: 630,
            height: 800
          },
          defaultStyle: {
            fontSize: 10,
            bold: true
          },
          pageMargins: [ 11, 13, 10, 1 ],
          info: {
            title: this.ValueTipo.Descripcion + "-N°" + this.NroRecibo,
          },
          content: [
            {
              text: "\n\n\n\n\n\n"
            },
            {
              columns: [
                {
                  width: 126,
                  text: " "
                },
                {
                  width: 318,
                  text: this.ValueTipo.Descripcion,
                  alignment: "center",
                },
                {
                  columns:[
                    { 
                      width: 43,
                      fontSize: 9,
                      text: this.NroRecibo, alignment: "center"
                    },
                    { 
                      width: 30,
                      fontSize: 9,
                      text: this.dia, alignment: "center"
                    },
                    { 
                      width: 26,
                      fontSize: 9,
                      text: this.mes, alignment: "center"
                    },
                    { 
                      width: 27,
                      fontSize: 9,
                      text: this.anio, alignment: "center"
                    }
                  ]
                },
              ]
            },
            { text: "\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 100,
                  text: this.listaBoletaFormulario[0].Codigo.Codigo
                },
                {
                  width: 305,
                  text: " "
                },
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 80,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                }
              ],
            },
            {
              text: "\n"
            },
            {
              columns: [
              { 
                  width: 100,
                  text: " "
                },
                {
                  width: 305,
                  text: this.listaBoletaFormulario[0].Codigo.CodClasificadorExterno
                  + "          " +
                  this.listaBoletaFormulario[0].Codigo.Descripcion
                  + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
                },
                {
                  width: 60,
                  text: this.ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 80,
                  text: " "
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: "\n\n\n\n\n\n\n\n\n\n"
                },
                {
                  width: 310,
                  text: this.TextoGlosa + 
                  "\nFARMACIA HOSPITAL ARZOBISPO LOAYZA"
                }
              ]
            },
            {
              columns: [
                {
                  width: 55,
                  text: " "
                },
                { 
                  width: "*",
                  text: 
                    "Base Imponible: 	S/." +
                    (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
                    + "            IGV  " + 
                    this.Igv + "%:    " + " S/." + this.MontoIgv.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
                },
                {
                  width: 100,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 60,
                  text: " "
                }
              ],
            },
            { text: "\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 5,
                  text: " "
                },
                { text: "81       82" }
              ]
            },
            { text: "\n\n\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 70,
                  text: "11010101" 
                },
                { 
                  width: 90,
                  text: "CAJA MN" 
                },
                { 
                  width: 70,
                  text: (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                { 
                  width: 70,
                  text: "2101010501" 
                },
                { 
                  width: 90,
                  text: "IGV CTA. PROPIA" 
                },
                { 
                  width: 70,
                  text: this.MontoIgv.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                {
                  width: 70,
                  text: "12010301" 
                },
                { 
                  width: 90,
                  text: "VTA. DE BIENES" 
                },
                { 
                  width: 70,
                  text: " "
                },
                { 
                  width: 70,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            }
          ]
        }
        pdfMake.createPdf(docDefinition).print();
      }
      else{
        let docDefinition = {
          pageSize: {
            width: 630,
            height: 800
          },
          defaultStyle: {
            fontSize: 10,
            bold: true
          },
          pageMargins: [ 11, 13, 10, 1 ],
          info: {
            title: this.ValueTipo.Descripcion + "-N°" + this.NroRecibo,
          },
          content: [
            {
              text: "\n\n\n\n\n\n"
            },
            {
              columns: [
                {
                  width: 126,
                  text: " "
                },
                {
                  width: 318,
                  text: this.ValueTipo.Descripcion,
                  alignment: "center",
                },
                {
                  columns:[
                    { 
                      width: 43,
                      fontSize: 9,
                      text: this.NroRecibo, alignment: "center"
                    },
                    { 
                      width: 30,
                      fontSize: 9,
                      text: this.dia, alignment: "center"
                    },
                    { 
                      width: 26,
                      fontSize: 9,
                      text: this.mes, alignment: "center"
                    },
                    { 
                      width: 27,
                      fontSize: 9,
                      text: this.anio, alignment: "center"
                    }
                  ]
                },
              ]
            },
            { text: "\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 100,
                  text: this.listaBoletaFormulario[0].Codigo.Codigo
                },
                {
                  width: 305,
                  text: " "
                },
                {
                  width: 60,
                  text: " "
                },
                {
                  width: 80,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                }
              ],
            },
            {
              text: "\n"
            },
            {
              columns: [
              { 
                  width: 100,
                  text: " "
                },
                {
                  width: 305,
                  text: this.listaBoletaFormulario[0].Codigo.CodClasificadorExterno
                  + "          " +
                  this.listaBoletaFormulario[0].Codigo.Descripcion
                  + "\n\n\n\n\n\n\n\n\n\n\n"
                },
                {
                  width: 60,
                  text: this.ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 80,
                  text: " "
                }
              ]
            },
            {
              columns: [
                {
                  width: 60,
                  text: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
                }
              ]
            },
            { text: "\n" },
            {
              columns: [
                {
                  width: 55,
                  text: " "
                },
                { 
                  width: "*",
                  text: 
                    "Base Imponible: 	S/." +
                    (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                    + "            IGV  " + 
                    this.Igv + "%:    " + " S/." + this.MontoIgv.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                },
                {
                  width: 100,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                {
                  width: 60,
                  text: " "
                }
              ],
            },
            { text: "\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 5,
                  text: " "
                },
                { text: "81       82" }
              ]
            },
            { text: "\n\n\n\n\n\n\n\n" },
            {
              columns: [
                { 
                  width: 70,
                  text: "11010101" 
                },
                { 
                  width: 90,
                  text: "CAJA MN" 
                },
                { 
                  width: 70,
                  text: (this.ImporteTotalBoleta -this.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                { 
                  width: 70,
                  text: "2101010501" 
                },
                { 
                  width: 90,
                  text: "IGV CTA. PROPIA" 
                },
                { 
                  width: 70,
                  text: this.MontoIgv.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            },
            {
              columns: [
                {
                  width: 70,
                  text: "12010301" 
                },
                { 
                  width: 90,
                  text: "VTA. DE BIENES" 
                },
                { 
                  width: 70,
                  text: " "
                },
                { 
                  width: 70,
                  text: this.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                  alignment: "right"
                },
                { 
                  width: "*",
                  text: " ",
                },
              ]
            }
          ]
        }
        pdfMake.createPdf(docDefinition).print();
      }
    },
  },
  created: function () {
    this.obtenerClasificadores();
    this.obtenerRegistros();
    this.TipoRegistro=[this.valorTipo.valorTipo]
    this.ValueTipo=this.valorTipo.valorTipo
    this.obtenerSubtiposIP();
    this.obtenerSubtiposFR();
    
    // this.obtenerCorrelativo();
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    if (this.editar.modoEditar) {
      if (this.title.registro.IdParametroSubtipo == 3) {
        this.ValueSubtipo = {
          IdParametro: 3,
          Codigo: 1,
          Descripcion: "Recaudación"
        }
      }
      if (this.title.registro.IdParametroSubtipo == 4) {
        this.ValueSubtipo = {
          IdParametro: 4,
          Codigo: 2,
          Descripcion: "Penalidad"
        }
      }
      if (this.title.registro.IdParametroSubtipo == 5) {
        this.ValueSubtipo = {
          IdParametro: 5,
          Codigo: 3,
          Descripcion: "Factura"
        }
      }
      if (this.title.registro.IdParametroSubtipo == 6) {
        this.ValueSubtipo = {
          IdParametro: 6,
          Codigo: 4,
          Descripcion: "Protocolo"
        }
      }
      if (this.title.registro.IdParametroSubtipo == 7) {
        this.ValueSubtipo = {
          IdParametro: 7,
          Codigo: 5,
          Descripcion: "Detracción"
        }
      }
      if (this.title.registro.IdParametroSubtipo == 8) {
        this.ValueSubtipo = {
          IdParametro: 8,
          Codigo: 6,
          Descripcion: "Otros servicios"
        }
      }
      if (this.title.registro.IdParametroSubtipo == 9) {
        this.ValueSubtipo = {
          IdParametro: 9,
          Codigo: 7,
          Descripcion: "Otros ingresos"
        }
      }
      if (this.title.registro.IdParametroSubtipo == 10) {
        this.ValueSubtipo = {
          IdParametro: 10,
          Codigo: 8,
          Descripcion: "Ingresos diversos"
        }
      }
      if (this.title.registro.IdParametroSubtipo == 11) {
        this.ValueSubtipo = {
          IdParametro: 11,
          Codigo: 1,
          Descripcion: "Recaudación por efectivo de caja"
        }
      }
      if (this.title.registro.IdParametroSubtipo == 12) {
        this.ValueSubtipo = {
          IdParametro: 12,
          Codigo: 2,
          Descripcion: "Pago de facturas - Cheque"
        }
      }
      if (this.title.registro.IdParametroSubtipo == 13) {
        this.ValueSubtipo = {
          IdParametro: 13,
          Codigo: 3,
          Descripcion: "Pago de facturas - Nota de Abono"
        }
      }
      if (this.title.registro.IdParametroSubtipo == 14) {
        this.ValueSubtipo = {
          IdParametro: 14,
          Codigo: 4,
          Descripcion: "Otros pagos"
        }
      }
      this.IdRegistro = this.title.registro.IdRegistro,
        this.NroRecibo = this.title.registro.NroRecibo,
        this.Fecha = new Date (this.title.registro.Fecha),
        this.ImporteTotalBoleta = this.title.registro.ImporteTotalBoleta,
        this.Igv = this.title.registro.Igv,
        this.MontoIgv = this.title.registro.MontoIgv,
        this.NombreEmpresa = this.title.registro.NombreEmpresa,
        this.NotaInformativa = this.title.registro.NotaInformativa,
        this.NombreFactura = this.title.registro.NombreFactura,
        this.FechaGlosa = new Date(this.title.registro.FechaGlosa),
        this.ImporteDeposito = this.title.registro.ImporteDeposito,
        this.ImporteTotalTipoIP = this.title.registro.ImporteTotalTipoIP,
        this.ImporteTotalTipoFR = this.title.registro.ImporteTotalTipoFR,
        this.NroVoucher = this.title.registro.NroVoucher,
        this.MontoVoucher = this.title.registro.MontoVoucher,
        this.NroCheque = this.title.registro.NroCheque,
        this.MontoCheque = this.title.registro.MontoCheque,
        this.NroNotaAbono = this.title.registro.NroNotaAbono,
        this.MontoNotaAbono = this.title.registro.MontoNotaAbono,
        this.NombreBanco = this.title.registro.NombreBanco,
        this.TextoGlosa = this.title.registro.TextoGlosa,
        this.UsuarioCreacion = this.title.registro.UsuarioCreacion,
        this.FechaCreacion = this.title.registro.FechaCreacion,
        this.UsuarioModificacion = this.title.registro.UsuarioModificacion,
        this.FechaModificacion = new Date(),
        this.Anulado = this.title.registro.Anulado,
      this.title.registro.listBoletas.forEach((element) => {
        if (element.IdParametro == 15) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: 12010301,
              CodClasificadorArea: 90101.00,
              CodClasificadorExterno: 131612,
            },
            Descripcion: "Medicina",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 16) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 101.00,
              CodClasificadorExterno: 133415,
            },
            Descripcion: "Cirugia Especialidades",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 17) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 101.10,
              CodClasificadorExterno: 133415,
            },
            Descripcion: "Cardio Vascular",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 18) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 101.20,
              CodClasificadorExterno: 133415,
            },
            Descripcion: "Cabeza - Cuello",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 19) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 101.30,
              CodClasificadorExterno: 133415,
            },
            Descripcion: "Colproctologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 20) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 101.4,
              CodClasificadorExterno: 133415,
            },
            Descripcion: "Oftalmologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 21) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 101.50,
              CodClasificadorExterno: null,
            },
            Descripcion: "Otorrinolaringologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 22) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 101.19,
              CodClasificadorExterno: 133425,
            },
            Descripcion: "Audiometria",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 23) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 101.60,
              CodClasificadorExterno: 133415,
            },
            Descripcion: "Quemados",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 24) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 101.70,
              CodClasificadorExterno: 133415,
            },
            Descripcion: "Traumatologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 25) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 101.80,
              CodClasificadorExterno: 133415,
            },
            Descripcion: "Urologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 26) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 101.90,
              CodClasificadorExterno: 133415,
            },
            Descripcion: "Neurocirugia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 27) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 102.00,
              CodClasificadorExterno: 133415,
            },
            Descripcion: "Cirugia General",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 28) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 103.20,
              CodClasificadorExterno: 133415,
            },
            Descripcion: "Ginecologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 29) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 104.02,
              CodClasificadorExterno: 133416,
            },
            Descripcion: "Inmunoreumatologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 30) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 104.10,
              CodClasificadorExterno: 133416,
            },
            Descripcion: "Angiologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 31) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 104.20,
              CodClasificadorExterno: 133416,
            },
            Descripcion: "Cardiologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 32) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 104.01,
              CodClasificadorExterno: 133423,
            },
            Descripcion: "Electrocardiograma",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 33) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 104.30,
              CodClasificadorExterno: 133416,
            },
            Descripcion: "Dermatologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 34) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 104.40,
              CodClasificadorExterno: 133416,
            },
            Descripcion: "Endocrinologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 35) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 104.50,
              CodClasificadorExterno: 133416,
            },
            Descripcion: "Gastroenterologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 36) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 104.60,
              CodClasificadorExterno: 133416,
            },
            Descripcion: "Nefrologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 37) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 104.70,
              CodClasificadorExterno: 133411,
            },
            Descripcion: "Neumologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 38) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 104.80,
              CodClasificadorExterno: 133411,
            },
            Descripcion: "Psicologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 39) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 104.81,
              CodClasificadorExterno: 133411,
            },
            Descripcion: "Psiquiatria",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 40) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 104.90,
              CodClasificadorExterno: 133431,
            },
            Descripcion: "Serv. Top. Y Rehab.",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 41) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 104.92,
              CodClasificadorExterno: 133411,
            },
            Descripcion: "Neurologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 42) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 107.00,
              CodClasificadorExterno: 133412,
            },
            Descripcion: "Odontoestamologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 43) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 108.50,
              CodClasificadorExterno: 133416,
            },
            Descripcion: "Unidad de Cuidados Inten.",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 44) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 201.00,
              CodClasificadorExterno: 133421,
            },
            Descripcion: "Anatomia Patologia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 45) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 202.00,
              CodClasificadorExterno: 133421,
            },
            Descripcion: "Laboratorio Clinico",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 46) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 302.01,
              CodClasificadorExterno: 133411,
            },
            Descripcion: "Ticket Pac. Antiguo",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 47) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 203.10,
              CodClasificadorExterno: 133424,
            },
            Descripcion: "Ecografia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 48) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 203.20,
              CodClasificadorExterno: 133424,
            },
            Descripcion: "Radiografia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 49) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 204.10,
              CodClasificadorExterno: 133424,
            },
            Descripcion: "Medicina Nuclear",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 50) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 301.00,
              CodClasificadorExterno: 133414,
            },
            Descripcion: "Atenc. Emergencia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 51) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 303.00,
              CodClasificadorExterno: 133416,
            },
            Descripcion: "Hospitalizacion",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 52) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 401.00,
              CodClasificadorExterno: 1334399,
            },
            Descripcion: "Transp. Ambulancia",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 53) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 302.02,
              CodClasificadorExterno: 132416,
            },
            Descripcion: "Ticket Pac. Nuevo",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 54) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 302.03,
              CodClasificadorExterno: 124013,
            },
            Descripcion: "Duplicado de Tarjeta",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 55) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 402.00,
              CodClasificadorExterno: 133411,
            },
            Descripcion: "Cáncer",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 56) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 400.07,
              CodClasificadorExterno: 1334199,
            },
            Descripcion: "Serv. De Esterelizacion",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 57) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 400.01,
              CodClasificadorExterno: 1334199,
            },
            Descripcion: "Const. Medica",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 58) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 105.00,
              CodClasificadorExterno: 133411,
            },
            Descripcion: "Medicina General",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 59) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 400.21,
              CodClasificadorExterno: 131912,
            },
            Descripcion: "Venta de Bases y Otros",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 60) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 106.00,
              CodClasificadorExterno: 133411,
            },
            Descripcion: "Pediatria",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 61) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 205.00,
              CodClasificadorExterno: 133432,
            },
            Descripcion: "P.P.D.",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
        if (element.IdParametro == 62) {
          const Codigo = {
            IdBoleta: element.IdBoleta,
            IdParametro: element.IdParametro,
            Codigo: {
              Codigo: null,
              CodClasificadorArea: 207.00,
              CodClasificadorExterno: 133415,
            },
            Descripcion: "Anastecia Endovenosa",
            ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
          }
          this.listaBoletaConvertida.push(Codigo)
        }
      });
      this.listaBoletaFormulario = this.listaBoletaConvertida
    }
      //debe estar despues de asignar los valores de arriba
      this.cambioTipo();
  },
}
</script>
<style>
h5 {
  text-align: center;
}

.text-red {
  color: red;
}

.alineacion {
  text-align: right;
  margin-top: 10px;
}

.mt-1-8 {
  margin-top: 1.8rem !important;
}

.mbo-0 {
  margin-bottom: 0 !important;
}
</style>

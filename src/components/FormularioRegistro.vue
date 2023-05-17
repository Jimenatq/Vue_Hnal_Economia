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
            <InputText id="input-editar" disabled="true" v-model="NroRecibo" maxlength="5"/>
          </div>
          <div class="field col-1 p-0">
            <Button id="button-editar" v-tooltip="'Editar N° recibo'" icon="pi pi-pencil" class="p-button-secondary mr-2 mt-1-8"
              @click="esSupervisorGlobal()" />
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
            <div class="field col-12 grid mbo-0">
              <div class="field col-12 mb-0">
                <br />
                <h5 class="m-0 mb-5">CLASIFICADORES</h5>
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
                <InputNumber id="price" v-model="clasificador.ImporteUnitarioClasificador" mode="currency" 
                currency="PEN" locale="es-PE" @input="clasificador.ImporteUnitarioClasificador= $event.value, sumarImportes();"
                :class="{ 'p-invalid': enviar && !clasificador.ImporteUnitarioClasificador }" />
                <small class="p-invalid text-red" v-if="enviar && !clasificador.ImporteUnitarioClasificador">Este campo
                  es requerido.</small>
              </div>
              <div class="field col-12 md:col-1">
                <Button icon="pi pi-times" v-tooltip="'Eliminar clasificador'" class="p-button-danger mr-2" @click="eliminarMedicamento(i)" />
              </div>
            </div>
            <div class="field col-12 grid">
              <div class="field col-12 md:col-4">
                <Button v-tooltip="'Añadir clasificador'" icon="pi pi-plus" class="p-button-success m-0"
                  @click="aniadirElemento()" />
              </div>
              <div class="field col-12 md:col-4 alineacion">
                <label  class="mb-7" for="quantity">Monto de Devolución</label>
                <label for="email1">Importe total</label>
              </div>
              <div class="field col-12 md:col-3">
                <InputNumber class="mb-5" id="price" v-model="MontoDevolucion" mode="currency" currency="PEN" locale="es-PE" max="999999" 
                  @input="MontoDevolucion= $event.value, sumarImportes();"/>
                <InputNumber id="price" v-model="ImporteTotalBoleta" mode="currency" currency="PEN" disabled
                  locale="es-PE" required="true " :class="{ 'p-invalid': enviar && !ImporteTotalBoleta }" />
                <small class="p-invalid text-red" v-if="enviar && !ImporteTotalBoleta">Este campo es
                  requerido.</small>
              </div>
            </div>
            <div class="field col-12">
              <h5>GLOSA</h5>
              <br />
            </div>
            <div class="field col-12 md:col-6">
              <label for="quantity">N° de Cheque</label>
              <InputText id="quantity" v-model="NroCheque" maxlength="9" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="quantity">Monto de Cheque</label>
              <InputNumber id="price" v-model="MontoCheque" mode="currency" currency="PEN" locale="es-PE" maxlength="9" />
            </div>
            <div class="field col-12">
              <label>Texto adicional</label>
              <Textarea v-model="TextoGlosa" placeholder="Ingrese texto adicional en la glosa" :autoResize="true"
                rows="3" cols="30" maxlength="450" />
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
                <InputNumber id="price" v-model="clasificador.ImporteUnitarioClasificador" mode="currency" currency="PEN"
                  locale="es-PE" :class="{ 'p-invalid': enviar && !clasificador.ImporteUnitarioClasificador }" max="99999"
                  @input="clasificador.ImporteUnitarioClasificador= $event.value, sumarImportes();"/>
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
                <InputText id="quantity" v-model="Igv" :class="{ 'p-invalid': enviar && !Igv }" maxlength="2"/>
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
                <InputText id="quantity" v-model="NroVoucher" maxlength="9"/>
              </div>
              <div class="field col-12 md:col-6">
                <label for="state">Monto voucher</label>
                <InputNumber id="price" v-model="MontoVoucher" mode="currency" currency="PEN" locale="es-PE"  max="99999"/>
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
                <InputText id="quantity" v-model="NombreEmpresa" maxlength="45"/>
              </div>
              <div class="field col-12 md:col-6">
                <label for="state">Nota de Informativa</label>
                <InputText id="quantity" v-model="NotaInformativa" maxlength="45"/>
              </div>
              <div class="field col-12 md:col-4">
                <label for="state">Nombre de Factura</label>
                <InputText id="quantity" v-model="NombreFactura" maxlength="35" />
              </div>
              <div class="field col-12 md:col-4">
                <label for="state">Fecha</label>
                <Calendar dateFormat="dd/mm/yy" :showIcon="true" :showButtonBar="true" v-model="FechaGlosa"></Calendar>
              </div>
              <div class="field col-12 md:col-4">
                <label for="state">Importe de deposito</label>
                <InputNumber id="price" v-model="ImporteDeposito" mode="currency" currency="PEN" locale="es-PE" max="99999" />
              </div>
              <div class="field col-12 md:col-6">
                <label for="state">Importe de ingresos propios</label>
                <InputNumber id="price" v-model="ImporteTotalTipoIP" mode="currency" currency="PEN" locale="es-PE" max="99999" />
              </div>
              <div class="field col-12 md:col-6">
                <label for="state">Importe de Fondos Rotatorios</label>
                <InputNumber id="price" v-model="ImporteTotalTipoFR" mode="currency" currency="PEN" locale="es-PE" max="99999" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">N° Voucher</label>
                <InputText id="quantity" v-model="NroVoucher" maxlength="9" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Monto Voucher</label>
                <InputNumber id="price" v-model="MontoVoucher" mode="currency" currency="PEN" locale="es-PE" max="99999"/>
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">N° Cheque</label>
                <InputText id="quantity" v-model="NroCheque" maxlength="12"/>
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Monto cheque</label>
                <InputNumber id="price" v-model="MontoCheque" mode="currency" currency="PEN" locale="es-PE" max="99999" />
              </div>
              <div class="field col-12">
                <label for="state">Nombre de Banco</label>
                <InputText id="quantity" v-model="NombreBanco" maxlength="45" />
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
                <InputText id="quantity" v-model="NombreEmpresa" maxlength="45" />
              </div>
              <div class="field col-12 md:col-6">
                <label for="state">Nota de Informativa</label>
                <InputText id="quantity" v-model="NotaInformativa" maxlength="45" />
              </div>
              <div class="field col-12 md:col-5">
                <label for="state">Nombre de Factura</label>
                <InputText id="quantity" v-model="NombreFactura" maxlength="35" />
              </div>
              <div class="field col-12 md:col-4">
                <label for="state">Fecha</label>
                <Calendar dateFormat="dd/mm/yy" :showIcon="true" :showButtonBar="true" v-model="FechaGlosa"></Calendar>
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Importe de deposito</label>
                <InputNumber id="price" v-model="ImporteDeposito" mode="currency" currency="PEN" locale="es-PE" max="99999"/>
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Importe de ingresos propios</label>
                <InputNumber id="price" v-model="ImporteTotalTipoIP" mode="currency" currency="PEN" locale="es-PE" max="99999" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Importe de Fondos Rotatorios</label>
                <InputNumber id="price" v-model="ImporteTotalTipoFR" mode="currency" currency="PEN" locale="es-PE" max="99999" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">N° Nota de Abono</label>
                <InputText id="quantity" v-model="NroNotaAbono" maxlength="12" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Monto de Nota de Abono</label>
                <InputNumber id="price" v-model="MontoNotaAbono" mode="currency" currency="PEN" locale="es-PE" max="99999" />
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
                <Textarea v-model="TextoGlosa" placeholder="Ingrese texto adicional para la glosa" autoResize
                  rows="3" cols="30" maxlength="450" />
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
            <div class="field col-12 grid" v-if="ValueSubtipo.Codigo == 5">
              <div class="field col-12">
                <label for="state">COMPROMISO DEL TRABAJADOR CARLOS HERRERA</label>
              </div>
              <div class="field col-12">
                <label for="state">Nota de Informativa</label>
                <InputText id="quantity" v-model="NotaInformativa" maxlength="45"/>
              </div>
              <div class="field col-12">
                <label for="state">ACTA DE COMPROMISO SIN/N° 
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  S/. 4,476.34</label>
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">N° Voucher</label>
                <InputText id="quantity" v-model="NroVoucher" maxlength="9" />
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Monto Voucher</label>
                <InputNumber id="price" v-model="MontoVoucher" mode="currency" currency="PEN" locale="es-PE" maxlength="9"/>
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">N° Cheque</label>
                <InputText id="quantity" v-model="NroCheque" maxlength="12"/>
              </div>
              <div class="field col-12 md:col-3">
                <label for="state">Monto cheque</label>
                <InputNumber id="price" v-model="MontoCheque" mode="currency" currency="PEN" locale="es-PE" max="99999"/>
              </div>
              <div class="field col-12">
                <label for="state">BANCO DE LA NACIÓN</label><BR />
                <label for="state">N° de Cuota</label>
                <InputText id="quantity" v-model="NombreBanco" maxlength="30"/>
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
        <Dialog v-model:visible="supervisorDialog" :style="{width: '450px'}" header="Ingrese Supervisor" :modal="true">
					<div class="align-items-center justify-content-center" :style="{padding: '0 40px'}">
						<p>Ingrese el usuario Supervisor:</p>
            <InputText v-model="usuario" type="text" class="w-full mb-3" placeholder="Ingrese el usuario" 
            :class="{ 'p-invalid': ingresoCredenciales && !usuario}"></InputText>
            <br />
            <p>Ingrese la clave:</p>
						<Password id="password1" v-model="clave" placeholder="Ingrese su clave" :toggleMask="true" :feedback="false" class="w-full mb-3" inputClass="w-full"
              :class="{ 'p-invalid': ingresoCredenciales && !clave}"></Password>
					</div>
          <span v-if="cargandoSupervisor" class="flex justify-content-center mb-4"><i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i></span>
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" class="p-button-rounded p-button-secondary" @click="supervisorDialog = false"/>
						<Button label="Aceptar" icon="pi pi-check" class="p-button-rounded p-button-success" @click="verificarSupervisor()" />
					</template>
				</Dialog>
        <Dialog v-model:visible="mensajeErrorDialog" :style="{width: '450px'}" header="Mensaje" :modal="true" :closable="false">
					<div class="align-items-center justify-content-center" :style="{padding: '0 40px'}">
            <p><i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            {{ message }}</p>
					</div>
					<template #footer>
						<Button label="Aceptar" icon="pi pi-check" class="p-button-rounded p-button-danger" @click="mensajeErrorDialog=false" />
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
import Login from "../service/Login.js";
import Supervisor from "../service/Supervisor.js";
import Formulario from "../service/Formulario.js";

export default {
  props:
  {
    title: String,
    editar: String,
    actualizar: Function,
    cerrarDialog: Function,
    valorTipo: String,
    tipoClasificadores: String
  },
  data() {
    return {
      message: null,
      mensajeDialog:false,
      mensajeErrorDialog: false,
      TipoRegistro: null,
      SubtipoIP: null,
      SubtipoFR: null,
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
      ListaClasificadoresIngresosPropios: [],
      ListaClasificadoresFondoRotatorio: [],
      ValueTipo: {
        Codigo: null,
        Descripcion: null,
        IdParametro: null
      },
      ValueSubtipo: "",
      NroRecibo: null,
      Fecha: new Date(),
      ImporteTotalBoleta: null,
      Igv: 18,
      MontoIgv: null,
      MontoDevolucion: null,
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
      UsuarioCreacion: this.$store.state.userName,
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
      listaRoles: [],
      listaDescripcionRoles: [],
      supervisorDialog: false,
      usuario: null,
      clave: null,
      cargandoSupervisor: false,
      ingresoCredenciales: false
    };
  },
  login: null,
  supervisor: null,
  formulario: null,
  methods: {
    //si inicia sesion con usuario supervisor no pedira credenciales para nada
    esSupervisorGlobal(){
      const username = {
        Usuario: this.$store.state.userName
      }
      this.supervisor.getListaRolesPorUsuario(username)
      .then(data=>{
        let listaRolesUser = data;
        if(listaRolesUser.length!=0){
          let listaDescripcionRol = [];
          listaRolesUser.map((element)=>{
            listaDescripcionRol.push(element.Descripcion);
          })
          let existeRolSupervisor = listaDescripcionRol.includes('Supervisor');
          if(existeRolSupervisor){
            this.editarNroRecibo();
          }
          else{
            this.abrirDialogSupervisor();
          }
        }
      })
      .catch(error=>{
        this.message = error;
        this.mensajeErrorDialog = true;
      })
    },
    esSupervisor(user){
      const username = {
          Usuario: user
        }
        this.supervisor.getListaRolesPorUsuario(username)
        .then(data=>{
          let listaRolesUser = data;
          if(listaRolesUser.length==0){
            this.message = "El usuario no tiene roles asignados";
            this.mensajeErrorDialog = true;
          }
          else{
            let listaDescripcionRol = [];
            listaRolesUser.map((element)=>{
              listaDescripcionRol.push(element.Descripcion);
            })
            let existeRolSupervisor = listaDescripcionRol.includes('Supervisor');
            if(existeRolSupervisor){
              this.editarNroRecibo();
              this.supervisorDialog = false;
            }
            else{
              this.message = "El usuario no es supervisor, intente de nuevo con un usuario supervisor.";
              this.mensajeErrorDialog = true;
            }
          }
        })
        .catch(error=>{
          this.message = error;
          this.mensajeErrorDialog = true;
        })
    },
    verificarSupervisor(){
      this.cargandoSupervisor = true;
      this.ingresoCredenciales = true;
      const user = {
        Usuario: this.usuario,
        Clave: this.clave
      }
      this.login.validarUsuario(user)
        .then(data => {
          this.cargandoSupervisor = false;
          if(data.error){
            this.message = data.error;
            this.mensajeErrorDialog = true;
          }
          else{
            //validamos si es supervisor
            this.esSupervisor(this.usuario);
          }
        })
        .catch(err => {
          this.cargandoSupervisor = false;
          this.message = err + ". Ha ocurrido un error, actualice la pág por favor.";
          this.mensajeErrorDialog = true;
        })
    },
    abrirDialogSupervisor(){
      if(this.disabled){
        this.supervisorDialog = true;
        this.usuario = null;
        this.clave = null;
        this.cargandoSupervisor = false;
        this.ingresoCredenciales = false;
      }
      else{
        this.editarNroRecibo();
      }
    },
    cerrarMessageDialog(){
      this.mensajeDialog = false;
      this.confirmaEliminacionDialog = false;
    },
    async eliminarClasifDefinit(value){
      this.formulario.deleteClasificadorDefinitivamente(value.IdBoleta)
        .then(async(data)=>{
          this.listaBoletaFormulario.splice(this.id, 1);
          await this.sumarImportes();
          const modifImporte ={
            IdRegistro: this.title.registro.IdRegistro,
            ImporteTotalBoleta: this.ImporteTotalBoleta
          }
          this.formulario.modificarImporteTotal(modifImporte)
          .then(async(resp)=>{
            await this.actualizar.obtenerRegistros();
            this.message = data+resp;
            this.mensajeDialog = true;
          })
          .catch(error=>{
            this.message = error + ". Ha ocurrido un error, no se actualizó el importe.";
            this.mensajeDialog = true;
          })
        })
        .catch(error=>{
          this.message = error+ ". Ha ocurrido un error, no se ha eliminado el clasificador, intente de nuevo.";
          this.mensajeDialog = true;
        })
    },
    calcularMontoIgv() {
      if (this.ImporteTotalBoleta != 0 && this.Igv != undefined) {
        this.MontoIgv = ((this.ImporteTotalBoleta/1.18) * this.Igv / 100).toFixed(2);
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
    async sumarImportes() {
      this.ImporteTotalBoleta = 0;
      if(this.MontoDevolucion){
        this.listaBoletaFormulario.forEach(element => {
          this.ImporteTotalBoleta += element.ImporteUnitarioClasificador;
        });
        this.ImporteTotalBoleta -= this.MontoDevolucion;
      }
      else{
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
        this.IdParametro = clasificador.Codigo.IdParametro;this.formulario
      }
    },
    obtenerSubtiposIP() {
      this.formulario.getSubtiposIngresosPropios()
      .then(data=> {
        this.SubtipoIP = data;
      })
    },
    obtenerSubtiposFR() {
      this.formulario.getSubtiposFondoRotatorio()
      .then(data => {
        this.SubtipoFR = data;
      })
    },
    obtenerClasificadores() {
      if(this.tipoClasificadores.tipoClasificadores == 5){
        this.formulario.getClasificadores(5)
        .then(data => {
          this.ListaClasificadoresIngresosPropios = data;
        })
      }
      else if(this.tipoClasificadores.tipoClasificadores == 4){
        this.formulario.getClasificadores(4)
        .then(data => {
          this.ListaClasificadoresFondoRotatorio = data;
        })
      }
    },
    async obtenerCorrelativo(value,anioFecha) {
      const valor = {
        IdParametro: value,
        Ano: anioFecha
      }
      this.formulario.obtenerCorrelativo(valor)
      // await this.formulario.obtenerCorrelativo(valor)
      .then(data => {
        this.NroRecibo = data;
      })
      .catch(error => {
        console.log(error)
      })
    },
    async obtenerRegistros() {
      this.formulario.getListaRegistros()
      .then(data => {
        this.ListaRegistros = data;
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
            console.log(NroReciboAnterior)
            console.log(anioFecha)
            await this.obtenerCorrelativo(1,anioFecha)
            console.log(this.NroRecibo)
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
              MontoDevolucion: this.MontoDevolucion,
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

            this.formulario.guardarRegistro(registro)
            .then(async() => {
              this.ingresoDialog = true;
              await this.actualizar.obtenerRegistros();
              const valor = {
                IdParametro: 1,
                Ano: anioFecha
              }
              this.formulario.modificarCorrelativo(valor)
            })
            .catch(err => {
              this.message = err;
              this.mensajeErrorDialog = true;
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
              MontoDevolucion: this.MontoDevolucion,
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
            this.formulario.guardarRegistro(registro)
            .then(() => {
              this.ingresoDialog = true;
              this.actualizar.obtenerRegistros();
              const valor = {
                IdParametro: 2,
                Ano: anioFecha
              }
              this.formulario.modificarCorrelativo(valor)
            })
            .catch(err => {
              this.message = err;
              this.mensajeErrorDialog=true;
            })
          }
        }
      }
    },
    async cambioTipo() {
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
      if(this.tipoClasificadores.tipoClasificadores == 5){
        if (!event.query.trim().length) {
          this.autoFilteredValue = [...this.ListaClasificadoresIngresosPropios];
        }
        else {
          this.autoFilteredValue = this.ListaClasificadoresIngresosPropios.filter((clasificador) => {
            return clasificador.CodClasificadorArea.toString().toLowerCase().startsWith(event.query.toLowerCase())
          })
        }
      }
      else if(this.tipoClasificadores.tipoClasificadores == 4){
        if (!event.query.trim().length) {
          this.autoFilteredValue = [...this.ListaClasificadoresFondoRotatorio];
        }
        else {
          this.autoFilteredValue = this.ListaClasificadoresFondoRotatorio.filter((clasificador) => {
            return clasificador.CodClasificadorArea.toString().toLowerCase().startsWith(event.query.toLowerCase())
          })
        }
      }
    },
    BuscarNombreClasificadores(event) {
      if(this.tipoClasificadores.tipoClasificadores == 5){
        if (!event.query.trim().length) {
          this.autoFilteredValue = [...this.ListaClasificadoresIngresosPropios];
        } else {
          this.autoFilteredValue = this.ListaClasificadoresIngresosPropios.filter((clasificador) => {
          return clasificador.Descripcion.toLowerCase().startsWith(event.query.toLowerCase())
          })
        }
      }
      else if(this.tipoClasificadores.tipoClasificadores == 4){
        if (!event.query.trim().length) {
          this.autoFilteredValue = [...this.ListaClasificadoresFondoRotatorio];
        } else {
          this.autoFilteredValue = this.ListaClasificadoresFondoRotatorio.filter((clasificador) => {
            return clasificador.Descripcion.toLowerCase().startsWith(event.query.toLowerCase())
          })
        }
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
              break
            }
            else{
              this.listaOpcional2.push(elem)
            }
          }
          else{
            this.dialogIncompleto = true;
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
        MontoDevolucion: this.MontoDevolucion,
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

      this.formulario.editarRegistroIngresos(registro)
      .then(() => {
        this.actualizar.obtenerRegistros();
        this.editarDialog = true
      })
      .catch(error => {
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
        if (this.ValueSubtipo.IdParametro == 63) {
          this.exportMatricialFR5();
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
    exportMatricialFR5(){
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
                  text: "COMPROMISO DEL TRABAJADOR CARLOS HERRERA"+"\n" + this.NotaInformativa + "\n"
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
                      width: 195,
                      text: "ACTA DE COMPROMISO SIN/N°"
                    },
                    {
                      width: 13,
                      text: "S/."
                    },
                    {
                      width: 55,
                      text: "4,476.34",
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
                  text: "BANCO DE LA NACIÓN\n"+this.NombreBanco+"\n"+
                        "FARMACIA HOSPITAL ARZOBISPO LOAYZA"
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
            { text: "\n\n\n\n\n" },
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
    async formularioEditar(){
      if (this.editar.modoEditar) {
        var detalleSubtipo = await this.formulario.getDetalleClasificador(this.title.registro.IdParametroSubtipo)
        this.ValueSubtipo = {
          IdParametro: detalleSubtipo[0].IdParametro,
          Codigo: detalleSubtipo[0].Codigo,
          Descripcion: detalleSubtipo[0].Descripcion
        }
        this.IdRegistro = this.title.registro.IdRegistro,
        this.NroRecibo = this.title.registro.NroRecibo,
        this.Fecha = new Date (this.title.registro.Fecha),
        this.ImporteTotalBoleta = this.title.registro.ImporteTotalBoleta,
        this.Igv = this.title.registro.Igv,
        this.MontoIgv = this.title.registro.MontoIgv,
        this.MontoDevolucion= this.title.registro.MontoDevolucion,
        this.NombreEmpresa = this.title.registro.NombreEmpresa,
        this.NotaInformativa = this.title.registro.NotaInformativa,
        this.NombreFactura = this.title.registro.NombreFactura;
        if(this.title.registro.FechaGlosa){
          this.FechaGlosa = new Date(this.title.registro.FechaGlosa)
        }
        else{
          this.FechaGlosa = this.title.registro.FechaGlosa
        }
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
        this.UsuarioModificacion = this.$store.state.userName,
        this.FechaModificacion = new Date(),
        this.Anulado = this.title.registro.Anulado
        this.listaBoletaFormulario =await Promise.all(this.title.registro.listBoletas.map(async (element) => {
        var detalle = await this.formulario.getDetalleClasificador(element.IdParametro)
        return {
          IdBoleta: element.IdBoleta,
          IdParametro: element.IdParametro,
          Codigo: {
            Codigo: detalle[0].Codigo,
            CodClasificadorArea: detalle[0].CodClasificadorArea,
            CodClasificadorExterno: detalle[0].CodClasificadorExterno,
          },
          Descripcion: detalle[0].Descripcion,
          ImporteUnitarioClasificador: element.ImporteUnitarioClasificador
        }
      }))
      }
    }
  },
  created: function () {
    this.login = new Login();
    this.supervisor = new Supervisor();
    this.formulario = new Formulario();
    this.obtenerClasificadores();
    this.obtenerRegistros();
    this.TipoRegistro=[this.valorTipo.valorTipo]
    this.ValueTipo=this.valorTipo.valorTipo
    this.obtenerSubtiposIP();
    this.obtenerSubtiposFR();
    this.formularioEditar();
    // this.obtenerCorrelativo();
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
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

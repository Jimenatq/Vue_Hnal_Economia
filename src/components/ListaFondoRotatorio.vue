<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
                <Toast/>
				<div class="field col-12 grid">
					<h2 class="m-auto">Fondo Rotatorio</h2>
				</div>
				<Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
							<Button label="Nuevo Registro" v-tooltip="'Agregar nuevo registro'" icon="pi pi-plus" class="p-button-success mr-2" @click="nuevoRegistro()" />
						</div>
					</template>
					<template v-slot:end>
						<Button label="Reporte PDF"  v-tooltip="'Imprimir reporte PDF'" icon="pi pi-upload" class="p-button-help mri-1" @click="abrirReporte(1)"  />
						<Button label="Reporte Excel" v-tooltip="'Imprimir reporte Excel'" icon="pi pi-upload" class="p-button-info" @click="abrirReporte(2)"  />
					</template>
				</Toolbar>
				<DataTable :value="ListaRegistros" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="IdRegistro" :rowHover="true" 
						v-model:filters="filtros" filterDisplay="menu" :loading="cargando" :filters="filtros" responsiveLayout="scroll"
						:globalFilterFields="['NroRecibo']" >
					<template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <!-- <Button type="button" icon="pi pi-filter-slash" label="Borrar Filtros" class="p-button-outlined mb-2" @click="BorrarFiltros()"/> -->
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-filter" />
                                <InputText v-model="listaPorAnio" style="width: 7rem" @change="obtenerRegistros()"/>
                            </span>
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filtros['global'].value" placeholder="Buscar registro por N° de recibo" style="width: 20rem"/>
                            </span>
                        </div>
                    </template>
					<template #empty>
                        No hay registros para mostrar.
                    </template>
					<template #loading>
                        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                    </template>
					<Column header="Estado" filterField="Anulado" :showFilterMatchModes="false" style="min-width:5rem">
						<template #body="{data}">
							<span style="margin-left: .5em; vertical-align: middle" class="image-text rojo">
								<b>{{ formatoAnulado(data) }}</b>
							</span>
						</template>
					</Column>
					<Column header="N° Recibo" filterField="NroRecibo" style="min-width:5rem">
						<template #body="{data}">
							<span style="margin-left: .5em; vertical-align: middle">
								{{ data.NroRecibo }}
							</span>
						</template>
						<!-- <template #filter="{filterModel}">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Buscar por N°"/>
                        </template> -->
                        <!-- <template #filterclear="{filterCallback}">
                            <Button type="button" icon="pi pi-times" @click="filterCallback()" class="p-button-secondary"></Button>
                        </template> -->
                        <!-- <template #filterapply="{filterCallback}">
                            <Button type="button" icon="pi pi-check" @click="filterCallback()" class="p-button-success"></Button>
                        </template> -->
					</Column>
					<Column header="Fecha" filterField="Fecha" style="min-width:8rem">
						<template #body="{data}">
							<span style="margin-left: .5em; vertical-align: middle">
								{{ formatDate(data.Fecha) }}
							</span>
						</template>
					</Column>
					<Column header="Subtipo de Ingreso" filterField="NombreSubtipo" style="min-width:14rem">
						<template #body="{data}">
							<span style="margin-left: .5em; vertical-align: middle" class="image-text">
								{{ formatoSubtipo(data.IdParametroSubtipo) }}
							</span>
						</template>
					</Column>
					<Column header="Monto Total" filterField="ImporteTotalBoleta" dataType="numeric" style="min-width:5rem">
						<template #body="{data}">
							<span style="margin-left: .5em; vertical-align: middle" class="image-text">
								{{ formatoMoneda(data.ImporteTotalBoleta) }}
							</span>
						</template>
					</Column>
					<Column header="Opciones" style="min-width:12rem">
						<template #body="{data}">
							<Button icon="pi pi-file-pdf" class="p-button-rounded p-button-warning mr-2" @click="valueImpresion=0,imprimir(data)" v-tooltip="'Imprimir PDF'" />
							<Button icon="pi pi-print" class="p-button-rounded p-button-info mr-2" @click="valueImpresion=1,imprimir(data)" v-tooltip="'Imprimir Matricial'" />
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-secondary mr-2" @click="modalEditar(data)" v-tooltip="'Editar'" />
							<Button v-if="!data.Anulado" icon="pi pi-times" class="p-button-rounded p-button-danger mr-2" @click="confirmAnularRegistro(data)" v-tooltip="'Anular registro'" />
              <Button v-else icon="pi pi-check" class="p-button-rounded p-button-success mr-2" @click="confirmAnularRegistro(data)" v-tooltip="'Activar registro'" />
							<!-- <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mt-2" @click="confirmEliminarRegistro(data)" /> -->
						</template>
					</Column>
				</DataTable>
				<Dialog v-model:visible="registroDialog" :style="{width: '700px'}" header="Detalles del registro" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<registro :title={registro} :editar={modoEditar} :actualizar={obtenerRegistros} :cerrarDialog={cerrarRegistro} :valorTipo={valorTipo}
							/>
					</div>
				</Dialog>
				<Dialog v-model:visible="anularRegistroDialog" :style="{width: '450px'}" header="Confirmar" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="registro">Esta seguro de <b>ANULAR</b> el recibo <b>N° {{ registro.NroRecibo }}</b>?</span>
					</div>
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" class="p-button-rounded p-button-secondary" @click="anularRegistroDialog = false"/>
						<Button label="Anular" icon="pi pi-check" class="p-button-rounded p-button-danger" @click="esSupervisorGlobal(registro)" />
					</template>
				</Dialog>
        <Dialog v-model:visible="activarRegistroDialog" :style="{width: '450px'}" header="Confirmar" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="registro">Esta seguro de <b>ACTIVAR</b> el recibo <b>N° {{ registro.NroRecibo }}</b>?</span>
					</div>
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" class="p-button-rounded p-button-secondary" @click="activarRegistroDialog = false"/>
						<Button label="Activar" icon="pi pi-check" class="p-button-rounded p-button-success" @click="esSupervisorGlobal(registro)" />
					</template>
				</Dialog>
				<Dialog v-model:visible="eliminarRegistroDialog" :style="{width: '450px'}" header="Confirmar" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="registro">Esta seguro de <b>ELIMINAR</b> el recibo <b>N° {{ registro.NroRecibo }}</b>?</span>
					</div>
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" class="p-button-rounded p-button-secondary" @click="eliminarRegistroDialog = false"/>
						<Button label="Eliminar" icon="pi pi-check" class="p-button-rounded p-button-danger" @click="eliminarRegistro(registro)" />
					</template>
				</Dialog>
        <Dialog v-model:visible="reporteDialog" :style="{width: '450px'}" header="Generar Reporte" :modal="true">
					<div class="align-items-center justify-content-center" :style="{padding: '0 40px'}">
						<p>Ingrese el mes que desea generar el reporte:</p>
            <Dropdown id="state" v-model="valueMes" :options="meses" optionLabel="name" placeholder="Seleccione el mes"></Dropdown>
            <br />
            <br />
            <p>Ingrese el año que desea generar el reporte:</p>
						<InputNumber id="price" v-model="valueAnio" mode="decimal" :useGrouping="false"/>
            <br />
					</div>
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" class="p-button-rounded p-button-danger" @click="reporteDialog = false"/>
						<Button label="Generar Reporte" icon="pi pi-check" class="p-button-rounded p-button-help" @click="generarReporte()" />
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
        <Dialog v-model:visible="motivoDialog" :style="{width: '450px'}" header="Motivo" :modal="true">
					<div class="align-items-center justify-content-center" :style="{padding: '0 40px'}">
						<p>Ingrese el motivo:</p>
            <Textarea v-model="motivo" placeholder="Ingrese el motivo" :autoResize="true" class="w-full"
                rows="2" cols="30" />
            <br />
          </div>
					<template #footer>
						<Button label="Aceptar" icon="pi pi-check" class="p-button-rounded p-button-success" @click="verificarMotivo(motivo)" />
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
	</div>

</template>

<script>
import {FilterMatchMode, FilterOperator} from 'primevue/api';
import registro from "./FormularioRegistro.vue"
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import FondoRotatorio from "../service/FondoRotatorio.js";
import exportFromJSON from "export-from-json";
import Supervisor from '../service/Supervisor';
import Login from "../service/Login.js";

export default {
	data() {
		return {
			ListaRegistros: [],
      listaRoles: [],
      listaDescripcionRoles: [],
			filtros: null,
			message : null,
			mensajeErrorDialog: false,
			cargando: true,
			anularRegistroDialog: false,
      activarRegistroDialog: false,
			eliminarRegistroDialog: false,
			registroDialog: false,
      //viene de los props
			registro: null,
			modoEditar: false,
      valorTipo: null,
      //
      reporteDialog: false,
      meses: [
        {
          cod: 1,
          name: "Enero"
        },
        {
          cod: 2,
          name: "Febrero"
        },
        {
          cod: 3,
          name: "Marzo"
        },
        {
          cod: 4,
          name: "Abril"
        },
        {
          cod: 5,
          name: "Mayo"
        },
        {
          cod: 6,
          name: "Junio"
        },
        {
          cod: 7,
          name: "Julio"
        },
        {
          cod: 8,
          name: "Agosto"
        },
        {
          cod: 9,
          name: "Setiembre"
        },
        {
          cod: 10,
          name: "Octubre"
        },
        {
          cod: 11,
          name: "Noviembre"
        },
        {
          cod: 12,
          name: "Diciembre"
        }
      ],
      valueImpresion: null,
      valueMes: null,
      valueAnio: null,
      listReporte: [],
      PDFoCSV: null,
      listaPorAnio: new Date().getFullYear(),
      supervisorDialog: false,
      usuario: null,
      clave: null,
      motivoDialog: null,
      cargandoSupervisor: false,
      ingresoCredenciales: false
		}
	},
  fondoRotatorio: null,
  supervisor: null,
  login: null,
	components:{
		"registro": registro, 
	},
	methods: {
    abrirDirectoDialogSupervisor(registro){
      this.motivoDialog=true;
      this.registro = registro;
      this.usuario = this.$store.state.userName;
      this.anularRegistroDialog = false;
      this.activarRegistroDialog = false;
      this.motivo = null;
    },
    //si inicia sesion con usuario supervisor no pedira credenciales para nada
    esSupervisorGlobal(registro){
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
            this.abrirDirectoDialogSupervisor(registro);
          }
          else{
            this.abrirDialogSupervisor(registro);
          }
        }
      })
      .catch(error=>{
        this.message = error;
        this.mensajeErrorDialog = true;
      })
    },
    verificarMotivo(motivo){
      if(motivo.length>14&&motivo.length<21){
        this.anularRegistro(this.registro,motivo)
      }
      else{
        this.message = "El motivo debe tener más de 15 caracteres pero menos de 20";
        this.mensajeErrorDialog = true;
      }
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
                this.motivoDialog=true;
            }
            else{
              this.message = "El usuario no es supervisor, intente de nuevo con un usuario supervisor.";
              this.mensajeErrorDialog = true;
            }
          }
        })
    },
    abrirDialogSupervisor(registro){
      this.supervisorDialog = true;
      this.registro = registro;
      this.anularRegistroDialog = false;
      this.activarRegistroDialog = false;
      this.usuario = null;
      this.clave = null;
      this.motivo = null;
      this.cargandoSupervisor = false;
      this.ingresoCredenciales = false;
    },
		validarRoles(){
      if(this.$store.state.isAuthenticated){
        const username = {
          Usuario: this.$store.state.userName
        }
        this.supervisor.getListaRolesPorUsuario(username)
        .then(data=>{
          this.listaRoles = data;
          if(this.listaRoles.length==0){
            this.$router.push({ path: '/access' })
          }
          else{
            this.listaRoles.map((element)=>{
              this.listaDescripcionRoles.push(element.Descripcion);
            })
            let existeRolIngresosPropios = this.listaDescripcionRoles.includes('Fondo Rotatorio');
            let existeRolSupervisor = this.listaDescripcionRoles.includes('Supervisor');
            if(!(existeRolIngresosPropios || existeRolSupervisor)){
              this.$router.push({ path: '/access' })
            }
          }
        })
      }
    },
    noLogin(){
      if(!this.$store.state.isAuthenticated){this.$router.push({ path: '/login' })}
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
		formatoAnulado(value){
      if(value.Anulado){
        return "Anulado"
      }
      else{
        return " "
      }
    },
    abrirReporte(value){
      this.reporteDialog=true
      this.valueMes = null
      this.valueAnio= null
      this.PDFoCSV = value
    },
		reportePDF(listaRegistros,valueReport){
      let fechaActual = new Date();
      fechaActual = fechaActual.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const listNroRecibo = [];
      const listFecha = [];
      const listImporteTotalBoleta = [];
      const listAnulado = [];
      const listMontoIgv = [];
      const listVenta = [];
      const listIgv = [];
      const listMotivo = [];
      const listUsuario = [];
      let sumaImporteTotal = 0;
      listaRegistros.map((element)=>{
        listNroRecibo.push(element.NroRecibo)
        listFecha.push(element.Fecha.slice(0,10))
        listIgv.push(element.Igv+"%")
        listMontoIgv.push(element.MontoIgv.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}))
        listVenta.push((element.ImporteTotalBoleta - element.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}))
        listImporteTotalBoleta.push(
          element.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
        )
        if(!element.Anulado){
          sumaImporteTotal += parseFloat(element.ImporteTotalBoleta)
          listAnulado.push(' ');
          listMotivo.push(' ')
          listUsuario.push(' ')
        }
        else{
          listAnulado.push('A')
          listMotivo.push(element.MotivoAnulacion.slice(0,20))
          listUsuario.push(element.UsuarioAnulacion.slice(0,10))
        }
      })
      const listCod = [];
      const listDescripcion = [];
      listaRegistros.map((element)=>{
        if(element.IdParametroTipo==2){
          listCod.push('03')
          listDescripcion.push('Fondo Rotatorio')
        }
      })
      if(valueReport.mes){
        var date = new Date(valueReport.anio+"-"+valueReport.mes+"-"+"20");
        var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
        var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        primerDia = primerDia.toLocaleDateString('es-PE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        ultimoDia = ultimoDia.toLocaleDateString('es-PE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        let docDefinition = {
          info: {
            title: "Reporte de Fondo Rotatorio",
          },
          pageOrientation: 'landscape',
          pageMargins: [ 40,40,40,150 ],
          footer: function (currentPage, pageCount) {
              return {
                  margin: [790,100,0,0],
                  text:currentPage.toString() + ' / ' + pageCount};
          },
          defaultStyle: {
            fontSize: 10,
            bold: true
          },
          content: [
            {
              columns: [
                {
                  width:"*",
                  text: "HOSPITAL NACIONAL ARZOBISPO LOAYZA",
                },
                {
                  width: 100,
                  alignment: "right",
                  text: "Emisión: "+fechaActual
                }
              ]
            },
            {
              columns: [
                {
                  width: 130,
                  text: "FONDO ROTATORIO"
                },
                {
                  width: "*",
                  alignment: "right",
                  text: "Recibos de Ingreso desde "+primerDia +" hasta "+ultimoDia
                }
              ]
            },
            { text: "\n"},
            {
              // layout : 'headerLineOnly',
              table: {
                widths: [37,65,"*","*","*",25,85,30,20,160,80],
                body: [
                  [
                    {
                      alignment: "center",
                      text: "Nro"
                    },
                    {
                      alignment: "center",
                      text: "Fecha"
                    },
                    {
                      alignment: "center",
                      text: "Bruto"
                    },
                    {
                      alignment: "center",
                      text: "Imp. IGV"
                    },
                    {
                      alignment: "center",
                      text: "V. Venta"
                    },
                    {
                      alignment: "center",
                      text: "Cod"
                    },
                    {
                      alignment: "center",
                      text: "Tipo"
                    },
                    {
                      alignment: "center",
                      text: "IGV"
                    },
                    {
                      alignment: "center",
                      text: "Est."
                    },
                    {
                      alignment: "center",
                      text: "Motivo"
                    },
                    {
                      alignment: "center",
                      text: "Anulado por:"
                    }
                  ],
                  [
                    {
                      type: "none",
                      ol: [listNroRecibo]
                    },
                    {
                      type: "none",
                      ol: [listFecha]
                    },
                    {
                      alignment: "right",
                      type: "none",
                      ol: [listImporteTotalBoleta]
                    },
                    {
                      alignment: "right",
                      type: "none",
                      ol: [listMontoIgv]
                    },
                    {
                      alignment: "right",
                      type: "none",
                      ol: [listVenta]
                    },
                    {
                      type: "none",
                      ol: [listCod]
                    },
                    {
                      type: "none",
                      ol: [listDescripcion]
                    },
                    {
                      alignment: "right",
                      type: "none",
                      ol: [listIgv]
                    },
                    {
                      bold: true,
                      color: 'red',
                      type:"none",
                      ol: [listAnulado]
                    },
                    {
                      type: "none",
                      ol: [listMotivo]
                    },
                    {
                      type:"none",
                      ol: [listUsuario]
                    }
                  ],
                  [
                    {
                      alignment: "center",
                      text: "Total"
                    },
                    {
                      colSpan: 2,
                      alignment: "right",  
                      text: sumaImporteTotal.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                    },{},
                    {
                      colSpan: 8,
                      text: " "
                    },{},{},{},{},{},{},{}
                  ]
                ]
              }
            }
          ]
        };
        pdfMake.createPdf(docDefinition).open();
      }
      else{
        let docDefinition = {
          info: {
            title: "Reporte de Fondo Rotatorio",
          },
          pageOrientation: 'landscape',
          pageMargins: [ 40,40,40,150 ],
          footer: function (currentPage, pageCount) {
              return {
                  margin: [790,100,0,0],
                  text:currentPage.toString() + ' / ' + pageCount};
          },
          defaultStyle: {
            fontSize: 10,
            bold: true
          },
          content: [
            {
              columns: [
                {
                  width:"*",
                  text: "HOSPITAL NACIONAL ARZOBISPO LOAYZA",
                },
                {
                  width: 100,
                  alignment: "right",
                  text: "Emisión: "+fechaActual
                }
              ]
            },
            {
              columns: [
                {
                  width: 130,
                  text: "FONDO ROTATORIO"
                },
                {
                  width: "*",
                  alignment: "right",
                  text: "Recibos de Ingreso del año "+valueReport.anio
                }
              ]
            },
            { text: "\n"},
            {
              table: {
                widths: [37,65,"*","*","*",25,85,30,20,160,80],
                body: [
                  [
                    {
                      alignment: "center",
                      text: "Nro"
                    },
                    {
                      alignment: "center",
                      text: "Fecha"
                    },
                    {
                      alignment: "center",
                      text: "Bruto"
                    },
                    {
                      alignment: "center",
                      text: "Imp. IGV"
                    },
                    {
                      alignment: "center",
                      text: "V. Venta"
                    },
                    {
                      alignment: "center",
                      text: "Cod"
                    },
                    {
                      alignment: "center",
                      text: "Tipo"
                    },
                    {
                      alignment: "center",
                      text: "IGV"
                    },
                    {
                      alignment: "center",
                      text: "Est."
                    },
                    {
                      alignment: "center",
                      text: "Motivo"
                    },
                    {
                      alignment: "center",
                      text: "Anulado por:"
                    }
                  ],
                  [
                    {
                      alignment: "center",
                      type: "none",
                      ol: [listNroRecibo]
                    },
                    {
                      alignment: "center",
                      type: "none",
                      ol: [listFecha]
                    },
                    {
                      alignment: "right",
                      type: "none",
                      ol: [listImporteTotalBoleta]
                    },
                    {
                      alignment: "right",
                      type: "none",
                      ol: [listMontoIgv]
                    },
                    {
                      alignment: "right",
                      type: "none",
                      ol: [listVenta]
                    },
                    {
                      alignment: "center",
                      type: "none",
                      ol: [listCod]
                    },
                    {
                      alignment: "center",
                      type: "none",
                      ol: [listDescripcion]
                    },
                    {
                      alignment: "center",
                      type: "none",
                      ol: [listIgv]
                    },
                    {
                      bold: true,
                      color: 'red',
                      type:"none",
                      ol: [listAnulado]
                    },
                    {
                      type: "none",
                      ol: [listMotivo]
                    },
                    {
                      type:"none",
                      ol: [listUsuario]
                    }
                  ],
                  [
                    {
                      alignment: "center",
                      text: "Total"
                    },
                    {
                      colSpan: 2,
                      alignment: "right",  
                      text: sumaImporteTotal.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                    },{},
                    {
                      colSpan: 8,
                      text: " "
                    },{},{},{},{},{},{},{}
                  ]
                ]
              }
            }
          ]
        };
        pdfMake.createPdf(docDefinition).open();
      }
    },
    generarReporte(){
      if(this.PDFoCSV==1){
        let estado = 0;
      let valueReport = {}
      if(this.valueMes&&this.valueAnio){
        valueReport={
        mes: this.valueMes.cod,
        anio: this.valueAnio
        }
        estado = 1
      }
      else if(!this.valueMes && this.valueAnio){
        valueReport={
          anio: this.valueAnio
        }
        estado= 2
      }
      else {
        alert("Falta ingresar el año")
        estado = 0
      }
      if(estado==1){
        this.fondoRotatorio.getReporteRegistros(valueReport)
        .then(data => {
          this.listReporte = data;
          if(this.listReporte.length==0){
            alert("No se ha encontrado registros en el tiempo solicitado")
          }
          else{
            this.reportePDF(this.listReporte, valueReport)
          }
        })
        .catch(err=>{
          this.message = err;
          this.mensajeErrorDialog=true;
        })
      }
      else if(estado==2){
        this.fondoRotatorio.getReporteRegistrosPorAnnio(valueReport)
        .then(data => {
          this.listReporte = data;
          if(this.listReporte.length==0){
            alert("No se ha encontrado registros en el año solicitado")
          }
          else{
            this.reportePDF(this.listReporte, valueReport)
          }
        })
        .catch(err=>{
          this.message = err;
          this.mensajeErrorDialog=true;
        })
      }
      }
      else if(this.PDFoCSV==2){
        let estado = 0;
        let valueReport = {}
        if(this.valueMes&&this.valueAnio){
          valueReport={
            mes: this.valueMes.cod,
            anio: this.valueAnio
          }
          estado = 1
        }
        else if(!this.valueMes && this.valueAnio){
          valueReport={
            anio: this.valueAnio
          }
          estado= 2
        }
        else {
          alert("Falta ingresar el año")
          estado = 0
        }
        if(estado==1){
          this.fondoRotatorio.getReporteRegistros(valueReport)
          .then(data => {
            this.listReporte = data;
            if(this.listReporte.length==0){
              alert("No se ha encontrado registros en el tiempo solicitado")
            }
            else{
              const listData = [];
              this.listReporte.map((element)=>{
                if(element.IdParametroSubtipo==11){
                  const data={
                    NroRecibo: element.NroRecibo,
                    Fecha: element.Fecha.slice(0,10),
                    Bruto: element.ImporteTotalBoleta,
                    Igv: element.Igv,
                    ImpIGV: element.MontoIgv,
                    ValorVenta: (element.ImporteTotalBoleta-element.MontoIgv),
                    Subtipo: "Recaudación por efectivo de caja",
                    Anulado: element.Anulado,
                    MotivoAnulacion: element.MotivoAnulacion,
                    FechaAnulacion: element.FechaAnulacion,
                    AnuladoPor: element.UsuarioAnulacion,
                    MotivoActivacion: element.MotivoActivacion,
                    FechaActivacion: element.FechaActivacion,
                    ActivadoPor: element.UsuarioActivacion
                  }
                  listData.push(data)
                }
                if(element.IdParametroSubtipo==12){
                  const data={
                    NroRecibo: element.NroRecibo,
                    Fecha: element.Fecha.slice(0,10),
                    Bruto: element.ImporteTotalBoleta,
                    Igv: element.Igv,
                    ImpIGV: element.MontoIgv,
                    ValorVenta: (element.ImporteTotalBoleta-element.MontoIgv),
                    Subtipo: "Pago de facturas - Cheque",
                    Anulado: element.Anulado,
                    MotivoAnulacion: element.MotivoAnulacion,
                    FechaAnulacion: element.FechaAnulacion,
                    AnuladoPor: element.UsuarioAnulacion,
                    MotivoActivacion: element.MotivoActivacion,
                    FechaActivacion: element.FechaActivacion,
                    ActivadoPor: element.UsuarioActivacion
                  }
                  listData.push(data)
                }
                if(element.IdParametroSubtipo==13){
                  const data={
                    NroRecibo: element.NroRecibo,
                    Fecha: element.Fecha.slice(0,10),
                    Bruto: element.ImporteTotalBoleta,
                    Igv: element.Igv,
                    ImpIGV: element.MontoIgv,
                    ValorVenta: (element.ImporteTotalBoleta-element.MontoIgv),
                    Subtipo: "Pago de facturas - Nota de Abono",
                    Anulado: element.Anulado,
                    MotivoAnulacion: element.MotivoAnulacion,
                    FechaAnulacion: element.FechaAnulacion,
                    AnuladoPor: element.UsuarioAnulacion,
                    MotivoActivacion: element.MotivoActivacion,
                    FechaActivacion: element.FechaActivacion,
                    ActivadoPor: element.UsuarioActivacion
                  }
                  listData.push(data)
                }
                if(element.IdParametroSubtipo==14){
                  const data={
                    NroRecibo: element.NroRecibo,
                    Fecha: element.Fecha.slice(0,10),
                    Bruto: element.ImporteTotalBoleta,
                    Igv: element.Igv,
                    ImpIGV: element.MontoIgv,
                    ValorVenta: (element.ImporteTotalBoleta-element.MontoIgv),
                    Subtipo: "Otros pagos",
                    Anulado: element.Anulado,
                    MotivoAnulacion: element.MotivoAnulacion,
                    FechaAnulacion: element.FechaAnulacion,
                    AnuladoPor: element.UsuarioAnulacion,
                    MotivoActivacion: element.MotivoActivacion,
                    FechaActivacion: element.FechaActivacion,
                    ActivadoPor: element.UsuarioActivacion
                  }
                  listData.push(data)
                }
              })
              const data = listData;
              const fileName = "fondo-rotatorio";
              const exportType = exportFromJSON.types.xls;

              if (data) exportFromJSON({ data, fileName, exportType });
            }
          })
          .catch(err=>{
            this.message = err;
            this.mensajeErrorDialog=true;
          })
        }
        else if(estado==2){
          this.fondoRotatorio.getReporteRegistrosPorAnnio(valueReport)
          .then(data => {
            this.listReporte = data;
            if(this.listReporte.length==0){
              alert("No se ha encontrado registros en el año solicitado")
            }
            else{
              const listData = [];
              this.listReporte.map((element)=>{
                if(element.IdParametroSubtipo==11){
                  const data={
                    NroRecibo: element.NroRecibo,
                    Fecha: element.Fecha.slice(0,10),
                    Bruto: element.ImporteTotalBoleta,
                    Igv: element.Igv,
                    ImpIGV: element.MontoIgv,
                    ValorVenta: (element.ImporteTotalBoleta-element.MontoIgv),
                    Subtipo: "Recaudación por efectivo de caja",
                    Anulado: element.Anulado,
                    MotivoAnulacion: element.MotivoAnulacion,
                    FechaAnulacion: element.FechaAnulacion,
                    AnuladoPor: element.UsuarioAnulacion,
                    MotivoActivacion: element.MotivoActivacion,
                    FechaActivacion: element.FechaActivacion,
                    ActivadoPor: element.UsuarioActivacion
                  }
                  listData.push(data)
                }
                if(element.IdParametroSubtipo==12){
                  const data={
                    NroRecibo: element.NroRecibo,
                    Fecha: element.Fecha.slice(0,10),
                    Bruto: element.ImporteTotalBoleta,
                    Igv: element.Igv,
                    ImpIGV: element.MontoIgv,
                    ValorVenta: (element.ImporteTotalBoleta-element.MontoIgv),
                    Subtipo: "Pago de facturas - Cheque",
                    Anulado: element.Anulado,
                    MotivoAnulacion: element.MotivoAnulacion,
                    FechaAnulacion: element.FechaAnulacion,
                    AnuladoPor: element.UsuarioAnulacion,
                    MotivoActivacion: element.MotivoActivacion,
                    FechaActivacion: element.FechaActivacion,
                    ActivadoPor: element.UsuarioActivacion
                  }
                  listData.push(data)
                }
                if(element.IdParametroSubtipo==13){
                  const data={
                    NroRecibo: element.NroRecibo,
                    Fecha: element.Fecha.slice(0,10),
                    Bruto: element.ImporteTotalBoleta,
                    Igv: element.Igv,
                    ImpIGV: element.MontoIgv,
                    ValorVenta: (element.ImporteTotalBoleta-element.MontoIgv),
                    Subtipo: "Pago de facturas - Nota de Abono",
                    Anulado: element.Anulado,
                    MotivoAnulacion: element.MotivoAnulacion,
                    FechaAnulacion: element.FechaAnulacion,
                    AnuladoPor: element.UsuarioAnulacion,
                    MotivoActivacion: element.MotivoActivacion,
                    FechaActivacion: element.FechaActivacion,
                    ActivadoPor: element.UsuarioActivacion
                  }
                  listData.push(data)
                }
                if(element.IdParametroSubtipo==14){
                  const data={
                    NroRecibo: element.NroRecibo,
                    Fecha: element.Fecha.slice(0,10),
                    Bruto: element.ImporteTotalBoleta,
                    Igv: element.Igv,
                    ImpIGV: element.MontoIgv,
                    ValorVenta: (element.ImporteTotalBoleta-element.MontoIgv),
                    Subtipo: "Otros pagos",
                    Anulado: element.Anulado,
                    MotivoAnulacion: element.MotivoAnulacion,
                    FechaAnulacion: element.FechaAnulacion,
                    AnuladoPor: element.UsuarioAnulacion,
                    MotivoActivacion: element.MotivoActivacion,
                    FechaActivacion: element.FechaActivacion,
                    ActivadoPor: element.UsuarioActivacion
                  }
                  listData.push(data)
                }
              })
              const data = listData;
              const fileName = "fondo-rotatorio";
              const exportType = exportFromJSON.types.xls;

              if (data) exportFromJSON({ data, fileName, exportType });
            }
          })
          .catch(err=>{
            this.message = err;
            this.mensajeErrorDialog=true;
          })
        }
      }
    },
		ExportPDFFR1(registro){
			if (registro.NroVoucher) {
				let docDefinition = {
					info: {
						title: "Fondos Rotatorios" + "-N°" + registro.NroRecibo,
					},
					defaultStyle: {
						fontSize: 10,
						bold: true
					},
					content: [
						{
							columns: [
								{
								image: 'logo',
								width: 100,
								height: 90
								},
								{
								width:"*",
								text: "\nRECIBOS DE INGRESOS\n" + "Fondo Rotatorio\n\n",
								alignment: "center",
								bold: true,
								fontSize: 20,
								},
								{
								width: 145,
								table:{
									widths:[ 40,20,20,30 ],
									body:[
									[
										{
										text: "N°recibo",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Día",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Mes",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Año",
										alignment: "center",
										fillColor: '#b5b1b1'
										}
									],
									[
										{
										text: registro.NroRecibo,
										alignment: "center"
										},
										{
										text: registro.dia,
										alignment: "center"
										},
										{
										text: registro.mes,
										alignment: "center"
										},
										{
										text: registro.anio,
										alignment: "center"
										}
									]
									]
								}
								}
							]
						},
						{ text: "\n" },
						{
						table: {
							widths: [50, "*", 50, 51],
							heights: [10, 10, 250],
							body: [
							[
								{
								text: "Codigo",
								rowSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{
								text: "Concepto",
								rowSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{
								text: "Importe",
								colSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{},
							],
							[
								{},
								{},
								{ text: "Parcial", alignment: "center", bold: true, fillColor:'#dedede' },
								{ text: "Total", alignment: "center", bold: true, fillColor:'#dedede' },
							],
							[
								{ text: "12010301" },
								[
								{
									layout: 'noBorders',
									table: {
									widths: ["*"],
									heights: [10, 170],
									body: [
										[' '],
										[
                      {
                        text: "131612     Medicina"
                      }
										]
									]
									},
								},
								{
									text: "VENTA DE MEDICAMENTOS AL CONTADO\nVOUCHER N°"+registro.NroVoucher+"     MONTO   S/."+registro.MontoVoucher.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
									+"\nDEPOSITO EN EFECTIVO BANCO DE LA NACIÓN\nFARMACIA HOSPITAL ARZOBISPO LOAYZA"}
								],
								[
								{
									layout: 'noBorders',
									table: {
									widths: ["*"],
									heights: [10, 170],
									body: [
										[' '],
										[
										{
											alignment: "right",
											text: registro.listBoletas[0].ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
										}
										]
									]
									},
								}
								],
								{
                  alignment: "right",
                  text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
								}
							],
							[
								{},
                {
                  text: "Base Imponible:   S/."+(registro.ImporteTotalBoleta-registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
                  +"    IGV    "+registro.Igv+"%:   S/."+registro.MontoIgv.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
                },
                {},
								{
                  alignment: "right",
                  text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
								}
							]
							],
						},
						},
						{ text: "\n" },
						{
						table: {
							widths: ["*", "*", "*", "*"],
							body: [
							[
								{
								text: "CONTABILIDAD PATRIMONIAL",
								alignment: "center",
								colSpan: 4,
								fillColor: '#b5b1b1'
								},
								{},
								{},
								{},
							],
							[
								{ text: "CODIGO", alignment: "center", colSpan: 2, fillColor:'#dedede' },
								{},
								{ text: "IMPORTE", alignment: "center", colSpan: 2, fillColor:'#dedede' },
								{},
							],
							[
								{ text: "CUENTA MAYOR", alignment: "center", fillColor:'#dedede' },
								{ text: "SUB-CUENTAS", alignment: "center", fillColor:'#dedede' },
								{ text: "DEBE", alignment: "center", fillColor:'#dedede' },
								{ text: "HABER", alignment: "center", fillColor:'#dedede' },
							],
							[
								{ text: "11010101" },
								{ text: "CAJA MN" },
								{ text: (registro.ImporteTotalBoleta-registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
								{},
							],
							[
								{ text: "2101010501" },
								{ text: "IGV CTA. PROPIA" },
								{ text: registro.MontoIgv.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
								{},
							],
							[
								{ text: "12010301" },
								{ text: "VTA. DE BIENES" },
								{},
								{ text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
							],
							],
						},
						},
						{ text: "\n" },
						{
						layout: "noBorders",
						table: {
							widths: [200, "*"],
							body: [
							[
								{
								table: {
									widths: [50, 50],
									body: [
									[
										{ text: "DEBE", alignment: "center",fillColor: '#b5b1b1' },
										{ text: "HABER", alignment: "center",fillColor: '#b5b1b1' },
									],
									["81", "82"],
									],
								},
								},
								{
								stack: [
									{
									fontSize: 10,
									table: {
										widths: ["*"],
										heights: [70, 25, 70, 25],
										body: [
										[{ text: " ", alignment: "center" }],
										[
											{
											text: "(1) DIRECTOR DE PRESUPUESTO Y CONTABILIDAD\n(SELLO Y FIRMA)",
											alignment: "center",
											},
										],
										[{ text: " ", alignment: "center" }],
										[
											{
											text: "(2) RECEPCIONISTA DEL DEPOSITO\n(SELLO Y FIRMA)",
											alignment: "center",
											},
										],
										],
									},
									},
								],
								},
							],
							],
						},
						},
					],
					images:{
						logo:'data:image/png;base64,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',
					}
				};
				pdfMake.createPdf(docDefinition).print();
			}
			else{
				let docDefinition = {
					info: {
						title: "Fondos Rotatorios" + "-N°" + registro.NroRecibo,
					},
					defaultStyle: {
						fontSize: 10,
						bold: true
					},
					content: [
						{
							columns: [
								{
								image: 'logo',
								width: 100,
								height: 90
								},
								{
								width:"*",
								text: "\nRECIBOS DE INGRESOS\n" + "Fondo Rotatorio\n\n",
								alignment: "center",
								bold: true,
								fontSize: 20,
								},
								{
								width: 145,
								table:{
									widths:[ 40,20,20,30 ],
									body:[
									[
										{
										text: "N°recibo",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Día",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Mes",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Año",
										alignment: "center",
										fillColor: '#b5b1b1'
										}
									],
									[
										{
										text: registro.NroRecibo,
										alignment: "center"
										},
										{
										text: registro.dia,
										alignment: "center"
										},
										{
										text: registro.mes,
										alignment: "center"
										},
										{
										text: registro.anio,
										alignment: "center"
										}
									]
									]
								}
								}
							]
						},
						{ text: "\n" },
						{
						table: {
							widths: [50, "*", 50, 50],
							heights: [10, 10, 250],
							body: [
							[
								{
								text: "Codigo",
								rowSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{
								text: "Concepto",
								rowSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{
								text: "Importe",
								colSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{},
							],
							[
								{},
								{},
								{ text: "Parcial", alignment: "center", bold: true, fillColor:'#dedede' },
								{ text: "Total", alignment: "center", bold: true, fillColor:'#dedede' },
							],
							[
								{ text: "12010301" },
								[
								{
									layout: 'noBorders',
									table: {
									widths: ["*"],
									heights: [10, 170],
									body: [
										[' '],
										[
                      {
                        text: "131612     Medicina"
                      }
										]
									]
									},
								},
								{
									text: "VENTA DE MEDICAMENTOS AL CONTADO"
									+"\nDEPOSITO EN EFECTIVO BANCO DE LA NACIÓN\nFARMACIA HOSPITAL ARZOBISPO LOAYZA"}
								],
								[
								{
									layout: 'noBorders',
									table: {
									widths: ["*"],
									heights: [10, 170],
									body: [
										[' '],
										[
										{
											alignment: "right",
											text: registro.listBoletas[0].ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
										}
										]
									]
									},
								}
								],
								{
                  alignment: "right",
                  text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
								}
							],
							[
								{},
                {
                  text: "Base Imponible:   S/."+(registro.ImporteTotalBoleta-registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
                  +"    IGV    "+registro.Igv+"%:   S/."+registro.MontoIgv.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
                },
                {},
								{
                  alignment: "right",
                  text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
								}
							]
							],
						},
						},
						{ text: "\n" },
						{
						table: {
							widths: ["*", "*", "*", "*"],
							body: [
							[
								{
								text: "CONTABILIDAD PATRIMONIAL",
								alignment: "center",
								colSpan: 4,
								fillColor: '#b5b1b1'
								},
								{},
								{},
								{},
							],
							[
								{ text: "CODIGO", alignment: "center", colSpan: 2, fillColor:'#dedede' },
								{},
								{ text: "IMPORTE", alignment: "center", colSpan: 2, fillColor:'#dedede' },
								{},
							],
							[
								{ text: "CUENTA MAYOR", alignment: "center", fillColor:'#dedede' },
								{ text: "SUB-CUENTAS", alignment: "center", fillColor:'#dedede' },
								{ text: "DEBE", alignment: "center", fillColor:'#dedede' },
								{ text: "HABER", alignment: "center", fillColor:'#dedede' },
							],
							[
								{ text: "11010101" },
								{ text: "CAJA MN" },
								{ text: (registro.ImporteTotalBoleta-registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
								{},
							],
							[
								{ text: "2101010501" },
								{ text: "IGV CTA. PROPIA" },
								{ text: registro.MontoIgv.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
								{},
							],
							[
								{ text: "12010301" },
								{ text: "VTA. DE BIENES" },
								{},
								{ text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
							],
							],
						},
						},
						{ text: "\n" },
						{
						layout: "noBorders",
						table: {
							widths: [200, "*"],
							body: [
							[
								{
								table: {
									widths: [50, 50],
									body: [
									[
										{ text: "DEBE", alignment: "center",fillColor: '#b5b1b1' },
										{ text: "HABER", alignment: "center",fillColor: '#b5b1b1' },
									],
									["81", "82"],
									],
								},
								},
								{
								stack: [
									{
									fontSize: 10,
									table: {
										widths: ["*"],
										heights: [70, 25, 70, 25],
										body: [
										[{ text: " ", alignment: "center" }],
										[
											{
											text: "(1) DIRECTOR DE PRESUPUESTO Y CONTABILIDAD\n(SELLO Y FIRMA)",
											alignment: "center",
											},
										],
										[{ text: " ", alignment: "center" }],
										[
											{
											text: "(2) RECEPCIONISTA DEL DEPOSITO\n(SELLO Y FIRMA)",
											alignment: "center",
											},
										],
										],
									},
									},
								],
								},
							],
							],
						},
						},
					],
					images:{
						logo:'data:image/png;base64,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',
					}
				};
				pdfMake.createPdf(docDefinition).print();
			}
		},
    ExportPDFFR2(registro){
      let docDefinition = {
					info: {
						title: "Fondos Rotatorios" + "-N°" + registro.NroRecibo,
					},
					defaultStyle: {
						fontSize: 10,
						bold: true
					},
					content: [
						{
							columns: [
								{
								image: 'logo',
								width: 80,
								height: 70
								},
								{
								width:"*",
								text: "\nRECIBOS DE INGRESOS\n" + "Fondo Rotatorio\n",
								alignment: "center",
								bold: true,
								fontSize: 20,
								},
								{
								width: 145,
								table:{
									widths:[ 40,20,20,30 ],
									body:[
									[
										{
										text: "N°recibo",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Día",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Mes",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Año",
										alignment: "center",
										fillColor: '#b5b1b1'
										}
									],
									[
										{
										text: registro.NroRecibo,
										alignment: "center"
										},
										{
										text: registro.dia,
										alignment: "center"
										},
										{
										text: registro.mes,
										alignment: "center"
										},
										{
										text: registro.anio,
										alignment: "center"
										}
									]
									]
								}
								}
							]
						},
						{ text: "\n" },
						{
						table: {
							widths: [50, "*", 50, 51],
							heights: [10, 10, 270],
							body: [
							[
								{
								text: "Codigo",
								rowSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{
								text: "Concepto",
								rowSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{
								text: "Importe",
								colSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{},
							],
							[
								{},
								{},
								{ text: "Parcial", alignment: "center", bold: true, fillColor:'#dedede' },
								{ text: "Total", alignment: "center", bold: true, fillColor:'#dedede' },
							],
							[
								{ text: "12010301" },
								[
                  {
                    layout: 'noBorders',
                    table: {
                    widths: ["*"],
                    heights: [10, 140],
                    body: [
                      [' '],
                      [
                        {
                          text: "131612     Medicina"
                        }
                      ]
                    ]
                    },
                  },
                  {
                    text: registro.NombreEmpresa
                  },
                  {
                    text: registro.NotaInformativa
                  },
                  {
                    columns:[
                      { 
                        width: 130,
                        text: registro.NombreFactura
                      },
                      { 
                        width: 60,
                        alignment: "center",
                        text: registro.dd+"/"+registro.mm+"/"+registro.aa 
                      },
                      { 
                        width: 20,
                        alignment: "center",
                        text: "S/." 
                      },
                      { 
                        width: 55,
                        alignment: "right",
                        text: registro.ImporteDeposito.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                      }
                    ]
                  },
                  {
                    columns:[
                      { 
                        width: 130,
                        text: "INGRESOS PROPIOS"
                      },
                      { 
                        width: 60,
                        alignment: "center",
                        text: "MONTO" 
                      },
                      { 
                        width: 20,
                        alignment: "center",
                        text: "S/." 
                      },
                      { 
                        width: 55,
                        alignment: "right",
                        text: registro.ImporteTotalTipoIP.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                      }
                    ]
                  },
                  {
                    columns:[
                      { 
                        width: 130,
                        text: "FONDO ROTATORIO"
                      },
                      { 
                        width: 60,
                        alignment: "center",
                        text: "MONTO" 
                      },
                      { 
                        width: 20,
                        alignment: "center",
                        text: "S/." 
                      },
                      { 
                        width: 55,
                        alignment: "right",
                        text: registro.ImporteTotalTipoFR.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                      }
                    ]
                  },
                  {
                    columns:[
                      { 
                        width: 130,
                        text: "VOUCHER N°"+registro.NroVoucher
                      },
                      { 
                        width: 60,
                        alignment: "center",
                        text: "MONTO" 
                      },
                      { 
                        width: 20,
                        alignment: "center",
                        text: "S/." 
                      },
                      { 
                        width: 55,
                        alignment: "right",
                        text: registro.MontoVoucher.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                      }
                    ]
                  },
                  {
                    columns:[
                      { 
                        width: 130,
                        text: "CH/N°"+registro.NroCheque
                      },
                      { 
                        width: 60,
                        alignment: "center",
                        text: "MONTO" 
                      },
                      { 
                        width: 20,
                        alignment: "center",
                        text: "S/." 
                      },
                      { 
                        width: 55,
                        alignment: "right",
                        text: registro.MontoCheque.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                      }
                    ]
                  },
                  {
                    text: registro.NombreBanco+"\nFARMACIA HOSPITAL ARZOBISPO LOAYZA"
                  }
								],
								[
								{
									layout: 'noBorders',
									table: {
									widths: ["*"],
									heights: [10, 170],
									body: [
										[' '],
										[
										{
											alignment: "right",
											text: registro.listBoletas[0].ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
										}
										]
									]
									},
								}
								],
								{
                  alignment: "right",
                  text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
								}
							],
							[
								{},
                {
                  text: "Base Imponible:   S/."+(registro.ImporteTotalBoleta-registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
                  +"    IGV    "+registro.Igv+"%:   S/."+registro.MontoIgv.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
                },
                {},
								{
                  alignment: "right",
                  text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
								}
							]
							],
						},
						},
						{ text: "\n" },
						{
						table: {
							widths: ["*", "*", "*", "*"],
							body: [
							[
								{
								text: "CONTABILIDAD PATRIMONIAL",
								alignment: "center",
								colSpan: 4,
								fillColor: '#b5b1b1'
								},
								{},
								{},
								{},
							],
							[
								{ text: "CODIGO", alignment: "center", colSpan: 2, fillColor:'#dedede' },
								{},
								{ text: "IMPORTE", alignment: "center", colSpan: 2, fillColor:'#dedede' },
								{},
							],
							[
								{ text: "CUENTA MAYOR", alignment: "center", fillColor:'#dedede' },
								{ text: "SUB-CUENTAS", alignment: "center", fillColor:'#dedede' },
								{ text: "DEBE", alignment: "center", fillColor:'#dedede' },
								{ text: "HABER", alignment: "center", fillColor:'#dedede' },
							],
							[
								{ text: "11010101" },
								{ text: "CAJA MN" },
								{ text: (registro.ImporteTotalBoleta-registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
								{},
							],
							[
								{ text: "2101010501" },
								{ text: "IGV CTA. PROPIA" },
								{ text: registro.MontoIgv.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
								{},
							],
							[
								{ text: "12010301" },
								{ text: "VTA. DE BIENES" },
								{},
								{ text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
							],
							],
						},
						},
						{ text: "\n" },
						{
						layout: "noBorders",
						table: {
							widths: [200, "*"],
							body: [
							[
								{
								table: {
									widths: [50, 50],
									body: [
									[
										{ text: "DEBE", alignment: "center",fillColor: '#b5b1b1' },
										{ text: "HABER", alignment: "center",fillColor: '#b5b1b1' },
									],
									["81", "82"],
									],
								},
								},
								{
								stack: [
									{
									fontSize: 10,
									table: {
										widths: ["*"],
										heights: [70, 25, 70, 25],
										body: [
										[{ text: " ", alignment: "center" }],
										[
											{
											text: "(1) DIRECTOR DE PRESUPUESTO Y CONTABILIDAD\n(SELLO Y FIRMA)",
											alignment: "center",
											},
										],
										[{ text: " ", alignment: "center" }],
										[
											{
											text: "(2) RECEPCIONISTA DEL DEPOSITO\n(SELLO Y FIRMA)",
											alignment: "center",
											},
										],
										],
									},
									},
								],
								},
							],
							],
						},
						},
					],
					images:{
						logo:'data:image/png;base64,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',
					}
      };
      pdfMake.createPdf(docDefinition).print();
    },
    ExportPDFFR3(registro){
      let docDefinition = {
					info: {
						title: "Fondos Rotatorios" + "-N°" + registro.NroRecibo,
					},
					defaultStyle: {
						fontSize: 10,
						bold: true
					},
					content: [
						{
							columns: [
								{
								image: 'logo',
								width: 80,
								height: 70
								},
								{
								width:"*",
								text: "\nRECIBOS DE INGRESOS\n" + "Fondo Rotatorio\n",
								alignment: "center",
								bold: true,
								fontSize: 20,
								},
								{
								width: 145,
								table:{
									widths:[ 40,20,20,30 ],
									body:[
									[
										{
										text: "N°recibo",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Día",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Mes",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Año",
										alignment: "center",
										fillColor: '#b5b1b1'
										}
									],
									[
										{
										text: registro.NroRecibo,
										alignment: "center"
										},
										{
										text: registro.dia,
										alignment: "center"
										},
										{
										text: registro.mes,
										alignment: "center"
										},
										{
										text: registro.anio,
										alignment: "center"
										}
									]
									]
								}
								}
							]
						},
						{ text: "\n" },
						{
						table: {
							widths: [50, "*", 50, 51],
							heights: [10, 10, 270],
							body: [
							[
								{
								text: "Codigo",
								rowSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{
								text: "Concepto",
								rowSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{
								text: "Importe",
								colSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{},
							],
							[
								{},
								{},
								{ text: "Parcial", alignment: "center", bold: true, fillColor:'#dedede' },
								{ text: "Total", alignment: "center", bold: true, fillColor:'#dedede' },
							],
							[
								{ text: "12010301" },
								[
                  {
                    layout: 'noBorders',
                    table: {
                    widths: ["*"],
                    heights: [10, 160],
                    body: [
                      [' '],
                      [
                        {
                          text: "131612     Medicina"
                        }
                      ]
                    ]
                    },
                  },
                  {
                    text: registro.NombreEmpresa
                  },
                  {
                    text: registro.NotaInformativa
                  },
                  {
                    columns:[
                      { 
                        width: 130,
                        text: registro.NombreFactura
                      },
                      { 
                        width: 60,
                        alignment: "center",
                        text: registro.dd+"/"+registro.mm+"/"+registro.aa 
                      },
                      { 
                        width: 20,
                        alignment: "center",
                        text: "S/." 
                      },
                      { 
                        width: 55,
                        alignment: "right",
                        text: registro.ImporteDeposito.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                      }
                    ]
                  },
                  {
                    columns:[
                      { 
                        width: 130,
                        text: "INGRESOS PROPIOS"
                      },
                      { 
                        width: 60,
                        alignment: "center",
                        text: "MONTO" 
                      },
                      { 
                        width: 20,
                        alignment: "center",
                        text: "S/." 
                      },
                      { 
                        width: 55,
                        alignment: "right",
                        text: registro.ImporteTotalTipoIP.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                      }
                    ]
                  },
                  {
                    columns:[
                      { 
                        width: 130,
                        text: "FONDO ROTATORIO"
                      },
                      { 
                        width: 60,
                        alignment: "center",
                        text: "MONTO" 
                      },
                      { 
                        width: 20,
                        alignment: "center",
                        text: "S/." 
                      },
                      { 
                        width: 55,
                        alignment: "right",
                        text: registro.ImporteTotalTipoFR.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                      }
                    ]
                  },
                  {
                    columns:[
                      { 
                        width: 130,
                        text: "ABONO N°"+registro.NroNotaAbono
                      },
                      { 
                        width: 60,
                        alignment: "center",
                        text: "MONTO" 
                      },
                      { 
                        width: 20,
                        alignment: "center",
                        text: "S/." 
                      },
                      { 
                        width: 55,
                        alignment: "right",
                        text: registro.MontoNotaAbono.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
                      }
                    ]
                  },
                  {
                    text: "FARMACIA HOSPITAL ARZOBISPO LOAYZA"
                  }
								],
								[
								{
									layout: 'noBorders',
									table: {
									widths: ["*"],
									heights: [10, 170],
									body: [
										[' '],
										[
										{
											alignment: "right",
											text: registro.listBoletas[0].ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
										}
										]
									]
									},
								}
								],
								{
                  alignment: "right",
                  text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
								}
							],
							[
								{},
                {
                  text: "Base Imponible:   S/."+(registro.ImporteTotalBoleta-registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
                  +"    IGV    "+registro.Igv+"%:   S/."+registro.MontoIgv.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
                },
                {},
								{
                  alignment: "right",
                  text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
								}
							]
							],
						},
						},
						{ text: "\n" },
						{
						table: {
							widths: ["*", "*", "*", "*"],
							body: [
							[
								{
								text: "CONTABILIDAD PATRIMONIAL",
								alignment: "center",
								colSpan: 4,
								fillColor: '#b5b1b1'
								},
								{},
								{},
								{},
							],
							[
								{ text: "CODIGO", alignment: "center", colSpan: 2, fillColor:'#dedede' },
								{},
								{ text: "IMPORTE", alignment: "center", colSpan: 2, fillColor:'#dedede' },
								{},
							],
							[
								{ text: "CUENTA MAYOR", alignment: "center", fillColor:'#dedede' },
								{ text: "SUB-CUENTAS", alignment: "center", fillColor:'#dedede' },
								{ text: "DEBE", alignment: "center", fillColor:'#dedede' },
								{ text: "HABER", alignment: "center", fillColor:'#dedede' },
							],
							[
								{ text: "11010101" },
								{ text: "CAJA MN" },
								{ text: (registro.ImporteTotalBoleta-registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
								{},
							],
							[
								{ text: "2101010501" },
								{ text: "IGV CTA. PROPIA" },
								{ text: registro.MontoIgv.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
								{},
							],
							[
								{ text: "12010301" },
								{ text: "VTA. DE BIENES" },
								{},
								{ text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
							],
							],
						},
						},
						{ text: "\n" },
						{
						layout: "noBorders",
						table: {
							widths: [200, "*"],
							body: [
							[
								{
								table: {
									widths: [50, 50],
									body: [
									[
										{ text: "DEBE", alignment: "center",fillColor: '#b5b1b1' },
										{ text: "HABER", alignment: "center",fillColor: '#b5b1b1' },
									],
									["81", "82"],
									],
								},
								},
								{
								stack: [
									{
									fontSize: 10,
									table: {
										widths: ["*"],
										heights: [70, 25, 70, 25],
										body: [
										[{ text: " ", alignment: "center" }],
										[
											{
											text: "(1) DIRECTOR DE PRESUPUESTO Y CONTABILIDAD\n(SELLO Y FIRMA)",
											alignment: "center",
											},
										],
										[{ text: " ", alignment: "center" }],
										[
											{
											text: "(2) RECEPCIONISTA DEL DEPOSITO\n(SELLO Y FIRMA)",
											alignment: "center",
											},
										],
										],
									},
									},
								],
								},
							],
							],
						},
						},
					],
					images:{
						logo:'data:image/png;base64,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',
					}
      };
      pdfMake.createPdf(docDefinition).print();
    },
    ExportPDFFR4(registro){
      let docDefinition = {
					info: {
						title: "Fondos Rotatorios" + "-N°" + registro.NroRecibo,
					},
					defaultStyle: {
						fontSize: 10,
						bold: true
					},
					content: [
						{
							columns: [
								{
								image: 'logo',
								width: 80,
								height: 70
								},
								{
								width:"*",
								text: "\nRECIBOS DE INGRESOS\n" + "Fondo Rotatorio\n",
								alignment: "center",
								bold: true,
								fontSize: 20,
								},
								{
								width: 145,
								table:{
									widths:[ 40,20,20,30 ],
									body:[
									[
										{
										text: "N°recibo",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Día",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Mes",
										alignment: "center",
										fillColor: '#b5b1b1'
										},
										{
										text: "Año",
										alignment: "center",
										fillColor: '#b5b1b1'
										}
									],
									[
										{
										text: registro.NroRecibo,
										alignment: "center"
										},
										{
										text: registro.dia,
										alignment: "center"
										},
										{
										text: registro.mes,
										alignment: "center"
										},
										{
										text: registro.anio,
										alignment: "center"
										}
									]
									]
								}
								}
							]
						},
						{ text: "\n" },
						{
						table: {
							widths: [50, "*", 50, 51],
							heights: [10, 10, 270],
							body: [
							[
								{
								text: "Codigo",
								rowSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{
								text: "Concepto",
								rowSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{
								text: "Importe",
								colSpan: 2,
								alignment: "center",
								bold: true,
								fillColor: '#b5b1b1'
								},
								{},
							],
							[
								{},
								{},
								{ text: "Parcial", alignment: "center", bold: true, fillColor:'#dedede' },
								{ text: "Total", alignment: "center", bold: true, fillColor:'#dedede' },
							],
							[
								{ text: "12010301" },
								[
                  {
                    layout: 'noBorders',
                    table: {
                    widths: ["*"],
                    heights: [10, 140],
                    body: [
                      [' '],
                      [
                        {
                          text: "131612     Medicina"
                        }
                      ]
                    ]
                    },
                  },
                  {
                    text: registro.TextoGlosa+"\nFARMACIA HOSPITAL ARZOBISPO LOAYZA"
                  }
								],
								[
								{
									layout: 'noBorders',
									table: {
									widths: ["*"],
									heights: [10, 170],
									body: [
										[' '],
										[
										{
											alignment: "right",
											text: registro.listBoletas[0].ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
										}
										]
									]
									},
								}
								],
								{
                  alignment: "right",
                  text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
								}
							],
							[
								{},
                {
                  text: "Base Imponible:   S/."+(registro.ImporteTotalBoleta-registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
                  +"    IGV    "+registro.Igv+"%:   S/."+registro.MontoIgv.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
                },
                {},
								{
                  alignment: "right",
                  text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
								}
							]
							],
						},
						},
						{ text: "\n" },
						{
						table: {
							widths: ["*", "*", "*", "*"],
							body: [
							[
								{
								text: "CONTABILIDAD PATRIMONIAL",
								alignment: "center",
								colSpan: 4,
								fillColor: '#b5b1b1'
								},
								{},
								{},
								{},
							],
							[
								{ text: "CODIGO", alignment: "center", colSpan: 2, fillColor:'#dedede' },
								{},
								{ text: "IMPORTE", alignment: "center", colSpan: 2, fillColor:'#dedede' },
								{},
							],
							[
								{ text: "CUENTA MAYOR", alignment: "center", fillColor:'#dedede' },
								{ text: "SUB-CUENTAS", alignment: "center", fillColor:'#dedede' },
								{ text: "DEBE", alignment: "center", fillColor:'#dedede' },
								{ text: "HABER", alignment: "center", fillColor:'#dedede' },
							],
							[
								{ text: "11010101" },
								{ text: "CAJA MN" },
								{ text: (registro.ImporteTotalBoleta-registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
								{},
							],
							[
								{ text: "2101010501" },
								{ text: "IGV CTA. PROPIA" },
								{ text: registro.MontoIgv.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
								{},
							],
							[
								{ text: "12010301" },
								{ text: "VTA. DE BIENES" },
								{},
								{ text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), alignment: "right" },
							],
							],
						},
						},
						{ text: "\n" },
						{
						layout: "noBorders",
						table: {
							widths: [200, "*"],
							body: [
							[
								{
								table: {
									widths: [50, 50],
									body: [
									[
										{ text: "DEBE", alignment: "center",fillColor: '#b5b1b1' },
										{ text: "HABER", alignment: "center",fillColor: '#b5b1b1' },
									],
									["81", "82"],
									],
								},
								},
								{
								stack: [
									{
									fontSize: 10,
									table: {
										widths: ["*"],
										heights: [70, 25, 70, 25],
										body: [
										[{ text: " ", alignment: "center" }],
										[
											{
											text: "(1) DIRECTOR DE PRESUPUESTO Y CONTABILIDAD\n(SELLO Y FIRMA)",
											alignment: "center",
											},
										],
										[{ text: " ", alignment: "center" }],
										[
											{
											text: "(2) RECEPCIONISTA DEL DEPOSITO\n(SELLO Y FIRMA)",
											alignment: "center",
											},
										],
										],
									},
									},
								],
								},
							],
							],
						},
						},
					],
					images:{
						logo:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABWVBMVEX///8AAP7+AAIAAAD///z///v7AAAAAPv///n/AAD//v/8//8AAPn///j4AAD///ZYWvsAAPR+fvtnZ2dAOf5STv72//+WlpZqamotLS3t7e309PSAgIC0tLTj4+MICAjExMQ3Nzfd3//l5v3Mzf386OeMjIx3d3f/4+NdXV3t7f5XVP/7srfPz8/V1dWWl/ympqZCQkKfn5++wfxTU1MkJCStra1LS0uQkJAxMTEWFhZrb/6ipPuyufkeHh77urrNz/ksK/3y9f6rrfc7QPudn/fd3/mHh/vR0/j44Nz78e36xcL70832m475SUb8Ylv5GRn2npz7iYL1cmf4LCb1d3f8UU77lZf2VFn+PDz6zcT5r6T80tf6v8D83NDveGrzbHL2f37/KDX0YWRaWu+FifIeI+tqbe7//+igqO04OvtgZ/xvdusAAOWFkff7pqj3aVj05tn8jpeOccSiAAAgAElEQVR4nO1d+1/TSNdP20kyySSZpkpEIqi0FSlq1Yq6SyvQQikFuVluoq4KWB9Z5PH9/394z0xu00IF3d1H0s8ed6Gkk5n5zjlzbpmZSFIHjdyPPg+zH7fGhyTpoRtcG3wsSe4TVujpzVTqMbty5cog/D/OPzEafyANjcPvsTu32B0PngzxO4euTaZSqSfDYmvXoNjgjWu3dO/PG34Ft/yv9Tup1GR0w/3gujT40P/wcMz/Pch6xGt7fivs7Jl061H0OcW6Nsx+Dj4Jr0GVbgqaepgaGx5LXZGksSuDkzcHGcLU7QDhSOoZwL2degZdv5Ua4cOVSt24devpeOr6SNTCld+h2CMA7vX49uRgB8IrqefDT1LXgtLPwr6lbvgfxn7zxybFf0A3nkFt4R1n0dPU/c6PHOFYyh8r6eYNH+HNK6zIJB+vwdteu2HNIyneyVvsiofwaeqKN7QPXqSGIoTj3rUnqTsc4Q1JpCEuI2Pj/p8PUqkH3Qhv3PZ/34Qfdzy4I4Opwe8gvJEK2XU9NRwh5I2JCL0+eeJ1CuGQh1B68shHOBI1OnQzEpMrQe9v8Btuj0kieeOk60Hhyd+C4j0QXvevXks97Y3wyaNgoIZT15+HCB9dSw13Ihz/PRL3ngjHA4Q3UlHpW/6XIkJp8tFphFJqXPhjJPV0ODVyIYTSk5u9EV5/OO4zcfLO2JUQ4W1g4/0OhCOp38IJ1QvhCOsJR5gS5e9FCCRC+JA1041wODUeDcxYSpeCyXIewluhPJ8i6PwD79vhlHvntoBQesIHMEQojdxMBWrOR3jz99+uA/3ONM2Np08fjqV+H/IQjkRsY7jCnkQIH7ASj256FfiFdWj8RdDVITZ+j/05fB5Ct7eYjkB3HnEmTo5B/SJC9/pNV0QIRsObixHCZ8/vAN1giBhN3nGlAKFghKSxUIYihJzrtx95FUQMGHkRDOMNYKGk+9DOR/i4F8JbgOc+Y9Yw/zAkIIROPOpAyFp9LiIUpfT+4wCUh1A0g+O3TyPkXO7SpYz0Z15jQ6nb1+48v/bIm8/nI3wo9aCHjG2PoN3rY6zWByJC6MV4J0Jp0Jv6Z87DK75EefNQmGF6NCkjhFyJdM9DXvo26xKoxxc3gV54bZyH8H6HzHQQvwOYeIt3j428gJDZt8kOhENeg2ci1CevRwjvCEbwaaQGIoTPWOGzEML991mT/ldjnIkhwjuT/uVHHQgHU7rUg55ws/Vo8BGv8PfnnQi5Y+IhHOZT0P0OQmD5WIjQ5e4NJ8E0RgivnWUPn3PR5vx4HNiJES5/IcKnvhWaHBMRDveehtLkY69TXoXjg10IpecBQs8+PvfY0cNaDPPeeD7N/dSjEb/125EFuHKFjxN4IRxb1zwc53eOAwj9Zjgqg7+LCIe84fImvefTuCM3Uld6AnR9jeAP5o3rbJQYQn90dOnKmF/qSmrwcaBMffWfunk9tBa3+P2sYd8vfXA99ez5w7EXqUHBMb6Sun37t+upwGO6nRKthe7+lrpxjXtWDyPBHmGGIMULTnJF+OL542deP24Etd3pCVAauuMN9H3/FzDlwXPo0XDIdRfac+88AKwPb9985GtI/+trHkEdQT3X4IsHd7wpqA+Pv7g5OdZhiof5DY+DaOChV8HzoIz7fPJ3Hsc8FqTu4cOgpees4gdjL24+8/pxy69tSPqX/qV/6V/6l/6ly0S65BDSXFyann6dbzo6QgR8N0QIAVuXX156k2+yzzrq6UVediKO9O7lStKyFEWxrNVpVyIYEOoET6+uwVULLu41CUD/1T39WXKWVpIATlOSSQZHsdYZD538hpVkV+Efw/5q2fnVHf0J0olOyPIKQBNJs1qLTn7TAmjCRc3aWnac2Amq7jjbFnCuEyKw8RXjW9dVTdl0yK/u8Q8Ry6jQHQCodUJJKkwqk6dISSqtphQnLhJdp7un4H2PLG3tXZwEVXeau90Cei5EZTlGgkrwihYCBEOR5KIJv0JAMBk1uBBOVIVJ8KIu/+qeX5ScfSvCAlgVxbOI0cSzgGf8esRqK9lyY8PFvQgMmLytvTf5fP71xq4SGQltbXPv9d3le5tWeA0w78cDoe7klUAewTqsvIFu856jt7sWZ1zS2n3L5ZGATtpLhvrVSi5JcXDgHGk/ZItibTvh3NId8hLmJMzBPYmQ8OLQlmIFstuKA0CJLIZzS7FOwLcJv4DPyyCLK+CJMv/UI/BSV0OWWydxcOCcV8EkVJSNru90KW+dnmxkNxgSrUViwETsm3olqe06pDNqAGc1f9qwO+8CdaOBxfifdfSnaSkZTqsl0s0SHVzy06ES+UPzBVXZvvRiSqQN31RAIHFB5U/Im9BbXbnsBgPpzo4VKNLtCyMkLV87WQo+v/wvJVl3WgE/lDcXRAhmZNNnvJX89s928C8TRkTTAlezefH71v1hUbR3/1zn/hYSEVrkwnOKLIUIl//J7v0NhIgT+p4KuXiC6W0gpZceoUScj2EE8QMZtOkwxFj85/r2txCwbTXoq5W/uPXe9n1Ty/qByfurKLCHSWX6gneA67pveZ6QpV12ewi05CNUlNUL3oF1EsT/ytY/2re/h5rJwKdRLpiUIM5rJXBmL+ol/EoiK76Qatb6Be0FeRV43rFIR5GTIHrS1vCF+us0k+EdchwQumEAnLynn9thHWxoGFFaGz9gQ38Z6WRTC8M991yDQXR9OQqZl+OQFiYobwUQrQ/nl3doSwvsyw5BMZBSiOM3Ay8zeb7m0J1NLUxFLUvxeHpBmoHyT2q73+2yrkvOevSAYzU2T6DIdpTn/fC9tAQooqUwe6wpd+OQh+Kkk90wWQO+W0/G6NhZDjloWdu9S142ImTZCtMSymKvfrPHxFGiX9lFFw8ofzXpjhME7eC7tZo9Oq6TN4rwZGY5NjLKiWyF3FF2Hf1053Ue2Uf5f+UkDqZQIOICdwKruE9OuyrIIXvRE28l+d453/+5VCSTRUsLHilZr0jnqiCdwJ8fAhFli1FW4gZQYjIoPBHdJLqIkOikuSMoGeXjxXz0y0U6eRk9gwKzKGbzdbK4Gz3zVrTdZhyXRTE5DDQlCOomCKbPJ10i0/6zfc5AZbcpXfrHFWeT8yryyKx97Auq7ugbSijBoEV3epmTy0/EWY0W1VhbpgeELK5YEULNei/HyxB2kK5vJSNuffymIySRt3wdRjBBrQ2YobHlISDEW4I87hOQ0E0tAg1z8F4MzUQHYXdF8yy/lpx2dGcZwl1LMPSL5Ax/J14EgmpZEMRrW00AuCGsuwSDv9WMOQMZ6bqznwSIe47jLLYiDcN0zEaclwcLRJxXytY34sjbSlLwRLW1146M4i6iHunkHsHk3YoWMRCs4H4MnsFcmHRTd7YtrUNCT2KTkzmfEEzFZb7eNFwYpKzk45D6vShBWPFB0YQVw5b1EvfF9AvpXUsRdKimfFwk/SKihLD/1pVwwTBTpcoHFv/2CQ8JqNHmirg6X0muLZNTa8FiTLq0pLC13JpPivYeE3JZGNit6/x+/cgaV/DSBAvBFgdPe/NP/klXBp1+RoB03F3mO3WjiOQuJBD2+DWZYjbinB7pTRmqkr0asd50g4yhec6NPfoHY3PqYmdVWMbydxDWRyPK8h4W2M8CG/Fsrs6HsJobhd/VQqFQBdgFnX0CkqRqNbzB+wBjVKiCpqlW+X48MjpTxYgUWD8LUJnEPvPaJXYzXK0Wwp7wynjVVf83+yDVcwX/elXSES/UyMFHiRVgwSfSZ3JVuffAD6hqwie1DWOD6jYUxsc5KmfsT3ba1WnNttUBl2YMw1APXDo7U1NV41g1qjTNyjYMv6qCXZIpmisB7+w0VCVnP9mzdgnLRgHTP41ZuNnM2jms09kcdMxIg4SUJ5DPKmQfwfBVbEY1moNe2XZRcgegikOTlu2Eanw1paMicr/Yx3blc1W1bUMtYdow4O8S7cnFdAgwoWZAHuRRle2InJ2hxdkswgdpXLXrFKUXzIWFqlv4NC9/yZGq/qXiVnVkfGkAQtWfBdWETU1pABqrz6kw1sgo0s8lw0VqARdnh0z34IgWEp8IwldzFDUGDGionEb8ZiQ3rs66gHACUVqxq5+r1eqM3cATbZ0WjDKqHRG3YY/KU0V5oS3jnFqtqk7VrRm0qtaoXLLrPSdB2oh4mGFCX2cNm4BQzZoEucfZukFl1Ciiha8mQsW2PJeDTlwtIUwrU/MZJI8GPKza6SLGDOHhfLtGpconqiPabjCERh1udu161p6Yh7tzFGfKUzWMAKF3M82Uj2ocoal/NmBMMZ4t0sYxzDLUsHF5CiRjroKnivioAvMuU3ASnyl2jez8AQXeH07hXkxMq50IpbrdaDRGZxujKvtanqhJdjqHKUaZQ0RRZoECQowAoUTTlaxBERT0tGUhkbWr8gAIznG9NEflhQXkPatQC3WVVY0HagW1brv0S06mdr0yQFEt7fcD29nKgIQqaYrN0rFLMV6Yo9L8EYUKqmqhNlUtzNgFOlVE/1FrQ5jSqgE/CrY7UTOhyMxxz4nYjRCP2moCRLyR+8L6h6cOafYoYcAQLcxlMunjrBQgRMRA2J6RIoQqbbdBSs26TbFakKfKTHIgHlQLOZtpO9QuFxL4KIO/5HBjlpp2FYcIG7OY2gVUMqBtmLvQZ7sg0YUM22JL7dEazLnEnxh4KMkwJ2Eiu3bmMGO3oS6mZQqJ6kURSnUVKpVnGzOzGIE4Hs0D+0jpywFHOJ+VUIDQLBnF4lybCgih2cJEiRa/FIt2DWeKJpgLzNDOGBTK0CNAKA/Z1bkcPZxjZWiIkP19XMOludHcpxrVKbZrCEtf/wQhoLpdLx9JpHB1HhAimOujC0bdTSxkFirUnCvBXJDqxnc0TTfCBPQFz85UEy5YVmzMVMogkMCfzFeYHKCLAoT0aGphIaPSRoCwmpBpMZ0umV8yC4dTc9B7mBs4UwOEVRBfJokz2YSMvx4M5NCnPxcOjwZw2UOI0ezC4WH7Kq1MyKDNR03ahuklSbljGeoYMVxAKOHaAJuHA5QiOjXvJijFVMeZBfxZQuUB2ktMz0Coc4T0oG1iCZTVjO0i3FChKpAXKUII/ALROy55E5YjRNQ5tnMF25TYtwWjIdGq3aAgsUdtqLs8S7MJ08S2PVNnZQC3z0O5YYO8uGq1NADDuvCFlmyTqQ6sVsDrgJvLUyCtmTboUmqXQbMM1FyVYhmEpG5nwVZ/x1ycIaU6k9IZVPg0MD9l1xFK2wsZo2JmFjznAhShSWdLZskGvGjhoG6n0xNHDCGT75KaK7bhtznwFQxp5qt9iEiiQF2o7Ai0fzYBMlVRG4d/Qhk8N1+zDybSCxQv/Mkck4H53JxJob8zs7PpiYl00WwcTxXnPrkw0umJOTAJR0U8Y6e/zn1BVZVyQ4Pm7cOi0aY9ncJTCKtl9vM/MM1JLTNfBQcMVzKHDSzN5Lw7almMaC0r5XKMo9lydb5cLtfgo8t+mLVsrQ5DgRo1k84cZkoYTIJrgn5ozxdAA7IytFyo1REvU4eb5ytUqtWhi7hRyVYolsxcpQJ1ludBYReKmf+AnayzNqoyKjWQXD/MlKuyW/R8SR01FjIlenGESPrMLD5lMgImTMcmtGzKSDZN3zuFaSDJmEomkwskg3YHqWVfeRdgklDmG1E2XUChQx0gTuCkUnBWZS7n7LrJy0LFEhgGhHl7EsbAQcwcHMzUHIaPSIar7Drzm+E+LFFWGiqmvjMKNpc13HPTxikenk0mNlmlyAEHMVtwTdb30zYW9DYF8KSardezBeZ3Qif9ph3qyiAPLv5WFe5DTtPFMicXVbM9yfVqgfpZuwDRa8Jhyk+mvV22iyNknkVx6otqqIwSidmj+RkYz079BaNZqCxMQAGDlTPsq1Pz4J1Q/iV7gs/ixaTyVnhwSNiCOH5Zs+hXI6GeSQmj7gcYIDv1WnsOnFQb3GQjkZhrw4T5awhBTIiE6xmDFYT/WMXwUYXetBsMVjC6YNprX6CEwQDC91AsYUO1hzy0kKYt9oQU4kXrtVh902I5Y7ZreA0XjR6kGnza6qB+izbAMli9vD82+3K2jHHvtcnn85Bx5sDmne0mI12gQdW6NDNrnFEmkTguM3me1s5c7d4M042A8MzbeddG2TiaUs1Wz/rasHO9I8RzEcJEKoFI2Gf13khwz4MDBBOmnlVGtVV7AQT1bYjwRKid5IOMqtaSzkGI0Dz4dGdABJbalYvbw24iZg1q4IXYhGAzJQICMlKkPKmAs34hr5zQOfjfrsjSUrjeclusPeLhLkMYTb0OJB4Pc9C8f93gUybqumrXf5qHUi6ST+DZQbFcnBBAqmpZZg4TbUeXjLlirVK8GhSCFo4Jvhvm3/4Qa78b5lR3pKKoXE7xEKE5Oxw0e6BcqR3aRlBSTaRRj6l4PkIjRKgmDrLMzsn1OaFxI8usITJChPY8t4V0PrqkVnAzWCvUub9iKUisapsdCO1OJjIe1lUjgGPnmEOD3XbAU5DU0Z9EaM4nIqFkrjSoFPBp0oKoHjFtM2KHnUvz/D0ovih/YE9REq6GWhOS3yQ8qcBal0J7CCa3LU6FxHEVXAaIrDxjZdtfJS9RJs8Go6ga8/RsiOcgxKYhYCl4qQJZh1hDjWYdTyHlZnI+eTwFDVUJB0edlaTdcKlCXmhgI1xiI6hYTBcEDoI5KIBTJheCBnIzfv7KxJmod210tltzDkK5IcyJI9mvA3p/GOG2mSfLfSjfrZO5awY6OJrBNiWbwUMa7a3QwGrAQkvYwYY96xvQbBU8P5AcxDJr/J/HLYTwfIRwoofBOAchnReEpYaiAg2h91N+vwA4dhuVYib9xdNFUS9tRNZDrblJQq9G9ncDK5YVnAAKPmlGVJPGlyB8h3AVPDZUbdQO2xOzRodWTyQGfm4eorYgLDORGEBsJ4yxd0nWZw7Br7NZw+ynqCoAYbj4WVtzwiT/YrjMZiXi4JTYcWOuSoPUO0VuKfPJ9o2K0cHon0SI5FBbQIWCyUF4NuyCytNMzKHi4JjGM4wudQ8ISbS+1t+voBNpOhnsetsgQZNT0c0AdYAi/8mqbmYzNrPIhs2cUtsDGJb9WR5OREZAzUbX5QghoGIFZ45FQCr3S4W5Cgh3wiemHwKEzn6oaJZ8BspTwuDYLG3s54whKBXkRuVDKw7lTyKUjqI67VEBoRu2BoMKkz+nimxj4ECpRwPMEO6FPFT8dXu6GS7z00xPFPGB6ADbafCY/J7LNcOwxSYSXE7DUfw5hLKZEYZNzIVUI2tuX6W6GzilXEek50v1QlWvqQJCFigFh9JY61zwULTqW1n1Fu2jtOguqVNYJ37Had0O9A+4A7PtcmkUQtBD+y8i1GlNGNEFHCS0mJ8dDWbbhGJBPeA/DXkRoVwWdSlMuq3QIq5hBlFYx6jtsUeo2JwQnFpbbdPIAnyeEtTrgu4NNm7/VYQwctFcUq/KYSUoEibDrmE8EPbMsLPYQ4giCWdSytfQBiaRn/ZBFsMDTpJNQIjkOVEFqxmqR4faUGFWfwKjwbK6Mr6a+CGE7exoN7nSnDC/ShSmjgw1oxkj9BENu4qlsB0j8QlhQCPLtCDMGoZQwmvRTos80R3yITxPY4cQpJtzggU1jCIKtIxETRa7hB09oOyhMmJPaH5Il0Igdyp9ME9LQqtqA1MqUfasJxEFDhD94QiLoY5S05R17MwlOnQp8OxltABsBRA2w102SXDZkHtV6K+RmCvPFyPCo4LaYhlclpkqiJHaBRAmDNHSelSmcjrij2q0Z7LVbIk9sAoQJgwXyTSSWTBWtYKMs+VjtVOXsmAwVJ3ssCWyqYU8ZPm9ii1GlnZCTGOorhvNODUxV6pSd/Rrh19xEYRnUBmcpGMWy5xNLN00Ax4ozSRO1yO6HB5Csh7tWksuLkbbZzbYtKz07gkgpF/OaEK88rMITYQLs2dnR7jZVXleWK6fbh4C4S4p1XXcsqKYfitaEfaNnIvQrHTF/Xx8537I4p+NENxdd+oUD7271MRE1pS5s3woaCzvk31YOcVDZ0lYLBwtjN4k5yNEON35PfursmCHXftphBID0DgABwq8QdtzlsBdUdmFiVyozCGcUllGyOAFmN/4FZyQToQS36zQfdanwk7TQOcilOTqge2liVSvAdWuiPHhTyKcZwhNMMXZ+QnV8D0zni610+UsxeHTc502plTPGWYum31Ql0WEqo9Qd1viYbSeIn3lrWw/ByH4wrkJWw16YNvtOupA2COv3776PZqtsdtksPRgmiAuK7YPJg4yh8VabhQMo47YChy2ogtmmA46KVfOHE1MTC3UGlVwRlBpID3h04HfPGK7v5JdTGxKfM1NaW6gNzl8XQ2qluYzBxPpqcPaKH++URwIWhjokbHX6dnAfUK0axURW5vTnZkkITEjTMMaibh1K4wIxd1fHsB1Lx7G7AmLfCZBN0IRhL+wGYoONWXs0xkrizwMJka9SddRJxwBgNdxSX+zNx2SS/jaKr/q5t49n6b33KAeou91yKn20V/Uh2nvfkgmjVpEwkIwGFKh1E/Q6bsYLzouktdWuEpP2wI2hqsQmdsZEHhp/lXZkU6Ew2oVCIf9KcocsV4IhWdAXX36H6w7JqvCavUNR1iFmA+BaEqYX9MB4x/CNsXucxYvIen50FHxtjSF3+RDcRQQSoQ9hgqPbtn9/rsZLwWBLxYab0Vj+yp9kOSuiNDfxKYTZ0/Yj28t/i/E7C8SdHormliateP6YfkZCJHskA1hg6K1FIsdNJi4a6IvtvbW59ddcR4SvgCMfFsR/DZlG9h9SVYPf5/IO0U8bV7ZZyvziXPXChbsM4SYOI6+Hh2dDLN3MzYnKiBmMgT9qGl/fCOO/s0KQlyG0HGcPQgtohAxuR+f9e06Ia/F1fnsufzOkgOhxOYaKB/2OoEmWv7AToUWJuFOzDZavrY0MWgAAV3bWCSEvmGneAJggXv86+Sry7J+/6JE3rW6IAKi3fW8IzlL+2zBhSX6owrbiBgrDjJBbULQ3oGC/VN23jYJGVr3tnmFJ9hYe3HcKuvgbUvpChxAxyhrH5aJI7/e4jPSY29r2YmBGewmXXecN7vd8S17u0zSWtmTCXmz75kKzdpwpXgpGZ8Ic8BOgGud77ngJ+5raxtNMJCr7ED93WVJP2MnTExIJ+56t6D6mif5AWzi649r03pMD8TwiMi6Q6dXznobC3unACbE7T60PW7ENCSRFjf4y6u638qigQolsZyBAhEd4xPmlr5+pShnQFx1YxFNfId0ZxH06e4JGEF3b8dKKskOdw4MRT427vbZ5ORb/FAMa39Jd0h+u8XXjorv61rLx8/UiyTvMlXK3ppjtV7mmfO9qnTaSGvlsp+j/x0CLbLBHTdNY3pGsVaXQXs2t9f4qcjhsouT+Mop0aMnhFZy5zXwsrUOMxJPfxSPGNqN2UF0IpGT4LmLZm07dxUWUVmvliWHTLeiEySsnscqXnpCwQtnQCo/OCwjzN4TlNRW7mGnuRs9xJ+OLUJJavlndCtJSsJcGztgr+m4Uf5i/Vd38+fJCQ5r016yTFSAECYh+N3RmqgY5Ll7keOfDGmx9bBd2URSXQu0TRxOYe9BxPe5+Vs5ujLChKwGiOMspX8Ex9DeI90IdcmzlaBml2LMw+lguforcL5PIfRMiaY04xsh6k0PlAIodKcDoUSCxxvalhNbzxS8sVfcsENEsePobImzxY0Fz3nnPb/GSu7FOgZe9ONezXqPnXXLP8wMEDrOpvdKEsuKzYs5z6RgvSHYwN3XxHm7wlPhjIfBY0Pr3q/u418jQlpeaM+y3DvLRFp+z149auX9s7AtZSWOqVKRyLvwCYWmKFtvIHragCtr4SHKn2OexQAjsRQces02jFpbr1mE6D9GZFtj4p6KInxNUJSDAruxO61L+T+4rCqtRRLbXHBExFnseL2zYu1OQyi1Aix934x3OjggIuF1tooojAcVpTVNyL3NRaLHOLwXiTHqpSU8+NY0a2XRIfF51cO5pC/miflSlFT2TFTuCwmV2PZ2aQjw5B30kh0n4DMSfreYHu0LNiKywxB9aBK8viYk2RRmKvpiHjr3ktxeKBtNkNW1KCFstcxYO90BEcTyUWyJiWV9gNh+nS1hUHhUoaz3hS4lSxyO8nGdPbP4wHJQu8HaqN3YRoYikVfc8951mxY/7eOPPKFvt3xHLt8PmkbmuV/tHbnrpWUU7f1dx/FeHRuLVwGeS801Tx6jPI1lrbrkhMNd+tW9+zsIrwEw7b+OHGaEQbGCxmEZ/t5vgooTkRXAYq0ReVHMRDlkjR0kFN83dwhEtjU+45xv4QYgnqeBuFhb7Qtd6nDeWa2mvr7GNKjm6VC2PlN53R/2kOyzU6+slTzB4NEwU6hYeWdXU6xXUl/wkO9LZ++0BGvv0BPutSnv9uHaSjM+q4K/T9z4KRq4NNtNSQJZZdpUUfZxP6QwPGLJUW/FgrXRdMjJR8tSdqeduOcRBUJkmmUPNb4gAyJFZ29j2YHIqR9MhU+OlN/i657Zti9lc5GwJX198nYSnwhbaemJKksjri7HfUniKSJEcpzpFl+KobFc6Xuzj0SUEXF0ArZhacVfhakpu3L/aFJGOntcsbXkOMuvvAS4pe2QPtKl3F6AQbR23xInv832CQEr1/slmygxGd22uJWHOPGe7Lg85ab0R2DhEVmCyN5a9RZifjxBTvMl06t7/YPQYS/SmXb5mkuYhWsnbHebouz0j5gugoFYjfYBa1rLJauK0or3E3yRpsFfu0einc4sepq2kmv981YyiC2Uaemu8FI5FgErrRhs3L4gfYPgadPp2I/v/F9fzUOyayWtux0IZdA0cV4520XsUb629jI8MsmyllaY3/ar+/X3EXHWvdApmIZs/Vd/5Ep9glh3Wnh5JduZbrUWnf54POqTDm5MK8QIDpSFpzEAAADQSURBVOpeX8GT+HmtZCPiItv32z+KlJNOnGVLmIdWs6+CQ4ktV2AGUFiMcdJXwaHEVg2RHWF/vqJt9l+ehrwXzhiwvIMD+4m4vRDn4et+QwiEWtG+Q2unT1bSdBBhEYY3CS2lGZOjdn6IkLPhr+xOKjHeQ/IdIkj3duQpyoeYHUVzcVrkK4W0lT6FB0T4yx0gOPzVHfnHiGCmT9f7aOVsN8lkWlFatN/CCoGI5Kwl9/rRFAakI7JtoX5Zvt6DFv/bvyLqkdNHCbaziaBfgPD/AZHp2lxOUNdNAAAAAElFTkSuQmCC',
					}
      };
      pdfMake.createPdf(docDefinition).print();
    },
		imprimir(registro){
			registro.dia = registro.Fecha.slice(8,10)
			registro.mes =  registro.Fecha.slice(5,7);
			registro.anio = registro.Fecha.slice(0,4);
			if(registro.FechaGlosa){
				registro.dd = registro.FechaGlosa.slice(8,10)
				registro.mm = registro.FechaGlosa.slice(5,7);
				registro.aa = registro.FechaGlosa.slice(0,4);
			}
			if(this.valueImpresion==1){
				if (registro.IdParametroSubtipo == 11) {
					this.ExportMatricialFR1(registro);
				}
				if (registro.IdParametroSubtipo == 12) {
					this.ExportMatricialFR2(registro);
				}
				if (registro.IdParametroSubtipo == 13) {
					this.ExportMatricialFR3(registro);
				}
				if (registro.IdParametroSubtipo == 14) {
					this.ExportMatricialFR4(registro);
				}
			}
			else{
				if (registro.IdParametroSubtipo == 11) {
					this.ExportPDFFR1(registro);
				}
				if (registro.IdParametroSubtipo == 12) {
					this.ExportPDFFR2(registro);
				}
				if (registro.IdParametroSubtipo == 13) {
					this.ExportPDFFR3(registro);
				}
				if (registro.IdParametroSubtipo == 14) {
					this.ExportPDFFR4(registro);
				}
			}
    },
		ExportMatricialFR1(registro){
			if (registro.NroVoucher) {
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
					title: "Fondo Rotatorio" + "-N°" + registro.NroRecibo,
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
						text: "Fondo Rotatorio",
						alignment: "center",
						},
						{
						columns:[
							{ 
							width: 43,
							fontSize: 9,
							text: registro.NroRecibo, alignment: "center"
							},
							{ 
							width: 30,
							fontSize: 9,
							text: registro.dia, alignment: "center"
							},
							{ 
							width: 26,
							fontSize: 9,
							text: registro.mes, alignment: "center"
							},
							{ 
							width: 27,
							fontSize: 9,
							text: registro.anio, alignment: "center"
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
						text: "12010301"
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
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: "131612"
						+ "          " +
						"Medicina"
						+ "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
						},
						{
						width: 60,
						text: registro.listBoletas[0].ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text:  "VOUCHER N° "+registro.NroVoucher + "   MONTO   S/."
							+ registro.MontoVoucher.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
							(registro.ImporteTotalBoleta -registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
							+ "            IGV  " + 
							registro.Igv + "%:    " + " S/." + registro.MontoIgv.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
						},
						{
						width: 100,
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: (registro.ImporteTotalBoleta -registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: registro.MontoIgv.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
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
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
					title: "Fondo Rotatorio" + "-N°" + registro.NroRecibo,
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
						text: "Fondo Rotatorio",
						alignment: "center",
						},
						{
						columns:[
							{ 
							width: 43,
							fontSize: 9,
							text: registro.NroRecibo, alignment: "center"
							},
							{ 
							width: 30,
							fontSize: 9,
							text: registro.dia, alignment: "center"
							},
							{ 
							width: 26,
							fontSize: 9,
							text: registro.mes, alignment: "center"
							},
							{ 
							width: 27,
							fontSize: 9,
							text: registro.anio, alignment: "center"
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
						text: "12010301"
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
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: "131612"
						+ "          " +
						"Medicina"
						+ "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
						},
						{
						width: 60,
						text: registro.listBoletas[0].ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
							(registro.ImporteTotalBoleta -registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
							+ "            IGV  " + 
							registro.Igv + "%:    " + " S/." + registro.MontoIgv.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
						},
						{
						width: 100,
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: (registro.ImporteTotalBoleta -registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: registro.MontoIgv.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
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
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
		ExportMatricialFR2(registro){
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
					title: "Fondo Rotatorio" + "-N°" + registro.NroRecibo,
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
						text: "Fondo Rotatorio",
						alignment: "center",
						},
						{
						columns:[
							{ 
							width: 43,
							fontSize: 9,
							text: registro.NroRecibo, alignment: "center"
							},
							{ 
							width: 30,
							fontSize: 9,
							text: registro.dia, alignment: "center"
							},
							{ 
							width: 26,
							fontSize: 9,
							text: registro.mes, alignment: "center"
							},
							{ 
							width: 27,
							fontSize: 9,
							text: registro.anio, alignment: "center"
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
						text: "12010301"
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
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: "131612"
						+ "          " +
						"Medicina"
						+ "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
						},
						{
						width: 60,
						text: registro.listBoletas[0].ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: registro.NombreEmpresa + "\n" + registro.NotaInformativa + "\n"
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
							text: registro.NombreFactura
							},
							{
							width: 65,
							text: registro.dd + "/" + registro.mm + "/" + registro.aa,
							alignment: "center"
							},
							{
							width: 13,
							text: "S/."
							},
							{
							width: 55,
							text: registro.ImporteDeposito.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
							text: registro.ImporteTotalTipoIP.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
							text: registro.ImporteTotalTipoFR.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
							text: "VOUCHER N° "+ registro.NroVoucher
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
							text: registro.MontoVoucher.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
							text: "CH/N° "+ registro.NroCheque
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
							text: registro.MontoCheque.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: registro.NombreBanco
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
							(registro.ImporteTotalBoleta -registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
							+ "            IGV  " + 
							registro.Igv + "%:    " + " S/." + registro.MontoIgv.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
						},
						{
						width: 100,
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: (registro.ImporteTotalBoleta -registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: registro.MontoIgv.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
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
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
		ExportMatricialFR3(registro){
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
				title: "Fondo Rotatorio" + "-N°" + registro.NroRecibo,
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
						text: "Fondo Rotatorio",
						alignment: "center",
					},
					{
						columns:[
						{ 
							width: 43,
							fontSize: 9,
							text: registro.NroRecibo, alignment: "center"
						},
						{ 
							width: 30,
							fontSize: 9,
							text: registro.dia, alignment: "center"
						},
						{ 
							width: 26,
							fontSize: 9,
							text: registro.mes, alignment: "center"
						},
						{ 
							width: 27,
							fontSize: 9,
							text: registro.anio, alignment: "center"
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
						text: "12010301"
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
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: "131612"
						+ "          " +
						"Medicina"
						+ "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
					},
					{
						width: 60,
						text: registro.listBoletas[0].ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: registro.NombreEmpresa + "\n" + registro.NotaInformativa + "\n"
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
							text: registro.NombreFactura
						},
						{
							width: 65,
							text: registro.dd + "/" + registro.mm + "/" + registro.aa,
							alignment: "center"
						},
						{
							width: 13,
							text: "S/."
						},
						{
							width: 55,
							text: registro.ImporteDeposito.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
							text: registro.ImporteTotalTipoIP.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
							text: registro.ImporteTotalTipoFR.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
							text: "N° ABONO: "+ registro.NroNotaAbono
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
							text: registro.MontoNotaAbono.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						(registro.ImporteTotalBoleta -registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
						+ "            IGV  " + 
						registro.Igv + "%:    " + " S/." + registro.MontoIgv.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
					},
					{
						width: 100,
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: (registro.ImporteTotalBoleta -registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: registro.MontoIgv.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
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
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
		ExportMatricialFR4(registro){
			if(registro.TextoGlosa){
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
					title: "Fondo Rotatorio" + "-N°" + registro.NroRecibo,
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
						text: "Fondo Rotatorio",
						alignment: "center",
						},
						{
						columns:[
							{ 
							width: 43,
							fontSize: 9,
							text: registro.NroRecibo, alignment: "center"
							},
							{ 
							width: 30,
							fontSize: 9,
							text: registro.dia, alignment: "center"
							},
							{ 
							width: 26,
							fontSize: 9,
							text: registro.mes, alignment: "center"
							},
							{ 
							width: 27,
							fontSize: 9,
							text: registro.anio, alignment: "center"
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
						text: "12010301"
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
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: "131612"
						+ "          " +
						"Medicina"
						+ "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
						},
						{
						width: 60,
						text: registro.listBoletas[0].ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: registro.TextoGlosa + 
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
							(registro.ImporteTotalBoleta -registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})
							+ "            IGV  " + 
							registro.Igv + "%:    " + " S/." + registro.MontoIgv.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
						},
						{
						width: 100,
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: (registro.ImporteTotalBoleta -registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: registro.MontoIgv.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
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
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
					title: "Fondo Rotatorio" + "-N°" + registro.NroRecibo,
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
						text: "Fondo Rotatorio",
						alignment: "center",
						},
						{
						columns:[
							{ 
							width: 43,
							fontSize: 9,
							text: registro.NroRecibo, alignment: "center"
							},
							{ 
							width: 30,
							fontSize: 9,
							text: registro.dia, alignment: "center"
							},
							{ 
							width: 26,
							fontSize: 9,
							text: registro.mes, alignment: "center"
							},
							{ 
							width: 27,
							fontSize: 9,
							text: registro.anio, alignment: "center"
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
						text: "12010301"
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
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: "131612"
						+ "          " +
						"Medicina"
						+ "\n\n\n\n\n\n\n\n\n\n\n"
						},
						{
						width: 60,
						text: registro.listBoletas[0].ImporteUnitarioClasificador.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
							(registro.ImporteTotalBoleta -registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) 
							+ "            IGV  " + 
							registro.Igv + "%:    " + " S/." + registro.MontoIgv.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
						},
						{
						width: 100,
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: (registro.ImporteTotalBoleta -registro.MontoIgv).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
						text: registro.MontoIgv.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
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
						text: registro.ImporteTotalBoleta.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
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
		formatDate(fecha){
			return new Date(fecha).toLocaleDateString('es-PE', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				});
		},
		formatoSubtipo(data){
			if(data==3){
				return "Recaudación"
			}
			if(data==4){
				return "Penalidad"
			}
			if(data==5){
				return "Factura"
			}
			if(data==6){
				return "Protocolo"
			}
			if(data==7){
				return "Detracción"
			}
			if(data==8){
				return "Otros servicios"
			}
			if(data==9){
				return "Otros ingresos"
			}
			if(data==10){
				return "Ingresos diversos"
			}
			if(data==11){
				return "Recaudación por efectivo de caja"
			}
			if(data==12){
				return "Pago de facturas - Cheque"
			}
			if(data==13){
				return "Pago de facturas - Nota de Abono"
			}
			if(data==14){
				return "Otros pagos"
			}
		},
		obtenerRegistros(){
			this.cargando=true;
      if(this.listaPorAnio){
        const annio ={
          Anio: this.listaPorAnio, 
        }
        this.fondoRotatorio.getListaRegistros(annio)
        .then(data => { 
          this.cargando=false;
          this.ListaRegistros = data;
        })
        .catch(err=>{
          this.cargando=false;
          this.message = err + ". Ha ocurrido un error, actualice la pág por favor.";
          this.mensajeErrorDialog=true;
        })
      }
      else{
        this.cargando=false;
        alert("Ingrese un año por favor")
      }
		},
		anularRegistro(registro, motivo){
			this.cargando = true;
      if(!registro.Anulado){
        let datos = {
          IdRegistro: registro.IdRegistro,
          UsuarioAnulacion: this.usuario,
          MotivoAnulacion: motivo,
          FechaAnulacion: new Date(),
          Anulado: !registro.Anulado
        }
        this.fondoRotatorio.putAnularRegistros(datos)
        .then(() => {
          this.cargando = false;
          this.motivoDialog = false;
          this.supervisorDialog = false;
          this.obtenerRegistros();
          this.$toast.add({severity:'error', summary: 'Registro Anulado', detail: 'El registro N° '+registro.NroRecibo+' ha sido anulado.', life: 3000});
        })
        .catch(err=>{
          this.cargando = false;
          this.message = err + ". Ha ocurrido un error, actualice la pág por favor.";
          this.mensajeErrorDialog=true;
        })
      }
      else{
        let datos = {
          IdRegistro: registro.IdRegistro,
          UsuarioActivacion: this.usuario,
          MotivoActivacion: motivo,
          FechaActivacion: new Date(),
          Anulado: !registro.Anulado
        }
        this.fondoRotatorio.putAnularRegistros(datos)
        .then(() => {
          this.cargando = false;
          this.motivoDialog = false;
          this.supervisorDialog = false;
          this.obtenerRegistros();
          this.$toast.add({severity:'success', summary: 'Registro Activo', detail: 'El registro N° '+registro.NroRecibo+' ha sido activado.', life: 3000});
        })
        .catch(err=>{
          this.cargando = false;
          this.message = err + ". Ha ocurrido un error, actualice la pág por favor.";
          this.mensajeErrorDialog=true;
        })
      }
		},
		modalEditar(registro){
			this.registro = registro;
			this.registroDialog = true;
			this.valorTipo={
				IdParametro: 2,
				Codigo: 3,
				Descripcion: "Fondo Rotatorio"
			}
			this.modoEditar = true;
		},
		confirmAnularRegistro(registro){
			this.registro = registro;
      if(registro.Anulado){
        this.activarRegistroDialog= true;
      }
      else{
        this.anularRegistroDialog= true;
      }
		},
		confirmEliminarRegistro(registro){
			this.registro = registro;
			this.eliminarRegistroDialog= true;
		},
		formatoMoneda(value){
			return value.toLocaleString('es-PE', {style: 'currency', currency: 'PEN'});
		},
		tiposFiltros() {
			this.filtros = {
				'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
				'NombreTipo': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
				'NroRecibo': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
				'Fecha': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
				'NombreSubtipo': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
				'ImporteTotalBoleta': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
			}
		},
		BorrarFiltros() {
			this.tiposFiltros();
		},
		nuevoRegistro(){
			// this.registro = {}
			this.modoEditar = false;
			this.valorTipo={
				IdParametro: 2,
				Codigo: 3,
				Descripcion: "Fondo Rotatorio"
			}
			this.registroDialog = true;
		},
		cerrarRegistro(){
			this.registroDialog=false;
		}
	},
	created(){
    // this.noLogin();
    this.supervisor = new Supervisor();
    this.validarRoles();
    this.fondoRotatorio = new FondoRotatorio();
    this.login = new Login();
		this.obtenerRegistros();
		this.tiposFiltros();
	}
}
</script>

<style>
.mri-1 {
  margin-right: 1rem !important;
}
.rojo{
  color: red !important;
}
</style>
<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
        <Toast/>
				<div class="field col-12 grid">
					<h2 class="m-auto">Modo Supervisor</h2>
				</div>
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
							<Button label="Añadir fila" icon="pi pi-plus" class="p-button-success mr-2" @click="anadirCorrelativo()" />
						</div>
					</template>
				</Toolbar>
				<DataTable :value="ListaCorrelativo" :paginator="false" class="col-8 m-auto p-datatable-gridlines" dataKey="IdCorrelativo" :rowHover="true" 
						:loading="cargando" responsiveLayout="scroll" >
					<template #empty>
            No hay datos para mostrar.
          </template>
					<template #loading>
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          </template>
          <Column header="Año" style="min-width:3rem">
            <template #body="{data}">
              <span style="margin-left: .5em; vertical-align: middle">
                {{ data.Ano }}
              </span>
            </template>
          </Column>
					<Column header="Descripción" style="min-width:8rem">
						<template #body="{data}">
							<span style="margin-left: .5em; vertical-align: middle">
								{{ data.NombreCorrelativo }}
							</span>
						</template>
					</Column>
					<Column header="N° docs" style="min-width:3rem">
						<template #body="{data}">
							<span style="margin-left: .5em; vertical-align: middle">
								{{ data.NroCorrelativo }}
							</span>
						</template>
					</Column>
					<Column header="Opciones" style="min-width:2rem">
						<template #body="{data}">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-secondary mr-2" @click="editarNroCorrelativoDialog=true,correlativo=data" />
						</template>
					</Column>
				</DataTable>
        <Dialog v-model:visible="formularioCorrelativoDialog" :style="{width: '450px'}" header="Ingresar nuevo correlativo" :modal="true">
					<div class="align-items-center justify-content-center" :style="{padding: '0 80px'}">
            <p>Ingrese el Tipo de Correlativo</p>
            <Dropdown id="state" v-model="valueParametro" :options="opcionTipo" optionLabel="descripcion" placeholder="Seleccione el tipo"
              :class="{ 'p-invalid': enviar && !valueParametro }"></Dropdown>
            <small class="p-invalid text-red" v-if="enviar && !valueParametro"><br/>Este campo es requerido.</small>
            <br />
            <br />
            <p>Ingrese el año del Correlativo</p>
            <InputNumber id="price" v-model="valueAnio" mode="decimal" :useGrouping="false"
              :class="{ 'p-invalid': enviar && !valueAnio }"/>
            <small class="p-invalid text-red" v-if="enviar && !valueAnio"><br/>Este campo es requerido.</small>
					</div>
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" class="p-button-rounded p-button-secondary" @click="formularioCorrelativoDialog = false"/>
						<Button label="Agregar" icon="pi pi-check" class="p-button-rounded p-button-success" @click="agregarCorrelativo()" />
					</template>
				</Dialog>
        <Dialog v-model:visible="editarNroCorrelativoDialog" :style="{width: '450px'}" header="Editar N° Docs" :modal="true">
					<div class="align-items-center justify-content-center" :style="{padding: '0 40px'}">
						<InputNumber id="price" v-model="correlativo.NroCorrelativo" mode="decimal" :useGrouping="false"/>
            <br />
					</div>
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" class="p-button-rounded p-button-secondary" @click="editarNroCorrelativoDialog = false"/>
						<Button label="Modificar" icon="pi pi-check" class="p-button-rounded p-button-help" @click="modificarNroRecibo()" />
					</template>
				</Dialog>
        <Dialog v-model:visible="mensajeDialog" :style="{width: '450px'}" header="Mensaje" :modal="true" :closable="false">
					<div class="align-items-center justify-content-center" :style="{padding: '0 40px'}">
            <p>{{ message }}</p>
					</div>
					<template #footer>
						<Button label="Aceptar" icon="pi pi-check" class="p-button-rounded p-button-success" @click="cerrarMessageDialog()" />
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
import Supervisor from "../service/Supervisor.js";

export default {
	data() {
		return {
			URLCorrelativo: "http://192.168.36.121:8081/api/Correlativo",
      ListaCorrelativo: [],
      correlativo: null,
      formularioCorrelativoDialog: false,
      valueNroCorrelativo: null,
      valueAnio: null,
      opcionTipo:[
        {
          idParametro: 1,
          descripcion: 'Ingresos Propios'
        },
        {
          idParametro: 2,
          descripcion: 'Fondo Rotatorio'
        }
      ],
      valueParametro: null,
      mensajeDialog: false,
      mensajeErrorDialog: false,
      message: null,
      cargando: false,
      enviar: false,
      editarNroCorrelativoDialog: false,
      valueNroRecibo: null,
		}
	},
  supervisor: null,
	methods: {
    async modificarNroRecibo(){
      this.cargando=true;
      const datos = {
        IdCorrelativo: this.correlativo.IdCorrelativo,
        NroCorrelativo: this.correlativo.NroCorrelativo
      };
        this.supervisor.putNroCorrelativo(datos)
        .then(data=>{
          this.cargando=false;
          this.message = data;
          this.mensajeDialog = true;
        })
        .catch(error=>{
          this.cargando=false;
          this.message = error;
          this.mensajeErrorDialog= true;
        })
    },
    anadirCorrelativo(){
      this.valueParametro=null;
      this.valueAnio=null;
      this.formularioCorrelativoDialog=true;
      this.enviar=false;
    },
    cerrarMessageDialog(){
      this.mensajeDialog=false;
      this.editarNroCorrelativoDialog=false;
      this.formularioCorrelativoDialog=false;
    },
		async obtenerTablaCorrelativo(){
      this.cargando=true;
        this.supervisor.getListaCorrelativos()
        .then(data => {
          this.cargando=false;
          this.ListaCorrelativo = data;
        })
        .catch(error => {
          this.cargando=false;
          this.message = error;
          this.mensajeErrorDialog= true;
        })
    },
    async agregarCorrelativo(){
      this.enviar = true;
      if(this.valueAnio>2000&&this.valueAnio<=2050){
        const datos = {
          IdParametro: this.valueParametro.idParametro,
          NombreCorrelativo: this.valueParametro.descripcion,
          Ano: this.valueAnio
        }
        this.cargando = true
          this.supervisor.agregarNuevoCorrelativo(datos)
          .then(data => {
            this.cargando = false
            this.message = data;
            this.mensajeDialog= true;
            this.obtenerTablaCorrelativo()
          })
          .catch(error => {
            this.cargando = false
            this.message = error;
            this.mensajeErrorDialog= true;
          })
      }
      else if(!this.valueAnio||!this.valueAnio){
        this.message= 'Faltan completar campos'
        this.mensajeErrorDialog=true;
      }
      else{
        this.message= 'El año ingresado no es correcto'
        this.mensajeErrorDialog=true;
      }
      }
    },
    created: function(){
      this.supervisor = new Supervisor();
      this.obtenerTablaCorrelativo();
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
  .text-red {
  color: red;
  }
</style>
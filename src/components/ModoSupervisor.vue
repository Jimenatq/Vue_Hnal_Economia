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
				<DataTable :value="listaCorrelativo" :paginator="false" class="col-8 m-auto p-datatable-gridlines" dataKey="IdCorrelativo" :rowHover="true" 
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
        <DataTable :value="listaUsuarios" :paginator="false" class="col-8 m-auto p-datatable-gridlines" dataKey="IdUsuario" :rowHover="true" 
						:loading="cargando" responsiveLayout="scroll" >
					<template #empty>
            No hay usuarios para mostrar.
          </template>
					<template #loading>
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          </template>
          <Column header="Usuario" style="min-width:3rem">
            <template #body="{data}">
              <span style="margin-left: .5em; vertical-align: middle">
                {{ data.Usuario }}
              </span>
            </template>
          </Column>
					<Column header="Nombres Completos" style="min-width:8rem">
						<template #body="{data}">
							<span style="margin-left: .5em; vertical-align: middle">
								{{ data.NombresCompletos }}
							</span>
						</template>
					</Column>
					<Column header="Opciones" style="min-width:2rem">
						<template #body="{data}">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-secondary mr-2" @click="editarUsuarioDialog=true,usuario=data" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2" @click="eliminarUsuario(data.IdUsuario)" />
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
        <Dialog v-model:visible="editarUsuarioDialog" :style="{width: '450px'}" header="Editar Usuario" :modal="true">
					<div class="align-items-center justify-content-center" :style="{padding: '0 40px'}">
						Usuario:  {{usuario.Usuario}}
            <br/>
            Nombres Completos: {{usuario.NombresCompletos}}
            {{ asignarValores(usuario)}}
            <AutoComplete placeholder="Ingrese un rol" id="dd" :dropdown="true" :multiple="false"
              v-model="descripcion" :suggestions="autoFilteredValue"
              @change="asignarValorRol($event,usuario)"
              @complete="buscarRoles($event)" field="Descripcion" />
            <Button id="button-agregar" v-tooltip="'Agregar Rol'" icon="pi pi-plus" class="p-button-help mr-2 mt-1-8"
              @click="agregarRol()" />
              <div class="field col-12 grid" :key="i + 'neo'" v-for="(userRol, i) of listaRolesUsuario">
                <div class="field col-12 md:col-9">
                  {{ userRol.Descripcion }}
                </div>
                <div class="field col-12 md:col-3">
                  <Button icon="pi pi-times" v-tooltip="'Eliminar rol'" class="p-button-danger mr-2" @click="eliminarRol(userRol.IdUsuarioRol,i)" />
                </div>
              </div>
            <br />
					</div>
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" class="p-button-rounded p-button-secondary" @click="editarUsuarioDialog = false"/>
						<Button label="Modificar Usuario" icon="pi pi-check" class="p-button-rounded p-button-help" @click="modificarUsuario()" />
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
      listaCorrelativo: [],
      listaUsuarios: [],
      listaRoles: [],
      listaRolesUsuario: [],
      autoFilteredValue: [],
      correlativo: null,
      usuario: null,
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
      editarUsuarioDialog: false,
      valueNroRecibo: null,
      descripcion: null,
      IdRol: null,
      IdUsuario: null,
		}
	},
  supervisor: null,
	methods: {
    eliminarUsuario(IdUsuario){
      this.cargando=true;
      this.supervisor.eliminarUsuario(IdUsuario)
      .then(async(data)=>{
        this.cargando=false;
        await this.obtenerListaUsuarios();
        this.message=data;
        this.mensajeDialog=true;
      })
      .catch(error=>{
        this.cargando=false;
        this.message=error;
        this.mensajeErrorDialog=true;
      })
    },
    asignarValores(usuario){
      this.listaRolesUsuario = usuario.listRoles
    },
    eliminarRol(IdUsuarioRol,i){
      this.cargando=true;
      this.supervisor.eliminarRolUsuario(IdUsuarioRol)
      .then(async(data)=>{
        this.cargando=false;
        this.listaRolesUsuario.splice(i,1);
        await this.obtenerListaUsuarios();
        this.message=data;
        this.mensajeDialog=true;
      })
      .catch(error=>{
        this.cargando=false;
        this.message=error;
        this.mensajeErrorDialog=true;
      })
    },
    agregarRol(){
      if(this.descripcion){
        if(this.IdRol && this.IdUsuario){
          this.cargando=true;
          const rol={
            IdRol: this.IdRol,
            IdUsuario: this.IdUsuario
          }
          this.supervisor.agregarRolUsuario(rol)
          .then(data=>{
            this.cargando=false;
            this.message=data;
            this.mensajeDialog=true;
          })
          .catch(error=>{
            this.cargando=false;
            this.message=error;
            this.mensajeErrorDialog=true;
          })
        }
        else{
          alert("El rol no existe, ingrese un rol válido");
        }
      }
      else{
        alert("Debe ingresar un rol");
      }
    },
    asignarValorRol(event,usuario){
      if (event.value.Descripcion) {
        this.IdRol = event.value.IdRol;
        this.IdUsuario = usuario.IdUsuario;
      }
    },
    buscarRoles(event){
      if (!event.query.trim().length) {
        this.autoFilteredValue = [...this.listaRoles];
      }
      else {
        this.autoFilteredValue = this.listaRoles.filter(usuario => {
          return usuario.Descripcion.toString().toLowerCase().startsWith(event.query.toLowerCase())
        })
      }
    },
    async obtenerListaRoles(){
      this.supervisor.getListaRoles()
      .then(data=>{
        this.listaRoles = data;
      })
      .catch(error=>{
        this.message = error;
        this.mensajeErrorDialog = true;
      })
    },
    async obtenerListaUsuarios(){
      this.cargando = true;
      this.supervisor.getListaUsuarios()
      .then(data=>{
        this.cargando = false;
        this.listaUsuarios = data;
      })
      .catch(err=>{
        this.cargando = false;
        this.message = err;
        this.mensajeErrorDialog = true;
      })
    },
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
          this.listaCorrelativo = data;
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
      this.obtenerListaUsuarios();
      this.obtenerListaRoles();
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
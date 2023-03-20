<template>
  <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
      <div class="col-12 xl:col-6"
        style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%);">
        <div class="h-full w-full m-0 py-7 px-4"
          style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
          <div class="text-center mb-5">
            <img alt="Logo" :src="footerImage()" height="100" class="" />
            <br /><span class="text-600 font-medium">Inicia sesión para continuar</span>
          </div>

          <div class="w-full md:w-10 mx-auto">
            <label for="email1" class="block text-900 text-xl font-medium mb-2">Usuario</label>
            <InputText id="email1" v-model="usuario" type="text" class="w-full mb-3" :class="{ 'p-invalid': iniciaSesion && !usuario}" placeholder="Ingrese su usuario"
              style="padding:1rem;" />
            <small class="p-invalid text-red" v-if="iniciaSesion && !usuario">Este campo es requerido.<br/><br/></small>

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Clave</label>
            <Password id="password1" v-model="clave" placeholder="Ingrese su clave" :toggleMask="true"
              :feedback="false" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"
              :class="{ 'p-invalid': iniciaSesion && !clave}"></Password>
            <small class="p-invalid text-red" v-if="iniciaSesion && !clave">Este campo es requerido.<br/><br/></small>

            <span v-if="cargando" class="flex justify-content-center mb-4"><i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i></span>
            <Button label="Iniciar Sesión" class="w-full p-3 text-xl" @click="loguearse()"></button>
          </div>
        </div>
      </div>
    </div>
    <Dialog v-model:visible="mensajeErrorDialog" :style="{ width: '450px' }" header="Mensaje" :modal="true"
      :closable="false">
      <div class="align-items-center justify-content-center" :style="{ padding: '0 40px' }">
        <p><i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          {{ message }}</p>
      </div>
      <template #footer>
        <Button label="Aceptar" icon="pi pi-check" class="p-button-rounded p-button-danger"
          @click="mensajeErrorDialog = false" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import Login from "../service/Login.js";
import router from '../router';

export default {
  data() {
    return {
      usuario: '',
      clave: '',
      cargando: false,
      mensajeErrorDialog: false,
      message: null,
      iniciaSesion: false,
    }
  },
  login: null,
  methods: {
    obtenerRolesPorUsuario(IdUsuario){
      this.login.getUsuarioConRoles(IdUsuario)
      .then(data=>{
        this.userConRoles = data;
      })
      .catch(()=>{
        this.message ="No se pudo cargar la lista del usuario con sus roles.";
        this.mensajeErrorDialog = true;
      })
    },
    footerImage() {
      return this.$appState.darkTheme ? 'images/logo.png' : 'images/logo.png';
    },
    loguearse() {
      this.cargando = true;
      this.iniciaSesion = true;
      const user = {
        Usuario: this.usuario,
        Clave: this.clave
      }
      this.login.validarUsuario(user)
        .then(data => {
          this.cargando = false;
          if(data.error){
            this.message = data.error;
            this.mensajeErrorDialog = true;
          }
          else{
            console.log("Credenciales correctas")
            this.login.guardarToken(data);
            router.push({ path: '/dashboard' });
          }
        })
        .catch(err => {
          this.cargando = false;
          this.message = err + ". Ha ocurrido un error, actualice la pág por favor.";
          this.mensajeErrorDialog = true;
        })
    }
  },
  created() {
    this.login = new Login();
  }
}
</script>
<style>
  .text-red {
    color: red;
  }
</style>
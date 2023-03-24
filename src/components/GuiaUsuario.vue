<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h2>Modulos de la Guía</h2>
        <DataView :value="dataModulos" :layout="layout">
          <template #header>
            <div class="grid grid-nogutter">
              <div class="col-6 text-right">
                <DataViewLayoutOptions v-model="layout" />
              </div>
            </div>
          </template>

          <template #grid="modulos">
            <div class="col-12 md:col-4">
              <div class="card m-3 border-1 surface-border cursor-pointer" @click="mostrar(modulos.data.code)">
                <div class="flex align-items-center justify-content-between">
                  <div class="flex align-items-center mb-5">
                    <i class="pi pi-info-circle mr-2"></i>
                    <span class="font-semibold">{{ modulos.data.code }}</span>
                  </div>
                </div>
                <div class="text-center mb-5">
                  <div class="text-2xl font-bold mb-3">{{ modulos.data.name }}</div>
                  <div class="mb-3">Guia al usuario</div>
                  <span class="mb-3">Para mas info. Has click</span>
                </div>
              </div>
            </div>
          </template>

          <template #list="modulos">
            <div class="col-12">
              <div class=" flex flex-column md:flex-row align-items-center p-3 w-full cursor-pointer"
                @click="mostrar(modulos.data.code)">
                <div class="flex align-items-center mr-5">
                  <i class="pi pi-info-circle mr-2"></i>
                  <span class="font-semibold">{{ modulos.data.code }}</span>
                </div>
                <div class="flex-1 text-center md:text-left">
                  <div class="font-bold text-2xl mb-3 mt-3">{{ modulos.data.name }}</div>
                  <div class="mb-3">Guía al usuario</div>
                </div>
                <div
                  class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                  <span class="mb-2 align-self-center md:align-self-end">Para mas info. Has click</span>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>

  </div>
</template>

<script>
import GuiaUsuarioService from "../service/GuiaUsuarioService";
import router from '../router';

export default {
  data() {
    return {
      layout: 'grid',
      dataModulos: null,
    }
  },
  guiaUsuarioService: null,
  created() {
    this.guiaUsuarioService = new GuiaUsuarioService();
  },
  mounted() {
    this.guiaUsuarioService.getModulos().then(data => this.dataModulos = data);
  },
  methods: {
    mostrar(code) {
      switch (code) {
        // case 0:
        //   router.push({ path: '/modulo0' });
        //   break;
        case 1:
          router.push({ path: '/modulo1' });
          break;
        case 2:
          router.push({ path: '/modulo2' });
          break;
        case 3:
          router.push({ path: '/modulo3' });
          break;
        case 4:
          router.push({ path: '/modulo4' });
          break;
        case 5:
          router.push({ path: '/modulo5' });
          break;
        case 6:
          router.push({ path: '/modulo6' });
          break;
        case 7:
          router.push({ path: '/modulo7' });
          break;
        case 8:
          router.push({ path: '/modulo8' });
          break;
        case 9:
          router.push({ path: '/modulo9' });
          break;
        case 10:
          router.push({ path: '/modulo10' });
          break;
        case 11:
          router.push({ path: '/modulo11' });
          break;
        case 12:
          router.push({ path: '/modulo12' });
          break;
        case 13:
          router.push({ path: '/modulo13' });
          break;
        case 14:
          router.push({ path: '/modulo14' });
          break;
      }
    }
  }
}
</script>


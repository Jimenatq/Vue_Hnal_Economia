<template>
	<div class="layout-topbar">
		<router-link to="/home" class="layout-topbar-logo">
			<img alt="Logo" :src="topbarImage()" />
			<span>Registros</span>
		</router-link>
		<button v-tooltip="'Ocultar/Abrir Menu'" class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button"
			v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', 
			leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
			<i class="pi pi-ellipsis-v"></i>
		</button>
		<ul class="layout-topbar-menu hidden lg:flex origin-top">
			<!-- <li>
				<button class="p-link layout-topbar-button">
					<i class="pi pi-calendar"></i>
					<span>Events</span>
				</button>
			</li>
			<li>
				<button class="p-link layout-topbar-button">
					<i class="pi pi-cog"></i>
					<span>Settings</span>
				</button>
			</li> -->
			<li>
				<button class="p-link layout-topbar-button danger" v-tooltip.left="'Cerrar Sesión'"
					@click="$store.commit('logout')">
					<i class="pi pi-user-minus"></i>
					<span>Cerrar Sesión</span>
				</button>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
    methods: {
        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
        },
		onTopbarMenuToggle(event) {
            this.$emit('topbar-menu-toggle', event);
        },
		topbarImage() {
			return this.$appState.darkTheme ? 'images/logo.png' : 'images/logo.png';
		}
    },
	computed: {
		darkTheme() {
			return this.$appState.darkTheme;
		}
	}
}
</script>
<style>
	.danger{
		background-color: rgb(231, 76, 76) !important;
		color: rgb(252, 251, 251) !important;
	}
</style>
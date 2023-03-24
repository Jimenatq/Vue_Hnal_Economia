<template>
    <div class="grid">
        <div class="col-12">
			<div class="card mb-0">
				<div class="mb-3">
					<div class="text-center">
						<div class="text-900 font-medium text-xl">Hola 
                        {{ $store.state.NameCompleto }}!
						<br />
                        Usuario : 
                        {{ $store.state.userName }}</div>
						<br />
						<div class="flex justify-content-center align-items-center m-auto">
							<img class=" wdt" src="images/hospital-nacional-arzobispo-loayza.jpg" alt="hospital-nacional-arzobispo-loayza" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	created() {
        this.noLogin();
	},
	methods: {
        noLogin(){
            if(!this.$store.state.isAuthenticated){this.$router.push({ path: '/login' })}
        }
	}
}
</script>
<style>
	.wdt{
		width: 100% !important;
	}
</style>
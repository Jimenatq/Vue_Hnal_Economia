<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h3 class="text-center">Modulo N° 1</h3>
        <h4 class="text-center">¿Cómo registrar un ingreso de Ingresos Propios?</h4>
        <br />
        <div>
          <p>Nos vamos al Menú Ingresos Propios, presionamos en boton Nuevo Registro (1). </p>
          <div class="flex justify-content-center">
            <img alt="modulo1-1" src="images/guiausuario/modulo1-1.png" />
          </div>
          <br />
          <p>
            Luego vemos el formulario a rellenar, debe estar rellenado obligatoriamente
            los campos:
          </p>
          <ul type="none" class="i-green">
            <li>
              <i class="pi pi-check-circle mr-2"></i>Tipo del registro (2)
            </li>
            <li>
              <i class="pi pi-check-circle mr-2"></i>N° recibo (3)
            </li>
            <li>
              <i class="pi pi-check-circle mr-2"></i>Fecha del registro (4)
            </li>
            <li>
              <i class="pi pi-check-circle mr-2"></i>Subtipo del registro (5)
            </li>
            <li>
              <i class="pi pi-check-circle mr-2"></i>Código, nombre e importe de los clasificadores (6)
            </li>
            <li>
              <i class="pi pi-check-circle mr-2"></i>Importe total del registro (7)
            </li>
            <li>
              <i class="pi pi-check-circle mr-2"></i>La Glosa (8) puede quedar vacía, no es necesaria llenarla.
            </li>
          </ul>
          <div class="flex justify-content-center">
            <img alt="modulo1-2" src="images/guiausuario/modulo1-2.png" />
          </div>
          <br />
          <p>
            Para agregar más clasificadores se debe presionar el boton + (9) y si desea eliminarlos presione
            la X (10).
            <br />
            Después de haber llenado los campos del registro correctamente, presionamos el boton "Guardar
            Registro" (11), luego nos mostrará una ventana de confirmación y damos en aceptar (12).
          </p>
          <div class="flex justify-content-center">
            <img alt="modulo1-3" src="images/guiausuario/modulo1-3.png" />
          </div>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  methods: {

  }
}
</script>
<style>
.i-green i {
  color: rgb(117, 245, 117)
}
</style>

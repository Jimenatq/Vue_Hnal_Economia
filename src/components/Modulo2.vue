<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h3 class="text-center">Modulo N° 2</h3>
        <h4 class="text-center">¿Cómo registrar un ingreso de Fondo Rotatorio?</h4>
        <br />
        <div>
          <p>Nos vamos al Menú Fondo Rotatorio, presionamos el botón Nuevo Registro (1). </p>
          <div class="flex justify-content-center">
            <img alt="modulo2-1" src="images/guiausuario/modulo2-1.png" />
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
              <i class="pi pi-check-circle mr-2"></i>Código, nombre e importe del clasificador (6)
            </li>
            <li>
              <i class="pi pi-check-circle mr-2"></i>IGV (7)
            </li>
            <li>
              <i class="pi pi-check-circle mr-2"></i>Monto del IGV (8)
            </li>
            <li>
              <i class="pi pi-check-circle mr-2"></i>Importe total del registro (9)
            </li>
            <li>
              <i class="pi pi-check-circle mr-2"></i>La Glosa (10) debe tener todos los campos llenos para
              que la impresión salga correcta, sino se tienen los datos para llenarlo de esa forma
              mejor opte por usar el subtipo "Otros pagos" (11)
            </li>
          </ul>
          <div class="flex justify-content-center">
            <img alt="modulo2-2" src="images/guiausuario/modulo2-2.png" />
          </div>
          <div class="flex justify-content-center">
            <img alt="modulo2-3" src="images/guiausuario/modulo2-3.png" />
          </div>
          <br />
          <p>
            Después de haber llenado los campos del registro correctamente, presionamos el boton "Guardar
            Registro" (12), luego nos mostrara una ventana de confirmación y damos en aceptar (13).
          </p>
          <div class="flex justify-content-center">
            <img alt="modulo2-4" src="images/guiausuario/modulo2-4.png" />
          </div>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {

}
</script>
<style>
.i-green i {
  color: rgb(117, 245, 117)
}
</style>


export default class GuiaUsuario {

    async getModulos() {
        return await fetch('data/guiaModulos.json').then(res => res.json()).then(d => d.data);
    }
}
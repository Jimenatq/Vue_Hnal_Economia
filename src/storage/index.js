import {createStore} from 'vuex';
import VuexPersistence from 'vuex-persist';
import router from '../router';

const storage = createStore({
    state:  {
        isAuthenticated: false,
        userName: '',
        NameCompleto: ''
    },
    mutations:{
        setAuthenticated(state,value){
            state.isAuthenticated = value;
        },
        setUserName(state,userName){
            state.userName = userName;
        },
        setNameCompleto(state,NameCompleto){
            state.NameCompleto = NameCompleto;
        },
        logout(state){
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            state.userName = '';
            state.NameCompleto = '';
            router.push({ path: '/login' });
        }
    },
    plugins:[
        new VuexPersistence({
            storage: window.localStorage
        }).plugin
    ]
});

export default storage
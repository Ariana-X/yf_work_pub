import CreatePersistedState from 'vuex-persistedstate';
import Vue from 'vue';
import Vuex from 'vuex';
import VuexConfig from './modules';

Vue.use(Vuex);

const vuexPersisted = new CreatePersistedState({
  key: 'pda-mall',
  storage: window.localStorage,
});

export default new Vuex.Store({
  modules: VuexConfig,
  plugins: [vuexPersisted],
});

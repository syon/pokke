import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '@/components/Welcome';
import HelloWorld from '@/components/HelloWorld';
import Config from '@/components/Config';

import '@/assets/app.stylus';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome,
    },
    {
      path: '/',
      name: 'Inbox',
      component: HelloWorld,
    },
    {
      path: '/favorite',
      name: 'Favorite',
      component: HelloWorld,
    },
    {
      path: '/tag/:tag',
      name: 'Tag',
      component: HelloWorld,
    },
    {
      path: '/config',
      name: 'Config',
      component: Config,
    },
  ],
});

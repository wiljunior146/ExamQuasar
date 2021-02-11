
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/users', component: () => import('pages/Users.vue') },
      { path: '/albums/:user_id', component: () => import('pages/Albums.vue') },
      { path: '/photos/:album_id', component: () => import('pages/Photos.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

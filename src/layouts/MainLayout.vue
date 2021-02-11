<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-space />
        <div>Wilson Jalipa</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-toolbar>
          <q-toolbar-title
            class="text-h5 text-bold text-uppercase text-center q-py-xl"
          >
            <router-link to="/">
              AL Coding Exam
            </router-link>
          </q-toolbar-title>
        </q-toolbar>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data: () => ({
    leftDrawerOpen: false,
    essentialLinks: [
      {
        title: 'Users',
        icon: 'person',
        link: '/users'
      }
    ]
  })
}
</script>

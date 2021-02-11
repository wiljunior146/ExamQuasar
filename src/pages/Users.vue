<template>
  <div class="q-pa-lg">
    <q-table
      title="Users"
      :data="users"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination.sync="pagination"
      @request="onRequest"
      :rows-per-page-options="[5, 10, 25, 50, 100]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>{{ props.row.name }}</q-td>
          <q-td>{{ props.row.username }}</q-td>
          <q-td>{{ props.row.email }}</q-td>
          <q-td>
            <q-btn
              color="primary"
              icon="search"
              label="Show Albums"
              @click="showAlbums(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { api } from 'boot/axios'

export default {
  name: 'User',
  data: () => ({
    loading: false,
    users: [],
    pagination: {
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 10
    },
    columns: [
      {
        name: 'name',
        label: 'Name',
        sortable: true,
        field: 'name',
        align: 'left'
      },
      {
        name: 'username',
        label: 'Username',
        sortable: true,
        field: 'username',
        align: 'left'
      },
      {
        name: 'email',
        label: 'Email',
        sortable: true,
        field: 'email',
        align: 'left'
      },
      {
        name: 'actions',
        label: 'Actions',
        sortable: false,
        field: 'id',
        align: 'center'
      }
    ]
  }),
  mounted () {
    this.getUsers()
  },
  methods: {
    onRequest (filter) {
      this.pagination = filter.pagination
      this.getUsers()
    },
    async getUsers () {
      try {
        this.loading = true
        const users = await api.get('/users', {
          params: {
            page: this.pagination.page,
            limit: this.pagination.rowsPerPage
          }
        })
        this.pagination.rowsNumber = users.data.meta.total
        this.users = users.data.data
      } catch (e) {
        this.$q.notify({
          position: 'top-right',
          color: 'negative',
          message: e.message,
          icon: 'report_problem'
        })
      } finally {
        this.loading = false
      }
    },
    showAlbums (user) {
      this.$router.push('/albums/' + user.id)
    }
  }
}
</script>

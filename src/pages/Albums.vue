<template>
  <div class="q-pa-lg">
    <q-btn
      @click="addDialog = true"
      color="green"
      icon="add"
      label="Add Album"
      class="q-mb-lg"
    />
    <q-table
      title="Albums"
      :data="albums"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination.sync="pagination"
      @request="onRequest"
      :rows-per-page-options="[5, 10, 25, 50, 100]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>{{ props.row.title }}</q-td>
          <q-td class="q-pa-md q-gutter-sm">
            <q-btn
              color="primary"
              icon="search"
              label="Show Photos"
              @click="showPhotos(props.row)"
            />
            <q-btn
              @click="form = Object.assign({}, props.row), editDialog = true"
              round
              color="amber"
              glossy
              icon="edit"
            />
            <q-btn
              @click="selectedAlbum = props.row, deleteDialog = true"
              round
              color="red"
              glossy
              icon="delete"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Delete Dialog -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div>
            <p class="text-h5">Are you sure ?</p>
            <p class="q-ml-sm">
              This album will be deleted permanently.
            </p>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :disabled="submitting"
            flat
            label="Cancel"
            color="primary"
            v-close-popup
          />
          <q-btn
            @click="deleteAlbum()"
            :loading="submitting"
            :disabled="submitting"
            label="Delete"
            color="red"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Add Dialog -->
    <q-dialog v-model="addDialog" persistent>
      <q-card style="width: 300px;">
        <q-card-section>
          <div class="text-h6">Add Album</div>
        </q-card-section>
        <q-card-section class="row items-center">
          <div class="q-pa-md">
            <form @submit.prevent="addAlbum">
              <q-input
                outlined
                v-model="form.title"
                label="Title"
              />
            </form>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :disabled="submitting"
            flat
            label="Cancel"
            color="primary"
            v-close-popup
          />
          <q-btn
            @click="addAlbum()"
            :loading="submitting"
            :disabled="submitting"
            label="Add Album"
            color="green"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Edit Dialog -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="width: 300px;">
        <q-card-section>
          <div class="text-h6">Edit Album</div>
        </q-card-section>
        <q-card-section class="row items-center">
          <div class="q-pa-md">
            <form @submit.prevent="editAlbum">
              <q-input
                outlined
                v-model="form.title"
                label="Title"
              />
            </form>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :disabled="submitting"
            flat
            label="Cancel"
            color="primary"
            v-close-popup
          />
          <q-btn
            @click="editAlbum()"
            :loading="submitting"
            :disabled="submitting"
            label="Edit Album"
            color="amber"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { api } from 'boot/axios'

export default {
  data: () => ({
    submitting: false,
    addDialog: false,
    editDialog: false,
    deleteDialog: false,
    selectedAlbum: {},
    form: {},
    loading: false,
    pagination: {
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 10
    },
    albums: [],
    columns: [
      {
        name: 'title',
        label: 'Title',
        sortable: true,
        field: 'title',
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
  computed: {
    userId () {
      return this.$route.params.user_id
    }
  },
  mounted () {
    this.getAlbums()
  },
  methods: {
    onRequest (filter) {
      this.pagination = filter.pagination
      this.getAlbums()
    },
    async getAlbums () {
      try {
        this.loading = true
        const albums = await api.get('/albums', {
          params: {
            user_id: this.userId,
            page: this.pagination.page,
            limit: this.pagination.rowsPerPage
          }
        })
        this.pagination.rowsNumber = albums.data.meta.total
        this.albums = albums.data.data
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
    async deleteAlbum () {
      try {
        this.submitting = true
        await api.delete('/albums/' + this.selectedAlbum.id)
        this.deleteDialog = false
        this.getAlbums()
      } catch (e) {
        this.$q.notify({
          position: 'top-right',
          color: 'negative',
          message: e.message,
          icon: 'report_problem'
        })
      } finally {
        this.submitting = false
      }
    },
    async addAlbum () {
      try {
        this.submitting = true
        const payload = this.form
        payload.user_id = this.userId
        await api.post('/albums', payload)
        this.addDialog = false
        this.getAlbums()
      } catch (e) {
        this.$q.notify({
          position: 'top-right',
          color: 'negative',
          message: e.message,
          icon: 'report_problem'
        })
      } finally {
        this.submitting = false
      }
    },
    async editAlbum () {
      try {
        this.submitting = true
        const payload = this.form
        await api.put('/albums/' + payload.id, payload)
        this.editDialog = false
        this.getAlbums()
      } catch (e) {
        this.$q.notify({
          position: 'top-right',
          color: 'negative',
          message: e.message,
          icon: 'report_problem'
        })
      } finally {
        this.submitting = false
      }
    },
    showPhotos (album) {
      this.$router.push('/photos/' + album.id)
    }
  }
}
</script>

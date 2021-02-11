<template>
  <div class="q-pa-lg">
    <q-btn
      @click="addDialog = true"
      color="green"
      icon="add"
      label="Add Photo"
      class="q-mb-lg"
    />
    <q-table
      title="Photos"
      :data="photos"
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
          <q-td>
            <q-img
              :src="props.row.url"
              spinner-color="white"
              style="height: 70px;"
            />
          </q-td>
          <q-td>
            <q-img
              :src="props.row.thumbnail_url"
              spinner-color="white"
              style="height: 70px;"
            />
          </q-td>
          <q-td class="q-pa-md q-gutter-sm">
            <q-btn
              @click="form = Object.assign({}, props.row), editDialog = true"
              round
              color="amber"
              glossy icon="edit"
            />
            <q-btn
              @click="selectedPhoto = props.row, deleteDialog = true"
              round
              color="red"
              glossy icon="delete"
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
              This photo will be deleted permanently.
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
            @click="deletePhoto()"
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
          <div class="text-h6">Add Photo</div>
        </q-card-section>
        <q-card-section class="row items-center">
          <div class="q-pa-md">
            <form @submit.prevent="addPhoto">
              <q-input
                outlined
                v-model="form.title"
                label="Title"
                class="q-mb-md"
              />
              <q-input
                outlined
                v-model="form.url"
                label="Image"
                class="q-mb-md"
              />
              <q-input
                outlined
                v-model="form.thumbnail_url"
                label="Thumbnail"
                class="q-mb-md"
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
            @click="addPhoto()"
            :loading="submitting"
            :disabled="submitting"
            label="Add Photo"
            color="green"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Edit Dialog -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="width: 300px;">
        <q-card-section>
          <div class="text-h6">Edit Photo</div>
        </q-card-section>
        <q-card-section class="row items-center">
          <div class="q-pa-md">
            <form @submit.prevent="editPhoto">
              <q-input
                outlined
                v-model="form.title"
                label="Title"
                class="q-mb-md"
              />
              <q-input
                outlined
                v-model="form.url"
                label="Image"
                class="q-mb-md"
              />
              <q-input
                outlined
                v-model="form.thumbnail_url"
                label="Thumbnail"
                class="q-mb-md"
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
            @click="editPhoto()"
            :loading="submitting"
            :disabled="submitting"
            label="Edit Photo"
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
    loading: false,
    addDialog: false,
    editDialog: false,
    submitting: false,
    selectedPhoto: {},
    form: {},
    deleteDialog: false,
    photos: [],
    pagination: {
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 10
    },
    columns: [
      {
        name: 'title',
        label: 'Title',
        sortable: true,
        field: 'title',
        align: 'left'
      },
      {
        name: 'url',
        label: 'Image',
        sortable: false,
        field: 'url',
        align: 'left'
      },
      {
        name: 'thumbnail_url',
        label: 'Thumbnail',
        sortable: false,
        field: 'thumbnail_url',
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
    albumId () {
      return this.$route.params.album_id
    }
  },
  mounted () {
    this.getPhotos()
  },
  methods: {
    onRequest (filter) {
      this.pagination = filter.pagination
      this.getPhotos()
    },
    async getPhotos () {
      try {
        this.loading = true
        const photos = await api.get('/photos', {
          params: {
            album_id: this.albumId,
            page: this.pagination.page,
            limit: this.pagination.rowsPerPage
          }
        })
        this.pagination.rowsNumber = photos.data.meta.total
        this.photos = photos.data.data
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
    async addPhoto () {
      try {
        this.submitting = true
        const payload = this.form
        payload.album_id = this.albumId
        await api.post('/photos', payload)
        this.addDialog = false
        this.getPhotos()
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
    async editPhoto () {
      try {
        this.submitting = true
        const payload = this.form
        await api.put('/photos/' + payload.id, payload)
        this.editDialog = false
        this.getPhotos()
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
    async deletePhoto () {
      try {
        this.submitting = true
        await api.delete('/photos/' + this.selectedPhoto.id)
        this.deleteDialog = false
        this.getPhotos()
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
    }
  }
}
</script>

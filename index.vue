<script lang="ts">
import { defineComponent } from 'vue'
import { useSearch, useList, useEdit } from './useIndex'
import EditModal from './EditModal.vue'

export default defineComponent({
  name: 'Demo',
  components: {
    EditModal,
  },
  setup() {
    const {
      columns,
      load,
      loading,
      dataSource,
      onPageChange,
      pageParams,
    } = useList()

    const { state, fields, onSearch } = useSearch(load)

    const {
      curInfo,
      editModalVisible,
      handleEdit,
    } = useEdit()

    return {
      columns,
      load,
      loading,
      dataSource,
      onPageChange,
      pageParams,

      state,
      fields,
      onSearch,

      curInfo,
      editModalVisible,
      handleEdit,
    }
  },
})
</script>

<template>
  <div class="pl-md pr-md">
    <SearchForm
      v-model:state="state"
      :fields="fields"
      class="pb-sm"
      @change="onSearch"
    >
      <template #extra>
        <a-button v-auth="''" @click="handleEdit">新增</a-button>
      </template>
    </SearchForm>

    <BaseTable
      :dataSource="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="{
        showSizeChanger: true,
        showQuickJumper: true,
        ...pageParams,
      }"
      rowKey="id"
      bordered
      @onPageChange="onPageChange"
    >
      <template #action="{ record }">
        <ActionBtn
          :btnList="[
            {
              text: '编辑',
              auth: [''],
              attrs: {
                onClick: () => handleEdit(record),
              },
            },
          ]"
        />
      </template>
    </BaseTable>
  </div>

  <EditModal
    v-model:visible="editModalVisible"
    :info="curInfo"
    @updated="load(false, false)"
  />
</template>

import { computed, ref, unref } from 'vue'
import { Load, useAuth, useDictionary, useLoadData, useState } from '@/hooks'
import { FieldTypeEnum } from '@/components/search-form/searchForm.config'
import { getList } from '@/api/demo'
import type { FormField } from '@/components/search-form/searchForm.type'
import type { GetPageParams } from '@/api/demo/index.type'
import { currentListData } from './index.type'

type SearchParams = Partial<GetPageParams>

export function useSearch(load: Load) {
  const [enumCode] = useDictionary('enumCode')

  const fields = computed((): FormField[] => [
    {
      type: FieldTypeEnum.Input,
      label: '查询条件1',
      key: 'param1',
      placeholder: '请输入',
    },
    {
      type: FieldTypeEnum.Select,
      label: '查询条件2',
      placeholder: '请选择',
      options: unref(enumCode),
      key: 'param2',
    },
  ])

  const state = ref<SearchParams>({
    param1: '',
    param2: '',
  })

  load(state.value)

  function onSearch(state: SearchParams) {

    load(state, true)
  }

  return {
    state,
    fields,
    onSearch,
  }
}

export function useList() {
  const [, enumCodeMap] = useDictionary('enumCode')

  const columns = computed(() => [
    {
      title: '第一列',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      customRender: ({ text }) => unref(enumCodeMap)?.[text],
    },
    {
      title: '第二列',
      dataIndex: 'staffNames',
      key: 'staffNames',
      minWidth: 150,
      slots: { customRender: 'staffNames' },
    },
    useAuth(['']) && {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 114,
      fixed: 'right',
      slots: { customRender: 'action' },
    },
  ])

  const {
    load,
    loading,
    dataSource,
    onPageChange,
    pageParams,
  } = useLoadData({
    api: getList,
  })

  return {
    columns,
    load,
    loading,
    dataSource,
    onPageChange,
    pageParams,
  }
}

export function useEdit() {
  const curInfo = ref<any>(null)
  const [editModalVisible, setEditModalVisible] = useState(false)

  function handleEdit(info): void {
    curInfo.value = info
    setEditModalVisible(true)
  }

  return {
    curInfo,
    editModalVisible,
    handleEdit,
  }
}

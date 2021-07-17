import {
  ComponentInternalInstance,
  computed,
  getCurrentInstance,
  Ref,
  ref,
  watch,
} from 'vue'
import { cloneDeep } from 'lodash-es'
import { useDictionary } from '@/hooks'
import Rules from '@/utils/rules'
import { saveApi } from '@/api/demo'
import type { DemoInfo } from '@/api/demo/index.type'
import type { EditModalProps } from './index.type'
import { notification } from 'ant-design-vue'

export function useOptions() {
  const [codeEnum] = useDictionary('codeEnum')

  return {
    codeEnum,
  }
}

export function useInit(props: EditModalProps) {
  const isEdit = computed(() => !!props.info?.id)
  const title = computed(() => isEdit.value ? '编辑弹窗' : '新增弹窗')

  return {
    title,
    isEdit,
  }
}

const defaultFormData: DemoInfo = {
  param1: ''
}

export function useFormState(props: EditModalProps) {
  const formRef = ref()
  const formState = ref<DemoInfo>(cloneDeep(defaultFormData))

  const rules = {
    param1: [Rules.input()],
  }

  watch(
    () => props.visible,
    (val) => {
      if (val) return

      formRef.value.resetFields()
      formState.value = cloneDeep(defaultFormData)
    }
  )

  return {
    formRef,
    formState,
    rules,
  }
}

export function useEvent(formRef: Ref<any>, formState: Ref<DemoInfo>) {
  const { emit } = getCurrentInstance() as ComponentInternalInstance

  function handleClose(): void {
    emit('update:visible', false)
  }

  function closeAndUpdate(): void {
    handleClose()
    emit('updated')
  }

  const submitLoading = ref(false)

  function handleSubmit(): void {
    formRef.value
      .validate()
      .then(() => {
        submitLoading.value = true

        saveApi(formState.value)
          .then(() => {
            closeAndUpdate()
            notification.success({
              message: '保存成功！',
            })
          })
          .catch((err) => err)
          .finally(() => (submitLoading.value = false))
      })
      .catch((err) => err)
  }

  return {
    handleClose,
    submitLoading,
    handleSubmit,
  }
}

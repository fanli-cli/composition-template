<script lang="ts">
import { defineComponent } from 'vue'
import {
  useOptions,
  useInit,
  useFormState,
  useEvent,
} from './useEditModal'

export default defineComponent({
  name: 'EditModal',

  inheritAttrs: false,

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:visible', 'updated'],

  setup(props) {
    const { codeEnum } = useOptions()

    const { isEdit, title } = useInit(props)

    const { formRef, formState, rules } = useFormState(props)

    const { handleClose, submitLoading, handleSubmit } = useEvent(
      formRef,
      formState
    )

    return {
      codeEnum,

      isEdit,
      title,

      formRef,
      formState,
      rules,

      handleClose,
      submitLoading,
      handleSubmit,
    }
  },
})
</script>

<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="550"
    :bodyStyle="{ maxHeight: '496px', overflowY: 'auto', paddingBottom: '0' }"
    :confirmLoading="submitLoading"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form ref="formRef" layout="vertical" :model="formState" :rules="rules">
      <a-form-item label="参数1" name="param1">
        <a-input
          v-model:value="formState.param1"
          :maxlength="50"
          placeholder="请输入，最多不超过50个字"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

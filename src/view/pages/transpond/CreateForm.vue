<template>
  <el-form
      ref="createForm"
      :rules="rules"
      label-position="left"
      :model="form"
      :hide-required-asterisk="true"
      label-width="80px">
    <el-form-item :label="$t('RULE_ENGINE.ACCESS_ENGINE.RULE_NAME')" prop="rule_name">
      <el-input v-model="form.rule_name" placeholder="请输入规则名称"></el-input>
    </el-form-item>

      <div style="display: flex;justify-content: center">
        <el-button class="cancel-button" type="cancel" size="medium" plain @click="cancelDialog">{{ $t('RULE_ENGINE.ACCESS_ENGINE.CANCEL') }}</el-button>
        <el-button class="medium" type="save" size="medium" @click="onSubmit">{{ $t('RULE_ENGINE.ACCESS_ENGINE.SUBMIT') }}</el-button>
      </div>

  </el-form>
</template>

<script>
import options from './cascader_options'
import i18n from "@/core/plugins/vue-i18n.js"
const required = true;
export default {
  name: "CreateForm",
  props: {
    // handle_create:{
    //   request: true,
    //   type: Function,
    // },
    init_data: {
      default: null
    }
  },
  data:()=>({
    form:{
      rule_name: '',
      frequency: ''
    },
    rules: {
      rule_name: [
        {required, message: i18n.t('RULE_ENGINE.ACCESS_ENGINE.PLACEHOLDER')}
      ]
    },
    options: options,
  }),
  created() {
    if(this.init_data){
      this.form.rule_name = this.init_data.rule_name
    }
  },
  methods: {
    onSubmit(){
      this.$refs.createForm.validate((valid)=>{
        if(valid){
          this.$emit('submit', this.form)
          setTimeout(()=>{
            this.$refs.createForm.resetFields()
          }, 500)
        }
      })
    },
    cancelDialog() {
      this.$emit("cancel")
    }
  }
}
</script>
<style>
  .el-dark-input .el-input__inner, .el-dark-input .el-textarea__inner{
  background: #fff !important;
  color: #000;
}
</style>
<style lang="scss">
.transpond-create{
  //.el-form-item__label{
  //  color: #fff;
  //}
  //.el-cascader{
  //  width: 100%;
  //}
  //.el-select{
  //  width: 100%;
  //}
}
</style>
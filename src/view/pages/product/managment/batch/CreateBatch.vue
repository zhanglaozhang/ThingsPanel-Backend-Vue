<!--
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-01-31 16:45:45
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-03-17 15:36:44
 * @FilePath: \ThingsPanel-Backend-Vue\src\view\pages\product\managment\batch\CreateBatch.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog class="el-dark-dialog" title="创建批次" :visible.sync="dialogVisible" width="400px"
             :before-close="handleClose" :close-on-click-modal="false">
    <el-form :inline="false" label-position="left"  :model="formData" :rules="formRules">

      <el-row>
        <el-form-item label="批次号" prop="batch_number">
          <el-input v-model="formData.batch_number" placeholder="请输入批次号"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="数量" prop="device_number">
          <el-input-number v-model="formData.device_number"></el-input-number>
        </el-form-item>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="save" @click="handleSubmit">创建批次</el-button>
    </span>
  </el-dialog>
</template>

<script>

import ProductAPI from "@/api/product.js"
import {message_success} from "@/utils/helpers";
import i18n from "@/core/plugins/vue-i18n.js"

const required = true;
export default {
  name: "CreateBatch",
  props: {
    visible: {
      type: [Boolean],
      default: false
    },
    data: {
      type: [Object],
      default: () => { return {} }
    }
  },
  data() {
    return {
      formData: {
        batch_number: "",
        device_number: 0,
      },
      formRules: {
        batch_number: [{required, message:  i18n.t('PRODUCT_MANAGEMENT.BATCH_LIST.PLACEHOLDER1')}],
        number: [{required, message:  i18n.t('PRODUCT_MANAGEMENT.BATCH_LIST.PLACEHOLDER4'), type: 'number'}]
      },
      productOptions: [

      ],
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  },
  methods: {
    handleSubmit() {
      if (!this.data.id) {
        // add
        ProductAPI.batchAdd({product_id: this.data.product_id, ...this.formData})
          .then(({ data: result }) => {
            console.log("result", result)
            if (result.code === 200) {
              this.$emit("submit")
              message_success("创建批次成功！")
              this.dialogVisible = false;
            }
          })
      } else {
        // edit
      }
    },
    handleClose() {
      this.dialogVisible = false;
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
<style>
.el-dark-input .el-input__inner, .el-dark-input .el-textarea__inner{
  background: #fff !important;
  color: #000;
}
</style>
<style scoped lang="scss">

::v-deep .el-form--label-left {
  .el-form-item {
    
  }
}
</style>
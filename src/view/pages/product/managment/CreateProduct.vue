<template>
  <div>
    <el-dialog class="el-dark-dialog" :title="$t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PRODUCT_LIST_ADD.CREATEPRODUCT')" :visible.sync="dialogVisible" width="30%"
               :before-close="handleClose" :close-on-click-modal="false">
      <el-form label-position="top" :model="formData" :rules="formRules" class="el-dark-input">
        <el-form-item :label="$t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PRODUCT_LIST_ADD.PRODUCTNAME')" prop="name">
          <el-input v-model="formData.name" placeholder="请输入产品名称"></el-input>
        </el-form-item>

        <el-form-item :label="$t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PRODUCT_LIST_ADD.PRODUCTNUMBER')" prop="serial_number">
          <el-input v-model="formData.serial_number" placeholder="请输入产品编号"></el-input>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PRODUCT_LIST_ADD.PROTOCOLTYPE1')" prop="protocol_type">
              <el-select style="width: 100%" v-model="formData.protocol_type" :placeholder="$t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PRODUCT_LIST_ADD.PLACEHOLDER42')">
                <el-option v-for="item in protocolOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="$t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PRODUCT_LIST_ADD.PROTOCOLTYPE2')" prop="auth_type">
              <el-select style="width: 100%" v-model="formData.auth_type" :placeholder="$t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PRODUCT_LIST_ADD.PLACEHOLDER43')">
                <el-option v-for="item in authOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="$t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PRODUCT_LIST_ADD.TITLE32')">
          <el-input v-model="formData.pluginName" @click.native="handleBindPlugin">

          </el-input>
        </el-form-item>

        <el-form-item :label="$t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PRODUCT_LIST_ADD.PRODUCTDESCRIPTION')">
          <el-input v-model="formData.describe" placeholder="请输入产品描述"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="cancel" @click="handleClose">{{ $t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PRODUCT_LIST_ADD.CANCEL') }}</el-button>
        <el-button type="save" @click="handleSubmit">{{ $t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PRODUCT_LIST_ADD.CONFIRM') }}</el-button>
      </span>
    </el-dialog>
    <plugin-binding-form :dialog-visible.sync="pluginDialogVisible" @submit="handleBindPluginSubmit"></plugin-binding-form>
  </div>
</template>

<script>

import ProductAPI from "@/api/product.js"
import {message_success} from "@/utils/helpers";
import PluginBindingForm from "./PluginBindingForm";
import i18n from "@/core/plugins/vue-i18n.js"

const required = true;
export default {
  name: "CreateProduct",
  components: { PluginBindingForm },
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
        name: "",
        serial_number: "",
        protocol_type: "",
        auth_type: "",
        plugin: "",
        describe: ""
      },
      formRules: {
        name: [{required, message: i18n.t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PLACEHOLDER1')}],
        serial_number: [{required, message: i18n.t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PLACEHOLDER2')}],
        protocol_type: [{required, message: i18n.t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PLACEHOLDER3')}],
        auth_type: [{required, message: i18n.t('PRODUCT_MANAGEMENT.PRODUCT_LIST.PLACEHOLDER4')}],
      },
      dialogVisible: false,
      protocolOptions: [
        { value: "mqtt", label: "MQTT直连" },
        { value: "MQTT", label: "MQTT网关" },
      ],
      authOptions: [
        { value: "1", label: "AccessToken " },
        { value: "2", label: "MQTTBasic" },
      ],
      pluginList: [],
      pluginDialogVisible: false
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          this.formData = JSON.parse(JSON.stringify(this.data));
          this.dialogVisible = newValue;
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      if (!this.formData.id) {
        // add
        this.formData.plugin = "{}"
        ProductAPI.add(this.formData)
          .then(({ data }) => {
            if (data.code ==200) {
              this.$emit("submit")
              message_success("产品添加成功！")
              this.handleClose();
            }
          })
      } else {
        // edit
        console.log("edit")
      }
    },
    handleBindPlugin(item) {
      this.pluginDialogVisible = true;
    },
    handleBindPluginSubmit(pluginId, pluginName) {
      console.log("handleBindPluginSubmit", pluginId)
      this.formData.plugin = pluginId;
      this.formData.pluginName = pluginName;
    },
    handleClose() {
      this.dialogVisible = false;
      this.$emit("update:visible", false)
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
    display: inline-flex!important;
  }
}
</style>
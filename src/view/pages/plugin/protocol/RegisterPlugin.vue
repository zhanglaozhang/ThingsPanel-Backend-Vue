<template>
  <div>
    <el-dialog class="el-dark-dialog" :title="$t('PLUGIN.TAB2_CONTENT.BTN')" :visible.sync="dialogVisible" width="50%"
               :before-close="handleClose" :close-on-click-modal="false">
      <el-form class="el-dark-input" label-position="left" :model="formData" :rules="formRules">

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('PLUGIN.TAB2_CONTENT.NAME')" prop="name">
              <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('PLUGIN.TAB2_CONTENT.DEVICETYPE')" prop="device_type">
              <el-select v-model="formData.device_type" placeholder="请输入设备类型">
                <el-option value="1" :label="$t('PLUGIN.TAB2_CONTENT.DEVICE')"></el-option>
                <el-option value="2" :label="$t('PLUGIN.TAB2_CONTENT.NEWWORK')"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('PLUGIN.TAB2_CONTENT.PROTOCOLTYPE')" prop="protocol_type">
              <el-input v-model="formData.protocol_type" placeholder="请输入协议类型"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('PLUGIN.TAB2_CONTENT.CONNECTADDRESS')" prop="access_address">
              <el-input v-model="formData.access_address" placeholder="请输入接入地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('PLUGIN.TAB2_CONTENT.HTTPADDRESS')" prop="http_address">
              <el-input v-model="formData.http_address" placeholder="请输入HTTP服务地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('PLUGIN.TAB2_CONTENT.LABLE')" prop="sub_topic_prefix">
              <el-input v-model="formData.sub_topic_prefix" placeholder="请输入协议订阅主题前缀"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('PLUGIN.TAB2_CONTENT.AUTHOR')" prop="author">
              <el-input v-model="formData.author" placeholder="请输入作者"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item :label="$t('PLUGIN.TAB2_CONTENT.DESCRIBE')" prop="description">
              <el-input v-model="formData.description" placeholder="请输入描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            {{ $t('PLUGIN.TAB2_CONTENT.CONNECTNUMBER') }}
          </el-col>

          <el-col :span="8" :offset="8">
            <el-button type="border" @click="addConnectForm">{{ $t('PLUGIN.TAB2_CONTENT.ADDCONFIG') }}</el-button>
          </el-col>
        </el-row>

        <el-row class="config-line" :gutter="20" v-for="(form, index) in connectForm" :key="index">
          <el-col :span="8">
            <el-input v-model="form.key" :placeholder="$t('PLUGIN.TAB2_CONTENT.PLACEHOLDER1')"></el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="form.value" :placeholder="$t('PLUGIN.TAB2_CONTENT.PLACEHOLDER2')"></el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="danger" @click="delConnectForm(index)">{{ $t('PLUGIN.TAB2_CONTENT.DELETE') }}</el-button>
          </el-col>
        </el-row>


      </el-form>

      <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="handleClose">{{ $t('PLUGIN.TAB2_CONTENT.CANCEL') }}</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit">{{ $t('PLUGIN.TAB2_CONTENT.CONFIRM') }}</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import ProtocolPlugin from "@/api/protocolPlugin.js"
import {message_success} from "@/utils/helpers";
import i18n from "@/core/plugins/vue-i18n.js"
const required = true;
export default {
  name: "RegisterPlugin",
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
      dialogVisible: false,
      formData: {
        name: "",
        device_type: "1",
        protocol_type: "",
        access_address: "",
        http_address: "",
        sub_topic_prefix: "",
        author: "",
        description: "",
        additional_info: {}
      },
      formRules: {
        name: [{required, message: i18n.t('PLUGIN.TAB2_CONTENT.PLACEHOLDER3')}],
        device_type: [{required, message: i18n.t('PLUGIN.TAB2_CONTENT.PLACEHOLDER4')}],
        protocol_type: [{required, message: i18n.t('PLUGIN.TAB2_CONTENT.PLACEHOLDER5')}],
        access_address: [{required, message: i18n.t('PLUGIN.TAB2_CONTENT.PLACEHOLDER6')}],
        http_address: [{required, message: i18n.t('PLUGIN.TAB2_CONTENT.PLACEHOLDER7')}],
        sub_topic_prefix: [{required, message: i18n.t('PLUGIN.TAB2_CONTENT.PLACEHOLDER8')}]
      },
      loading: false,
      connectForm: []
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log("====visible", newValue)
        if (newValue) {
          // this.formData = JSON.parse(JSON.stringify(this.data));
          // this.formData.device_type = "1";
          this.loading = false;
          this.dialogVisible = newValue;
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      this.loading = true;
      this.formData.additional_info = JSON.stringify(this.connectForm);
      if (this.formData.id) {
        // 编辑
      } else {
        ProtocolPlugin.add(this.formData)
            .then(({ data }) => {
              if (data.code == 200) {
                message_success("注册成功！");
                this.$emit("submit");
                this.handleClose();
              }
            })
            .finally(() => this.loading = false)
      }

    },
    handleClose() {
      this.$emit("update:visible", false)
      this.dialogVisible = false;
    },
    addConnectForm() {
      this.connectForm.push({key: "", value: ""})
    },
    delConnectForm(index) {
      this.connectForm.splice(index, 1);
    }

  }
}
</script>
<style>
  .el-dark-input .el-input__inner, .el-dark-input .el-textarea__inner{
  background-color: #fff !important;
  color: black !important;
}
</style>
<style scoped>

.config-line {
  margin-top: 16px;
}

/deep/ .el-select {
   width: 100%;
}
</style>
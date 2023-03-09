<template>
  <div>
    <el-form ref="loginFormRef" :model="formData" :rules="rules" @keyup.enter.native="handleSubmit">
      <el-form-item  class="mima" prop="email" :error="errors.email">
        <img src="../../../assets/images/login/zhanghao.png" alt="" srcset="">
        <input style="width:418px;" v-model.trim="formData.email" placeholder="请输入账号" name="email"></input>
      </el-form-item>
      <el-form-item  class="mima" prop="password" :error="errors.password">
        <img src="../../../assets/images/login/mima.png" alt="" srcset="">
        <input style="width:418px;" v-model.trim="formData.password" type="password" placeholder="请输入密码" show-password name="password"></input>
      </el-form-item>
      <el-button style="margin-top:42px;width:416px !important;transform: translate(8%, -50%);    height: 62px;" type="primary" class="w-100" :loading="loading" @click="handleSubmit">{{ $t("LOGIN.SIGNIN") }}</el-button>
    </el-form>
    <div style="display: flex;padding-left: 35px;">
      <div>
        <img v-if="xzStatus==1" @click="handlerWxz" style="position: relative;top: -3px;" src="../../../assets/images/login/jzmm1.png" alt="" srcset="">
        <img v-else-if="xzStatus==2" @click="handlerXz" style="position: relative;top: -3px;" src="../../../assets/images/login/jzmmxz.png" alt="" srcset="">
        <span style="color:#666666;font-size:18px">记住密码</span>
      </div>
      <div style="margin-left:55%">
        <img src="../../../assets/images/login/wjmm.png" alt="" srcset="">
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "@vue/composition-api";
import useLoginForm from "@/view/pages/auth/useLoginForm";

const Base64 = require("js-base64").Base64
export default defineComponent({
  name: "LoginForm",
  setup() {
    let {
      loginFormRef,
      formData,
      loading,
      rules,
      errors,
      handleSubmit,
      xzStatus
    } = useLoginForm();
    function handlerWxz(){
      xzStatus.value = 2
      if(xzStatus.value===2 && formData.email){
        window.localStorage.setItem("userName",formData.email)
        window.localStorage.setItem("userpwd",Base64.encode(formData.password))
      }
    }
    function handlerXz(){
      xzStatus.value = 1
    }
    onMounted(()=>{
      if(window.localStorage.getItem("userName") || window.localStorage.getItem("userpwd")){
        xzStatus.value = 2
        formData.email =  window.localStorage.getItem("userName")
        formData.password =  Base64.decode(window.localStorage.getItem("userpwd"))
      }else{
        xzStatus.value = 1
      }
     
    })
    return {
      loginFormRef,
      formData,
      loading,
      rules,
      errors,
      handlerWxz,
      handlerXz,
      xzStatus,
      handleSubmit
    }
    
  },
  
})
</script>

<style scoped>
>>>.el-form-item__error{
  left: 30px;
}
/deep/ .el-input__inner{
  color: #fff;
  background-color: #fff !important;
  border-color: transparent;
  padding-left: 48px;
  height: 62px;
}
input{
  background-color: #fff !important;
  border-color: transparent;
  padding-left: 48px;
  height: 62px;
  border: none;
}

/deep/ .el-button i{
  color: #fff;
}
>>>.el-form-item__content{
  text-align: center;
}
.mima{
  position: relative;
}
.mima img{
  position: absolute;
  top: 28%;
  z-index: 999;
  padding-left: 17px;
}
</style>
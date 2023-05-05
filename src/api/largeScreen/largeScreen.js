import axios from "../interceptor/http";
const BASE_URL = "/tp_large"
export default{
    list:()=>{
        return axios({
            url:BASE_URL+'/list',
            method:'get'
        })
    },
    getWarnings:()=>{
        return axios({
            url:'tp_large/warningMessage',
            method:'get'
        })
    },
    deviceMessage:()=>{
        return axios({
            url:'tp_large/deviceMessage',
            method:'get'
        })
    },
    deviceStatus:()=>{
        return axios({
            url:'tp_large/deviceStatus',
            method:'get'
        })
    },
    deviceStatistics:()=>{
        return axios({
            url:'tp_large/deviceStatistics',
            method:'get'
        })
    },
    getTree:()=>{
        return axios({
            url:'tp_large/typeMap',
            method:'get'
        })
    },
    deviceMap:(data)=>{
        return axios({
            url:'tp_large/deviceMap',
            method:'post',
            data
        })
    },
}
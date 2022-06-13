import {reactive, ref} from "@vue/composition-api";
import {business_index} from "@/api/business";
import {dateFormat} from "@/utils/tool";

export default function useBusinessIndex(page){
    let tableData = ref([])
    let loading = ref(false)
    let params = reactive({
        page: page ? page : 1,
        limit: 10,
    })

    let total = ref(0)

    // 获取列表
    function getBusinessIndex(){
        if(loading.value) return;
        loading.value = true

        business_index(params).then(({data})=>{
            if(data.code === 200) {
                tableData.value = data.data.data ? washData(data.data.data) : []
                total.value = data.data.total
            }
        }).finally(()=>{
            loading.value = false
        })
    }

    getBusinessIndex()

    function washData(data_array){
        return data_array.map((item)=>{
            item.created_at = dateFormat(item.created_at)
            item.status = null
            return item
        })
    }

    return{
        tableData,
        getBusinessIndex,
        loading,
        params,
        total,
    }
}
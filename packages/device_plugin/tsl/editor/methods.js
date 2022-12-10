export default {
    dataChange(data) {
        console.log("====data:", data)
        let obj = {};
        try{
            obj = JSON.parse(JSON.stringify(this.tableData));
        } catch (e) {}

        // obj[this.tslType] = data;
        if (this.tslType == "properties") {
            obj.properties = data;
        } else if (this.tslType == "services") {
            obj.services = data;
        } else if (this.tslType == "events") {
            obj.events = data;
        }
        this.jsonStr = JSON.stringify(obj, null, 4);
        this.$emit("dataChange", obj);
    }
}
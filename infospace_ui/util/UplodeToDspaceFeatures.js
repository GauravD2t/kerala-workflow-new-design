const AsiosUtil = require("../utils/AxiosUtil")
class UplodeToDspaceFeatures {
  constructor(finalDspaceUplodelist, collection) {
    this.AsiosUtilObj = new AsiosUtil()
    this.finalDspaceUplodelist = finalDspaceUplodelist
    this.collection = collection
  }
  async uplodeitemInDspace(dataObject){  
    console.log("step1===")  
    let item = await this.postAItemTODspace();
    if (item.data != null && item.data.id != undefined) {
      console.log("step2===") 
      let submitionObject = await this.updatematataDataToDspace(item.data.id, dataObject.data)
      console.log("step3===") 
      let bundles = await this.CreateABundle(item.data.id);
      console.log(dataObject.files.length)
      for (const filepath  of dataObject.files) {
        console.log("------>"+filepath,bundles.data.uuid,item.data.id)
        console.log("step4===") 
        let fileUplode = await this.uplodeFileToDspace(bundles.data.uuid, filepath);
      }
    
    }
    return item.data.id;
  }
  async updatematataDataToDspace(itemID,dataObject) {
    
    return await this.AsiosUtilObj.patch("/api/core/items/"+itemID, dataObject, "application/json")
    
  }
  async postAItemTODspace() {
    
    return await this.AsiosUtilObj.post("/api/core/items?owningCollection="+this.collection+"&projection=full", { inArchive: true, discoverable: true }, "application/json")
    
  }
  async createWorkspace() {
    
    return await this.AsiosUtilObj.post("/api/submission/workspaceitems?owningCollection="+this.collection+"&projection=full", { owningCollection: this.collection, projection: "full" }, "application/json")
    
  }
  async CreateABundle(itemID) {
    
    return await this.AsiosUtilObj.post("/api/core/items/"+itemID+"/bundles", {name: "ORIGINAL", metadata: {}}, "application/json")
    
  }
  async uplodeFileToDspace(bundleID, filepath) {    
    return await this.AsiosUtilObj.multipart("/api/core/bundles/"+bundleID+"/bitstreams", filepath)
  }
  async grantLicense(workspaceID){
    let objconsole=[{"op": "add", "path": "/sections/license/granted", value: "true"}]
    return await this.AsiosUtilObj.patch("/api/submission/workspaceitems/" + workspaceID, objconsole, 'application/json')
  }
  async uplodeFile(workspaceID,filepath){    
    return await this.AsiosUtilObj.multipart("/api/submission/workspaceitems/" + workspaceID, filepath)
  }
  async saveWorkspace(contentType,workspaceID) {    
    return await this.AsiosUtilObj.post("/api/workflow/workflowitems?projection=full", "http://help.d2t.co:8080/jkserver/api/submission/workspaceitems/"+workspaceID, contentType)
  }
}
module.exports = UplodeToDspaceFeatures;

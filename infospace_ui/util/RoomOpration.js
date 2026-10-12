/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var allroomObject=[]
function RoomOpration(){
    this.allroomObject=[]
}
RoomOpration.prototype.getRemotesenderObjectByName=function(name,callback){      
   return this.allroomObject.find( remotObject => remotObject.name === name );
}
RoomOpration.prototype.getAllRoom=function (){
    return this.allroomObject;
}
RoomOpration.prototype.setRemoteObjectToRoom=function(remoteObject){    
   var roomname=remoteObject.ID
   return this.allroomObject.push({name:roomname,remoteObject:remoteObject}) 
}
RoomOpration.prototype.isRoomExist=function (roomname){ 
    
  for (var i=0; i < this.allroomObject.length; i++) {          
        if (this.allroomObject[i].name == roomname) {
            console.log("name  "+this.allroomObject[i].name);
            console.log("name from pass  "+roomname);
            return this.allroomObject[i];
        }
    }      
}
RoomOpration.prototype.getindex=function (roomname){   
  for (var i=0; i < this.allroomObject.length; i++) {    
        if (this.allroomObject[i].name == roomname) {
            return i
        }
    }      
}
RoomOpration.prototype.updateRooObject=function (object,index){ 
  console.log("roomupdate");
  this.allroomObject[index]=object
}
module.exports = new RoomOpration();



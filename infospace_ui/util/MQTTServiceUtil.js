function  MQTTServiceUtil(MQTTObject,connection,socketIO) {
    this.MQTTServerObject
    MQTTObject.on('clientConnected', function (client) {
        console.log("clientConnected")
    });
    MQTTObject.on('published', function (packet, client) {
        var topic = packet.topic
        console.log(client)
        if (packet.payload != undefined) {
            var stringBuf = packet.payload.toString('utf-8');
            if (stringBuf.indexOf("from") != -1 && stringBuf != null && stringBuf != undefined){
                var a=JSON.parse(stringBuf)
                if(a.from == "PCB"){ 
                    socketIO.emit("message",a);
                }
                connection.user.create({topic: a.topic, message: a.message, type: a.from, date: new Date()});            
                console.log(a)
            }
        }
    });
    MQTTObject.on('subscribed', function (packet, client) {
        var topic = packet.topic
        if (packet.payload != undefined) {            
            var stringBuf = packet.payload.toString('utf-8');
            if (stringBuf != null && stringBuf != undefined){
                var a=JSON.parse(stringBuf)
                console.log(a.from)
            }            
        }
    });
    MQTTObject.on('unsubscribed', function (topic, client) {

    });
    MQTTObject.on('clientDisconnecting', function (client) {
    });
    MQTTObject.on('clientDisconnected', function (client) {
        console.log("clientDisconnected");
    });
}
module.exports = MQTTServiceUtil;

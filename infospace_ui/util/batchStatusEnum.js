function batchStatusEnum(){
  this.objectstage={
    'batchCreate':0,
    'batchCommitted':1,
    'inwardreceive':2,
    'inwardCommitted':3,
 },
 this.batchstatus={
   'createbatch':0,
   'Createcommitted':1,
    'inwardcommited':2,
    'fileTagcommit':3,
    'scanningcommited':4,
    'Qccommited':5,
    'QArejectCommit':6,
    'outwardcommited':7,
    'receivecommited':8


     
 },
 this.firstatus={
   'notassign':-1,
  'assign':0,
  'scanningcommittedFIR':1,
   'qccommittedFIR':2,
   'pdfcommittedFIR':3,
   


    
},
 this.objecttype={
  'batch':0,
  'fir':1,
    
} , 
this.userType={
  'police':0,
   "digitizationcenter":1,
   "digitizationcenteruser":2,
   "supperAdmin":3
}    
}

module.exports = new batchStatusEnum();
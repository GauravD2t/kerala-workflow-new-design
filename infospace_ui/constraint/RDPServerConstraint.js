/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function RDPServerConstraint(){
    this.URL="http://localhost:7080/screening";
    this.successstatus={status:true}
    this.failstatus={status:false}
    this.authkey="ZAQ!Wxcds2017"
    this.pass="AKZ!@1970"
    console.log(this.URL)
}
module.exports=new RDPServerConstraint();


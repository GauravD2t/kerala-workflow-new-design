var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates-v2').EmailTemplate;
var transporter=null
var sendResetPasswordLink=null;
var smtpTransport = require('nodemailer-smtp-transport');
function  emailutil(){
  transporter = nodemailer.createTransport(smtpTransport({
    host: "mail.patsonenterprise.com", // hostname
    name: "patsonenterprise",
    secure: true, // use SSL
    port: 465, // port for secure SMTP
    auth: {
        user: "support@patsonenterprise.com",
        pass: "support@patson"
    },
    requireTLS:true,
    tls: {
      ciphers:'SSLv3'
    },
    sendmail: true,
    tls: {
        rejectUnauthorized: false
    }
  }));  
  sendResetPasswordLink = transporter.templateSender(
    new EmailTemplate('../tagserver/emailtemplate/'), {
        from: 'support@patsonenterprise.com',
    });
}
emailutil.prototype.sendemail=function(message,callback) {  
  if(transporter != null && sendResetPasswordLink != null){
            sendResetPasswordLink({
              to: message.to,
              subject: message.subject
          }, {
              name: message.name,            
              token: message.token
          }, function (err, info) {
              if (err) {        
                  console.log(err)
                  callback(null);
              } else {
                  console.log('Link sent::'+ JSON.stringify(info));
                  callback(true);
              }
          });
            
  }else{
    callback(null);
  }
  
}  
module.exports = new emailutil();

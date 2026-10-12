
const axios = require('axios');
const url = require('url');
var LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const fs = require('fs');
const FormData = require('form-data');
class AxiosUtil {
  constructor() {
    this.baseURL = "https://lab.d2t.co/serverjnk/"
  }
  async getstatus(url, data) {
    let http = await this.creatAxios();
    //  console.log(http)
    return await http.get(url, data.toString(), this.headers('application/x-www-form-urlencoded'))
  }
  async headers(ContentType) {

    return {
      headers: {
        'Content-Type': ContentType != undefined ? ContentType : 'application/x-www-form-urlencoded',
        'Cookie': localStorage.getItem("csrf-cookie"),
        "X-XSRF-TOKEN": localStorage.getItem("csrf"),
        Authorization: localStorage.getItem("authorization")
      }
    }
  }
  async get(url, data) {
    try {
      const u = new URLSearchParams(data).toString();
      await this.getXsrfnadCookie();
      let http = await this.creatAxios();
      console.log(url + u)
      return await http.get(url + "?" + u, await this.headers())
    } catch (err) {
      throw {
        statuscode: err.response.status,
        error: new Error()
      };
    }
  }
  async getDircet(url, data) {

    const u = new URLSearchParams(data).toString();
    await this.getXsrfnadCookie();
    let http = await this.creatAxiosWithoutLogin();
    console.log(url + u)
    return await http.get(url + "?" + u, await this.headers())
  }


  async post(url, data, ContentType) {
    await this.getXsrfnadCookie();
    const PassOnObect = ((ContentType == 'application/json' || ContentType == 'text/uri-list') ? data : new URLSearchParams(data))
    let http = await this.creatAxios();
    return await http.post(url, PassOnObect, await this.headers(ContentType))
  }
  async patch(url, data, ContentType) {
    await this.getXsrfnadCookie();
    const PassOnObect = (ContentType == 'application/json' ? data : new URLSearchParams(data))
    let http = await this.creatAxios();
    return await http.patch(url, PassOnObect, await this.headers(ContentType))
  }
  async multipart(url, filepath) {
    await this.getXsrfnadCookie();
    const formData = new FormData();
    formData.append('file', await fs.createReadStream(filepath));
    let http = await this.creatAxios();
    return await http.post(url, formData, await this.headers(formData.getHeaders()['content-type']))
  }

  async postxForm(url, data) {
    try {
      await this.getXsrfnadCookie();
      let http = await this.creatAxios()
      return await http.post(url, new URLSearchParams(data), await this.headers());
    } catch (err) {
      throw {
        statuscode: err.response.status,
        error: new Error()
      };
    }
  }

  async getXsrfnadCookie() {
    if (localStorage.getItem("csrf-cookie") == null) {
      let http = await this.creatAxios()
      let statusData = await http.get("api/authn/status", {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': localStorage.getItem("csrf-cookie"),
          "X-XSRF-TOKEN": localStorage.getItem("csrf"),
        }
      });
      localStorage.setItem("csrf-cookie", statusData.headers['set-cookie'])
      localStorage.setItem("csrf", statusData.headers['dspace-xsrf-token'])
    }
  }
  async creatAxios() {
    return await axios.create({
      withCredentials: true,
      baseURL: this.baseURL,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
  }
  async creatAxiosWithoutLogin() {
    return await axios.create({
      withCredentials: false,
      baseURL: this.baseURL,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
  }

  async postwithFormData(url, data) {
    try {

      let headers = {
        'content-type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      };
      const params = new URLSearchParams(data);
      let obj = {
        method: 'POST',
        headers: headers,
        body: data
      };
      let http = axios.create({
        baseURL: "http://uat.d2t.co/rest",
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      return await http.post(url, params.toString(), { headers: headers })
    } catch (err) {
      throw err;
    }
  }

}
module.exports = AxiosUtil;

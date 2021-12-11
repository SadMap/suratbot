const fetch = require("node-fetch")
const optiontypes = {
    takipkodu : ""
}
class kargo {
    /**
     * 
     * @param {optiontypes} options 
     */
    constructor() {
        this.url=""
        this.takipkodu = ""
        this.baseurl = "https://suratkargo.com.tr/"
        this.basehtml=""
    }
    async fetchhtml(url) {
        const response = await fetch.default(url)
        return await response.text()
    }
    async init(options) {
        const dom = require("jsdom")
        this.takipkodu = options.takipkodu
        console.log(this.takipkodu)
        this.url = this.baseurl+"KargoTakip/?kargotakipno="+options.takipkodu
        this.takipkodu=options.takipkodu
        this.kargodom = new dom.JSDOM(await this.fetchhtml(this.url))
        this.secretcode = this.kargodom.window.document.querySelector("body > div.container.body-content > div > div > div > div:nth-child(5) > table > tbody > tr > td:nth-child(8) > button").getAttribute("ng-click")
        this.secretcode = this.secretcode.split("Getir('")[1].split("')")[0]
    }
    getImage() {
        return this.baseurl+this.kargodom.window.document.querySelector("body > div.container.body-content > div > div > div > div:nth-child(1) > table > tbody > tr > td > img").src
    }
    kargobulundumu() {
        return this.kargodom.window.document.querySelector("body > div.container.body-content > div > div > h3") == null ? true : false
    }
    async kargohareketleri() {
        var myHeaders = new fetch.Headers();
        myHeaders.append("sec-ch-ua", "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"");
        myHeaders.append("Accept", "application/json, text/plain, */*");
        myHeaders.append("DNT", "1");
        myHeaders.append("Content-Type", "application/json;charset=UTF-8");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36");
        myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
        myHeaders.append("Sec-Fetch-Site", "same-origin");
        myHeaders.append("Sec-Fetch-Mode", "cors");
        myHeaders.append("Sec-Fetch-Dest", "empty");
        myHeaders.append("sec-gpc", "1");
        
        var raw = `{\"kargotakipno\":\"${this.secretcode}\"}`;
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        const r = await fetch("https://suratkargo.com.tr/KargoTakip/KargoHareketi", requestOptions)
        try {
            const json = await r.json()
            return json
        } catch (error) {
            return error
        }
    }
    
}
module.exports=kargo;
/*
    @descr:範例為抓取政府資料開放平臺的交通部觀光局之資料，下方參考網址為url api
    @參考網址：https://data.gov.tw/dataset/7779
    @資料網址：https://gis.taiwan.net.tw/XMLReleaseALL_public/restaurant_C_f.json
*/

const fetch = require("node-fetch");

var restaurant_url = "https://gis.taiwan.net.tw/XMLReleaseALL_public/restaurant_C_f.json";

//執行抓取，其中 encodeURI會將中文的部份做UTF-8編碼
//console.log(encodeURI(restaurant_url));
fetch( encodeURI(restaurant_url), {
    method: 'GET'
})
.then(async function(result){
    //檢查是否抓取成功
    if (!result.ok) throw result;

    //remove byte order marker(BOM), then parse to JSON object
    let text = await result.text();
    if(text.charCodeAt(0) === 0xFEFF){
        text = text.substr(1);
    }
    return JSON.parse(text);
})
.then(function(data){

	//顯示餐廳資料
    var i;
    var j_restaurants = data.XML_Head.Infos.Info;

    //Region      : 地區名稱
    //Name        : 店家名稱
    //Description : 店家描述
    //Opentime    : 開放時間
    for( i=0; i<j_restaurants.length; i++){
        console.log("========================");
        console.log("地區名稱:" + j_restaurants[i].Region);
        console.log("店家名稱:" + j_restaurants[i].Name);
        console.log("店家描述:" + j_restaurants[i].Description);
        console.log("開放時間:" + j_restaurants[i].Opentime);
    }

}).catch(function(error){
    console.log(error);
    //抓取失敗
    console.log("抓取失敗");
});
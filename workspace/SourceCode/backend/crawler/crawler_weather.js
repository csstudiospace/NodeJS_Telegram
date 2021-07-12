/*
    @descr:範例為抓取中央氣象局開放資料平臺之資料，下方參考網址為url api
    @note: 需先請申請授權碼(api_key)，url api會用到，
           申請授權碼流程如下： 
           進入官網[https://opendata.cwb.gov.tw/index] -> 右上角按 登入/註冊 -> 選擇註冊方式 -> 註冊完成後找「會員資訊」 -> 按「取得授權碼」
    @參考網址：https://opendata.cwb.gov.tw/dist/opendata-swagger.html
*/

const fetch = require("node-fetch");

var api_key = "Your_API_KEY_FROM_中央氣象局";//在中央氣象局開放資料平臺的授權碼
var data_type = "F-C0032-001";//一般天氣預報-今明 36 小時天氣預報
var location_name = "";//地區

var weather_url = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/"+data_type+"?Authorization="+api_key+"&locationName="+location_name;

//執行抓取，其中 encodeURI會將中文的部份做UTF-8編碼
//console.log(encodeURI(weather_url));
fetch( encodeURI(weather_url), {
    method: 'GET'
})
.then(function(result){
    //檢查是否抓取成功
    if (!result.ok) throw result;
    return result.json();
})
.then(function(data){
	//顯示天氣資料
    var i,j;
    //在天氣資訊中 weatherElement的排序：Wx(天氣現象)、PoP(降雨機率)、MinT(最低溫度)、CI(舒適度)MaxT(最高溫度)
    var W_WX   = 0;
    var W_POP  = 1;
    var W_MINT = 2;
    var W_CI   = 3;
    var W_MAXT = 4;

    var j_locationis = data.records.location;

    for( i=0; i<j_locationis.length; i++){
        console.log( j_locationis[i].locationName);

        var j_wx = j_locationis[i].weatherElement[W_WX];
        console.log("   天氣現象:");
        for( j=0; j<j_wx.time.length; j++)
            console.log("       開始："+j_wx.time[j].startTime+", 結束："+j_wx.time[j].endTime+", "+j_wx.time[j].parameter.parameterName);

        var j_pop = j_locationis[i].weatherElement[W_POP];
        console.log("   降雨機率:");
        for( j=0; j<j_pop.time.length; j++)
            console.log("       開始："+j_pop.time[j].startTime+", 結束："+j_pop.time[j].endTime+", "+j_pop.time[j].parameter.parameterName+"%");

    }
    
}).catch(function(error){
    console.log(error);
    //抓取失敗
    console.log("抓取失敗");
});
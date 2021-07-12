const fetch = require("node-fetch");
const TelegramBot = require('node-telegram-bot-api');

//下方輸入你在 Telegram botfather 所拿到 bot的 API Token
const token = 'Your_Token_from_botfather';
const weather_api_key = "Your_API_KEY_FROM_中央氣象局";//在中央氣象局開放資料平臺的授權碼

//建立一個機器人，並設定自動接收訊息更新通知
const bot = new TelegramBot(token, {polling: true});

//一般打字時，會收到訊息
bot.on('message', function(msg){
	const chatId = msg.chat.id;
	const rcv_msg = msg.text;

	switch(true){
		//只要訊息結尾是天氣的，執行此case, 像： 台北天氣、屏東天氣…etc
		case /天氣$/.test(rcv_msg):
			get_weather(chatId, rcv_msg);
			break;

		//只要訊息結尾是餐廳的，執行此case, 像： 旗津餐廳(高雄市旗津區)、屏東餐廳(屏東縣屏東市)、蘆洲餐廳(新北市蘆洲區)…etc
		case /餐廳$/.test(rcv_msg):
			get_restaurant(chatId, rcv_msg);
			break;

		//問候語
		case "h":
		case "H":
			var sendstr = "您好，很高興為您服務，你需要什麼呢？\r\n";
			    sendstr += "天氣、餐廳\r\n";
			bot.sendMessage(chatId, sendstr);
			break;

	//無法辨識
		default:
		    var sendstr = "我不懂您說什麼，請再說一次\r\n";
			bot.sendMessage(chatId, sendstr);
			break;
	}

});

async function get_weather(_chatId, rcvstr){

	//將 台 轉換成 臺，方便接下來的比對
	var fixedstr = rcvstr.replace(/台/g,"臺");

	//找出搜尋區域字串
	var search_region = fixedstr.split("天氣")[0];
	if(search_region.length == 0){
		bot.sendMessage(_chatId,"輸入有誤");
		return;
	}

	//locationName: 地區名稱
	//Wx          : 天氣現象
	//PoP         : 降雨機率
	//startTime   : 起始時間
	//endTime     : 結束時間

	var data_type = "F-C0032-001";//一般天氣預報-今明 36 小時天氣預報
	var location_name = "";//地區：沒填代表全部地區

	var i,j;
	var weather_url = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/"+data_type+"?Authorization="+weather_api_key+"&locationName="+location_name;
	var j_data = await fetch(weather_url)
                       .then(async function(result){
							//檢查是否抓取成功
						    if (!result.ok) throw result;

						    return result.json();
						})
                       .catch(function(error){
                       		console.log(error);
                       		return {}; //失敗回傳空json物件
                       });

    //檢查json物件是否為空，成功往下，失敗return
    if(Object.keys(j_data).length==0)
    	return;
    
    //在天氣資訊中 weatherElement的排序：Wx(天氣現象)、PoP(降雨機率)、MinT(最低溫度)、CI(舒適度)MaxT(最高溫度)
    var W_WX   = 0;
    var W_POP  = 1;
    var W_MINT = 2;
    var W_CI   = 3;
    var W_MAXT = 4;

    var j_locations = j_data.records.location;

    var send_str = "";
    for( i=0; i<j_locations.length; i++){
    	console.log( j_locations[i].locationName);
    	if(j_locations[i].locationName && j_locations[i].locationName.indexOf(search_region) != -1){
    		send_str += "[" + j_locations[i].locationName + "]\r\n";
	        console.log( j_locations[i].locationName);

	        var j_wx = j_locations[i].weatherElement[W_WX];

	        send_str += "  天氣現象:\r\n";
	        console.log("  天氣現象:");
	        for( j=0; j<j_wx.time.length; j++){
	        	send_str += "  開始："+j_wx.time[j].startTime+" \r\n  結束："+j_wx.time[j].endTime+", \r\n      "+j_wx.time[j].parameter.parameterName+"\r\n\r\n";
	            console.log("  開始："+j_wx.time[j].startTime+", 結束："+j_wx.time[j].endTime+", "+j_wx.time[j].parameter.parameterName);
	        }

	        var j_pop = j_locations[i].weatherElement[W_POP];
	        send_str += "  降雨機率:\r\n";
	        console.log("  降雨機率:");
	        for( j=0; j<j_pop.time.length; j++){
	        	send_str += "  開始："+j_pop.time[j].startTime+" \r\n  結束："+j_pop.time[j].endTime+", "+j_pop.time[j].parameter.parameterName+"%\r\n\r\n";
	            console.log("       開始："+j_pop.time[j].startTime+", 結束："+j_pop.time[j].endTime+", "+j_pop.time[j].parameter.parameterName+"%");
	        }
    	}
    }

    if(send_str.length > 0)
    	await bot.sendMessage( _chatId, send_str);

    await bot.sendMessage( _chatId, "Done!");
}

async function get_restaurant(_chatId, rcvstr){

	//將 台 轉換成 臺，方便接下來的比對
	var fixedstr = rcvstr.replace(/台/g,"臺");

	//找出搜尋區域字串
	var search_region = fixedstr.split("餐廳")[0];
	if(search_region.length == 0){
		bot.sendMessage(_chatId,"輸入有誤");
		return;
	}

    var i;
    var restaurant_url = "https://gis.taiwan.net.tw/XMLReleaseALL_public/restaurant_C_f.json";
    var j_data = await fetch(restaurant_url)
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
                       .catch(function(error){
                       		console.log(error);
                       		return {}; //失敗回傳空json物件
                       });

    //檢查json物件是否為空，成功往下，失敗return
    if(Object.keys(j_data).length==0)
    	return;

    var j_restaurants = j_data.XML_Head.Infos.Info;

    //Region      : 縣/市名稱
    //Town        : 區/鄉鎮/名稱
    //Name        : 店家名稱
    //Description : 店家描述
    //Opentime    : 開放時間
    for( i=0; i<j_restaurants.length; i++){
    	
    	if(j_restaurants[i].Town && j_restaurants[i].Town.indexOf(search_region) != -1){
    		console.log("========================");
	        console.log("地區名稱:" + j_restaurants[i].Town);
	        console.log("店家名稱:" + j_restaurants[i].Name);
	        console.log("店家描述:" + j_restaurants[i].Description);
	        console.log("開放時間:" + j_restaurants[i].Opentime);
	        var send_str = "[地區名稱]:" + j_restaurants[i].Town + "\r\n";
	            send_str += "[店家名稱]:" + j_restaurants[i].Name + "\r\n";
	            send_str += "[店家描述]:" + j_restaurants[i].Description + "\r\n";
	            send_str += "[開放時間]:" + j_restaurants[i].Opentime + "\r\n";
	        await bot.sendMessage( _chatId, send_str);
    	}
    }

    await bot.sendMessage( _chatId, "Done!");
}

console.log("csstudiobot bot is starting...");




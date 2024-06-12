fetch('https://api.open-meteo.com/v1/jma?latitude=24.6685&longitude=124.7026&daily=weather_code,sunrise,sunset&timezone=Asia%2FTokyo&forecast_days=1')
// レスポンスの処理
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json(); //おまじない
})

// dataを処理
.then(data => {
    console.log(data,"日の出日の入りデータ確認");

    // 日の出＆日の入り
    const sunriseData = new Date(data.daily.sunrise);
    const sunsetData = new Date(data.daily.sunset);

    var sunriseHours = sunriseData.getHours();
    var sunriseMinutes = sunriseData.getMinutes();
    var sunsetHours = sunsetData.getHours();
    var sunsetMinutes = sunsetData.getMinutes();

    $("#sunrise").html(`${sunriseHours}:${sunriseMinutes}`);
    $("#sunset").html(`${sunsetHours}:${sunsetMinutes}`);

})

// エラーハンドリング
.catch(error => {
    console.error(error);  
});
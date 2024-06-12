/* ----- LocalStorageの名前 -----*/
// 初期化
let lsData,uname,createDate;

//localstorage戻し
lsData = JSON.parse(localStorage.getItem("name"));

if(localStorage.hasOwnProperty("name")){
    uname = lsData.username;
    createDate = lsData.createDate;

    $("#player").html(`${uname} さん`);
}else{
    location.href = "index.html";
}

/* ----- GoogleMap -----*/

// Dynamic Library Import
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "",
    v: "weekly",
    region: "JP",
    language: "ja"
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
});

/* ----- MAP表示 -----*/

// オブジェクト設定（initMap以外でも使うのでここに配置）
const taramap = [
    {id:"t001", spot:"多良間空港", lat:"24.6540373", lon:"124.6773855"},
    {id:"t002", spot:"すまむぬたらま", lat:"24.670955", lon:"124.70638"},
    {id:"t003", spot:"前泊港(西側)", lat:"24.675583", lon:"124.706366"},
    {id:"t004", spot:"宮古市の森", lat:"24.639364", lon:"124.693137"},
    {id:"t005", spot:"普天間御嶽", lat:"24.648419", lon:"124.722219"},
    {id:"t006", spot:"八重山遠見台", lat:"24.671655", lon:"124.696608"},
    {id:"t007", spot:"ふる里海浜公園", lat:"24.67615", lon:"124.695067"},
    {id:"t008", spot:"たねび食堂", lat:"24.665677", lon:"124.704134"},

];

// 各種初期化（別関数に引き渡すもの）

    // map（初期設定で定義するmap）
    let map = "";

    // 格納用配列
    let markerArr = [];
    let infoWinArr = [];

// ＊＊＊＊＊＊initMap関数＊＊＊＊＊＊
async function initMap() {

    /* ----- 初期設定（地図の表示位置を島の中心に置くがピンなどはつけない）----- */

        // スマホ対応
        const zoomLevel = window.innerWidth <= 768 ? 13 : 14;

        // 初期設定（import）
        const { Map, InfoWindow } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const { event, LatLng } = await google.maps.importLibrary("core");

        // 初期設定（中心・ピンはつけない）
        map = new google.maps.Map(document.getElementById("map_area"), {
            center: { lat: 24.6577019, lng: 124.6952496 },
            zoom: zoomLevel,
            mapId: "2b7b8366344cb22a", // Map ID is required for advanced markers.
        });

    /* ----- 位置情報（将来的にそのエリアにきた時だけチェックが入れられるようにしたい）----- */

        // 1. 位置情報取得成功した時
        function mapsInit(position) {
            // 位置情報（座標）取得
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const myLatLng = new google.maps.LatLng(lat, lon);

            // pinカスタマイズ
            const pinCustom = new google.maps.marker.PinElement({
                scale: 0.8,  // マーカーの大きさ( 等倍: 1)
                background: '#ff0000', // マーカーの色
                borderColor: '#ff0000', // マーカーの輪郭の色
                glyphColor: '#ffffff', // グリフの色
            });

            // pin設定
            const marker = new google.maps.marker.AdvancedMarkerElement({
                position: myLatLng,
                map,
                content: pinCustom.element, // カスタマイズしたマーカーの要素をセット
            });

            // pinクリック時
            marker.addListener('click', () => {
                // infowindowを設定
                const myInfoWindow = new google.maps.InfoWindow({
                    content: "現在地",
                });

                // クリックされたマーカーの情報ウィンドウを開く
                myInfoWindow.open({
                    anchor: marker,
                    map,
                });
            });
        };

        // 2. 位置情報取得失敗した時
        function mapsError(error) {
            let e = "";
            if (error.code == 1) { //1＝位置情報取得が許可されてない（ブラウザの設定）
            e = "位置情報が許可されてません";
            }
            if (error.code == 2) { //2＝現在地を特定できない
            e = "現在位置を特定できません";
            }
            if (error.code == 3) { //3＝位置情報を取得する前にタイムアウトになった場合
            e = "位置情報を取得する前にタイムアウトになりました";
            }
            alert("エラー：" + e);
        };

        // 3.位置情報取得オプション
        const set ={
            enableHighAccuracy: true, //より高精度な位置を求める
            maximumAge: 20000,        //最後の現在地情報取得が20秒以内であればその情報を再利用する設定
            timeout: 10000            //10秒以内に現在地情報を取得できなければ、処理を終了
        };

        // 位置情報取得実働
        navigator.geolocation.getCurrentPosition(mapsInit, mapsError, set);

    /* ----- 多良間のスタンプラリー各地部分 ----- */

    // マップの各地を表示
    taramap.forEach(function(loc) {

        // 位置情報（座標）取得
        const taraLatlng = new google.maps.LatLng(loc.lat, loc.lon);

        /* --- Pin部分---*/
            // pinカスタマイズ
            const pinCustom = new google.maps.marker.PinElement({
                scale: 0.9,  // マーカーの大きさ( 等倍: 1)
                background: '#666666', // マーカーの色
                borderColor: '#666666', // マーカーの輪郭の色
                glyphColor: '#ffffff', // グリフの色
            });

            // pin設定
            const marker = new google.maps.marker.AdvancedMarkerElement({
                position: taraLatlng,
                map,
                title: loc.spot,
                content: pinCustom.element, // カスタマイズしたマーカーの要素をセット
            });

            // 格納用配列に格納
            markerArr.push(marker);

        /* --- infoWindow部分---*/
            // infowindow設定
            const infoWindow = new google.maps.InfoWindow({
                content: loc.spot,
            });

            // 格納用配列に格納
            infoWinArr.push(infoWindow);

        /* --- Markerクリックイベント部分---*/

        marker.addListener('click', () => {

            // クリックしたmarkerのSpot名からtaramapでのindexを取る
            // spotにしているのはmarkerのタイトルに入れるしかなくidよりはspotがtitleに合うため
            const markerSpot = marker.title;
            const mi = taramap.findIndex((item)=> item.spot === markerSpot);
            console.log(mi,"markerindex");

            const markerIn = markerArr[mi];
            const infoWindowIn = infoWinArr[mi];

            // Close for ALL
            infoWinArr.forEach(infoWindow => infoWindow.close());

            // Open
            infoWindowIn.open({
                anchor: markerIn,
                map,
            });

            //active
            const itemId = loc.id;
            $(".item").removeClass("active");
            $("#"+itemId).addClass("active");
            $(".item").next().slideUp();
            $("#"+itemId).next().slideDown();

        });

    });
}
// ＊＊＊initMap関数ここまで＊＊＊

// ＊＊＊initMap関数実行＊＊＊
initMap();

/* ----- itemクリックイベント ----- */

$('.item').on('click', function() {

    //クリックしたidに紐づくtaramapのindexをとる
    const getId = $(this).attr("id");
    console.log(getId, "id番号");

    const i = taramap.findIndex((item)=> item.id === getId);
    console.log(i,"index");

    const markerIn = markerArr[i];
    const infoWindowIn = infoWinArr[i];

    // Close for ALL
    infoWinArr.forEach(infoWindow => infoWindow.close());

    //activeクラス（アコーディオン含）
    if($(this).hasClass("active")){
        $(".item").removeClass("active");
        $(this).next().slideUp();

    }else{
        $(".item").removeClass("active");
        $(this).addClass("active");
        $(".item").next().slideUp();
        $(this).next().slideDown();

        infoWindowIn.open({
            anchor: markerIn,
            map,
        });
    }

});

/* ----- Firebase部分 -----*/

//切り出したAPIKeyをimport
import firebaseConfig from "./firebaseApiKey.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection, doc, addDoc, setDoc, getDoc, updateDoc} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"

// Your web app's Firebase configuration
// ->firebaseApiKeyに移動済

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); //Firestoreに接続

// 初期DB
const stampInitial = {
    username: uname,
    t001: false,
    t002: false,
    t003: false,
    t004: false,
    t005: false,
    t006: false,
    t007: false,
    t008: false,
}

/* ----- リロード時にDBから取り出し -----*/
// データ取得
const docRef = doc(db, "stamp", createDate);
const docSnap = await getDoc(docRef);
const stampDB = docSnap.data();
console.log(stampDB,"docSnapDB");

// 存在有無で分岐
if (docSnap.exists()) {
    console.log("既存あり");

    // // プロパティをループして、trueのプロパティに対して処理を行う
    for (let key in stampDB) {
        if (key !== "username" && stampDB[key] === true) {
            
            // trueの場合はチェックアイコン処理のところと同じ
            $("#"+key).find(".check_area").html('<img src="img/checked.png" alt="済"></img>'); 
            $("#"+key).find(".check_area").addClass('done');
        }
    }

} else {
    console.log("既存なし");
    // 既存がない場合はドキュメント単位で追加
    setDoc(docRef,stampInitial);
}

/* ----- checkクリックイベント -----*/

$(".check_area").on("click", function(event){

    // チェックをいれる処理
    if($(this).hasClass('done')){
        console.log("終わってます"); //すでにチェックが入っていたらアラートを出さない
    }else if(!confirm("チェックを入れてよろしいですか？")){
        return false;
    }else{
        // チェックアイコン処理
        event.stopPropagation(); //.itemをクリックしたときの動きはさせない
        $(this).html('<img src="img/checked.png" alt="済"></img>'); // checkアイコン更新
        $(this).addClass('done'); // 今後アラート出さないためのClass設定

        // オブジェクト更新処理
        const pId = $(this).parent().attr("id"); // 親のid取得
        console.log(pId,"親のID");

        stampDB[pId] = true; // 親のidをキーにstampDB（firebaseからgetしたobj）の値更新

        // firestoreに入れる処理
        setDoc(docRef,stampDB);

    }
});
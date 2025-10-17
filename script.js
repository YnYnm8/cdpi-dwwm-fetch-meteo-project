
// === 要素の取得 ===
const inputElem = document.querySelector(".nameOfCity");
const form = document.querySelector(".citySearch");
const listContainer = document.querySelector(".city-list");
const templateCity = document.querySelector("#template-city");
const coordsForm = document.querySelector(".coords-search");
const inputLat = document.querySelector(".input-lat");
const inputLon = document.querySelector(".input-lon");
const templateMeteo = document.querySelector("#template-meteo");
const weatherContainer = document.querySelector(".weather-list");

function main() {

    navigator.geolocation.getCurrentPosition(onPosition);
    weatherByCity(form, inputElem, listContainer, templateCity, templateMeteo, weatherContainer);
    weatherByCoords(coordsForm, inputLat, inputLon, templateMeteo, weatherContainer);


}
main();



// ===  共通関数：緯度・経度から天気を取得して表示 ===
function weatherCoords(lat, lon, cityName) {

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=is_day,apparent_temperature,weather_code`)
        .then(response => response.json())
        .then(weathers => {
            const current = weathers.current;

            const cloneWeather = templateMeteo.content.cloneNode(true);
            cloneWeather.querySelector(".wcity-name").textContent = cityName;
            cloneWeather.querySelector(".temperature").textContent = current.apparent_temperature + "°C";
            const weatherCode = current.weather_code;

            // cloneWeather.querySelector(".meteo").textContent = weatherCode;

            const weatherIcon = cloneWeather.querySelector(".weather-icon");
            if (weatherCode === 0 || weatherCode === 1) {
                weatherIcon.classList.add("fa-sun");
            } else if (weatherCode === 2 || weatherCode === 3) {
                weatherIcon.classList.add("fa-cloud");
            } else if (weatherCode >= 61 && weatherCode <= 67) {
                weatherIcon.classList.add("fa-droplet");
            }else if(weatherCode>=71 && weatherCode<=75){
                weatherIcon.classList.add("fa-snowflake");
            }else if(weatherCode>=80 && weatherCode<=82){
                weatherIcon.classList.add("fa-cloud-showers-water");
            }
            else {
                weatherIcon.classList.add("fa-cloud-sun");
            }

            // 前回の天気を消してから追加
            weatherContainer.innerHTML = "";
            weatherContainer.appendChild(cloneWeather);
               skyColor(lat,lon);
        });
}


// === 都市名で検索 ===
function weatherByCity(cleanCity) {
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // フォームの自動リロードを防ぐ

        const cleanCity = inputElem.value.trim().toLowerCase();
        if (!cleanCity) return; // 空文字防止

        fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cleanCity}&count=10&language=en&format=json`)
            .then(response => response.json())
            .then(cityDetails => {
                listContainer.innerHTML = "";

                cityDetails.results.forEach(cityDetail => {
                    const clone = templateCity.content.cloneNode(true);
                    const card = clone.querySelector(".city-card");
                    clone.querySelector(".city-name").textContent = cityDetail.name;
                    clone.querySelector(".country-name").textContent = cityDetail.country;
                    listContainer.appendChild(clone);

                    // ✨ クリックで天気取得関数を呼ぶ
                    card.addEventListener("click", function () {
                        weatherCoords(cityDetail.latitude, cityDetail.longitude, cityDetail.name);
                         //  都市リストをクリック後に消す
                        listContainer.innerHTML = "";
                    });
                });
            });
    });

}


// === 緯度・経度から検索 ===
function weatherByCoords(lat, lon) {

    coordsForm.addEventListener("submit", function (event) {
        event.preventDefault();
        // parseFloatの正しい書き方に修正
        const lat = parseFloat(inputLat.value.trim());
        const lon = parseFloat(inputLon.value.trim());

        if (isNaN(lat) || isNaN(lon)) {
            alert("数値の緯度・経度を入力してください。");
            return;
        }


        // 共通関数を再利用
        weatherCoords(lat, lon);
    });

}

/**
 * S'execute quand l'utilisateur a accepté la geolocalisation.
 *
//  * @param {*} position_obj
//  */



function onPosition(userPosition) {
    console.log("userLatitude: " + userPosition.coords.latitude);
    console.log("userLongitude: " + userPosition.coords.longitude);

    const userLatitude = userPosition.coords.latitude;
    const userLongitude = userPosition.coords.longitude;
    const chezToi = document.querySelector(".chez-toi-submit");
    chezToi.addEventListener("click", function (event) {
        event.preventDefault();

        weatherCoords(userLatitude, userLongitude);
    })
}
function skyColor(lat,lon) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=is_day`)
        .then(response => response.json())
        .then(dataTime => {
            console.log(dataTime.current.is_day);
            const time =  dataTime.current.is_day;
            if (time){
                document.body.style.background = "linear-gradient(to bottom, #1e3c72, #2a5298, #23a6d5, #23d5ab)";
            }else{
                document.body.style.background = "linear-gradient(182deg,rgba(8, 22, 28, 1) 0%, rgba(54, 96, 117, 1) 91%)";
            }

})
}


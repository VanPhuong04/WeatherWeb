var myAPI = '4ccbed5532f6b7d470687f9561a26612';
var cityInput = document.getElementById('nameCityInput');
var resultBox = document.querySelector('.results-list');
var resultHeader = document.querySelector('.result-header');

//Hàm gọi api lấy dữ liệu thời tiết
function getWeatherData(city) {
    fetch(
        'https://api.openweathermap.org/data/2.5/forecast?q=' + city + ',vn&appid=' + myAPI + '&units=metric&lang=vi'
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // Cập nhật tiêu đề kết quả
            if (resultHeader) {
                resultHeader.innerHTML = `Kết quả cho <span class="search-keyword">${city}</span>`;
            }
            // lọc dữ liệu có giờ = 12:00:00 | dt_txt là thuộc tính của json mà api trả về
            var dailyData = data.list.filter(function (item) {
                return item.dt_txt.includes("12:00:00");
            });
            // Xóa kết quả cũ
            resultBox.innerHTML = "";
            // Duyệt qua từng ngày và render HTML
            dailyData.forEach((item, index) => {
                let date = new Date(item.dt_txt);
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let dayLabel = index === 0 ? "Hôm nay" : `Ngày ${day}/${month}`;
                let html = `
                <div class="result-item">
                    <div class="item-day">
                        <p class="">${dayLabel}</p>
                    </div>
                    <div class="item-icon">
                        <img src="https://openweathermap.org/img/wn/${
                            item.weather[0].icon
                        }@2x.png" alt="${item.weather[0].description}">
                    </div>
                    <div class="item-temp">
                        <p class="high-temp">${Math.round(item.main.temp_max)}°C</p>
                        <p class="low-temp">${Math.round(item.main.temp_min)}°C</p>
                    </div>
                    <div class="item-des">
                        <p class="des-main">${item.weather[0].description}</p>
                    </div>
                    <div class="item-humi">
                        <i class="wi wi-humidity"></i>
                        <p class="humi-text">${item.main.humidity}%</p>
                    </div>
                </div>
                `;
                resultBox.innerHTML += html;
            });
        })
        .catch(function (error) {
            console.error('Error fetching weather data:', error);
        });
}

// Bấm Enter trong ô input để tìm và ngăn submit form reload trang khi bấm enter
var searchForm = cityInput.closest('form');
if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var city = cityInput.value.trim();
        if (city !== "") {
            getWeatherData(city);
        } else {
            if (resultHeader) {
                resultHeader.textContent = "Vui lòng nhập tên thành phố để xem thời tiết.";
            }
            resultBox.innerHTML = "";
        }
    });
}

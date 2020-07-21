class Model {
    constructor (query){
        this.query = query;
    }

    async getResults(lat = '',long=''){
        try {
            const key = '0ee6277c95b493b057bb0c534b40cecc';
            const url = lat && long ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}&units=metric` : `https://api.openweathermap.org/data/2.5/weather?q=${this.query}&appid=${key}&units=metric`;
            let response = await fetch(url);
            let data = await response.json();
            const result = data;
            this.result = result;

        } catch (error) {
            console.log(error)
        }  
    }
}

controller =  {

     InitApp() {

        // Get user location
        const currentCity =  new Model();
        if (window.navigator.geolocation) { 
            window.navigator.geolocation.getCurrentPosition(successfulLookup, console.log);
           } 
           async function successfulLookup(position){
            try{
            const { latitude, longitude } = position.coords;
            await currentCity.getResults(latitude,longitude);
            const res = currentCity.result;
            veiw.AppVeiw(res)
            } catch (error) {
                console.log(error)
            }  
        }
        // add event lesiner
        window.addEventListener("keydown", event => {
            if (event.isComposing || event.keyCode === 13) {
                this.searchcontroller()
            }
          });
    },
    async searchcontroller(){
        const Cityname = veiw.getsearchInput();
        if(Cityname){
            const city =  new Model(Cityname);
            await city.getResults();
            veiw.AppVeiw(city.result)
            veiw.ClearsearchInput();
            if(city.result.message === 'city not found' ){
                console.log('not city')
            }
        }

    }
  
} 

controller.InitApp();


veiw = {
    base : {
        citySection : document.querySelector('.city-section'),
        search:document.querySelector('.search-Input')
    },
    AppVeiw(res) {
        const dayDate = this.veiwDay();
        const markUp = `
            <h1 class="city-name">${res.name}</h1>
            <h2  class="date">${dayDate}</h2>
            <i id="wether-icon" class="owf owf-${res.weather[0].id}"></i>
            
            <h1 class="city-temp">${res.main.temp} <span>°C</span></h1>
        `
        
        //console.log(res) <img class="city-img" src="http://openweathermap.org/img/w/${res.weather[0].icon}.png" alt="">
        document.querySelector('.city-section').innerHTML = markUp;
    },
    veiwDay(){
        const weekDays = ['Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday','Friday','Saturday']
        const date = new Date;
        const day = date.getDay();
        const dayDate = date.getDate();
        return `${weekDays[day]} ${dayDate}`;
    },
    getsearchInput(){
        return document.querySelector('.search-Input').value
    },
    ClearsearchInput(){
        document.querySelector('.search-Input').value = ''
    }
}


const city =  new Model('new york');
city.getResults()

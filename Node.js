// node js for weather app 

// include required modules
const fs = require('fs');
const http = require('http');
var requests = require('requests');

const port = process.env.port || 8000;//first process/find random port if not found then go to 8000

//grab/select home.html HomeHtmlfile  
const HomeHtmlfile = fs.readFileSync('index.html', 'UTF-8');

const replaceHomeFileData = (tempVal, orgVal) => {

	//update temp ,min,max,location,country
	let temprature = tempVal.replace("{%temp%}", orgVal.current.temp_c);
	temprature = temprature.replace("{%tempMin%}", orgVal.forecast.forecastday[0].day.mintemp_c);
	temprature = temprature.replace("{%tempMax%}", orgVal.forecast.forecastday[0].day.maxtemp_c);
	temprature = temprature.replace("{%tempLocation%}", orgVal.location.name);
	temprature = temprature.replace("{%tempCountry%}", orgVal.location.country);

	// update weather icon according to api text
	if (orgVal.current.condition.text == 'Sunny')
		temprature = temprature.replace("{%weatherIcon%}", `<i class="weatherIcon fas fa-sun fa-3x my-20" style="color:yellow;"></i>`);

	else if (orgVal.current.condition.text == 'Cloudy')
		temprature = temprature.replace("{%weatherIcon%}", `<i class="weatherIcon fas fa-cloud fa-3x my-20" style="color:white;"></i>`);

	else if (orgVal.current.condition.text == 'Rainy')
		temprature = temprature.replace("{%weatherIcon%}", `<i class="weatherIcon fas fa-cloud-rain fa-3x my-20" style="color:gray;"></i>`);

	else
		temprature = temprature.replace("{%weatherIcon%}", `<i class="weatherIcon fas fa-cloud fa-3x my-20" style="color: white;"></i>`);

	return temprature;
};

const server = http.createServer((req, res) => {
	if (req.url == '/') {
		//here only accept http link ****
		requests("http://api.weatherapi.com/v1/forecast.json?key=fabe898711064a3d89f125021210911&q=Pune&days=1&aqi=no&alerts=no")
			.on('data', (chunk) => {

				let obj = JSON.parse(chunk);
				const tempra = replaceHomeFileData(HomeHtmlfile, obj);
				// res.write();
				res.end(tempra);
			})
			.on('end', (err) => {
				if (err) return console.log('connection closed due to errors', err);
				// console.log('end');
			});
	}
});

server.listen(port, '127.0.0.1',()=>{console.log("listening at 8000");
});

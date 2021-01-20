import * as functions from "firebase-functions"

const fetch = require('node-fetch')

interface WeatherReport {
    coord: Map<string, number>
    weather: Array<WeatherData>
    sys: LocationData
    name: string
  }
  interface WeatherData {
    id: number
    main: string
  }
  interface LocationData {
    id: number
    country: string
  }

  export class WeatherObject {
    country: string
    city: string
    keyword: string

    constructor(country: string, city:string, keyword: string) {
      this.country = country
      this.city = city
      this.keyword = keyword
    }
  }
    
  export const getWeatherByCoordinates = async (latitude:number, longitude:number) => {
    let result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${functions.config().weatherAccessToken}`
    )
  
    let json:WeatherReport = await result.json()
  
    console.log(json)
  
    var weatherReportList:WeatherData = json["weather"][0]
    var keyword:string = weatherReportList["main"]
    var country:string = json["sys"]["country"] ?? ''
    var city:string = json["name"]
  
    return new WeatherObject(country, city, keyword)
  }
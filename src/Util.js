import React from 'react';
import numeral from 'numeral';
import {Circle, Popup} from 'react-leaflet';

const casesTypeColors = {
    cases : {
        hex : "#CC1034",
        multiplier : 800,
    },
    recovered : {
        hex : "#7dd71d",
        multiplier : 1200,
    },
    deaths : {
        hex : "#fb4443",
        multiplier : 2000,
    }
}

export const SortByCases = (data,casesComparator) =>
{
    const Data = [...data];
    if(casesComparator)
    {
        Data.sort((obj1,obj2) => {return obj1.cases>obj2.cases ?-1 : 1;});
    }
    else
    {
        Data.sort((obj1,obj2) => {return obj1.cases<obj2.cases ?-1 : 1;});
    }
    return Data;
}

export const SortByName = (data, countryComparator) =>
{
    const sortedData = [...data];
    if(countryComparator)sortedData.sort((obj1,obj2) => {return obj1.country<obj2.country ?-1 : 1;});
    else sortedData.sort((obj1,obj2) => {return obj1.country>obj2.country ?-1 : 1;});
    return sortedData;
}

export const prettyPrintStat = (stat) => stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={250*casesTypeColors[casesType].multiplier
        // Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier 
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
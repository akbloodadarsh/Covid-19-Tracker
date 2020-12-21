import React from "react";
import { Circle, Popup } from "react-leaflet";
import {countriesarea} from "./Util";
import numeral from 'numeral';

const casesTypeColors = {
    cases: {
        hex: "#fb4443",
        multiplier: 800,
    },
    recovered: {
        hex: "darkGreen",
        multiplier: 1200,
    },
    deaths: {
        hex: "#CC1034",
        multiplier: 2000,
    },
};

function DrawCircleOnMap({ country, casesType = "recovered" }) {
    let area = countriesarea[country.countryInfo.iso3];
    if (!area) {
        area = 800;
    }
    let radius = parseInt(
        (country[casesType] / country.population) * 20 * area
    );
    if (!radius) radius = 0;
    if (radius > 1523903) {
        radius = 1000000;
    }
    if (radius > 1000000 && casesType !== "death") {
        radius = 700000;
    }
    return (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            pathOptions={{
                color: casesTypeColors[casesType].hex,
                fillColor: casesTypeColors[casesType].hex,
                fillOpacity: 0.2,
            }}
            radius={radius}
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
    );
}

export default DrawCircleOnMap;

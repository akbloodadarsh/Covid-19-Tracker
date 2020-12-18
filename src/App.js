import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map'
import Table from './Table'
import { SortByCases,SortByName } from './Util';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import LineGraph from './LineGraph'
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('World');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesComparator, setCasesComparator] = useState(0);
  const [countryComparator, setCountryComparator] = useState(0);
  const [graphCountry,setGraphCountry] = useState('all');
  const [mapCenter,setMapCenter] = useState({lat: 41.257017,lng: 29.077524}); 
  const [mapZoom, setMapZoom] = useState(5);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data)
    });
  },[]);

  useEffect(() => {
    const getCountriesData = async () => {
    await fetch('https://disease.sh/v3/covid-19/countries')
    .then((response) => response.json())
    .then((data) => {
      setTableData(data);
      const country_name = data.map((country) => (
        {
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        setCountries(country_name);
    });
  };
getCountriesData();
  },[]);

const onCountryChange = async (event) => {
  const countryname = event.target.value;
  const url = countryname === 'World' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryname}`; 
  await fetch(url)
  .then(response => response.json())
  .then((data) => {
    setGraphCountry(countryname);
    setCountry(countryname);
    setCountryInfo(data);
    setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
    setMapZoom(4);
  });
}

const sortByCountryName = () => {
  setTableData(SortByName(tableData,countryComparator));
  setCountryComparator(!countryComparator);
}

const sortByCountryCases = () => {
  setTableData(SortByCases(tableData,casesComparator)); 
  setCasesComparator(!casesComparator)
}

  return (
    <div className="app">
        <div className="app__left">
          <div className="app__header">
            <h1>Daily Change</h1>
            <FormControl className="app_dropdown">
              <Select variant="outlined" value={country} onChange={onCountryChange}>
                <MenuItem value="World">World</MenuItem>
                {
                  countries.map((country) => (<MenuItem value={country.value}>{country.name}</MenuItem>))
                }
              </Select>
            </FormControl>
          </div>

          <div className="app__stats">
                <InfoBox title="CoronaVirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
                <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
                <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
          </div> 

          <Map center={mapCenter} zoom={mapZoom}/>

        </div>
        <div className="app__right">
                <CardContent>
                  <h1 Style="padding-bottom:20px">Cases Overview</h1>
                  <tr>
                    <td>
                      <div class="tooltip">
                        <button className="sortByCountryName" onClick={sortByCountryName}><SortByAlphaIcon /></button>
                        <span class="tooltiptext">Sort By Country Name</span>
                      </div>
                    </td>
                    <td Style="padding-left:20px">
                      <div class="tooltip">
                        <button className="sortByCountryCases" onClick={sortByCountryCases}><FormatListNumberedIcon /></button>
                        <span class="tooltiptext">Sort By Country Cases</span>
                      </div>
                    </td>
                  </tr>
                  <Table countries={tableData} />
                  <LineGraph countryName={graphCountry} />
                </CardContent>
        </div>
    </div>
  );
}

export default App;

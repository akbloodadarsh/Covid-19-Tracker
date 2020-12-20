import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map'
import Table from './Table'
import { SortByCases,SortByName , prettyPrintStat } from './Util';
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
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [countryCode, setCountryCode] = useState('World');


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
        setMapCountries(data);
    });
  };

getCountriesData();
  },[]);


  useEffect(() => {
    const change_data = async() => {
      const url =countryCode === "World"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url)
          .then((response) => response.json())
          .then((data) => {
            setCountry(countryCode);
            setGraphCountry(countryCode); 
            setCountryInfo(data); 
            const lat_long = countryCode==='World' ? [34.80746,-40.4796 ] : [data.countryInfo.lat, data.countryInfo.long];
            setMapCenter(lat_long);
            setMapZoom(4);
          });
      };
      
      change_data();
  },[countryCode]);

  const onCountryChange = (e) => {
    setCountryCode(e.target.value);
  };

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
                <InfoBox onClick={(e) => setCasesType('cases')} title="CoronaVirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />
                <InfoBox onClick={(e) => setCasesType('recovered')} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />
                <InfoBox onClick={(e) => setCasesType('deaths')} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />
          </div> 

          <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>

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

// two country comparison graph
// heal ratio

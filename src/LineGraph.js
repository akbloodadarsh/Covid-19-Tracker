import {useState, useEffect, memo} from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options =     
    {
        text: "cases",
        easing: "linear",
        responsive: true,
        legend : {
                    display : false,
                },
    elements : 
    {
        point : {
            radius : 0,
        },
    },
    maintainAspectRatio : false,
    tooltips : {
        mode : "index",
        intersect : false,
        callbacks : {
            label : function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales : 
    {
        xAxes : 
        [
            {
                type : "time",
                time : {
                    format : "MM/DD/YY",
                    tooltipFormat : "ll",
                },
            },
        ],
        yAxes : 
        [
            {
                gridLines : 
                {
                    display : false,
                },
                ticks : 
                {
                    min: 0,
                    callback : function(value, index,values)
                    {
                        return numeral(value).format("0a");
                    }
                },
            },
        ],
    },
};

function LineGraph({countryName='all', showDetails='0'}) {
    const [data_cases, setDataCases] = useState({});
    const [data_deaths, setDataDeaths] = useState({});
    const [data_recovered, setDataRecovered] = useState({});
    const [countryDetails, setCountryDetails] = useState({});

    useEffect(() => 
    {
        const buildChartData = (data, caseType) => {
            // if(countryName==='World')countryName = 'all';
            if(countryName!=='all' && countryName!=='World')data=data.timeline;
            try {
                if(!data.cases)return;
            }
            catch (e) 
            {
                return;
            }
            let chartData = []
            let lastDataPoint;
            for(let date in data.cases) {
                if(lastDataPoint) 
                {
                    let newDataPoint = 
                    {
                        x : date,
                        y : data[caseType][date] - lastDataPoint, 
                    };
                    chartData.push(newDataPoint);
                }
                lastDataPoint = data[caseType][date]
            }
            return chartData;
        };
        const fetchData = async () => 
        {
            await fetch(`${countryName==='World' || countryName==='all'?'https://disease.sh/v3/covid-19/historical/all':`https://disease.sh/v3/covid-19/historical/${countryName}`}`)
            .then((response) => response.json())
            .then(data => {
                setDataCases(buildChartData(data,'cases'));
                setDataDeaths(buildChartData(data,'deaths'));
                setDataRecovered(buildChartData(data,'recovered'));      
            });
        };
        const fetchCountryDetails = async () => 
        {
            await fetch(`${countryName==='World' || countryName==='all'?'https://disease.sh/v3/covid-19/all':`https://disease.sh/v3/covid-19/countries/${countryName}`}`)
            .then((response) => response.json())
            .then(data => {
                setCountryDetails(data);      
            });
        };
        fetchCountryDetails();
        console.log(countryDetails);
        fetchData();
    },[countryName]);
    return (
        <div>
            {showDetails==='1' && <h1 Style="padding-bottom=10px;">{countryName}</h1>}
            {
                data_cases?.length > 0 && data_recovered?.length > 0 && data_deaths?.length > 0 && (
                <Line options = {options} 
                    data={{
                    datasets : [
                        {
                            backgroundColor : "rgba(204,16,52,0)",
                            borderColor : "#CC1034",
                            data : data_cases,
                        },
                        {
                            backgroundColor : "rgba(204,16,52,0)",
                            borderColor : "green",
                            data : data_recovered,
                        },
                        {
                            backgroundColor : "rgba(204,16,52,0)",
                            borderColor : "#c02739",
                            data : data_deaths,
                        },
                    ],
                }
                } />)
            }
            {/* {showDetails==='0' && <div>
                <p>Active : {countryDetails.active}</p>
                <p>Active Per One Million : {countryDetails.activePerOneMillion}</p>
                <p>Cases : {countryDetails.cases}</p>
                <p>Cases Per One Million : {countryDetails.casesPerOneMillion}</p>
                <p>Continent : {countryDetails.continent}</p>
                <p>Country : {countryDetails.country}</p>
                <p>Critical : {countryDetails.critical}</p>
                <p>Critical Per One Million : {countryDetails.criticalPerOneMillion}</p>
                <p>Deaths : {countryDetails.deaths}</p>
                <p>Deaths Per One Million : {countryDetails.deathsPerOneMillion}</p>
                <p>One Case Per People : {countryDetails.oneCasePerPeople}</p>
                <p>One Death Per People : {countryDetails.oneDeathPerPeople}</p>
                <p>One Test Per People : {countryDetails.oneTestPerPeople}</p>
                <p>Population : {countryDetails.population}</p>
                <p>Recovered : {countryDetails.recovered}</p>
                <p>Recovered Per One Million : {countryDetails.recoveredPerOneMillion}</p>
                <p>Tests : {countryDetails.tests}</p>
                <p>Tests Per One Million : {countryDetails.testsPerOneMillion}</p>
                <p>Today Cases : {countryDetails.todayCases}</p>
                <p>Today Deaths : {countryDetails.todayDeaths}</p>
                <p>Today Recovered : {countryDetails.todayRecovered}</p>
                </div>
            } */}
                 
        </div>
    )
}

export default memo(LineGraph);
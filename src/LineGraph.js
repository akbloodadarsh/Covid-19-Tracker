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
    const [countryFlag,setCountryFlag] = useState('');

    useEffect(() => 
    {
        const buildChartData = (data, caseType) => {
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
                try {
                    if(!data.countryInfo.flag)return;
                }
                catch (e) 
                {
                    return;
                }
                setCountryFlag(data.countryInfo.flag);
                setCountryDetails(data);      
            });
        };
        fetchCountryDetails();
        fetchData();
    },[countryName]);
    return (<>
        <div className="Line_Graph_Graphs">
            {
            showDetails==='1' && <h1 className="Line_Graph_Graphs_Header" Style="padding-bottom=10px;margin-top:10px;"><img className="Line_Graph_Graphs_Flag" src={countryFlag} alt="" Style="width:30px;height:30px;border-radius: 20px;padding:0px; "></img> {countryName}</h1>}
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
        </div>
        {
            showDetails==='1' && 
            <div className="Line_Graph_Overlay">
                <p className="Line_Graph_Description">Active : {countryDetails.active}</p>
                <p className="Line_Graph_Description">Cases : {countryDetails.cases}</p>
                <p className="Line_Graph_Description">Critical : {countryDetails.critical}</p>
                <p className="Line_Graph_Description">Tests : {countryDetails.tests}</p>
                <p className="Line_Graph_Description">Today Cases : {countryDetails.todayCases}</p>
                <p className="Line_Graph_Description">Today Deaths : {countryDetails.todayDeaths}</p>
                <p className="Line_Graph_Description">Today Recovered : {countryDetails.todayRecovered}</p>
            </div>
        }
        </>
    )
}

export default memo(LineGraph);
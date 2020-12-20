import {useState, useEffect} from 'react';
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
                    callback : function(value, index,values)
                    {
                        return numeral(value).format("0a");
                    }
                },
            },
        ],
    },
};

function LineGraph({caseType = 'cases',countryName='all'}) {
    const [data, setData] = useState({})    

    useEffect(() => 
    {
        const buildChartData = (data, caseType = 'cases') => {
            // if(countryName==='World')countryName = 'all';
            if(countryName!=='all' && countryName!=='World')data=data.timeline;
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
                const chartData = buildChartData(data);
                setData(chartData);      
            });
        };
        fetchData();
    },[countryName]);
    return (
        <div Style="padding-top:20px">
            {
                data?.length > 0 && (
                <Line options = {options} 
                    data={{
                    datasets : [
                        {
                            backgroundColor : "rgba(204,16,52,0)",
                            borderColor : "#CC1034",
                            data : data,
                        },
                    ],
                }

                } />)
            }            
        </div>
    )
}

export default LineGraph
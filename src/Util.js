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



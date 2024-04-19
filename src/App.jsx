import { useEffect } from 'react';
import './App.scss';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {CategoryScale, Chart, LinearScale, BarElement} from 'chart.js'; 
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);

function App() {
  const [papers, setPapers] = useState(null);
  const [searchFilter, setFilterValue] = useState(null);
  const [pageSize, setPageSize] = useState(10);

  const getURL = (pageSize, filter) => {
    let url = `https://api.core.ac.uk/v3/search/works?limit=${pageSize}`;
    if (filter) {
      url += `&q=(${searchFilter})`;
    }

    return url;
  }

  useEffect(() => {fetchPapers(pageSize, searchFilter)}, []);
  useEffect(() => {fetchPapers(pageSize, searchFilter)}, [pageSize]);

  const fetchPapers = async (pageSize, searchFilter) => {
    const response = await fetch(getURL(pageSize, searchFilter));
    const responseJson = await response.json();
    setPapers(responseJson.results);
  }

  const handleInputChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filterChanges = async () => {
    await fetchPapers(pageSize, searchFilter);
  }

  const changePageSize = async (e) => {
    setPageSize(e.target.value);
  }

  const countOccurrences = (filter, text) => {
    if (!filter) {
      return 0;
    }
    const escapedFilter = filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexPattern = new RegExp(escapedFilter, 'gi');
    const matches = text.match(regexPattern);

    return matches ? matches.length : 0;
}

  if(!papers) {
    return(<div className='loading'>Loading...</div>);
  }

  let chartData = {
    labels: papers.map(paper => paper.yearPublished),
    datasets: papers.map(paper => ({
      label: paper.title,
      data: paper.publishedDate,
      backgroundColor: 'rgb(11, 18, 246)'
    }))
  };


  return (
  <div className="App">
    <h1>Papers</h1>
    <div className='chart-container'>
      <Bar className='chart' data={chartData}/>
    </div>
    <div className='filter-row'>
      <input type="text" placeholder='Filters' onChange={handleInputChange}/>
      <button onClick={filterChanges}>Filter</button>
      <select onChange={changePageSize} name="pageSizes" id="">
        <option value="2">2</option>
        <option value="5">5</option>
        <option selected value="10">10</option>
      </select>
    </div>
     <div className='card-container'>
        {papers.map((data) => {
          return(
            <div className='card-style'>
              <h4>{data.title}</h4>
              <p>Language: {data.language?.name ?? "No Language Available"}</p>
              <p>Number of Hits: {countOccurrences(searchFilter, data.fullText)}</p>
              <p>Published: {data.yearPublished}</p>
              <a href={data.downloadUrl}>View Paper</a>
            </div>
          );
        })}
     </div>
  </div>
  );
}

export default App;


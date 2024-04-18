import { useEffect } from 'react';
import logo from './logo.svg';
import './App.scss';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {CategoryScale, Chart, LinearScale, BarElement} from 'chart.js'; 
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);

function App() {
  const [papers, setPapers] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {fetchPapers("https://api.core.ac.uk/v3/search/works")}, []);

  const fetchPapers = async (url) => {
    const response = await fetch(url);
    const results = await response.json();
    setPapers(results.results);
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const filterChanges = () => {
    const url = 'https://api.core.ac.uk/v3/search/works?q=('+ inputValue + ')';
    fetchPapers(url);
  }

  if(!papers) {
    return(<div>Loading...</div>);
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
    </div>
     <div className='card-container'>
        {papers.map((data) => {
          return(
            <div className='card-style'>
              <h4>{data.title}</h4>
              <p>Language: {data.language.name}</p>
              <p>Published: {data.yearPublished}</p>
              <a href={data.downloadUrl}>Download</a>
            </div>
          );
        })}
     </div>
  </div>
  );
}

export default App;

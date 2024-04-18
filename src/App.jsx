import { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {CategoryScale, Chart, LinearScale, BarElement} from 'chart.js'; 
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);

function App() {
  const [papers, setPapers] = useState(null);

  useEffect(() => {fetchPapers("https://api.core.ac.uk/v3/search/works")}, []);

  const fetchPapers = async (url) => {
    const response = await fetch(url);
    const results = await response.json();
    setPapers(results.results);
  }

  if(!papers) {
    return(<div>Loading...</div>);
  }

  let chartData = {
    labels: papers.map(paper => paper.yearPublished),
    datasets: papers.map(paper => ({
      label: paper.title,
      data: paper.publishedDate

    }))
  };


  return (
  <div className="App">
    <h1>Papers</h1>
    <div className='chart-container'>
      <Bar className='chart' data={chartData}/>
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

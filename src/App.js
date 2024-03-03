import './App.css';
import { React, useState, useEffect } from 'react';
import blinkGif from './output-onlinegiftools.gif'
import { Gif } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { useAsync } from "react-async-hook";

function App() {
  const [currentData, setCurrentData] = useState(0)
  const [currentDataFive, setCurrentDataFive] = useState(5)
  const [data, setData] = useState([]);
  const [clickedData, setClickedData] = useState([])
  const [clickedDataFive, setClickedDataFive] = useState([])
  const [gifPlayed, setGifPlayed] = useState(false);

  const apikey = 'a8ec3adf11a71a6e3ef495d42c8fb9f4';
    const category = 'world';
    const url = 'https://gnews.io/api/v4/top-headlines?category=' + category + '&lang=en&country=us&max=50&apikey=' + apikey;
    useEffect(() => {
     fetch(url).then(result => result.json()).then(alldata => setData(alldata.articles)).catch(error => console.log(error.message))
    }, [])

    function nextQuestion() {
      if (!gifPlayed) {
        const blinkElement = document.getElementById('blink');
        if (blinkElement) {
          blinkElement.onload = () => {
            blinkElement.src = blinkGif;
            setGifPlayed(true);
          };
          blinkElement.src = blinkGif; 
        }
      }

      const nextIndex = currentData >= data.length - 1 ? 0 : currentData + 1;
      setCurrentData(nextIndex);
      setClickedData([...clickedData, currentData]);

      const nextIndexFive = currentDataFive >= data.length - 1 ? 0 : currentDataFive + 1;
      setCurrentDataFive(nextIndexFive);
      setCurrentDataFive([...clickedDataFive, currentDataFive]);
    }

    const giphyFetch = new GiphyFetch('bvWogBDRALOdICcvDhJPS5XVxe50qs7O')

    function GifDemo() {
      const [gif, setGif] = useState(null);
      useAsync(async () => {
        const { data } = await giphyFetch.gif("fpXxIjftmkk9y");
        setGif(data);
      }, []);
      return gif && <Gif gif={gif} width={100} />;
    }


  return (
    <div className="App">
      <div className="tabloid">
          <div onClick={() => nextQuestion()} className="blink-button">
            <div className="title">Blink to update: </div>
            <button className="blink-img" onClick={nextQuestion}><img id="blink" src={blinkGif} alt="Blinking eye gif"></img></button>
            <div className="title2">Click my eye!!</div>
          </div>
            <div className="answers"> 
              {data[currentData] && (
                <div className="li" key={data[currentData].publishedAt}>{data[currentData].title}
                <div className="gif"><GifDemo /></div>
                </div>
              )}
              {clickedData.length > 0 && clickedData.map((questionIndex, index) => (
                <div className="li" key={index}>{data[questionIndex] && data[questionIndex].title}
                <div className="gif"><GifDemo /></div>
                </div>
              ))}
            </div>
        </div>
    </div>
  );
}

export default App;



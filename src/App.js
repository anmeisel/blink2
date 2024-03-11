import './App.css';
import { React, useState, useEffect } from 'react';
// import blinkGif from './blink.gif'
// import noblinkGif from './noblink.png'
import { Gif } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { useAsync } from "react-async-hook";
import AdSense from 'react-adsense';
import ImgurComponent from './Imgur';
import EbayComponent from './Ebay'
const keyword_extractor = require("keyword-extractor");


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const keywords = [];

function App() {
  const [currentData, setCurrentData] = useState(0)
  const [currentDataFive, setCurrentDataFive] = useState(5)
  const [vintedcurrentData, setVintedCurrentData] = useState(0)
  const [data, setData] = useState([]);
  const [vinted, setVinted] = useState([]);
  const [ebaydata, setEbay] = useState([]);
  const [clickedData, setClickedData] = useState([])
  const [clickedDataFive, setClickedDataFive] = useState([])
  const [clickedVintedData, setClickedVintedData] = useState([])
  const [blink, setBlink] = useState("visible")
  const [noblinking, setBlinking] = useState("none")

    // componentDidMount(){
    //   (window.adsbygoogle = window.adsbygoogle || []).push({});
    // }

    const apikey = '48878147a05368955e614dca472e6dc4';
    const category = 'world';
    const url = 'https://gnews.io/api/v4/top-headlines?category=' + category + '&lang=en&country=us&max=50&apikey=' + apikey;
    useEffect(() => {
     fetch(url).then(result => result.json()).then(alldata => setData(alldata.articles)).catch(error => console.log(error.message))
    }, [])

    const urlvinted = 'https://vinted3.p.rapidapi.com/getSearch?country=us&page=1&order=newest_first';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '149c13c63amsh5015475dafad941p18992ajsnc6524a1363a9',
        'X-RapidAPI-Host': 'vinted3.p.rapidapi.com'
      }
    };

    useAsync(async () => {
      try {
        const response = await fetch(urlvinted, options);
        const result = await response.text();
        const jsondata = JSON.parse(result);
        console.log(jsondata);
        setVinted(jsondata);
      } catch (error) {
        console.error(error);
      }
    }, [])

    // const ebaycategory = "drones"
    // const ebayurl = "https://cors-anywhere.herokuapp.com/https://api.ebay.com/buy/browse/v1/item_summary/search?q=drone&limit=3"
    // useEffect(() => {
    //  fetch(ebayurl).then(result => result.json()).then(alldata => setEbay(alldata)).catch(error => console.log(error.message))
    // }, [])
    // console.log(ebaydata[0]);

    function nextData() {
      setBlink("hidden");
      setTimeout(() => {
        setBlink("visible");
        setBlinking("block");
        // setBlinkGifUrl("https://external-pages.s3.amazonaws.com/art/blink.gif")
      }, 250);

      setBlinking("none");
      
      const nextIndex = currentData >= data.length - 1 ? 0 : currentData + 1;
      setCurrentData(nextIndex);
      setClickedData([...clickedData, currentData]);

      const nextIndexFive = currentDataFive >= data.length - 1 ? 0 : currentDataFive + 1;
      setCurrentDataFive(nextIndexFive);
      setCurrentDataFive([...clickedDataFive, currentDataFive]);

      const vintedNextIndex = vintedcurrentData >= vinted.length - 1 ? 0 : vintedcurrentData + 1;
      setVintedCurrentData(vintedNextIndex);
      setClickedVintedData([...clickedVintedData, vintedcurrentData]);
    }

    const giphyFetch = new GiphyFetch('bvWogBDRALOdICcvDhJPS5XVxe50qs7O')

    function GifDemo() {
      const [gif, setGif] = useState(null);

      const extraction_result = keyword_extractor.extract(data[currentData].description,{
          language:"english",
          remove_digits: true,
          return_changed_case:true,
          return_chained_words: true,
          remove_duplicates: true
        });    

      useAsync(async () => {
        
        console.log(extraction_result[0]);
        // const { data1 } = await giphyFetch.search('cute', {  tag: 'blink', sort: 'relevant', limit: 5, type: 'gifs' })
        const { data1 } = await giphyFetch.search(extraction_result[0], { sort: 'relevant', lang: 'es', limit: 10, type: 'stickers' })
        if(typeof data1 == "undefined"){
          //console.log("here");
          const { data } = await giphyFetch.random({ tag: 'blink', type: 'stickers' });
          setGif(data);
        }    
        else{
          console.log(data1);
          console.log("bla");
          setGif(data1[0]);
        }   
      }, []);
      return gif && <Gif gif={gif} width={100} style={{left:getRandomArbitrary(-1, 1)*20 + "%",top:getRandomArbitrary(-1, 1)*35 + "%"}} backgroundColor='transparent' height={100} />;
    }


  return (
    <div className="App">
      <div className="tabloid">
          <div className="blink-button">
            <div className="title">Blink to update: </div>
            <button className="blink-img" onClick={() => nextData()}>
              <img class="blink yesblink" src="blink.gif" alt="Blinking eye jpg"/>
              <img class="blink noblink" style={{ display: noblinking }} src="noblink.jpg" alt="Blinking eye gif"/>
            </button>
            <div className="title2">Click my eye!!</div>
          </div>
            <div style={{ visibility: blink }} className="answers"> 
              {data[currentData] && (
                <div className="li" key={data[currentData].publishedAt}>
                  <h2 class="newstitle">{data[currentData].title}</h2>
                  <p class="newscontent">{data[currentData].content}</p>
                  <img class="newsimg" style={{left:Math.random()*15 + "%",top:Math.random()*40 + "%"}} src={data[currentData].image}></img>
                  <div className="gif">
                    <GifDemo/>
                    <div className='imgur'><ImgurComponent/></div>
                  </div>
                </div>
              )}
              {/* {Math.random() > 0.4 && clickedData.length > 0 && ( 
                <div className="li">
                  <ImgurComponent/>
                </div>
              )} */}
              {clickedData.length > 0 && clickedData.map((questionIndex, index) => (
                <div className="li" key={index}>
                  <h2 class="newstitle">{data[questionIndex] && data[questionIndex].title}</h2>
                  <p class="newscontent">{data[questionIndex].content}</p>
                  <img class="newsimg" style={{left:Math.random()*15 + "%",top:Math.random()*40 + "%"}} src={data[questionIndex].image}></img>
                  <div className="gif">
                    <GifDemo/>
                    <div className='imgur'><ImgurComponent/></div>
                  </div>
                </div>
              ))}
              {clickedVintedData.length > 0 && Math.random() > 0.6 && clickedVintedData.map((vintedIndex, index) => (
                <div className="li" key={Math.random()}>
                  <div key={vinted[vintedIndex].productId} style={{background: 'white'}}>
                    <h3 style={{top: '0',marginLeft:'5px',marginTop:'0px', marginBottom:'1px'}}>{vinted[vintedIndex].title}</h3>
                    <h4 style={{textDecoration:'underline',marginTop:'1px',marginLeft:'5px'}}>{vinted[vintedIndex].brand}</h4>
                    <a href={vinted[vintedIndex].url}>
                      <img className="vintedimg" src={vinted[vintedIndex].image} href={vinted[vintedIndex].url} style={{borderColor:'red',borderStyle:'solid',borderWidth:'1.5px'}}></img>
                    </a>
                    <h4 style={{margin: '5px', backgroundColor: '#017783', color:'white'}}>{vinted[vintedIndex].price.amount}{vinted[vintedIndex].price.currency}</h4>
                  </div>
                </div>
              ))}
              {/* {Math.random() > 0.4 && clickedData.length > 0 && ( 
                <div className="li" key={data[currentData].publishedAt}>
                  <EbayComponent/>
                </div>
              )} */}
            </div>
        </div>
    </div>
  );
}

export default App;


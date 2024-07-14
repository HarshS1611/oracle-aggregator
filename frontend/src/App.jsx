import { useEffect, useState } from 'react'
import { Chart } from "react-google-charts";
import axios from 'axios'

import './App.css'

function App() {
  const [selecedTab, setSelectedTab] = useState(0);
  const [priceData, setPriceData] = useState([]);
  const [avgPrice, setAvgPrice] = useState(0);
  const priceFeedId = ["0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
    "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
    "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
    "0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7"
  ]

  const priceFeedId2 = ["Bitcoin", "Ethereum", "Solana", "Avalanche"]
  const priceFeedId3 = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "AVAXUSDT"]



  const fetchPrice = async () => {
    console.log(import.meta.env.VITE_DIA_URL)
    try {
      const pythResponse = await axios.get(`${import.meta.env.VITE_PYTH_URL}/latest?ids%5B%5D=${priceFeedId[selecedTab]}&encoding=base64&parsed=true`);
      const diaResponse = await axios.get(`${import.meta.env.VITE_DIA_URL}/${priceFeedId2[selecedTab]}/0x0000000000000000000000000000000000000000`, {
        headers: { 'Content-Type': 'application/json' }

      });
      const switchBoardResponse = await axios.get(`${import.meta.env.VITE_SWITCHBOARD_URL}?symbol=${priceFeedId3[selecedTab]}`);

      setPriceData([
        [`${priceFeedId2[selecedTab]}`, "Pyth Network", "DIA Protocol", "Switchboard Protocol"],
        [`${priceFeedId2[selecedTab]}`, (pythResponse.data.parsed[0].price.price / 1e8).toString(), (diaResponse.data.Price).toString(), switchBoardResponse.data.price],

      ])

      const avg = (Number(pythResponse.data.parsed[0].price.price / 1e8) + (diaResponse.data.Price) + Number(switchBoardResponse.data.price)) / 3;
      console.log(avg)
      setAvgPrice(avg);

    } catch (error) {
      console.error(error)
    }
  }



  const options = {
    chart: {
      title: `Price of ${priceFeedId2[selecedTab]} in USD`,
    },
  };

  useEffect(() => {

    fetchPrice();


    setInterval(() => {

      fetchPrice();

    }, 20000);

  }, [selecedTab]);

  return (
    <div className='flex flex-col gap-10 items-center justify-center h-screen'>
      <div className='text-4xl mt-20 font-bold'>Crypto Price Aggregator</div>
      <p className='text-xl'>Fetch Latest Price of Cryptos</p>
      {avgPrice ?
        <p className='text-xl p-4 bg-gray-100 rounded-lg'>Average Price of {priceFeedId2[selecedTab]}: $ {(avgPrice).toString().substring(0, 10)}</p>
        : <div className='flex items-center w-full'>
          <div class="loader">
            <div class="loader-cube">
              <div class="face"></div>
              <div class="face"></div>
              <div class="face"></div>
              <div class="face"></div>
              <div class="face"></div>
              <div class="face"></div>
            </div>
          </div>
        </div>}
      <div>
        <div className="tab-container mt-10">
          <input type="radio" name="tab" id="tab1" className="tab tab--1" />
          <label onClick={() => setSelectedTab(0)} className="tab_label" for="tab1">BTC/USD</label>

          <input type="radio" name="tab" id="tab2" className="tab tab--2" />
          <label onClick={() => setSelectedTab(1)} className="tab_label" for="tab2">ETH/USD</label>

          <input type="radio" name="tab" id="tab3" className="tab tab--3" />
          <label onClick={() => setSelectedTab(2)} className="tab_label" for="tab3">SOL/USD</label>

          <input type="radio" name="tab" id="tab4" className="tab tab--4" />
          <label onClick={() => setSelectedTab(3)} className="tab_label" for="tab4">AVAX/USD</label>

          <div className="indicator"></div>
        </div>

      </div>
      <div className='bg-gray-100 bg-opacity-50 p-4 rounded-xl h-full w-[80%] mb-20'>
        {priceData && priceData.length > 0 ? <Chart
          chartType="Bar"
          width="100%"
          height="500px"
          data={priceData}
          options={options}
        /> : <div className='flex items-center w-full'>
          <div class="loader">
            <div class="loader-cube">
              <div class="face"></div>
              <div class="face"></div>
              <div class="face"></div>
              <div class="face"></div>
              <div class="face"></div>
              <div class="face"></div>
            </div>
          </div>
        </div>}
      </div>
    </div>
  )
}

export default App

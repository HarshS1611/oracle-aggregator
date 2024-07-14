import { useEffect, useState } from 'react'
import { Chart } from "react-google-charts";
import axios from 'axios'

import './App.css'

function App() {
  const [priceData, setPriceData] = useState([]);
  const [avgPrice, setAvgPrice] = useState(0);

  const fetchPrice = async () => {
    console.log(import.meta.env.VITE_DIA_URL)
    try {
      const pythResponse = await axios.get(`${import.meta.env.VITE_PYTH_URL}`);
      const diaResponse = await axios.get(`${import.meta.env.VITE_DIA_URL}`, {
        headers: { 'Content-Type': 'application/json' }

      });
      const switchBoardResponse = await axios.get(`${import.meta.env.VITE_SWITCHBOARD_URL}`);
      console.log(pythResponse.data)
      console.log(diaResponse.data)
      console.log(switchBoardResponse.data)

      setPriceData([
        ["BTC/USD", "Pyth Network", "DIA Protocol", "Switchboard Protocol"],
        ["BTC/USD", (pythResponse.data.parsed[0].price.price / 1e8).toString(), (diaResponse.data.Price).toString(), switchBoardResponse.data.price],

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
      title: "BTC/USD Price",
    },
  };

  useEffect(() => {

    if (priceData.length === 0) {
      fetchPrice();
    }

    setInterval(() => {

      fetchPrice();

    }, 20000);

  }, []);

  return (
    <div className='flex flex-col gap-10 items-center justify-center h-screen'>
      <div className='text-4xl mt-20 font-bold'>Crypto Price Aggregator</div>
      <p className='text-xl'>Fetch Latest Price of Cryptos</p>
      <p className='text-xl p-4 bg-gray-100 rounded-lg'>Average Price of BTC/USD : $ {(avgPrice).toString().substring(0,10)}</p>
      <div>
        <div className="tab-container mt-10">
          <input type="radio" name="tab" id="tab1" className="tab tab--1" />
          <label className="tab_label" for="tab1">BTC/USD</label>

          <input type="radio" name="tab" id="tab2" className="tab tab--2" />
          <label className="tab_label" for="tab2">ETH/USD</label>

          <input type="radio" name="tab" id="tab3" className="tab tab--3" />
          <label className="tab_label" for="tab3">Notifications</label>

          <div className="indicator"></div>
        </div>

      </div>
      <div className='bg-gray-100 p-4 rounded-xl h-full w-[80%] mb-20'>
        {priceData && priceData.length > 0 && <Chart
          chartType="Bar"
          width="100%"
          height="500px"
          data={priceData}
          options={options}
        />}
      </div>
    </div>
  )
}

export default App

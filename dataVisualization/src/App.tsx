import { useState } from 'react'
import { orderedData } from "./orderedData";
import { Scatterplot } from "./scatterplot/Scatterplot";
import { LineChart } from './lineChart/LineChart';
import { BarChart } from "./barChart/barChart";
import './App.css'

function App() {
  const [active, setActive] = useState('scatterplot')

  return (
    <>
      <div
        style={{
          width: '95%',
          height: '1075px',
          overflowY: 'scroll',
          paddingTop: '20px'
        }}>
        <div style={{marginLeft: '30px'}}>
          <button
            onClick={() => setActive('scatterplot')}
            className={`${active === 'scatterplot' ? 'activeButton' : 'button'}`}>
            Time/Day Scatterplot
          </button>
          <button
            onClick={() => setActive('p')}
            className={`${active === 'p' ? 'activeButton' : 'button'}`}>
            Amount Breakdown
          </button>
          <button
            onClick={() => setActive('totals')}
            className={`${active === 'totals' ? 'activeButton' : 'button'}`}>
            Month Totals Breakdown
          </button>
        </div>
        {active === 'scatterplot' && <Scatterplot data={orderedData} width={20000} height={1000} />}
        {active === 'p' && <LineChart data={orderedData} width={8000} height={1000} />}
        {active === 'totals' && <BarChart data={orderedData} width={20000} height={1000} />}

      </div>
    </>
  )
}

export default App

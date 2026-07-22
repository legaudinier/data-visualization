import { useState } from 'react'
import { orderedData } from "./orderedData";
import { Scatterplot } from "./scatterplot/Scatterplot";
import { LineChart } from './lineChart/LineChart';
import { BarChart } from "./barChart/barChart";
import { allBData, allPData, allTotalsArray, bColor, pColor, allColor } from './dataTools'
import './App.css'

function App() {
  const [active, setActive] = useState('scatterplot')
  console.log('allBTotals', allTotalsArray)

  return (
    <>
      <div
        style={{
          width: '95%',
          height: '1075px',
          overflowY: 'scroll',
          paddingTop: '20px',
          fontFamily: 'Arial, Helvetica, sans-serif'
        }}>
        <div style={{ width: '1000px', display: 'flex', flexDirection: 'row' }}>
          <div style={{ marginLeft: '30px', display: 'flex', width: '250px', flexDirection: 'column' }}>
            <button
              onClick={() => setActive('scatterplot')}
              className={`${active === 'scatterplot' ? 'activeButton' : 'button'}`}>
              Daily Scatterplot
            </button>
            <button
              onClick={() => setActive('p')}
              className={`${active === 'p' ? 'activeButton' : 'button'}`}>
              Daily Line Chart Breakdown
            </button>
            <button
              onClick={() => setActive('totals')}
              className={`${active === 'totals' ? 'activeButton' : 'button'}`}>
              Daily Bar Chart Breakdown
            </button>
          </div>
          <div style={{ marginLeft: '40px' }}>
            <h1 style={{ marginTop: '0', marginBottom: '15px' }}>Totals</h1>
            <div style={{ fontWeight: 'bold' }}>Events: <span style={{ color: allColor }}>All ({allBData.length + allPData.length})</span> |
              <span style={{ color: bColor }}> B ({allBData.length}) </span> | <span style={{ color: pColor }}> P ({allPData.length}) </span></div>
            <div style={{ fontWeight: 'bold' }}>Times: <span style={{ color: allColor }}>All ({(((allTotalsArray[0].totals + allTotalsArray[1].totals) / 60) / 60 / 24).toFixed(2)} days) </span>
              | <span style={{ color: bColor }}>B ({(((allTotalsArray[1].totals) / 60) / 60 / 24).toFixed(2)} days) </span>
              | <span style={{ color: pColor }}>P ({(((allTotalsArray[0].totals) / 60) / 60 / 24).toFixed(2)} days)</span></div>
            <div style={{ fontWeight: 'bold' }}>Amount: <span style={{ color: pColor }}>P oz</span></div>
          </div>
        </div>
        {active === 'scatterplot' && <Scatterplot data={orderedData} width={20000} height={1000} />}
        {active === 'p' && <LineChart data={orderedData} width={8000} height={800} />}
        {active === 'totals' && <BarChart data={orderedData} width={20000} height={800} />}
        {/* donut chart all the breadown */}
      </div>
    </>
  )
}

export default App

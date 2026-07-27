import { useState } from 'react'
import { orderedData } from "./orderedData";
import { Scatterplot } from "./scatterplot/Scatterplot";
import { LineChart } from './lineChart/LineChart';
import { BarChart } from "./barChart/barChart";
// import { PieChart } from './pieChart/pieChart';
import { Heatmap } from './heatmap/Heatmap';
import { allBData, allPData, allTotalsArray, bColor, pColor, allColor } from './dataTools'
import './App.css'

export const data = [
  { name: "Mark", value: 90 },
  { name: "Robert", value: 12 },
  { name: "Emily", value: 34 },
  { name: "Marion", value: 53 },
  { name: "Nicolas", value: 58 },
]

// in this case, it will be day / month for the heatmap data
const heatmapData = [
    {
        "x": "A",
        "y": "A",
        "value": 25.30191591442724
    },
    {
        "x": "A",
        "y": "B",
        "value": 5.780349128262543
    },
    {
        "x": "A",
        "y": "C",
        "value": 25.869751488891033
    },
    {
        "x": "A",
        "y": "D",
        "value": 18.62825078145418
    },
    {
        "x": "A",
        "y": "E",
        "value": 32.38568780614751
    },
    {
        "x": "B",
        "y": "A",
        "value": 15.42296386956869
    },
    {
        "x": "B",
        "y": "B",
        "value": 8.309143216542028
    },
    {
        "x": "B",
        "y": "C",
        "value": 22.555874621081262
    },
    {
        "x": "B",
        "y": "D",
        "value": 29.124915017056402
    },
    {
        "x": "B",
        "y": "E",
        "value": 5.866160569716441
    },
    {
        "x": "C",
        "y": "A",
        "value": 31.11854247777927
    },
    {
        "x": "C",
        "y": "B",
        "value": 38.5848311495048
    },
    {
        "x": "C",
        "y": "C",
        "value": 21.155722581634556
    },
    {
        "x": "C",
        "y": "D",
        "value": 23.123746000498052
    },
    {
        "x": "C",
        "y": "E",
        "value": 14.559681106340086
    },
    {
        "x": "D",
        "y": "A",
        "value": 7.383373343606925
    },
    {
        "x": "D",
        "y": "B",
        "value": 8.326004655901844
    },
    {
        "x": "D",
        "y": "C",
        "value": 15.327013657904418
    },
    {
        "x": "D",
        "y": "D",
        "value": 38.95627721239764
    },
    {
        "x": "D",
        "y": "E",
        "value": 18.913069396428114
    },
    {
        "x": "E",
        "y": "A",
        "value": 28.79310949554903
    },
    {
        "x": "E",
        "y": "B",
        "value": 14.960145326066145
    },
    {
        "x": "E",
        "y": "C",
        "value": 7.624785717149645
    },
    {
        "x": "E",
        "y": "D",
        "value": 14.493449101314164
    },
    {
        "x": "E",
        "y": "E",
        "value": 4.111665769088537
    },
    {
        "x": "F",
        "y": "A",
        "value": 36.653947994907526
    },
    {
        "x": "F",
        "y": "B",
        "value": 18.134506722693956
    },
    {
        "x": "F",
        "y": "C",
        "value": 35.69449240402042
    },
    {
        "x": "F",
        "y": "D",
        "value": 6.168805228298155
    },
    {
        "x": "F",
        "y": "E",
        "value": 33.2962029795814
    },
    {
        "x": "G",
        "y": "A",
        "value": 19.35128431328969
    },
    {
        "x": "G",
        "y": "B",
        "value": 3.933151181752912
    },
    {
        "x": "G",
        "y": "C",
        "value": 39.28389731914159
    },
    {
        "x": "G",
        "y": "D",
        "value": 25.93115455856559
    },
    {
        "x": "G",
        "y": "E",
        "value": 9.478967974418762
    },
    {
        "x": "H",
        "y": "A",
        "value": 6.379327366398337
    },
    {
        "x": "H",
        "y": "B",
        "value": 16.54548402275978
    },
    {
        "x": "H",
        "y": "C",
        "value": 39.13484683910955
    },
    {
        "x": "H",
        "y": "D",
        "value": 10.962005677719354
    },
    {
        "x": "H",
        "y": "E",
        "value": 31.128389621810886
    },
    {
        "x": "I",
        "y": "A",
        "value": 36.99019188113493
    },
    {
        "x": "I",
        "y": "B",
        "value": 39.86663175387543
    },
    {
        "x": "I",
        "y": "C",
        "value": 11.853965643436402
    },
    {
        "x": "I",
        "y": "D",
        "value": 38.46037714608488
    },
    {
        "x": "I",
        "y": "E",
        "value": 32.758411335200066
    },
    {
        "x": "J",
        "y": "A",
        "value": 19.99955006971737
    },
    {
        "x": "J",
        "y": "B",
        "value": 17.628866389472776
    },
    {
        "x": "J",
        "y": "C",
        "value": 33.002620900691475
    },
    {
        "x": "J",
        "y": "D",
        "value": 8.228635560185268
    },
    {
        "x": "J",
        "y": "E",
        "value": 14.023861749280048
    }
]

function App() {
  const [active, setActive] = useState('')


  // To Do
  // donut charts, heat maps, pie charts
  // all charts render on the "homepage", you click on one and it opens up larger

  return (
    <>
      <div
        style={{
          width: '95%',
          // height: '1075px',
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
        <div style={{ display: 'flex' }}>
          <div><Scatterplot data={orderedData} width={400} height={300} circleSize={1} hideToolTip={true} /></div>
          <div><LineChart data={orderedData} width={400} height={300} circleSize={1} hideToolTip={true} /></div>
        </div>
        <div style={{ display: 'flex' }}>
          <div><BarChart data={orderedData} width={400} height={300} hideData={true} /></div>
        </div>
        {active === 'scatterplot' && <Scatterplot data={orderedData} width={20000} height={1000} circleSize={10} hideToolTip={false} />}
        {active === 'p' && <LineChart data={orderedData} width={8000} height={800} circleSize={8} hideToolTip={false} />}
        {active === 'totals' && <BarChart data={orderedData} width={20000} height={800} hideData={false} />}
        {/* donut chart all the breadown */}
        {/* <PieChart data={data} width={400} height={400} /> */}
        <Heatmap data={heatmapData} width={400} height={400} />
      </div>
    </>
  )
}

export default App

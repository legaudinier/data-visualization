import { useState } from 'react'
import { orderedData } from "./orderedData";
import { Scatterplot } from "./scatterplot/Scatterplot";
import { LineChart } from './lineChart/LineChart';
import { BarChart } from "./barChart/barChart";
// import { PieChart } from './pieChart/pieChart';
import { Heatmap } from './heatmap/Heatmap';
import { BubblePlot } from './bubblePlot/bubblePlot';
import {
  allBData,
  allPData,
  allTotalsArray,
  bColor,
  pColor,
  allColor
} from './dataTools'
import { Modal } from './modal'
import './App.css'

function App() {
  const [active, setActive] = useState('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // To Do
  // add a bubble chart on the per day for the size
  // donut charts for the totals in the top
  // legends in the charts
  // tooltips working on all charts
  // brush and zoom?

  return (
    <>
      <div
        style={{
          width: '95%',
          paddingTop: '20px',
          fontFamily: 'Arial, Helvetica, sans-serif'
        }}>
        <div style={{ width: '1000px', display: 'flex', flexDirection: 'row' }}>
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
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}>
          {/* Smaller charts to click to maximize up */}
          <div onClick={() => { setActive('scatterplot'); setIsModalOpen(true) }} className="svgContainer">
            <Scatterplot data={orderedData} width={375} height={300} circleSize={1} hideToolTip={true} />
          </div>
          <div onClick={() => { setActive('p'); setIsModalOpen(true) }} className="svgContainer">
            <LineChart data={orderedData} width={375} height={300} circleSize={1} hideToolTip={true} />
          </div>
          <div onClick={() => { setActive('totals'); setIsModalOpen(true) }} className="svgContainer">
            <BarChart width={375} height={300} hideData={true} />
          </div>
          <div onClick={() => { setActive('bHeatmap'); setIsModalOpen(true) }} className="svgContainer">
            <Heatmap
              width={375}
              height={300}
              hideTooltip={true}
              heatmapVersion={'b'} />
          </div>
          <div onClick={() => { setActive('pHeatmap'); setIsModalOpen(true) }} className="svgContainer">
            <Heatmap
              width={375}
              height={300}
              hideTooltip={true}
              heatmapVersion={'p'} />
          </div>
          <BubblePlot data={orderedData} width={400} height={400} />
        </div>
        {/* donut chart all the breadown */}
        {/* <PieChart data={data} width={400} height={400} /> */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={active === 'scatterplot' ? 'Daily Scatterplot'
            : active === 'p' ? 'Daily Line Plot'
              : active === 'totals' ? 'Bar Chart Totals'
                : active === 'bHeatmap' ? 'HeatMap - B Data'
                  : 'HeatMap - P Data'
          }
        >
          {active === 'scatterplot' && <Scatterplot data={orderedData} width={20000} height={800} circleSize={10} hideToolTip={false} />}
          {active === 'p' && <LineChart data={orderedData} width={8000} height={800} circleSize={8} hideToolTip={false} />}
          {active === 'totals' && <BarChart width={20000} height={800} hideData={false} />}
          {active === 'bHeatmap' && <Heatmap width={1000} height={800} hideTooltip={false}
            heatmapVersion={'b'} />}
          {active === 'pHeatmap' && <Heatmap width={1000} height={800} hideTooltip={false}
            heatmapVersion={'p'} />}
        </Modal>
      </div>
    </>
  )
}

export default App

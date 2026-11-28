import { useState } from 'react'
import { Scatterplot } from "./scatterplot/Scatterplot";
import { LineChart } from './lineChart/LineChart';
import { BarChart } from "./barChart/barChart";
// import { PieChart } from './pieChart/pieChart';
import { Heatmap } from './heatmap/Heatmap';
import { BubblePlot } from './bubblePlot/bubblePlot';
import {
  allBData,
  allPData,
  allBDataH,
  allPDataH,
  allTotalsArray,
  bColor,
  bColorH,
  pColor,
  pColorH,
  allColor,
  MODAL_TITLES,
  type ChartType
} from './dataTools'
import { Modal } from './modal'
import './App.css'

function App() {
  const [active, setActive] = useState('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pressedM, setPressedM] = useState(true);
  const [pressedH, setPressedH] = useState(true);

  const handleClickM = () => {
    const nextState = !pressedM;
    setPressedM(nextState);
  };

  const handleClickH = () => {
    const nextState = !pressedH;
    setPressedH(nextState);
  };

  // To Do
  // Update H data on all charts
  // Update H data on the top totals
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
        <div
          style={{
            margin: '0 auto 24px auto',
            padding: '24px 28px',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '20px',
              marginBottom: '20px',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                Data Visualization Project
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                aria-pressed={pressedM}
                onClick={handleClickM}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: `2px solid ${bColor}`,
                  backgroundColor: pressedM ? bColor : '#ffffff',
                  color: pressedM ? '#ffffff' : bColor,
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: pressedM ? '0 2px 8px rgba(0, 0, 0, 0.12)' : 'none',
                }}
              >
                M
              </button>

              <button
                type="button"
                aria-pressed={pressedH}
                onClick={handleClickH}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: `2px solid ${bColorH}`,
                  backgroundColor: pressedH ? bColorH : '#ffffff',
                  color: pressedH ? '#ffffff' : bColorH,
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: pressedH ? '0 2px 8px rgba(0, 0, 0, 0.12)' : 'none',
                }}
              >
                H
              </button>
            </div>
          </div>

          {/* Bottom Row: 3 Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Card 1: Events */}
            <div
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#64748b',
                  marginBottom: '6px',
                }}
              >
                Total Events
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: allColor,
                  marginBottom: '12px',
                }}
              >
                {allBData.length + allPData.length + allBDataH.length + allPDataH.length}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#ffffff', border: `1px solid ${bColor}`, color: bColor }}>
                  B-M: {allBData.length}
                </span>
                <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#ffffff', border: `1px solid ${bColorH}`, color: bColorH }}>
                  B-H: {allBDataH.length}
                </span>
                <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#ffffff', border: `1px solid ${pColor}`, color: pColor }}>
                  P-M: {allPData.length}
                </span>
                <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#ffffff', border: `1px solid ${pColorH}`, color: pColorH }}>
                  P-H: {allPDataH.length}
                </span>
              </div>
            </div>
            <div
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#64748b',
                  marginBottom: '6px',
                }}
              >
                Total Duration
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: allColor,
                  marginBottom: '12px',
                }}
              >
                {(((allTotalsArray[0].totals + allTotalsArray[1].totals) / 60) / 60 / 24).toFixed(2)}{' '}
                <span style={{ fontSize: '15px', fontWeight: 600 }}>days</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#ffffff', border: `1px solid ${bColor}`, color: bColor }}>
                  B: {(((allTotalsArray[1].totals) / 60) / 60 / 24).toFixed(2)}d
                </span>
                <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#ffffff', border: `1px solid ${pColor}`, color: pColor }}>
                  P: {(((allTotalsArray[0].totals) / 60) / 60 / 24).toFixed(2)}d
                </span>
              </div>
            </div>
            <div
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#64748b',
                  marginBottom: '6px',
                }}
              >
                Total Amount
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: pColor,
                  marginBottom: '12px',
                }}
              >
                P <span style={{ fontSize: '15px', fontWeight: 600 }}>oz</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}>
          {/* Smaller charts to click to maximize up */}
          <div onClick={() => { setActive('scatterplot'); setIsModalOpen(true) }} className="svgContainer">
            <Scatterplot
              dataToggleM={pressedM}
              dataToggleH={pressedH}
              width={375}
              height={300}
              circleSize={1}
              hideToolTip={true} />
          </div>
          <div onClick={() => { setActive('p'); setIsModalOpen(true) }}
            className="svgContainer">
            <LineChart
              dataToggleM={pressedM}
              dataToggleH={pressedH}
              width={375}
              height={300}
              circleSize={1}
              hideToolTip={true} />
          </div>
          <div onClick={() => { setActive('totals'); setIsModalOpen(true) }}
            className="svgContainer">
            <BarChart
              dataToggle={pressedM}
              width={375}
              height={300}
              hideData={true} />
          </div>
          <div onClick={() => { setActive('bHeatmap'); setIsModalOpen(true) }}
            className="svgContainer">
            <Heatmap
              dataToggleM={pressedM}
              width={375}
              height={300}
              hideTooltip={true}
              heatmapVersion={'b'} />
          </div>
          <div onClick={() => { setActive('pHeatmap'); setIsModalOpen(true) }}
            className="svgContainer">
            <Heatmap
              dataToggleM={pressedM}
              width={375}
              height={300}
              hideTooltip={true}
              heatmapVersion={'p'} />
          </div>
          <div onClick={() => { setActive('bubble'); setIsModalOpen(true) }}
            className="svgContainer">
            <BubblePlot
              dataToggleM={pressedM}
              dataToggleH={pressedH}
              width={375}
              height={300}
              hideData={true} />
          </div>
        </div>
        {/* donut chart all the breadown */}
        {/* <PieChart data={data} width={400} height={400} /> */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={MODAL_TITLES[active as ChartType] ?? 'HeatMap - P Data'}
        >
          {active === 'scatterplot' &&
            <Scatterplot
              width={20000}
              dataToggleM={pressedM}
              dataToggleH={pressedH}
              height={800}
              circleSize={10}
              hideToolTip={false} />}
          {active === 'p' &&
            <LineChart
              dataToggleM={pressedM}
              dataToggleH={pressedH}
              width={8000}
              height={800}
              circleSize={8}
              hideToolTip={false} />}
          {active === 'totals' &&
            <BarChart
              dataToggle={pressedM}
              width={20000}
              height={800}
              hideData={false} />}
          {active === 'bHeatmap' &&
            <Heatmap
              width={1000}
              height={800}
              hideTooltip={false}
              dataToggleM={pressedM}
              heatmapVersion={'b'} />}
          {active === 'pHeatmap' &&
            <Heatmap
              width={1000}
              height={800}
              hideTooltip={false}
              dataToggleM={pressedM}
              heatmapVersion={'p'} />}
          {active === 'bubble' &&
            <BubblePlot
              width={10000}
              height={800}
              dataToggleM={pressedM}
              dataToggleH={pressedH}
              hideData={false} />}
        </Modal>
      </div>
    </>
  )
}

export default App

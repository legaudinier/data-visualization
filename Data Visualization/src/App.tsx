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
     <div>
      <button onClick={() => setActive('scatterplot')}>Time/Day Scatterplot</button>
      <button onClick={() => setActive('p')}>Amount Breakdown</button>
      <button onClick={() => setActive('totals')}>Month Totals Breakdown</button>

      {active === 'scatterplot' && <Scatterplot data={orderedData} width={8000} height={500} />}
      {active === 'p' && <LineChart data={orderedData} width={8000} height={400} />}
      {active === 'totals' && <BarChart data={orderedData} width={20000} height={400} />}

    </div>
    </>
  )
}

export default App

import {useState, useContext, useMemo} from "react"
import {MuuriComponent, getResponsiveStyle} from "muuri-react"
import {AreaChart, Card, Title} from "@tremor/react"
import {useMediaQuery} from "react-responsive"
import {generateItems, ThemeContext} from "./utils"
import {Header, Demo} from "./components"

const chartdata = [
  {
    date: "Jan 22",
    SemiAnalysis: 2890,
    "The Pragmatic Engineer": 2338,
  },
  {
    date: "Feb 22",
    SemiAnalysis: 2756,
    "The Pragmatic Engineer": 2103,
  },
  {
    date: "Mar 22",
    SemiAnalysis: 3322,
    "The Pragmatic Engineer": 2194,
  },
  {
    date: "Apr 22",
    SemiAnalysis: 3470,
    "The Pragmatic Engineer": 2108,
  },
  {
    date: "May 22",
    SemiAnalysis: 3475,
    "The Pragmatic Engineer": 1812,
  },
  {
    date: "Jun 22",
    SemiAnalysis: 3129,
    "The Pragmatic Engineer": 1726,
  },
]

const dataFormatter = (number: number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString()
}

export const AreaChartGraph = () => (
  <Card>
    <Title>Newsletter revenue over time (USD)</Title>
    <AreaChart
      className="mt-4"
      data={chartdata}
      index="date"
      categories={["SemiAnalysis", "The Pragmatic Engineer"]}
      colors={["indigo", "cyan"]}
      valueFormatter={dataFormatter}
    />
  </Card>
)

// App.
const App = () => {
  // Items state.
  const [items] = useState(generateItems())
  // Items to children.
  const children = items.map(() => <AreaChartGraph />)

  return (
    <Demo>
      <Header />
      <MuuriComponent
        dragEnabled
        dragFixed
        dragSortPredicate={{
          action: "swap",
        }}
        dragSortHeuristics={{
          sortInterval: 0,
        }}
      >
        {children}
      </MuuriComponent>
    </Demo>
  )
}

export default App

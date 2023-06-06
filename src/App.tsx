import {useDeferredValue, useRef, useState} from "react"
import {MuuriComponent, useDraggable, useRefresh} from "muuri-react"
import {AreaChart, Card, Title} from "@tremor/react"
import {ResizableBox} from "react-resizable"
import {generateItems} from "./utils"
import Muuri from "muuri"

import "./App.css"

export const ResizableWrapper = (Component, {width, height}) => {
  // Return the wrapped resizable component.
  return function WrappedComponent(props) {
    // Muuri-react provides all the tools to manage scaling.
    // You can implement it however you want.
    const ref = useRef()
    const refresh = useRefresh()
    // Get the best performance with debouncing.
    // It is not mandatory to use.
    const refreshWithdebounce = useDeferredValue(() =>
      requestAnimationFrame(refresh)
    )

    return (
      <div
        ref={ref}
        className="item"
        style={{width: `${width}px`, height: `${height}px`}}
        // isLocked
      >
        <div>
          <ResizableBox
            width={width}
            height={height}
            minConstraints={[width, height]}
            onResize={(_, {size}) => {
              ref.current.style.width = size.width + "px"
              ref.current.style.height = size.height + "px"

              refreshWithdebounce()
            }}
          >
            <Component {...props} />
          </ResizableBox>
        </div>
      </div>
    )
  }
}

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

export const AreaChartGraph = ResizableWrapper(
  (props) => {
    const setDraggable = useDraggable()
    if (props.isLocked) {
      setDraggable(false)
    }
    return (
      <Card className="h-full">
        <Title className="area-chart-header">Hello world</Title>
        <AreaChart
          className="h-full"
          data={chartdata}
          index="date"
          categories={["SemiAnalysis", "The Pragmatic Engineer"]}
          colors={["indigo", "cyan"]}
          valueFormatter={dataFormatter}
        />
      </Card>
    )
  },
  {
    width: 320,
    height: 200,
  }
)

// App.
const App = () => {
  // Items state.
  const [items] = useState(generateItems())
  const dragSortOptions = {
    action: "swap",
    threshold: 50,
  }

  // Items to children.
  const children = items.map((item) => (
    <AreaChartGraph key={item.id} isLocked={item.color === "blue"} />
  ))

  return (
    <MuuriComponent
      dragEnabled
      dragStartPredicate={function (_item, e) {
        console.log(e.target.classList)
        if (e.target.classList.contains("react-resizable-handle")) {
          return false
        }
        return true
        // Implement your logic...
      }}
      dragSortPredicate={(item) => {
        const result = Muuri.ItemDrag.defaultSortPredicate(
          item,
          dragSortOptions
        )
        if (
          result &&
          result.grid._items[result.index]._component.props.isLocked
        ) {
          return false
        }
        return result
      }}
      // dragPlaceholder={{
      //   enabled: true,
      // }}
      dragSortHeuristics={{
        sortInterval: 0,
      }}
    >
      {children}
    </MuuriComponent>
  )
}

export default App

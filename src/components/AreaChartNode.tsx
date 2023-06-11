import {Node, useStore} from "reactflow"
import {AreaChart, Card, Title} from "@tremor/react"
import ResizableNode from "./ResizableNode/ResizableNode"
import {memo} from "react"

interface Props {
  chartData: Record<string, string | number>[]
  isLocked: boolean
}

const AreaChartNode = memo(({id, data}: Omit<Node<Props>, "position">) => {
  const dataFormatter = (number: number) => {
    return "$ " + Intl.NumberFormat("us").format(number).toString()
  }

  return (
    <ResizableNode minHeight={200} minWidth={300} isLocked={data.isLocked}>
      <Card className="h-full">
        <Title className="area-chart-header">Hello world</Title>
        <AreaChart
          className="h-full"
          data={data.chartData}
          index="date"
          categories={["SemiAnalysis", "The Pragmatic Engineer"]}
          colors={["indigo", "cyan"]}
          valueFormatter={dataFormatter}
        />
      </Card>
    </ResizableNode>
  )
})

export default AreaChartNode

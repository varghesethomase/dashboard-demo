import {Node, useStore} from "reactflow"
import {AreaChart, Card, Title} from "@tremor/react"
import ResizableNode from "./ResizableNode/ResizableNode"

interface Props {
  chartData: Record<string, string | number>[]
  isLocked: boolean
}

const AreaChartNode = ({id, data}: Omit<Node<Props>, "position">) => {
  const dataFormatter = (number: number) => {
    return "$ " + Intl.NumberFormat("us").format(number).toString()
  }
  const size = useStore((s) => {
    const node = s.nodeInternals.get(id) as Node

    return {
      width: node.width,
      height: node.height,
    }
  })
  return (
    <ResizableNode
      // elementHeight={data.elementHeight}
      // elementWidth={data.elementWidth}
      isLocked={data.isLocked}
    >
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
}

export default AreaChartNode

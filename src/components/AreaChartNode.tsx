import {Node} from "reactflow"
import {AreaChart, Card, Title} from "@tremor/react"
import ResizableNode from "./ResizableNode/ResizableNode"
import {memo} from "react"

interface Props {
  chartData: Record<string, string | number>[]
  isLocked: boolean
}

const AreaChartNode = memo(({data, id}: Omit<Node<Props>, "position">) => {
  const dataFormatter = (number: number) => {
    return "$ " + Intl.NumberFormat("us").format(number).toString()
  }

  return (
    <ResizableNode
      minHeight={240}
      minWidth={400}
      isLocked={data.isLocked}
      nodeId={id}
    >
      <Card className="h-full">
        <Title className="area-chart-header">Hello world</Title>
        <AreaChart
          className="h-full w-full"
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

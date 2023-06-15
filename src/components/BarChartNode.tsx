import {Node, useStore} from "reactflow"
import {BarChart, Card, Title} from "@tremor/react"
import ResizableNode from "./ResizableNode/ResizableNode"
import {memo, useDeferredValue} from "react"

interface Props {
  chartData: Record<string, string | number>[]
  isLocked: boolean
}

const AreaChartNode = memo(({data, id}: Omit<Node<Props>, "position">) => {
  console.log('--------')
  const dataFormatter = (number: number) => {
    return "$ " + Intl.NumberFormat("us").format(number).toString()
  }

  const size = useDeferredValue(
    useStore((s) => {
      const node = s.nodeInternals.get(id) as Node

      return {
        width: node.width,
        height: node.height,
      }
    })
  )

  return (
    <ResizableNode minHeight={240} minWidth={480} isLocked={data.isLocked}>
      <Card className="h-full">
        <Title className="area-chart-header">Hello world</Title>
        <BarChart
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

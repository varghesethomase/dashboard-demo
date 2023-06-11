import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
} from "reactflow"
import AreaChartNode from "./components/AreaChartNode"
import {useMemo, useState} from "react"

import "reactflow/dist/style.css"
import "./App.css"

const chartData = [
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

const initialNodes = [
  {
    id: "1",
    position: {x: 200, y: 50},
    data: {
      isLocked: false,
      chartData,
    },
    type: "AreaChartNode",
    deletable: true,
    isLocked: false,
  },
  {
    id: "2",
    position: {x: 0, y: 50},
    data: {
      isLocked: false,
      chartData,
    },
    type: "AreaChartNode",
    deletable: true,
    isLocked: false,
  },
]

export default function App() {
  const [isEditing, seItsEditing] = useState(true)

  const nodeTypes = useMemo(
    () => ({
      AreaChartNode,
    }),
    []
  )

  return (
    <ReactFlowProvider>
      <div style={{width: "100vw", height: "100vh"}}>
        <ReactFlow
          defaultNodes={initialNodes}
          nodeTypes={nodeTypes}
          minZoom={1}
          maxZoom={isEditing ? 3 : 1}
          fitView
          panOnScroll={false}
          panOnDrag={false}
          selectionOnDrag
        >
          {isEditing && (
            <>
              <Background
                id="1"
                gap={10}
                color="#f1f1f1"
                variant={BackgroundVariant.Lines}
              />
              <Background
                id="2"
                gap={100}
                offset={1}
                color="#ccc"
                variant={BackgroundVariant.Lines}
              />
            </>
          )}

          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}

import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  PanOnScrollMode,
  ReactFlowProvider,
  useNodesState,
} from "reactflow"
import AreaChartNode from "./components/AreaChartNode"
import {useMemo, useState} from "react"

import "reactflow/dist/style.css"
import "./App.scss"

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
    expandParent: true,
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
    expandParent: true,
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

  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes)

  return (
    <main className="dashboard">
      <div className="dashboard__editor-wrapper">
        <ReactFlowProvider>
          <ReactFlow
            className="dashboard__editor"
            nodes={nodes}
            nodeTypes={nodeTypes}
            minZoom={1}
            maxZoom={isEditing ? 2 : 1}
            defaultViewport={{
              x: 0,
              y: 0,
              zoom: 1,
            }}
            panOnScrollMode={PanOnScrollMode.Vertical}
            // autoPanOnNodeDrag={false}
            // panOnScroll={false}
            // panOnDrag={false}
            // fitView
            selectionOnDrag
            // snapToGrid
            // nodeExtent={[
            //   [-300, -265],
            //   [500, Infinity],
            // ]}
            // onNodeDragStop={(event, node, nodes) => {
            //   console.log(event, node)
            // }}
            onNodesChange={onNodesChange}
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
        </ReactFlowProvider>
      </div>

      <aside className="dashboard__sidebar">hello</aside>
    </main>
  )
}

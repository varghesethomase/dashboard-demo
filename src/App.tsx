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
    id: "A",
    type: "group",
    position: {x: 0, y: 0},
    style: {
      width: 1080,
      maxWidth: 1080,
      height: 1980,
      maxHeight: Infinity,
    },
    draggable: false,
  },
  {
    id: "1",
    parentNode: "A",
    position: {x: 0, y: 0},
    expandParent: true,
    data: {
      isLocked: false,
      chartData,
    },
    type: "AreaChartNode",
    deletable: true,
    isLocked: false,
    extent: "parent",
  },
  {
    id: "2",
    parentNode: "A",
    position: {x: 0, y: 320},
    expandParent: true,
    data: {
      isLocked: false,
      chartData,
    },
    type: "AreaChartNode",
    deletable: true,
    isLocked: false,
    extent: "parent",
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
            minZoom={0.5}
            maxZoom={isEditing ? 2 : 0.5}
            defaultViewport={{
              x: 0,
              y: 0,
              zoom: 1,
            }}
            panOnDrag={false}
            panOnScrollMode={PanOnScrollMode.Vertical}
            autoPanOnNodeDrag={true}
            panOnScroll={true}
            zoomOnScroll={false}
            selectionOnDrag
            // snapToGrid
            nodeExtent={[
              [0, 0],
              [960, Infinity],
            ]}
            fitView
            // onNodeDragStop={(event, node, nodes) => {
            //   console.log(event, node)
            // }}
            onNodesChange={onNodesChange}
          >
            {isEditing && (
              <>
                <Background
                  id="1"
                  gap={8}
                  color="#f1f1f1"
                  variant={BackgroundVariant.Lines}
                />
                <Background
                  id="2"
                  gap={64}
                  offset={2}
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

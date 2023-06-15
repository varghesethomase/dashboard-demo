import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  PanOnScrollMode,
  ReactFlowInstance,
  ReactFlowProvider,
  useNodesState,
} from "reactflow"
import type {Node} from "reactflow"
import AreaChartNode from "./components/AreaChartNode"
import BarChartNode from "./components/BarChartNode"

import {
  DragEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import "reactflow/dist/style.css"
import "./App.scss"
import {Sidebar} from "./Sidebar"

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
let id = 0
const getId = () => `dndnode_${id++}`

const initialNodes = [
  {
    id: getId(),
    position: {x: 0, y: 0},
    data: {
      isLocked: false,
      chartData,
    },
    type: "AreaChartNode",
    deletable: true,
    isLocked: false,
    // extent: "parent",
  },
  {
    id: getId(),
    position: {x: 0, y: 320},
    expandParent: true,
    data: {
      isLocked: false,
      chartData,
    },
    type: "AreaChartNode",
    deletable: true,
    isLocked: false,
    // extent: "parent",
  },
]

export default function App() {
  const [isEditing, seItsEditing] = useState(true)
  const [currentDraggedNodes, setCurrentDraggedNode] =
    useState<Node<unknown>[]>()
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const nodeTypes = useMemo(
    () => ({
      AreaChartNode,
      BarChartNode,
    }),
    []
  )
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault()
      if (reactFlowWrapper.current) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
        const type = event.dataTransfer.getData("application/reactflow")

        // check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return
        }
        if (reactFlowInstance) {
          const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          })

          const newNode = {
            id: getId(),
            type,
            position,
            data: {
              isLocked: false,
              chartData,
              label: `${type} node`,
            },
            deletable: true,
            isLocked: false,
          }

          setNodes((nodes) => [...nodes, newNode])
        }
      }
    },
    [reactFlowInstance, setNodes]
  )

  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move"
    }
  }

  return (
    <main className="dashboard dndflow">
      <div className="dashboard__editor-wrapper">
        <ReactFlowProvider>
          <ReactFlow
            ref={reactFlowWrapper}
            className="dashboard__editor"
            nodes={nodes}
            onNodesChange={onNodesChange}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={handleDragOver}
            nodeTypes={nodeTypes}
            minZoom={1}
            maxZoom={isEditing ? 2 : 1}
            defaultViewport={{
              x: 0,
              y: 0,
              zoom: 1,
            }}
            style={{
              padding: "24px",
            }}
            panOnDrag={false}
            panOnScroll={true}
            panOnScrollMode={PanOnScrollMode.Vertical}
            autoPanOnNodeDrag={false}
            zoomOnScroll={false}
            // onPaneScroll={(event) => {
            //   console.log(event)
            // }}
            selectionOnDrag
            nodeExtent={[
              [0, 0],
              [960, Infinity],
            ]}
            // snapToGrid
            // fitView
            onNodeDragStart={(_event, _node, nodes) => {
              setCurrentDraggedNode(nodes)
            }}
            onNodeDragStop={(_event, _node, nodes) => {
              const intersectingNodes = nodes.reduce((accumulator, n) => {
                const intersections = reactFlowInstance?.getIntersectingNodes(
                  n,
                  true
                )
                if (intersections) {
                  accumulator.push(...intersections)
                }
                return accumulator
              }, [] as Node<unknown>[])
              if (intersectingNodes?.length) {
                // console.log(intersectingNodes, currentDraggedNodes)
                setNodes((nodes) => {
                  currentDraggedNodes?.forEach((draggedNode) => {
                    const nodeIndex = nodes.findIndex(
                      (node) => node.id === draggedNode.id
                    )
                    nodes.splice(nodeIndex, 1, draggedNode)
                  })
                  console.log(nodes)
                  return [...nodes]
                })
              }
              setCurrentDraggedNode(undefined)
            }}
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

      <Sidebar />
    </main>
  )
}

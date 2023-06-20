import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  PanOnScrollMode,
  ReactFlowInstance,
  ReactFlowProvider,
  useNodesState,
} from "reactflow"
import type {Node, NodeChange, NodeDragHandler} from "reactflow"
import AreaChartNode from "./components/AreaChartNode"
import BarChartNode from "./components/BarChartNode"

import {DragEventHandler, useCallback, useMemo, useRef, useState} from "react"

import "reactflow/dist/style.css"
import "./App.scss"
import {Sidebar} from "./Sidebar"
import ParentNode from "./components/ParentNode/ParentNode"
import {DASHBOARD_CREATOR_COORDINATES} from "./configs"
import {RecoilRoot} from "recoil"

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
    type: "ParentNode",
    position: {x: 0, y: 0},
    style: {
      maxWidth: DASHBOARD_CREATOR_COORDINATES.width,
      width: DASHBOARD_CREATOR_COORDINATES.width,
      height: DASHBOARD_CREATOR_COORDINATES.height,
    },
    draggable: false,
  },
  {
    id: getId(),
    parentNode: "dndnode_0",
    position: {x: 0, y: 0},
    data: {
      isLocked: false,
      chartData,
    },
    type: "AreaChartNode",
    deletable: true,
    isLocked: false,
    expandParent: true,
    // extent: "parent",
  },
  {
    id: getId(),
    parentNode: "dndnode_0",
    position: {x: 0, y: 320},
    data: {
      isLocked: false,
      chartData,
    },
    type: "AreaChartNode",
    deletable: true,
    isLocked: false,
    expandParent: true,
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
      ParentNode,
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
            parentNode: "dndnode_0",
            type,
            position,
            data: {
              isLocked: false,
              chartData,
              label: `${type} node`,
            },
            deletable: true,
            isLocked: false,
            expandParent: true,
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

  const handleNodeDragStop: NodeDragHandler = (_event, _node, nodes) => {
    console.log("%cApp.tsx line:164 object", "color: #007acc;")
    const draggedAndIntersectingNodes = nodes.reduce((accumulator, n) => {
      const intersections = reactFlowInstance?.getIntersectingNodes(n, true)

      if (intersections) {
        // Remove parent node from the intersections
        intersections.shift()
        accumulator.push(...intersections)
      }
      return accumulator
    }, [] as Node<unknown>[])
    if (draggedAndIntersectingNodes?.length) {
      setNodes((nodes) => {
        currentDraggedNodes?.forEach((draggedNode) => {
          const nodeIndex = nodes.findIndex(
            (node) => node.id === draggedNode.id
          )
          nodes.splice(nodeIndex, 1, draggedNode)
        })
        return [...nodes]
      })
    }
    setCurrentDraggedNode(undefined)
  }

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const parsedChanges = changes.map((change) => {
        if (
          change.type === "position" &&
          change.position &&
          change.positionAbsolute
        ) {
          const changedNode = nodes.find((node) => node.id === change.id)
          if (changedNode?.width) {
            const newEndXCoordinate = change.position.x + changedNode.width
            if (newEndXCoordinate > DASHBOARD_CREATOR_COORDINATES.width) {
              change.position = {
                x: DASHBOARD_CREATOR_COORDINATES.width - changedNode.width,
                y: change.position.y,
              }
              change.positionAbsolute = {
                x: DASHBOARD_CREATOR_COORDINATES.width - changedNode.width,
                y: change.position.y,
              }
            }
          }
        }
        return change
      })
      onNodesChange(parsedChanges)
    },
    [nodes, onNodesChange]
  )

  return (
    <RecoilRoot>
      <main className="dashboard dndflow">
        <div className="dashboard__editor-wrapper">
          <ReactFlowProvider>
            <ReactFlow
              ref={reactFlowWrapper}
              className="dashboard__editor"
              nodes={nodes}
              onNodesChange={handleNodesChange}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={handleDragOver}
              nodeTypes={nodeTypes}
              minZoom={0.5}
              maxZoom={isEditing ? 2 : 1}
              defaultViewport={{
                x: 0,
                y: 0,
                zoom: 1,
              }}
              panOnDrag={false}
              panOnScroll={true}
              panOnScrollMode={PanOnScrollMode.Vertical}
              autoPanOnNodeDrag={false}
              zoomOnScroll={false}
              zoomOnPinch={false}
              selectionOnDrag
              nodeExtent={[
                [0, 0],
                [DASHBOARD_CREATOR_COORDINATES.width, Infinity],
              ]}
              snapToGrid
              // fitView
              onNodeDragStart={(_event, _node, nodes) => {
                setCurrentDraggedNode(nodes)
              }}
              onNodeDragStop={handleNodeDragStop}
            >
              <Controls showFitView={false} />
              <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        <Sidebar />
      </main>
    </RecoilRoot>
  )
}

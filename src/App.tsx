import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  PanOnScrollMode,
  ReactFlowInstance,
  ReactFlowProvider,
  useNodesState,
} from "reactflow"
import type {Node, NodeChange, NodeDragHandler, ProOptions} from "reactflow"
import AreaChartNode from "./components/AreaChartNode"
import BarChartNode from "./components/BarChartNode"

import {DragEventHandler, useCallback, useMemo, useRef, useState} from "react"

import "reactflow/dist/style.css"
import "./App.scss"
import {Sidebar} from "./Sidebar"
import {DASHBOARD_CREATOR_COORDINATES, GRID_GAP} from "./configs"
import {useRecoilState, useRecoilValue} from "recoil"
import {dashboardCanvasHeight, gridGap} from "./store"
import getHelperLines from "./utils/getHelperLines"
import HelperLines from "./components/HelperLines"

const proOptions: ProOptions = {account: "paid-pro", hideAttribution: true}

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
  },
  {
    id: getId(),
    position: {x: 0, y: 320},
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
  const [currentDraggedNodes, setCurrentDraggedNode] =
    useState<Node<unknown>[]>()
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>()
  const [helperLineHorizontal, setHelperLineHorizontal] = useState<
    number | undefined
  >(undefined)
  const [helperLineVertical, setHelperLineVertical] = useState<
    number | undefined
  >(undefined)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useRecoilState(dashboardCanvasHeight)
  const gap = useRecoilValue(gridGap)

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
    const draggedAndIntersectingNodes = nodes.reduce((accumulator, n) => {
      const intersections = reactFlowInstance?.getIntersectingNodes(n, true)

      if (intersections) {
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
          changes.length === 1 &&
          changes[0].type === "position" &&
          changes[0].dragging &&
          changes[0].position
        ) {
          const helperLines = getHelperLines(changes[0], nodes)

          // if we have a helper line, we snap the node to the helper line position
          // this is being done by manipulating the node position inside the change object
          changes[0].position.x =
            helperLines.snapPosition.x ?? changes[0].position.x
          changes[0].position.y =
            helperLines.snapPosition.y ?? changes[0].position.y

          // if helper lines are returned, we set them so that they can be displayed
          setHelperLineHorizontal(helperLines.horizontal)
          setHelperLineVertical(helperLines.vertical)
        }
        if (
          change.type === "position" &&
          change.position &&
          change.positionAbsolute
        ) {
          // Prevents drag along the X coordinate
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
        // Enable auto resize of the canvas
        if (nodes) {
          let farthestNode = nodes[0]
          for (let i = 1; i < nodes.length; i += 1) {
            const endYCoordinate = nodes[i].position.y + Number(nodes[i].height)
            const currentFarthestEndCoordinate =
              farthestNode.position.y + Number(farthestNode.height)
            if (endYCoordinate > currentFarthestEndCoordinate) {
              farthestNode = nodes[i]
            }
          }
          const farthestEndYCoordinate =
            farthestNode.position.y + Number(farthestNode.height)
          if (farthestEndYCoordinate > DASHBOARD_CREATOR_COORDINATES.height) {
            setCanvasHeight(farthestEndYCoordinate)
          } else {
            setCanvasHeight(DASHBOARD_CREATOR_COORDINATES.height)
          }
        }
        return change
      })
      onNodesChange(parsedChanges)
    },
    [nodes, onNodesChange, setCanvasHeight]
  )
  return (
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
            minZoom={1}
            maxZoom={isEditing ? 2 : 1}
            defaultViewport={{
              x: 0,
              y: 0,
              zoom: 1,
            }}
            panOnDrag={true}
            panOnScroll={true}
            panOnScrollMode={PanOnScrollMode.Vertical}
            panActivationKeyCode={null}
            zoomActivationKeyCode={null}
            autoPanOnNodeDrag={true}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            selectionOnDrag
            nodeExtent={[
              [0, 0],
              [DASHBOARD_CREATOR_COORDINATES.width, Infinity],
            ]}
            snapToGrid
            onNodeDragStart={(_event, _node, nodes) => {
              setCurrentDraggedNode(nodes)
            }}
            onNodeDragStop={handleNodeDragStop}
            translateExtent={[
              [0, 0],
              [DASHBOARD_CREATOR_COORDINATES.width, canvasHeight],
            ]}
            proOptions={proOptions}
          >
            <Controls showFitView={false} showZoom={isEditing ?? false} />
            <Background variant={BackgroundVariant.Dots} gap={gap} />
            <HelperLines
              horizontal={helperLineHorizontal}
              vertical={helperLineVertical}
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      <Sidebar />
    </main>
  )
}

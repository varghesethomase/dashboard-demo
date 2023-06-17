import {memo, startTransition, useCallback, useState} from "react"
import {
  NodeResizer,
  ResizeDragEvent,
  ResizeParams,
  ResizeParamsWithDirection,
  useNodes,
  useReactFlow,
} from "reactflow"

import "./resiable-node.scss"
import {DASHBOARD_CREATOR_COORDINATES} from "../../configs"
import {atom, useRecoilState} from "recoil"
import {flushSync} from "react-dom"

const originalNodeDimensions = atom<ResizeParams | object>({
  key: "nodeDimensions",
  default: {
    x: 100,
    y: 300,
  },
})

interface Props {
  isLocked: boolean
  children: React.ReactElement
  minHeight: number
  minWidth: number
  nodeId: string
}

const ResizableNode = memo(
  ({isLocked, children, minHeight, minWidth, nodeId}: Props) => {
    const [nodeSize, setNodeSize] = useState({
      height: minHeight,
      width: minWidth,
    })
    const nodes = useNodes()
    const nodeIndex = nodes.findIndex((node) => node.id === nodeId)
    const currentNode = nodes[nodeIndex]

    const {getIntersectingNodes, setNodes} = useReactFlow()

    const handleResizeEnd = (event: ResizeDragEvent, params: ResizeParams) => {
      // TODO: Check with the team if its an issue that the function does not have access to latest values in the component
      if (currentNode) {
        const intersections = getIntersectingNodes(currentNode, true)
        intersections.shift()
        if (intersections.length) {
          setNodes((nodes) => {
            const newNode = {
              ...currentNode,
              width: nodeSize.width,
              height: nodeSize.height,
            }
            nodes.splice(nodeIndex, 1, newNode)
            setNodeSize(nodeSize)
            return [...nodes]
          })
        }
      }
    }

    const handleResize = useCallback(
      (_event: ResizeDragEvent, params: ResizeParams) => {
        startTransition(() => {
          setNodeSize({
            height: params.height,
            width: params.width,
          })
        })
      },
      []
    )

    const handleShouldResize = (
      _event: ResizeDragEvent,
      params: ResizeParamsWithDirection
    ) => {
      let newEndXCoordinate = 0
      if (params.x < 0) {
        newEndXCoordinate = params.width
      } else {
        newEndXCoordinate = params.x + params.width
      }
      return (
        !isLocked && newEndXCoordinate < DASHBOARD_CREATOR_COORDINATES.width
      )
    }
    return (
      <>
        <NodeResizer
          nodeId={nodeId}
          minHeight={minHeight}
          minWidth={minWidth}
          isVisible={!isLocked}
          // position="bottom-right"
          // variant={ResizeControlVariant.Line}
          // onResizeStart={handleResizeStart}
          shouldResize={handleShouldResize}
          onResizeEnd={handleResizeEnd}
          onResize={handleResize}
        />
        <div
          className="resizable-node__content-wrapper"
          style={{
            height: nodeSize.height,
            width: nodeSize.width,
          }}
        >
          {children}
        </div>
      </>
    )
  }
)
export default ResizableNode

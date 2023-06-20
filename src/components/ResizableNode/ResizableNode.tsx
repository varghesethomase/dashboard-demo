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

    const handleResizeEnd = useCallback(() => {
      if (currentNode) {
        const intersections = getIntersectingNodes(currentNode, true)
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
    }, [currentNode, getIntersectingNodes, nodeIndex, nodeSize, setNodes])

    const handleResize = useCallback(
      (_event: ResizeDragEvent, params: ResizeParams) => {
        // startTransition(() => {

        setNodeSize({
          height: params.height,
          width: params.width,
        })
        // })
      },
      []
    )

    const handleShouldResize = useCallback(
      (_event: ResizeDragEvent, params: ResizeParamsWithDirection) => {
        let newEndXCoordinate = 0
        if (params.x < 0) {
          newEndXCoordinate = params.width
        } else {
          newEndXCoordinate = params.x + params.width
        }
        return (
          !isLocked && newEndXCoordinate < DASHBOARD_CREATOR_COORDINATES.width
        )
      },
      [isLocked]
    )
    return (
      <>
        <NodeResizer
          nodeId={nodeId}
          minHeight={nodeSize.height || minHeight}
          minWidth={nodeSize.width || minWidth}
          isVisible={!isLocked}
          // position="bottom-right"
          // variant={ResizeControlVariant.Line}
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

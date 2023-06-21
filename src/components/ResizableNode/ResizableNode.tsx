import {memo, useCallback} from "react"
import {
  NodeResizer,
  ResizeDragEvent,
  ResizeParamsWithDirection,
  useReactFlow,
  useStore,
  Node,
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
    const {getIntersectingNodes, setNodes, getNodes} = useReactFlow()
    const nodes = getNodes()

    const nodeIndex = nodes.findIndex((node) => node.id === nodeId)
    const currentNode = nodes[nodeIndex]

    const handleShouldResize = useCallback(
      (_event: ResizeDragEvent, params: ResizeParamsWithDirection) => {
        let newEndXCoordinate = 0
        if (params.x < 0) {
          newEndXCoordinate = params.width
        } else {
          newEndXCoordinate = params.x + params.width
        }
        return (
          !isLocked &&
          newEndXCoordinate < DASHBOARD_CREATOR_COORDINATES.width + 2 // The additional 2 represents the border
        )
      },
      [isLocked]
    )

    const size = useStore((s) => {
      const n = s.nodeInternals.get(nodeId) as Node

      return {
        width: n.width,
        height: n.height,
      }
    })

    const handleResizeEnd = useCallback(() => {
      if (currentNode) {
        const intersections = getIntersectingNodes(currentNode, true)
        if (intersections.length) {
          setNodes((nodes) => {
            const newNode = {
              ...currentNode,
              width: size.width,
              height: size.height,
            }
            nodes.splice(nodeIndex, 1, newNode)
            return [...nodes]
          })
        }
      }
    }, [
      currentNode,
      getIntersectingNodes,
      nodeIndex,
      setNodes,
      size.height,
      size.width,
    ])

    return (
      <>
        <NodeResizer
          minHeight={minHeight}
          minWidth={minWidth}
          isVisible={!isLocked}
          shouldResize={handleShouldResize}
          onResizeEnd={handleResizeEnd}
        />
        <div
          className="resizable-node__content-wrapper"
          style={{
            minHeight: minHeight,
            minWidth: minWidth,
            height: size.height ?? minHeight,
            width: size.width ?? minWidth,
          }}
        >
          {children}
        </div>
      </>
    )
  }
)
export default ResizableNode

import {memo, startTransition, useState} from "react"
import {
  NodeResizer,
  ResizeDragEvent,
  ResizeParams,
  ResizeParamsWithDirection,
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
    const handleResizeEnd = (event: ResizeDragEvent, params: ResizeParams) => {
      // console.log(event, params)
      //TODO: Prevent resize if the end coordinates overlap with any other existing Node
    }

    const handleResize = (_event: ResizeDragEvent, params: ResizeParams) => {
      // startTransition(() => {
      setNodeSize({
        height: params.height,
        width: params.width,
      })
      // })
    }

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
          // variant={ResizeControlVariant.Handle}
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

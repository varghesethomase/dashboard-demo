import {memo, startTransition, useDeferredValue, useState} from "react"
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
}

const ResizableNode = memo(
  ({isLocked, children, minHeight, minWidth}: Props) => {
    const [nodeSize, setNodeSize] = useState({
      height: minHeight,
      width: minWidth,
    })
    const handleResizeEnd = (event: ResizeDragEvent, params: ResizeParams) => {
      // console.log(event, params)
      //TODO: Prevent resize if the end coordinates overlap with any other existing Node
    }

    const handleResize = (_event: ResizeDragEvent, params: ResizeParams) => {
      startTransition(() => {
        setNodeSize({
          height: params.height,
          width: params.width,
        })
      })
    }

    const handleShouldResize = (
      _event: ResizeDragEvent,
      params: ResizeParamsWithDirection
    ) => {
      const newEndXCoordinate = params.x + params.width
      return (
        !isLocked && newEndXCoordinate < DASHBOARD_CREATOR_COORDINATES.width
      )
    }
    return (
      <>
        <NodeResizer
          minHeight={minHeight}
          minWidth={minWidth}
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

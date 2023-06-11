import {memo} from "react"
import {NodeResizer, ResizeDragEvent, ResizeParams} from "reactflow"

import "./resiable-node.scss"

interface Props {
  isLocked: boolean
  children: React.ReactElement
  minHeight: number
  minWidth: number
}

const ResizableNode = memo(
  ({isLocked, children, minHeight, minWidth}: Props) => {
    const handleResizeEnd = (event: ResizeDragEvent, params: ResizeParams) => {
      console.log(event, params)
      //TODO: Prevent resize if the end coordinates overlap with any other existing Node
    }
    return (
      <>
        <NodeResizer
          minHeight={minHeight}
          minWidth={minWidth}
          shouldResize={() => !isLocked}
          onResizeEnd={handleResizeEnd}
        />
        <div className="resizable-node__content-wrapper">{children}</div>
      </>
    )
  }
)
export default ResizableNode

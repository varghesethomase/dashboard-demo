import {memo} from "react"
import {NodeResizer, ResizeDragEvent, ResizeParams} from "reactflow"

interface Props {
  elementHeight: number
  elementWidth: number
  isLocked: boolean
  children: React.ReactElement
}

const ResizableNode = memo(
  ({elementHeight, elementWidth, isLocked, children}: Props) => {
    const isResizable = () => {
      if (isLocked) {
        return false
      }
      return true
    }

    const handleResizeEnd = (event: ResizeDragEvent, params: ResizeParams) => {
      console.log(event, params)
      //TODO: Prevent resize if the end coordinates overlap with any other existing Node
    }
    return (
      <>
        <NodeResizer
          minWidth={elementHeight}
          minHeight={elementWidth}
          shouldResize={isResizable}
          onResizeEnd={handleResizeEnd}
        />
        <div style={{padding: 10}}>{children}</div>
      </>
    )
  }
)

export default ResizableNode

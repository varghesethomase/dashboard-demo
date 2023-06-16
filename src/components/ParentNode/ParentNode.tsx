import {memo} from "react"
import {Background, BackgroundVariant} from "reactflow"

import "./ParentNode.scss"

const ParentNode = memo(() => {
  return (
    <div className="parent-node">
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
    </div>
  )
})

export default ParentNode

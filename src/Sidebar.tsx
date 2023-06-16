enum NodeType {
  AreaChart = "AreaChartNode",
  BarChart = "BarChartNode",
  Default = "default",
}
export const Sidebar = () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: NodeType
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <aside className="dashboard__sidebar">
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, NodeType.AreaChart)}
        draggable
      >
        Area Chart
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, NodeType.BarChart)}
        draggable
      >
        Bar Chart
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, NodeType.Default)}
        draggable
      >
        Normal Node
      </div>
    </aside>
  )
}

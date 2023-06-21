import {useRecoilState} from "recoil"
import {gridGap} from "./store"
import {GRID_GAP} from "./configs"

enum NodeType {
  AreaChart = "AreaChartNode",
  BarChart = "BarChartNode",
  Default = "default",
}
export const Sidebar = () => {
  const [gap, setGridGap] = useRecoilState(gridGap)
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: NodeType
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }
  const handleGapChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGridGap(parseInt(event.target.value, 0))
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
      <label>
        Grid Gap
        <div>
          <select defaultValue={gap} onChange={handleGapChange}>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
          </select>
        </div>
      </label>
    </aside>
  )
}

export const Sidebar = () => {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className='dashboard__sidebar'>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'AreaChartNode')} draggable>
        Area Chart
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'BarChartNode')} draggable>
        Bar Chart
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'normal')} draggable>
        Normal Node
      </div>
    </aside>
  );
};

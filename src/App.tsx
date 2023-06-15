import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  PanOnScrollMode,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow"
import AreaChartNode from "./components/AreaChartNode"
import BarChartNode from "./components/BarChartNode"

import {useCallback, useMemo, useRef, useState} from "react"

import "reactflow/dist/style.css"
import "./App.scss"
import { Sidebar } from "./Sidebar"

const chartData = [
  {
    date: "Jan 22",
    SemiAnalysis: 2890,
    "The Pragmatic Engineer": 2338,
  },
  {
    date: "Feb 22",
    SemiAnalysis: 2756,
    "The Pragmatic Engineer": 2103,
  },
  {
    date: "Mar 22",
    SemiAnalysis: 3322,
    "The Pragmatic Engineer": 2194,
  },
  {
    date: "Apr 22",
    SemiAnalysis: 3470,
    "The Pragmatic Engineer": 2108,
  },
  {
    date: "May 22",
    SemiAnalysis: 3475,
    "The Pragmatic Engineer": 1812,
  },
  {
    date: "Jun 22",
    SemiAnalysis: 3129,
    "The Pragmatic Engineer": 1726,
  },
]
let id = 0;
const getId = () => `dndnode_${id++}`;

const initialNodes = [
  {
    id: "A",
    type: "group",
    position: {x: 0, y: 0},
    style: {
      width: window.innerWidth - 400,
      maxWidth: window.innerWidth - 400,
      height: 1980,
      maxHeight: Infinity,
    },
    draggable: false,
  },
  {
    id: getId(),
    parentNode: "A",
    position: {x: 0, y: 0},
    expandParent: true,
    data: {
      isLocked: false,
      chartData,
    },
    type: "AreaChartNode",
    deletable: true,
    isLocked: false,
    extent: "parent",
  },
  {
    id: getId(),
    parentNode: "A",
    position: {x: 0, y: 320},
    expandParent: true,
    data: {
      isLocked: false,
      chartData,
    },
    type: "AreaChartNode",
    deletable: true,
    isLocked: false,
    extent: "parent",
  },
]

export default function App() {
  const [isEditing, seItsEditing] = useState(true)
  const nodeTypes = useMemo(
    () => ({
      AreaChartNode,
      BarChartNode
    }),
    []
  )

  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const reactFlowWrapper = useRef<any>(null);

  // transform: translate(18.1536px, -149.435px) scale(1.24416);

  // default 1 => transform: translate(420px, -193px) scale(0.5);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);


  const onDrop = useCallback(
    (event: any) => {
      console.log('-e', event)
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      // const newNode = {
      //   id: getId(),
      //   type,
      //   position,
      //   data: { label: `${type} node` },
      // };

      const newNode = {
        id: getId(),
        type,
        position,
        data: {
          isLocked: false,
          chartData,
          label: `${type} node`
        },
        deletable: true,
        isLocked: false,
        expandParent: true,
        parentNode: "A",
        extent: "parent",
      }

      setNodes((nds) => nds.concat(newNode as any));
    },
    [reactFlowInstance, setNodes]
  );

    const onDragOver = useCallback((event: any) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);


  return (
    <main className="dashboard dndflow">
      <div className="dashboard__editor-wrapper">
        <ReactFlowProvider>
          <ReactFlow
            ref={reactFlowWrapper}
            className="dashboard__editor"
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            nodeTypes={nodeTypes}
            minZoom={1}
            maxZoom={isEditing ? 2 : 1}
            defaultViewport={{
              x: 0,
              y: 0,
              zoom: 1,
            }}
            zoomOnPinch={false}
            panOnDrag={false}
            panOnScrollMode={PanOnScrollMode.Vertical}
            autoPanOnNodeDrag={false}
            panOnScroll={true}
            zoomOnScroll={false}
            selectionOnDrag
            // snapToGrid
            nodeExtent={[
              [0, 0],
              [960, Infinity],
            ]}
            // fitView
            // onNodeDragStop={(event, node, nodes) => {
            //   console.log(event, node)
            // }}
          >
            {isEditing && (
              <>
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
              </>
            )}

            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      <Sidebar />
    </main>
  )
}

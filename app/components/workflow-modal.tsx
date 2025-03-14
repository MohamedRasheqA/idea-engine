"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
  MarkerType,
  type Connection,
  type Node,
} from "reactflow"
import "reactflow/dist/style.css"
import { IoCloseOutline, IoSaveOutline, IoTrashOutline, IoAddOutline } from "react-icons/io5"
import { FiEdit2 } from "react-icons/fi"
import { BsDiamondFill } from "react-icons/bs"
import { TbRectangle } from "react-icons/tb"
import { FaRegCircle } from "react-icons/fa"

interface WorkflowModalProps {
  isOpen: boolean
  onClose: () => void
  initialContent?: string
}

// Node types
const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  start: StartNode,
  end: EndNode,
}

// Custom nodes
function ProcessNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 bg-white border-2 border-gray-300 rounded-md shadow-sm w-48">
      <div className="font-bold text-sm text-gray-700 mb-1">{data.label}</div>
      {data.description && <div className="text-xs text-gray-500">{data.description}</div>}
    </div>
  )
}

function DecisionNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 bg-white border-2 border-yellow-400 rounded-md shadow-sm transform rotate-45 w-32 h-32 flex items-center justify-center">
      <div className="transform -rotate-45 text-center">
        <div className="font-bold text-sm text-gray-700 mb-1">{data.label}</div>
        {data.description && <div className="text-xs text-gray-500">{data.description}</div>}
      </div>
    </div>
  )
}

function StartNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 bg-green-100 border-2 border-green-500 rounded-full shadow-sm w-48">
      <div className="font-bold text-sm text-gray-700 text-center">{data.label || "Start"}</div>
    </div>
  )
}

function EndNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 bg-red-100 border-2 border-red-500 rounded-full shadow-sm w-48">
      <div className="font-bold text-sm text-gray-700 text-center">{data.label || "End"}</div>
    </div>
  )
}

export function WorkflowModal({ isOpen, onClose, initialContent = "" }: WorkflowModalProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [nodeName, setNodeName] = useState("")
  const [nodeDescription, setNodeDescription] = useState("")
  const [workflowName, setWorkflowName] = useState("Untitled Workflow")
  const [savedWorkflows, setSavedWorkflows] = useState<{ name: string; data: any }[]>([])
  const [showSavedWorkflows, setShowSavedWorkflows] = useState(false)
  const [selectedNodeType, setSelectedNodeType] = useState<string>("process")

  // Initialize with a basic workflow if initialContent is provided
  useEffect(() => {
    if (initialContent && nodes.length === 0) {
      // Create a simple workflow based on the content
      const initialNodes = [
        {
          id: "1",
          type: "start",
          position: { x: 250, y: 50 },
          data: { label: "Start" },
        },
        {
          id: "2",
          type: "process",
          position: { x: 250, y: 150 },
          data: { label: "Process Content", description: initialContent.substring(0, 50) + "..." },
        },
        {
          id: "3",
          type: "end",
          position: { x: 250, y: 250 },
          data: { label: "End" },
        },
      ]

      const initialEdges = [
        {
          id: "e1-2",
          source: "1",
          target: "2",
          markerEnd: { type: MarkerType.ArrowClosed },
        },
        {
          id: "e2-3",
          source: "2",
          target: "3",
          markerEnd: { type: MarkerType.ArrowClosed },
        },
      ]

      setNodes(initialNodes)
      setEdges(initialEdges)
    }
  }, [initialContent, nodes.length, setNodes, setEdges])

  // Load saved workflows from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("destructive-ai-workflows")
    if (savedData) {
      try {
        setSavedWorkflows(JSON.parse(savedData))
      } catch (e) {
        console.error("Failed to load saved workflows", e)
      }
    }
  }, [])

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2 },
          },
          eds,
        ),
      )
    },
    [setEdges],
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      if (!reactFlowWrapper.current || !reactFlowInstance) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes],
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node)
      setNodeName(node.data.label || "")
      setNodeDescription(node.data.description || "")
    },
    [setSelectedNode],
  )

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setNodeName("")
    setNodeDescription("")
  }, [setSelectedNode])

  const updateNodeData = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: nodeName,
                description: nodeDescription,
              },
            }
          }
          return node
        }),
      )
      setSelectedNode(null)
    }
  }, [selectedNode, nodeName, nodeDescription, setNodes])

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const addNewNode = () => {
    const newNode = {
      id: `node_${Date.now()}`,
      type: selectedNodeType,
      position: { x: 100, y: 100 },
      data: { label: `${selectedNodeType.charAt(0).toUpperCase() + selectedNodeType.slice(1)} Node` },
    }

    setNodes((nds) => nds.concat(newNode))
  }

  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      setNodes([])
      setEdges([])
    }
  }

  const saveWorkflow = () => {
    if (!workflowName.trim()) {
      alert("Please enter a workflow name")
      return
    }

    const workflowData = {
      name: workflowName,
      data: {
        nodes,
        edges,
      },
    }

    const updatedWorkflows = [...savedWorkflows.filter((w) => w.name !== workflowName), workflowData]
    setSavedWorkflows(updatedWorkflows)
    localStorage.setItem("destructive-ai-workflows", JSON.stringify(updatedWorkflows))
    alert("Workflow saved successfully!")
  }

  const loadWorkflow = (workflow: { name: string; data: any }) => {
    setWorkflowName(workflow.name)
    setNodes(workflow.data.nodes || [])
    setEdges(workflow.data.edges || [])
    setShowSavedWorkflows(false)
  }

  const exportAsImage = () => {
    if (!reactFlowInstance) return

    const dataUrl = reactFlowInstance.toObject()
    const jsonString = JSON.stringify(dataUrl, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${workflowName.replace(/\s+/g, "_")}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">Workflow Designer</h2>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              placeholder="Workflow Name"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSavedWorkflows(!showSavedWorkflows)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              My Workflows
            </button>
            <button
              onClick={saveWorkflow}
              className="px-3 py-1 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center"
            >
              <IoSaveOutline className="mr-1" /> Save
            </button>
            <button
              onClick={exportAsImage}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Export
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <IoCloseOutline className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-700 mb-2">Add Nodes</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedNodeType}
                    onChange={(e) => setSelectedNodeType(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value="process">Process</option>
                    <option value="decision">Decision</option>
                    <option value="start">Start</option>
                    <option value="end">End</option>
                  </select>
                  <button onClick={addNewNode} className="p-1 bg-purple-500 text-white rounded-md hover:bg-purple-600">
                    <IoAddOutline />
                  </button>
                </div>
                <div className="text-xs text-gray-500">Or drag and drop from below:</div>
              </div>
              <div className="mt-3 space-y-2">
                <div
                  className="border border-gray-300 rounded-md p-2 bg-white cursor-move flex items-center"
                  onDragStart={(event) => onDragStart(event, "process")}
                  draggable
                >
                  <TbRectangle className="mr-2 text-gray-600" />
                  <span className="text-sm">Process</span>
                </div>
                <div
                  className="border border-gray-300 rounded-md p-2 bg-white cursor-move flex items-center"
                  onDragStart={(event) => onDragStart(event, "decision")}
                  draggable
                >
                  <BsDiamondFill className="mr-2 text-yellow-400" />
                  <span className="text-sm">Decision</span>
                </div>
                <div
                  className="border border-gray-300 rounded-md p-2 bg-white cursor-move flex items-center"
                  onDragStart={(event) => onDragStart(event, "start")}
                  draggable
                >
                  <FaRegCircle className="mr-2 text-green-500" />
                  <span className="text-sm">Start</span>
                </div>
                <div
                  className="border border-gray-300 rounded-md p-2 bg-white cursor-move flex items-center"
                  onDragStart={(event) => onDragStart(event, "end")}
                  draggable
                >
                  <FaRegCircle className="mr-2 text-red-500" />
                  <span className="text-sm">End</span>
                </div>
              </div>
            </div>

            {/* Node properties */}
            <div className="p-4 flex-1 overflow-y-auto">
              <h3 className="font-bold text-gray-700 mb-2">Properties</h3>
              {selectedNode ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Node Name</label>
                    <input
                      type="text"
                      value={nodeName}
                      onChange={(e) => setNodeName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={nodeDescription}
                      onChange={(e) => setNodeDescription(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm h-20 resize-none"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={updateNodeData}
                      className="px-3 py-1 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center"
                    >
                      <FiEdit2 className="mr-1" /> Update
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Select a node to edit its properties</div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={clearCanvas}
                className="w-full px-3 py-2 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50 flex items-center justify-center"
              >
                <IoTrashOutline className="mr-1" /> Clear Canvas
              </button>
            </div>
          </div>

          {/* Flow canvas */}
          <div className="flex-1 h-full" ref={reactFlowWrapper}>
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                fitView
              >
                <Controls />
                <Background color="#aaa" gap={16} />
                <Panel position="top-left">
                  <div className="bg-white p-2 rounded-md shadow-md text-xs text-gray-500">
                    Drag nodes to position • Connect nodes by dragging from handles
                  </div>
                </Panel>
              </ReactFlow>
            </ReactFlowProvider>
          </div>

          {/* Saved workflows panel */}
          {showSavedWorkflows && (
            <div className="absolute right-0 top-16 bg-white border border-gray-200 rounded-md shadow-lg w-64 z-10">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-700">Saved Workflows</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {savedWorkflows.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">No saved workflows</div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {savedWorkflows.map((workflow, index) => (
                      <li
                        key={index}
                        className="p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => loadWorkflow(workflow)}
                      >
                        <div className="font-medium text-gray-700">{workflow.name}</div>
                        <div className="text-xs text-gray-500">
                          {workflow.data.nodes?.length || 0} nodes, {workflow.data.edges?.length || 0} connections
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


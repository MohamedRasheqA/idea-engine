"use client"

import { useState, useEffect } from "react"
import {
  IoCloseOutline,
  IoAddOutline,
  IoFolderOutline,
  IoDocumentOutline,
  IoGridOutline,
  IoListOutline,
  IoSearchOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
} from "react-icons/io5"
import { FaRegStar, FaStar } from "react-icons/fa"

// Types
interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  folderId: string | null
  starred: boolean
}

interface Folder {
  id: string
  name: string
  createdAt: Date
  notes: Note[]
  isOpen?: boolean
}

interface LibraryProps {
  isOpen: boolean
  onClose: () => void
  initialNotes?: Note[]
  initialFolders?: Folder[]
}

export function Library({ isOpen, onClose, initialNotes = [], initialFolders = [] }: LibraryProps) {
  // State
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [folders, setFolders] = useState<Folder[]>(initialFolders)
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [activeFolder, setActiveFolder] = useState<Folder | null>(null)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [isCreatingNote, setIsCreatingNote] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState("")

  // Initialize with sample data if none provided
  useEffect(() => {
    if (notes.length === 0 && folders.length === 0) {
      const sampleFolders: Folder[] = [
        {
          id: "folder-1",
          name: "Research Notes",
          createdAt: new Date(),
          notes: [],
          isOpen: true,
        },
        {
          id: "folder-2",
          name: "Project Ideas",
          createdAt: new Date(),
          notes: [],
          isOpen: false,
        },
      ]

      const sampleNotes: Note[] = [
        {
          id: "note-1",
          title: "AI Research Summary",
          content:
            "Recent advancements in large language models have shown significant improvements in reasoning capabilities...",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          folderId: "folder-1",
          starred: true,
        },
        {
          id: "note-2",
          title: "Meeting Notes - Project Kickoff",
          content: "Discussed project timeline, resource allocation, and key deliverables...",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          folderId: "folder-1",
          starred: false,
        },
        {
          id: "note-3",
          title: "App Feature Ideas",
          content: "1. Implement dark mode\n2. Add export functionality\n3. Improve search capabilities",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          folderId: "folder-2",
          starred: false,
        },
        {
          id: "note-4",
          title: "Quick Notes",
          content: "Remember to follow up on the API integration issue.",
          createdAt: new Date(),
          updatedAt: new Date(),
          folderId: null,
          starred: false,
        },
      ]

      setFolders(sampleFolders)
      setNotes(sampleNotes)
    }
  }, [notes.length, folders.length])

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get notes for a specific folder
  const getNotesForFolder = (folderId: string) => {
    return notes.filter((note) => note.folderId === folderId)
  }

  // Get notes that don't belong to any folder
  const getUnfiledNotes = () => {
    return notes.filter((note) => note.folderId === null)
  }

  // Create a new folder
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        createdAt: new Date(),
        notes: [],
        isOpen: true,
      }
      setFolders([...folders, newFolder])
      setNewFolderName("")
      setIsCreatingFolder(false)
      setActiveFolder(newFolder)
    }
  }

  // Create a new note
  const handleCreateNote = () => {
    if (newNoteTitle.trim()) {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: newNoteTitle,
        content: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        folderId: activeFolder ? activeFolder.id : null,
        starred: false,
      }
      setNotes([...notes, newNote])
      setNewNoteTitle("")
      setIsCreatingNote(false)
      setActiveNote(newNote)
      setIsEditing(true)
      setEditedContent("")
    }
  }

  // Save edited note
  const handleSaveNote = () => {
    if (activeNote) {
      const updatedNotes = notes.map((note) =>
        note.id === activeNote.id ? { ...note, content: editedContent, updatedAt: new Date() } : note,
      )
      setNotes(updatedNotes)
      setActiveNote({ ...activeNote, content: editedContent, updatedAt: new Date() })
      setIsEditing(false)
    }
  }

  // Delete a note
  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
    if (activeNote && activeNote.id === noteId) {
      setActiveNote(null)
    }
  }

  // Delete a folder
  const handleDeleteFolder = (folderId: string) => {
    // Move notes from this folder to unfiled
    const updatedNotes = notes.map((note) => (note.folderId === folderId ? { ...note, folderId: null } : note))

    setNotes(updatedNotes)
    setFolders(folders.filter((folder) => folder.id !== folderId))

    if (activeFolder && activeFolder.id === folderId) {
      setActiveFolder(null)
    }
  }

  // Toggle star status for a note
  const handleToggleStar = (noteId: string) => {
    const updatedNotes = notes.map((note) => (note.id === noteId ? { ...note, starred: !note.starred } : note))
    setNotes(updatedNotes)

    if (activeNote && activeNote.id === noteId) {
      setActiveNote({ ...activeNote, starred: !activeNote.starred })
    }
  }

  // Toggle folder open/closed state
  const handleToggleFolder = (folderId: string) => {
    setFolders(folders.map((folder) => (folder.id === folderId ? { ...folder, isOpen: !folder.isOpen } : folder)))
  }

  // Format date for display
  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return "Today"
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Render note list in grid view
  const renderGridView = () => {
    const notesToDisplay = activeFolder ? getNotesForFolder(activeFolder.id) : searchQuery ? filteredNotes : notes

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {notesToDisplay.map((note) => (
          <div
            key={note.id}
            className={`bg-white border rounded-lg shadow-sm overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${
              activeNote && activeNote.id === note.id ? "ring-2 ring-purple-500" : ""
            }`}
            onClick={() => setActiveNote(note)}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 truncate">{note.title}</h3>
                <button
                  className="text-gray-400 hover:text-yellow-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleStar(note.id)
                  }}
                >
                  {note.starred ? <FaStar className="text-yellow-500" /> : <FaRegStar />}
                </button>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
              <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                <span>{formatDate(note.updatedAt)}</span>
                <div className="flex space-x-2">
                  <button
                    className="hover:text-purple-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveNote(note)
                      setIsEditing(true)
                      setEditedContent(note.content)
                    }}
                  >
                    <IoCreateOutline className="text-base" />
                  </button>
                  <button
                    className="hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteNote(note.id)
                    }}
                  >
                    <IoTrashOutline className="text-base" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add new note card */}
        <div
          className="bg-white border border-dashed rounded-lg shadow-sm p-4 flex flex-col items-center justify-center text-gray-500 hover:text-purple-500 hover:border-purple-500 cursor-pointer h-[150px]"
          onClick={() => {
            setIsCreatingNote(true)
            setNewNoteTitle("")
          }}
        >
          <IoAddOutline className="text-3xl mb-2" />
          <span>Add New Note</span>
        </div>
      </div>
    )
  }

  // Render note list in list view
  const renderListView = () => {
    const notesToDisplay = activeFolder ? getNotesForFolder(activeFolder.id) : searchQuery ? filteredNotes : notes

    return (
      <div className="divide-y divide-gray-200">
        {notesToDisplay.map((note) => (
          <div
            key={note.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              activeNote && activeNote.id === note.id ? "bg-purple-50" : ""
            }`}
            onClick={() => setActiveNote(note)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-bold text-gray-900">{note.title}</h3>
                  <button
                    className="ml-2 text-gray-400 hover:text-yellow-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleStar(note.id)
                    }}
                  >
                    {note.starred ? <FaStar className="text-yellow-500" /> : <FaRegStar />}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.content}</p>
                <div className="mt-2 text-xs text-gray-500">Updated {formatDate(note.updatedAt)}</div>
              </div>
              <div className="flex space-x-2 text-gray-500">
                <button
                  className="hover:text-purple-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveNote(note)
                    setIsEditing(true)
                    setEditedContent(note.content)
                  }}
                >
                  <IoCreateOutline className="text-lg" />
                </button>
                <button
                  className="hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteNote(note.id)
                  }}
                >
                  <IoTrashOutline className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add new note row */}
        <div
          className="p-4 hover:bg-gray-50 cursor-pointer flex items-center text-gray-500 hover:text-purple-500"
          onClick={() => {
            setIsCreatingNote(true)
            setNewNoteTitle("")
          }}
        >
          <IoAddOutline className="text-xl mr-2" />
          <span>Add New Note</span>
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Library</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoCloseOutline className="text-2xl" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
            {/* Search */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Folders */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">FOLDERS</h3>
                <button className="text-gray-500 hover:text-purple-500" onClick={() => setIsCreatingFolder(true)}>
                  <IoAddOutline className="text-lg" />
                </button>
              </div>

              {/* Create new folder input */}
              {isCreatingFolder && (
                <div className="mb-2 flex">
                  <input
                    type="text"
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                  <button
                    className="bg-purple-500 text-white px-2 py-1 rounded-r-lg text-sm"
                    onClick={handleCreateFolder}
                  >
                    Add
                  </button>
                </div>
              )}

              {/* Folder list */}
              <ul className="space-y-1">
                {folders.map((folder) => (
                  <li key={folder.id}>
                    <div
                      className={`flex items-center px-2 py-1.5 rounded-md cursor-pointer ${
                        activeFolder && activeFolder.id === folder.id
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <button className="mr-1 text-gray-500" onClick={() => handleToggleFolder(folder.id)}>
                        {folder.isOpen ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
                      </button>
                      <button
                        className="flex-1 flex items-center"
                        onClick={() => {
                          setActiveFolder(folder)
                          setSearchQuery("")
                        }}
                      >
                        <IoFolderOutline className="mr-2" />
                        <span className="truncate">{folder.name}</span>
                        <span className="ml-auto text-xs text-gray-500">{getNotesForFolder(folder.id).length}</span>
                      </button>
                      <button
                        className="ml-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                        onClick={() => handleDeleteFolder(folder.id)}
                      >
                        <IoTrashOutline />
                      </button>
                    </div>

                    {/* Notes in folder */}
                    {folder.isOpen && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {getNotesForFolder(folder.id).map((note) => (
                          <li key={note.id}>
                            <button
                              className={`flex items-center w-full px-2 py-1 rounded-md text-left ${
                                activeNote && activeNote.id === note.id
                                  ? "bg-purple-100 text-purple-700"
                                  : "text-gray-700 hover:bg-gray-200"
                              }`}
                              onClick={() => setActiveNote(note)}
                            >
                              <IoDocumentOutline className="mr-2 flex-shrink-0" />
                              <span className="truncate">{note.title}</span>
                              {note.starred && <FaStar className="ml-1 text-yellow-500 text-xs" />}
                            </button>
                          </li>
                        ))}
                        {/* Add new note option inside folder */}
                        <li>
                          <button
                            className="flex items-center w-full px-2 py-1 rounded-md text-left text-gray-700 hover:bg-gray-200 hover:text-purple-500"
                            onClick={() => {
                              setActiveFolder(folder)
                              setIsCreatingNote(true)
                              setNewNoteTitle("")
                            }}
                          >
                            <IoAddOutline className="mr-2 flex-shrink-0" />
                            <span className="text-sm">New Note</span>
                          </button>
                        </li>
                      </ul>
                    )}
                  </li>
                ))}
              </ul>

              {/* Unfiled notes */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">UNFILED NOTES</h3>
                <ul className="space-y-1">
                  {getUnfiledNotes().map((note) => (
                    <li key={note.id}>
                      <button
                        className={`flex items-center w-full px-2 py-1.5 rounded-md text-left ${
                          activeNote && activeNote.id === note.id
                            ? "bg-purple-100 text-purple-700"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() => setActiveNote(note)}
                      >
                        <IoDocumentOutline className="mr-2 flex-shrink-0" />
                        <span className="truncate">{note.title}</span>
                        {note.starred && <FaStar className="ml-1 text-yellow-500 text-xs" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900">
                  {activeFolder ? activeFolder.name : searchQuery ? "Search Results" : "All Notes"}
                </h3>
                <p className="text-sm text-gray-500">
                  {activeFolder
                    ? `${getNotesForFolder(activeFolder.id).length} notes`
                    : searchQuery
                      ? `${filteredNotes.length} results`
                      : `${notes.length} notes`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  <IoListOutline className="text-lg" />
                </button>
                <button
                  className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <IoGridOutline className="text-lg" />
                </button>
              </div>
            </div>

            {/* Note list or editor */}
            <div className="flex-1 overflow-auto">
              {activeNote && isEditing ? (
                // Note editor
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <h3 className="font-bold text-gray-900">{activeNote.title}</h3>
                      <button
                        className="ml-2 text-gray-400 hover:text-yellow-500"
                        onClick={() => handleToggleStar(activeNote.id)}
                      >
                        {activeNote.starred ? <FaStar className="text-yellow-500" /> : <FaRegStar />}
                      </button>
                    </div>
                    <button
                      className="px-3 py-1 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600"
                      onClick={handleSaveNote}
                    >
                      Save
                    </button>
                  </div>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="flex-1 p-4 resize-none focus:outline-none"
                    placeholder="Start writing your note here..."
                    autoFocus
                  />
                </div>
              ) : activeNote ? (
                // Note viewer
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <h3 className="font-bold text-gray-900">{activeNote.title}</h3>
                      <button
                        className="ml-2 text-gray-400 hover:text-yellow-500"
                        onClick={() => handleToggleStar(activeNote.id)}
                      >
                        {activeNote.starred ? <FaStar className="text-yellow-500" /> : <FaRegStar />}
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                        onClick={() => {
                          setIsEditing(true)
                          setEditedContent(activeNote.content)
                        }}
                      >
                        <IoCreateOutline className="text-lg" />
                      </button>
                      <button
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                        onClick={() => handleDeleteNote(activeNote.id)}
                      >
                        <IoTrashOutline className="text-lg" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 overflow-auto whitespace-pre-wrap">
                    {activeNote.content || <span className="text-gray-400 italic">No content</span>}
                  </div>
                </div>
              ) : isCreatingNote ? (
                // Create new note
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Note Title</label>
                    <input
                      type="text"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter note title"
                      autoFocus
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                      onClick={handleCreateNote}
                    >
                      Create Note
                    </button>
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={() => setIsCreatingNote(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Note list
                <div className="h-full overflow-auto">{viewMode === "grid" ? renderGridView() : renderListView()}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


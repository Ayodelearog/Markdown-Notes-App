import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
import { addDoc, deleteDoc, onSnapshot, doc, setDoc } from "firebase/firestore"
import { db, notesCollection } from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState('')
    
    
    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    React.useEffect(() => {
        // this creates a web socket connection
        const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
            const notesArray = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id, 
            })) //wrapped the object in parenthesis so that I can use the implicit return. Else, the function thinks I was opening a function body
            setNotes(notesArray)
        })
        //clean up function for side effects to prevent memory leaks
        return unsubscribe
    }, [])

    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    React.useEffect(() => {
        setTempNoteText(currentNote?.body)
    } , [currentNote])

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            tempNoteText !== currentNote.body && updateNote(tempNoteText)
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])


    
    const sortedNotes = notes.sort ((noteA, noteB) => Number(noteB.updatedAt) - Number(noteA.updatedAt))
    // console.log(sortedArrays)
    

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(), 
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    function updateNote(text) {
        const docRef = doc(db, 'notes', currentNoteId)
        setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true })
    }

    async function deleteNote(noteId) {
        const docRef = doc(db, 'notes', noteId)
        await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        
                        <Editor
                            currentNote={tempNoteText}
                            updateNote={updateNote}
                            setTempNoteText={setTempNoteText}
                        />
                        
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}

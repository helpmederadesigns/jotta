'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface RichTextEditorProps {
    content: string
    onChange: (html: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        editorProps: {
            attributes: {
                // The 'prose' class auto-styles all the HTML tags nicely
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-6',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) return null

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Editor Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-3 flex gap-2 flex-wrap">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    Bold
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900 italic' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    Italic
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    Heading
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    Quote
                </button>
            </div>

            {/* The actual typing area */}
            <div className="bg-white cursor-text" onClick={() => editor.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
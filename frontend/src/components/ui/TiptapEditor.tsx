import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import HardBreak from "@tiptap/extension-hard-break";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import History from "@tiptap/extension-history";
import {
	LuList,
	LuListOrdered,
	LuListX,
	LuAlignCenter,
	LuAlignRight,
	LuAlignLeft,
	LuAlignJustify,
	LuUndo,
	LuRedo,
} from "react-icons/lu";
import { VscHorizontalRule, VscNewline } from "react-icons/vsc";
import { useEffect } from "react";

const MenuBar = ({ editor }: { editor: any }) => {
	if (!editor) {
		return null;
	}

	return (
		<div className="flex items-center flex-wrap mb-4 gap-2 p-2 rounded-t-lg border-b border-gray-300 bg-white">
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={`editor-button ${editor.isActive("bold") ? "editor-button-active font-bold" : ""}`}
			>
				B
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={`editor-button ${editor.isActive("italic") ? "editor-button-active" : ""}`}
			>
				<em>I</em>
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				className={`editor-button ${editor.isActive("underline") ? "editor-button-active" : ""}`}
			>
				<u>U</u>
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleStrike().run()}
				className={`editor-button ${editor.isActive("strike") ? "editor-button-active line-through" : ""}`}
			>
				S
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				className={`editor-button ${editor.isActive("heading", { level: 1 }) ? "editor-button-active" : ""}`}
			>
				H1
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				className={`editor-button ${editor.isActive("heading", { level: 2 }) ? "editor-button-active" : ""}`}
			>
				H2
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				className={`editor-button ${editor.isActive("heading", { level: 3 }) ? "editor-button-active" : ""}`}
			>
				H3
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={`editor-button ${editor.isActive("bulletList") ? "editor-button-active" : ""}`}
			>
				<LuList size={20} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={`editor-button ${editor.isActive("orderedList") ? "editor-button-active" : ""}`}
			>
				<LuListOrdered size={20} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().setHorizontalRule().run()}
				className="editor-button"
			>
				<VscHorizontalRule size={20} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().setHardBreak().run()}
				className="editor-button"
			>
				<VscNewline size={20} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().setTextAlign("left").run()}
				className={`editor-button ${editor.isActive({ textAlign: "left" }) ? "editor-button-active" : ""}`}
			>
				<LuAlignLeft size={20} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().setTextAlign("center").run()}
				className={`editor-button ${editor.isActive({ textAlign: "center" }) ? "editor-button-active" : ""}`}
			>
				<LuAlignCenter size={20} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().setTextAlign("right").run()}
				className={`editor-button ${editor.isActive({ textAlign: "right" }) ? "editor-button-active" : ""}`}
			>
				<LuAlignRight size={20} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().setTextAlign("justify").run()}
				className={`editor-button ${editor.isActive({ textAlign: "justify" }) ? "editor-button-active" : ""}`}
			>
				<LuAlignJustify size={20} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().unsetTextAlign().run()}
				className="editor-button"
			>
				<LuListX size={20} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().undo().run()}
				className="editor-button"
			>
				<LuUndo size={20} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().redo().run()}
				className="editor-button"
			>
				<LuRedo size={20} />
			</button>
		</div>
	);
};

export const TiptapEditor = ({
	onEditorReady,
}: {
	onEditorReady: (editor: any) => void;
}) => {
	const limit = 6000;

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				dropcursor: false,
				gapcursor: false,
				codeBlock: false,
				code: false,
				blockquote: false,
				heading: {
					levels: [1, 2, 3],
				},
			}),
			Underline,
			CharacterCount.configure({
				limit,
			}),
			Placeholder.configure({
				placeholder: "Write something...",
			}),
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
		],
		editorProps: {
			attributes: {
				class:
					"prose prose-sm max-w-none w-full min-h-[200px] focus:outline-none",
			},
		},
	});

	useEffect(() => {
		if (editor) {
			onEditorReady(editor);
		}
	}, [editor, onEditorReady]);

	return (
		<div className="relative w-full pb-3 bg-gray-50 border border-gray-300 hover:border-gray-500 text-gray-800 text-sm rounded-lg focus-within:ring focus-within:ring-gray-100 transition duration-200">
			<MenuBar editor={editor} />
			<div className="px-3 pb-2 w-full">
				<EditorContent
					editor={editor}
					className="w-full min-h-[200px] [&>div]:w-full"
				/>
			</div>
			<span className="absolute bottom-0 right-0 text-xs p-1 mt-2">
				{editor?.storage.characterCount.characters()} / {limit} chars
			</span>
		</div>
	);
};

"use client";

import {
	headingsPlugin,
	listsPlugin,
	quotePlugin,
	thematicBreakPlugin,
	markdownShortcutPlugin,
	MDXEditor,
	type MDXEditorMethods,
	toolbarPlugin,
	ConditionalContents,
	ChangeCodeMirrorLanguage,
	UndoRedo,
	Separator,
	BoldItalicUnderlineToggles,
	ListsToggle,
	CreateLink,
	InsertImage,
	InsertTable,
	InsertThematicBreak,
	InsertCodeBlock,
	linkPlugin,
	linkDialogPlugin,
	tablePlugin,
	imagePlugin,
	codeBlockPlugin,
	codeMirrorPlugin,
	diffSourcePlugin,
} from "@mdxeditor/editor";

import type { ForwardedRef } from "react";
import { basicDark } from "cm6-theme-basic-dark";
import "@mdxeditor/editor/style.css";
import "./dark-editor.css";
import { useTheme } from "next-themes";

interface Props {
	value: string;
	fieldChange: (value: string) => void;
	editorRef: ForwardedRef<MDXEditorMethods> | null;
}

const Editor = ({ value, fieldChange, editorRef, ...props }: Props) => {
	const { resolvedTheme } = useTheme();
	const theme = resolvedTheme === "dark" ? [basicDark] : [];
	return (
		<MDXEditor
			key={resolvedTheme}
			markdown={value}
			className="background-light800_dark200 light-border-2 markdown-editor dark-editor grid w-full border"
			onChange={fieldChange}
			plugins={[
				headingsPlugin(),
				listsPlugin(),
				linkPlugin(),
				linkDialogPlugin(),
				quotePlugin(),
				thematicBreakPlugin(),
				markdownShortcutPlugin(),
				tablePlugin(),
				imagePlugin(),
				codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
				codeMirrorPlugin({
					codeBlockLanguages: {
						css: "css",
						txt: "text",
						sql: "sql",
						html: "html",
						saas: "sass",
						scss: "scss",
						bash: "bash",
						json: "json",
						js: "javascript",
						ts: "typescript",
						"": "unspecified",
						jsx: "JavaScript (React)",
						tsx: "TypeScript (React)",
					},
					autoLoadLanguageSupport: true,
					codeMirrorExtensions: theme,
				}),
				diffSourcePlugin({
					viewMode: "rich-text",
					diffMarkdown: "",
				}),
				toolbarPlugin({
					toolbarContents: () => (
						<ConditionalContents
							options={[
								{
									when: (editor) =>
										editor?.editorType === "codeblock",
									contents: () => (
										<ChangeCodeMirrorLanguage />
									),
								},
								{
									fallback: () => (
										<>
											<UndoRedo />
											<Separator />

											<BoldItalicUnderlineToggles />
											<Separator />

											<ListsToggle />
											<Separator />

											<CreateLink />
											<InsertImage />
											<Separator />

											<InsertTable />
											<InsertThematicBreak />
											<InsertCodeBlock />
										</>
									),
								},
							]}
						/>
					),
				}),
			]}
			{...props}
			ref={editorRef}
		/>
	);
};

export default Editor;

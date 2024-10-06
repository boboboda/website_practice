import "@/styles/codeBlockComponent.css";
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { NodeViewContent, ReactNodeViewRenderer, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { all, createLowlight } from 'lowlight'


const lowlight = createLowlight(all)

export const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent)
  }
}).configure({
  lowlight,
  defaultLanguage: 'javascript',
})



const CodeBlockComponent = (props: NodeViewProps) => {
  const { node, updateAttributes, extension } = props;

  return (
    

    <NodeViewWrapper className="code-block">
      <select 
        contentEditable={false} 
        defaultValue={node.attrs.language} 
        onChange={event => updateAttributes({ language: event.target.value })}
      >
        <option value="null">auto</option>
        <option disabled>—</option>
        {extension.options.lowlight.listLanguages().map((lang: string, index: number) => (
          <option key={index} value={lang}>{lang}</option>
        ))}
      </select>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  )
}



import { useObservable, observer } from "@legendapp/state/react";
import classNames from "classnames";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { themes } from "prism-react-renderer";
import { BiPencil } from "react-icons/bi";

interface Props {
  code: string;
  scope?: Record<string, unknown>;
  name?: string;
  noInline?: boolean;
  renderCode?: string;
  previewWidth?: number;
  transformCode?: (code: string) => string;
}
const emptyTheme = { plain: {}, styles: [] };

function removeImports(code: string) {
  return code.replace(/import .*?\n/g, "");
}

export const Editor = observer(function Editor({
  code,
  scope,
  name,
  previewWidth,
  renderCode,
  transformCode,
  noInline = false,
}: Props) {
  code = code.trim();
  return (
    <LiveProvider
      code={code}
      transformCode={(output) =>
        removeImports(
          (transformCode ? transformCode(output) : output) + (renderCode || "")
        )
      }
      scope={scope}
      enableTypeScript={true}
      theme={emptyTheme}
      noInline={noInline}
      language="jsx"
    >
      <div className="flex gap-4 text-sm mt-6 items-center">
        <div className="relative flex-1">
          <div>
            <LiveEditor />
          </div>
          <div
            className={classNames(
              "absolute top-3 right-3 !mt-0 flex items-center bg-blue-700 px-2 py-1 rounded-md text-sm cursor-default"
            )}
          >
            <BiPencil className="mr-2" />
            Editing
          </div>
        </div>
        <div
          className={classNames(name ? `p_${name}` : "col-span-1 rounded")}
          style={{ width: previewWidth }}
        >
          <LivePreview />
        </div>
      </div>
      <LiveError />
    </LiveProvider>
  );
});
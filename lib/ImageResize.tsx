import { Quill } from "react-quill";
import { IQuillInstance, ImageResize } from "quill-image-resize-module-ts";
import { IDefaultOptions } from "quill-image-resize-module-ts/dist/DefaultOptions";

function QuillImageResize(this: ImageResize, quill: IQuillInstance, options: IDefaultOptions) {
  ImageResize.call(this, quill, options);
}

QuillImageResize.prototype = Object.create(ImageResize.prototype);
QuillImageResize.prototype.constructor = QuillImageResize;

QuillImageResize.prototype.onKeyUp = function () {
  const self = this;
  const KEYCODE_BACKSPACE = 8;
  const KEYCODE_DELETE = 46;

  return function (event: { keyCode: number }) {
    if (self.currentSelectedImage) {
      if (event.keyCode === KEYCODE_DELETE || event.keyCode === KEYCODE_BACKSPACE) {
        const quillInstance = self.quill;
        if (quillInstance) {
          const blot = Quill.find(self.currentSelectedImage);
          if (blot) {
            const index = quillInstance.getIndex(blot);
            quillInstance.deleteText(index, 1);
            self.hideSelection();
          }
        }
      }
    }
  };
};

export { QuillImageResize };
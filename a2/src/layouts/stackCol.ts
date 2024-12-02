import { SKElement, LayoutMethod, Size } from "simplekit/imperative-mode";

type StackLayoutProps = {
  gap?: number;
};

// places elements in a vertical stack
export class StackColLayout implements LayoutMethod {
  constructor({ gap = 0 }: StackLayoutProps = {}) {
    this.gap = gap;
  }
  private gap: number;

  measure(elements: SKElement[]) {
    // measure all children first
    elements.forEach((el) => {
      el.measure();
    });

    // width is width of widest element
    const totalWidth = elements.reduce(
      (acc, el) => Math.max(acc, el.intrinsicWidth),
      0
    );

    // height is sum of all element heights and their gaps
    const totalHeight =
      elements.reduce((acc, el) => acc + el.intrinsicHeight, 0) +
      (elements.length - 1) * this.gap;

    // return minimum layout size
    return {
      width: totalWidth,
      height: totalHeight,
    };
  }

  layout(width: number, height: number, elements: SKElement[]) {
    const newBounds: Size = { width: 0, height: 0 };

    let y = 0;

    const totalFixedHeight = elements.reduce(
      (acc, el) => acc + (el.fillHeight === 0 ? el.intrinsicHeight : 0),
      0
    );

    const availableHeight =
      height - totalFixedHeight - (elements.length - 1) * this.gap;
    const proportionalElements = elements.filter((el) => el.fillHeight > 0);
    const proportionalUnitHeight =
      proportionalElements.length > 0
        ? availableHeight / proportionalElements.length
        : 0;

    elements.forEach((el) => {
      // set the element position
      el.x = 0;
      el.y = y;

      const h = el.fillHeight > 0 ? proportionalUnitHeight : el.intrinsicHeight;
      // optional fill width
      const w = el.fillWidth ? width : el.intrinsicWidth;

      el.layout(w, h);

      // next row
      y += el.layoutHeight + this.gap;

      // update bounds that were actually used
      newBounds.width = Math.max(newBounds.width, el.layoutWidth);
      newBounds.height = Math.max(newBounds.height, y);
    });

    return newBounds;
  }
}

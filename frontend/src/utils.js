import { css } from "styled-components";

function widthLessThan(width) {
  return (...args) =>
    css`
      @media screen and (max-width: ${width}px) {
        ${css(...args)};
      }
    `;
}

function smoothSet({ comp, propName, initial, final, duration }) {
  let start = null;
  initial = initial == null ? comp[propName] : initial;
  const animation = time => {
    if (!start) start = time;
    const w = (time - start) / duration;
    comp[propName] = w * final + (1 - w) * initial;
    if (w < 1) window.requestAnimationFrame(animation);
  };
  window.requestAnimationFrame(animation);
}

export { widthLessThan, smoothSet };

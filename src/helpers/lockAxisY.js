export default function lockAxisY(style) {
  if (style?.transform) {
    const axisLockY = `translate(0px, ${style.transform.split(",").pop()}`;
    return {
      ...style,
      transform: axisLockY,
    };
  }
  return style;
}

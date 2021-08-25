export const calculateAspectRatioFit = (
  srcWidth,
  srcHeight,
  maxWidth,
  maxHeight,
) => {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  var rtnWidth = srcWidth * ratio;
  var rtnHeight = srcHeight * ratio;

  return {width: rtnWidth, height: rtnHeight};
};

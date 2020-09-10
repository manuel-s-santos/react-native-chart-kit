var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
import Pie from "paths-js/pie";
import React from "react";
import { View } from "react-native";
import { G, Path, Rect, Svg, Text } from "react-native-svg";
import AbstractChart from "./AbstractChart";
var ProgressChart = /** @class */ (function(_super) {
  __extends(ProgressChart, _super);
  function ProgressChart() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  ProgressChart.prototype.render = function() {
    var _this = this;
    var _a = this.props,
      width = _a.width,
      height = _a.height,
      style = _a.style,
      data = _a.data,
      hideLegend = _a.hideLegend,
      strokeWidth = _a.strokeWidth,
      radius = _a.radius;
    var _b = style.borderRadius,
      borderRadius = _b === void 0 ? 0 : _b,
      _c = style.margin,
      margin = _c === void 0 ? 0 : _c,
      _d = style.marginRight,
      marginRight = _d === void 0 ? 0 : _d;
    if (Array.isArray(data)) {
      data = {
        data: data
      };
    }
    var pies = data.data.map(function(pieData, i) {
      var r =
        ((height / 2 - 32) /
          (Array.isArray(data) ? data.length : data.data.length)) *
          i +
        radius;
      return Pie({
        r: r,
        R: r,
        center: [0, 0],
        data: [pieData, 1 - pieData],
        accessor: function(x) {
          return x;
        }
      });
    });
    var pieBackgrounds = data.data.map(function(pieData, i) {
      var r =
        ((height / 2 - 32) /
          (Array.isArray(data) ? data.length : data.data.length)) *
          i +
        radius;
      return Pie({
        r: r,
        R: r,
        center: [0, 0],
        data: [0.999, 0.001],
        accessor: function(x) {
          return x;
        }
      });
    });
    var withLabel = function(i) {
      return data.labels && data.labels[i];
    };
    var legend = !hideLegend && (
      <>
        <G>
          {pies.map(function(_, i) {
            return (
              <Rect
                key={Math.random()}
                width="16px"
                height="16px"
                fill={_this.props.chartConfig.color(0.2 * (i + 1), i)}
                rx={8}
                ry={8}
                x={_this.props.width / 2.5 - 24}
                y={
                  -(_this.props.height / 2.5) +
                  ((_this.props.height * 0.8) /
                    (Array.isArray(data) ? data.length : data.data.length)) *
                    i +
                  12
                }
              />
            );
          })}
        </G>
        <G>
          {pies.map(function(_, i) {
            return (
              <Text
                key={Math.random()}
                x={_this.props.width / 2.5}
                y={
                  -(_this.props.height / 2.5) +
                  ((_this.props.height * 0.8) /
                    (Array.isArray(data) ? data.length : data.data.length)) *
                    i +
                  12 * 2
                }
                {..._this.getPropsForLabels()}
              >
                {withLabel(i)
                  ? data.labels[i] + " " + Math.round(100 * data.data[i]) + "%"
                  : Math.round(100 * data.data[i]) + "%"}
              </Text>
            );
          })}
        </G>
      </>
    );
    return (
      <View
        style={__assign({ width: width, height: height, padding: 0 }, style)}
      >
        <Svg width={width - margin * 2 - marginRight} height={height}>
          {this.renderDefs(
            __assign(
              { width: this.props.height, height: this.props.height },
              this.props.chartConfig
            )
          )}
          <Rect
            width="100%"
            height={this.props.height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G
            x={this.props.width / (hideLegend ? 2 : 2.5)}
            y={this.props.height / 2}
          >
            <G>
              {pieBackgrounds.map(function(pie, i) {
                return (
                  <Path
                    key={Math.random()}
                    d={pie.curves[0].sector.path.print()}
                    strokeWidth={strokeWidth}
                    stroke={_this.props.chartConfig.color(0.2, i)}
                  />
                );
              })}
            </G>
            <G>
              {pies.map(function(pie, i) {
                return (
                  <Path
                    key={Math.random()}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={pie.curves[0].sector.path.print()}
                    strokeWidth={strokeWidth}
                    stroke={_this.props.chartConfig.color(
                      (i / pies.length) * 0.5 + 0.5,
                      i
                    )}
                  />
                );
              })}
            </G>
            {legend}
          </G>
        </Svg>
      </View>
    );
  };
  ProgressChart.defaultProps = { style: {}, strokeWidth: 16, radius: 32 };
  return ProgressChart;
})(AbstractChart);
export default ProgressChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvZ3Jlc3NDaGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Qcm9ncmVzc0NoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEdBQUcsTUFBTSxjQUFjLENBQUM7QUFDL0IsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBRSxJQUFJLEVBQWEsTUFBTSxjQUFjLENBQUM7QUFDL0MsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU1RCxPQUFPLGFBR04sTUFBTSxpQkFBaUIsQ0FBQztBQXlCekI7SUFBNEIsaUNBRzNCO0lBSEQ7O0lBK0tBLENBQUM7SUF6S0MsOEJBQU0sR0FBTjtRQUFBLGlCQXdLQztRQXZLSyxJQUFBLEtBUUEsSUFBSSxDQUFDLEtBQUssRUFQWixLQUFLLFdBQUEsRUFDTCxNQUFNLFlBQUEsRUFDTixLQUFLLFdBQUEsRUFDTCxJQUFJLFVBQUEsRUFDSixVQUFVLGdCQUFBLEVBQ1YsV0FBVyxpQkFBQSxFQUNYLE1BQU0sWUFDTSxDQUFDO1FBRVAsSUFBQSxLQUFrRCxLQUFLLGFBQXZDLEVBQWhCLFlBQVksbUJBQUcsQ0FBQyxLQUFBLEVBQUUsS0FBZ0MsS0FBSyxPQUEzQixFQUFWLE1BQU0sbUJBQUcsQ0FBQyxLQUFBLEVBQUUsS0FBb0IsS0FBSyxZQUFWLEVBQWYsV0FBVyxtQkFBRyxDQUFDLEtBQUEsQ0FBVztRQUVoRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkIsSUFBSSxHQUFHO2dCQUNMLElBQUksTUFBQTthQUNMLENBQUM7U0FDSDtRQUVELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBTyxFQUFFLENBQUM7WUFDcEMsSUFBTSxDQUFD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S0FBSyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQztJQTJLMUUsb0JBQUM7Q0FBQSxBQS9LRCxDQUE0QixhQUFhLEdBK0t4QztBQUVELGVBQWUsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBpZSBmcm9tIFwicGF0aHMtanMvcGllXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBWaWV3LCBWaWV3U3R5bGUgfSBmcm9tIFwicmVhY3QtbmF0aXZlXCI7XG5pbXBvcnQgeyBHLCBQYXRoLCBSZWN0LCBTdmcsIFRleHQgfSBmcm9tIFwicmVhY3QtbmF0aXZlLXN2Z1wiO1xuXG5pbXBvcnQgQWJzdHJhY3RDaGFydCwge1xuICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICBBYnN0cmFjdENoYXJ0UHJvcHNcbn0gZnJvbSBcIi4vQWJzdHJhY3RDaGFydFwiO1xuXG5leHBvcnQgdHlwZSBQcm9ncmVzc0NoYXJ0RGF0YSA9XG4gIHwgQXJyYXk8bnVtYmVyPlxuICB8IHsgbGFiZWxzPzogQXJyYXk8c3RyaW5nPjsgZGF0YTogQXJyYXk8bnVtYmVyPiB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb2dyZXNzQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIGRhdGE6IFByb2dyZXNzQ2hhcnREYXRhO1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgYWNjZXNzb3I6IHN0cmluZztcbiAgYmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XG4gIHBhZGRpbmdMZWZ0OiBzdHJpbmc7XG4gIGNlbnRlcj86IEFycmF5PG51bWJlcj47XG4gIGFic29sdXRlPzogYm9vbGVhbjtcbiAgaGFzTGVnZW5kPzogYm9vbGVhbjtcbiAgc3R5bGU/OiBQYXJ0aWFsPFZpZXdTdHlsZT47XG4gIGNoYXJ0Q29uZmlnPzogQWJzdHJhY3RDaGFydENvbmZpZztcbiAgaGlkZUxlZ2VuZD86IGJvb2xlYW47XG4gIHN0cm9rZVdpZHRoPzogbnVtYmVyO1xuICByYWRpdXM/OiBudW1iZXI7XG59XG5cbnR5cGUgUHJvZ3Jlc3NDaGFydFN0YXRlID0ge307XG5cbmNsYXNzIFByb2dyZXNzQ2hhcnQgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0PFxuICBQcm9ncmVzc0NoYXJ0UHJvcHMsXG4gIFByb2dyZXNzQ2hhcnRTdGF0ZVxuPiB7XG4gIHB1YmxpYyBzdGF0aWMgZGVmYXVsdFByb3BzID0geyBzdHlsZToge30sIHN0cm9rZVdpZHRoOiAxNiwgcmFkaXVzOiAzMiB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBzdHlsZSxcbiAgICAgIGRhdGEsXG4gICAgICBoaWRlTGVnZW5kLFxuICAgICAgc3Ryb2tlV2lkdGgsXG4gICAgICByYWRpdXNcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHsgYm9yZGVyUmFkaXVzID0gMCwgbWFyZ2luID0gMCwgbWFyZ2luUmlnaHQgPSAwIH0gPSBzdHlsZTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICBkYXRhID0ge1xuICAgICAgICBkYXRhXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IHBpZXMgPSBkYXRhLmRhdGEubWFwKChwaWVEYXRhLCBpKSA9PiB7XG4gICAgICBjb25zdCByID1cbiAgICAgICAgKChoZWlnaHQgLyAyIC0gMzIpIC9cbiAgICAgICAgICAoQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEubGVuZ3RoIDogZGF0YS5kYXRhLmxlbmd0aCkpICpcbiAgICAgICAgICBpICtcbiAgICAgICAgcmFkaXVzO1xuXG4gICAgICByZXR1cm4gUGllKHtcbiAgICAgICAgcixcbiAgICAgICAgUjogcixcbiAgICAgICAgY2VudGVyOiBbMCwgMF0sXG4gICAgICAgIGRhdGE6IFtwaWVEYXRhLCAxIC0gcGllRGF0YV0sXG4gICAgICAgIGFjY2Vzc29yKHg6IHN0cmluZykge1xuICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHBpZUJhY2tncm91bmRzID0gZGF0YS5kYXRhLm1hcCgocGllRGF0YSwgaSkgPT4ge1xuICAgICAgY29uc3QgciA9XG4gICAgICAgICgoaGVpZ2h0IC8gMiAtIDMyKSAvXG4gICAgICAgICAgKEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhLmxlbmd0aCA6IGRhdGEuZGF0YS5sZW5ndGgpKSAqXG4gICAgICAgICAgaSArXG4gICAgICAgIHJhZGl1cztcbiAgICAgIHJldHVybiBQaWUoe1xuICAgICAgICByLFxuICAgICAgICBSOiByLFxuICAgICAgICBjZW50ZXI6IFswLCAwXSxcbiAgICAgICAgZGF0YTogWzAuOTk5LCAwLjAwMV0sXG4gICAgICAgIGFjY2Vzc29yKHg6IHN0cmluZykge1xuICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHdpdGhMYWJlbCA9IChpOiBudW1iZXIpID0+XG4gICAgICAoZGF0YSBhcyBhbnkpLmxhYmVscyAmJiAoZGF0YSBhcyBhbnkpLmxhYmVsc1tpXTtcblxuICAgIGNvbnN0IGxlZ2VuZCA9ICFoaWRlTGVnZW5kICYmIChcbiAgICAgIDw+XG4gICAgICAgIDxHPlxuICAgICAgICAgIHtwaWVzLm1hcCgoXywgaSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPFJlY3RcbiAgICAgICAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgICAgICAgd2lkdGg9XCIxNnB4XCJcbiAgICAgICAgICAgICAgICBoZWlnaHQ9XCIxNnB4XCJcbiAgICAgICAgICAgICAgICBmaWxsPXt0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLmNvbG9yKDAuMiAqIChpICsgMSksIGkpfVxuICAgICAgICAgICAgICAgIHJ4PXs4fVxuICAgICAgICAgICAgICAgIHJ5PXs4fVxuICAgICAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAyLjUgLSAyNH1cbiAgICAgICAgICAgICAgICB5PXtcbiAgICAgICAgICAgICAgICAgIC0odGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUpICtcbiAgICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC9cbiAgICAgICAgICAgICAgICAgICAgKEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhLmxlbmd0aCA6IGRhdGEuZGF0YS5sZW5ndGgpKSAqXG4gICAgICAgICAgICAgICAgICAgIGkgK1xuICAgICAgICAgICAgICAgICAgMTJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L0c+XG4gICAgICAgIDxHPlxuICAgICAgICAgIHtwaWVzLm1hcCgoXywgaSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPFRleHRcbiAgICAgICAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgICAgICAgeD17dGhpcy5wcm9wcy53aWR0aCAvIDIuNX1cbiAgICAgICAgICAgICAgICB5PXtcbiAgICAgICAgICAgICAgICAgIC0odGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUpICtcbiAgICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC9cbiAgICAgICAgICAgICAgICAgICAgKEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhLmxlbmd0aCA6IGRhdGEuZGF0YS5sZW5ndGgpKSAqXG4gICAgICAgICAgICAgICAgICAgIGkgK1xuICAgICAgICAgICAgICAgICAgMTIgKiAyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yTGFiZWxzKCl9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7d2l0aExhYmVsKGkpXG4gICAgICAgICAgICAgICAgICA/IGAkeyhkYXRhIGFzIGFueSkubGFiZWxzW2ldfSAke01hdGgucm91bmQoXG4gICAgICAgICAgICAgICAgICAgICAgMTAwICogKGRhdGEgYXMgYW55KS5kYXRhW2ldXG4gICAgICAgICAgICAgICAgICAgICl9JWBcbiAgICAgICAgICAgICAgICAgIDogYCR7TWF0aC5yb3VuZCgxMDAgKiAoZGF0YSBhcyBhbnkpLmRhdGFbaV0pfSVgfVxuICAgICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L0c+XG4gICAgICA8Lz5cbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxWaWV3XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgLi4uc3R5bGVcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFN2Z1xuICAgICAgICAgIHdpZHRoPXt3aWR0aCAtIChtYXJnaW4gYXMgbnVtYmVyKSAqIDIgLSAobWFyZ2luUmlnaHQgYXMgbnVtYmVyKX1cbiAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgPlxuICAgICAgICAgIHt0aGlzLnJlbmRlckRlZnMoe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY2hhcnRDb25maWdcbiAgICAgICAgICB9KX1cbiAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICAgIGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9XG4gICAgICAgICAgICByeD17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgICAgcnk9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIGZpbGw9XCJ1cmwoI2JhY2tncm91bmRHcmFkaWVudClcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEcgeD17dGhpcy5wcm9wcy53aWR0aCAvIChoaWRlTGVnZW5kID8gMiA6IDIuNSl9IHk9e3RoaXMucHJvcHMuaGVpZ2h0IC8gMn0+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3BpZUJhY2tncm91bmRzLm1hcCgocGllLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxQYXRoXG4gICAgICAgICAgICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICAgICAgICAgICAgZD17cGllLmN1cnZlc1swXS5zZWN0b3IucGF0aC5wcmludCgpfVxuICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9XG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZT17dGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcigwLjIsIGkpfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvRz5cbiAgICAgICAgICAgIDxHPlxuICAgICAgICAgICAgICB7cGllcy5tYXAoKHBpZSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8UGF0aFxuICAgICAgICAgICAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBkPXtwaWUuY3VydmVzWzBdLnNlY3Rvci5wYXRoLnByaW50KCl9XG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH1cbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXt0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLmNvbG9yKFxuICAgICAgICAgICAgICAgICAgICAgIChpIC8gcGllcy5sZW5ndGgpICogMC41ICsgMC41LFxuICAgICAgICAgICAgICAgICAgICAgIGlcbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICB7bGVnZW5kfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgPC9Tdmc+XG4gICAgICA8L1ZpZXc+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcm9ncmVzc0NoYXJ0O1xuIl19

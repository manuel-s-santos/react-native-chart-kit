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
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
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
    var withColor = function(i) {
      return data.colors && data.colors[i];
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
                fill={
                  _this.props.withCustomBarColorFromData
                    ? withColor(i)
                    : _this.props.chartConfig.color(0.2 * (i + 1), i)
                }
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
                    stroke={
                      _this.props.withCustomBarColorFromData
                        ? withColor(i)
                        : _this.props.chartConfig.color(
                            (i / pies.length) * 0.5 + 0.5,
                            i
                          )
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvZ3Jlc3NDaGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Qcm9ncmVzc0NoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEdBQUcsTUFBTSxjQUFjLENBQUM7QUFDL0IsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBRSxJQUFJLEVBQWEsTUFBTSxjQUFjLENBQUM7QUFDL0MsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU1RCxPQUFPLGFBR04sTUFBTSxpQkFBaUIsQ0FBQztBQXVCekI7SUFBNEIsaUNBRzNCO0lBSEQ7O0lBNkxBLENBQUM7SUF2TEMsOEJBQU0sR0FBTjtRQUFBLGlCQXNMQztRQXJMSyxJQUFBLEtBUUEsSUFBSSxDQUFDLEtBQUssRUFQWixLQUFLLFdBQUEsRUFDTCxNQUFNLFlBQUEsRUFDTixLQUFLLFdBQUEsRUFDTCxJQUFJLFVBQUEsRUFDSixVQUFVLGdCQUFBLEVBQ1YsV0FBVyxpQkFBQSxFQUNYLE1BQU0sWUFDTSxDQUFDO1FBRVAsSUFBQSxLQUFrRCxLQUFLLGFBQXZDLEVBQWhCLFlBQVksbUJBQUcsQ0FBQyxLQUFBLEVBQUUsS0FBZ0MsS0FBSyxPQUEzQixFQUFWLE1BQU0sbUJBQUcsQ0FBQyxLQUFBLEVBQUUsS0FBb0IsS0FBSyxZQUFWLEVBQWYsV0FBVyxtQkFBRyxDQUFDLEtBQUEsQ0FBVztRQUVoRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkIsSUFBSSxHQUFHO2dCQUNMLElBQUksTUFBQTthQUNMLENBQUM7U0FDSDtRQUVELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBTyxFQUFFLENBQUM7WUFDcEMsSUFBTSxDQUFD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LENBQUMsS0FBSyxDQUMxQixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFDN0IsQ0FBQyxDQUNGLENBQ04sRUFDRCxDQUNILENBQUM7UUFDSixDQUFDLENBQUMsQ0FDSjtZQUFBLEVBQUUsQ0FBQyxDQUNIO1lBQUEsQ0FBQyxNQUFNLENBQ1Q7VUFBQSxFQUFFLENBQUMsQ0FDTDtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQztJQXhMYSwwQkFBWSxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQztJQXlMMUUsb0JBQUM7Q0FBQSxBQTdMRCxDQUE0QixhQUFhLEdBNkx4QztBQUVELGVBQWUsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBpZSBmcm9tIFwicGF0aHMtanMvcGllXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBWaWV3LCBWaWV3U3R5bGUgfSBmcm9tIFwicmVhY3QtbmF0aXZlXCI7XG5pbXBvcnQgeyBHLCBQYXRoLCBSZWN0LCBTdmcsIFRleHQgfSBmcm9tIFwicmVhY3QtbmF0aXZlLXN2Z1wiO1xuXG5pbXBvcnQgQWJzdHJhY3RDaGFydCwge1xuICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICBBYnN0cmFjdENoYXJ0UHJvcHNcbn0gZnJvbSBcIi4vQWJzdHJhY3RDaGFydFwiO1xuXG5leHBvcnQgdHlwZSBQcm9ncmVzc0NoYXJ0RGF0YSA9XG4gIHwgQXJyYXk8bnVtYmVyPlxuICB8IHsgbGFiZWxzPzogQXJyYXk8c3RyaW5nPjsgY29sb3JzPzogQXJyYXk8c3RyaW5nPjsgZGF0YTogQXJyYXk8bnVtYmVyPiB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb2dyZXNzQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIGRhdGE6IFByb2dyZXNzQ2hhcnREYXRhO1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgY2VudGVyPzogQXJyYXk8bnVtYmVyPjtcbiAgYWJzb2x1dGU/OiBib29sZWFuO1xuICBoYXNMZWdlbmQ/OiBib29sZWFuO1xuICBzdHlsZT86IFBhcnRpYWw8Vmlld1N0eWxlPjtcbiAgY2hhcnRDb25maWc/OiBBYnN0cmFjdENoYXJ0Q29uZmlnO1xuICBoaWRlTGVnZW5kPzogYm9vbGVhbjtcbiAgc3Ryb2tlV2lkdGg/OiBudW1iZXI7XG4gIHJhZGl1cz86IG51bWJlcjtcbiAgd2l0aEN1c3RvbUJhckNvbG9yRnJvbURhdGE/OiBib29sZWFuO1xufVxuXG50eXBlIFByb2dyZXNzQ2hhcnRTdGF0ZSA9IHt9O1xuXG5jbGFzcyBQcm9ncmVzc0NoYXJ0IGV4dGVuZHMgQWJzdHJhY3RDaGFydDxcbiAgUHJvZ3Jlc3NDaGFydFByb3BzLFxuICBQcm9ncmVzc0NoYXJ0U3RhdGVcbj4ge1xuICBwdWJsaWMgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHsgc3R5bGU6IHt9LCBzdHJva2VXaWR0aDogMTYsIHJhZGl1czogMzIgfTtcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgc3R5bGUsXG4gICAgICBkYXRhLFxuICAgICAgaGlkZUxlZ2VuZCxcbiAgICAgIHN0cm9rZVdpZHRoLFxuICAgICAgcmFkaXVzXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCB7IGJvcmRlclJhZGl1cyA9IDAsIG1hcmdpbiA9IDAsIG1hcmdpblJpZ2h0ID0gMCB9ID0gc3R5bGU7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgZGF0YVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBwaWVzID0gZGF0YS5kYXRhLm1hcCgocGllRGF0YSwgaSkgPT4ge1xuICAgICAgY29uc3QgciA9XG4gICAgICAgICgoaGVpZ2h0IC8gMiAtIDMyKSAvXG4gICAgICAgICAgKEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhLmxlbmd0aCA6IGRhdGEuZGF0YS5sZW5ndGgpKSAqXG4gICAgICAgICAgaSArXG4gICAgICAgIHJhZGl1cztcblxuICAgICAgcmV0dXJuIFBpZSh7XG4gICAgICAgIHIsXG4gICAgICAgIFI6IHIsXG4gICAgICAgIGNlbnRlcjogWzAsIDBdLFxuICAgICAgICBkYXRhOiBbcGllRGF0YSwgMSAtIHBpZURhdGFdLFxuICAgICAgICBhY2Nlc3Nvcih4OiBzdHJpbmcpIHtcbiAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBwaWVCYWNrZ3JvdW5kcyA9IGRhdGEuZGF0YS5tYXAoKHBpZURhdGEsIGkpID0+IHtcbiAgICAgIGNvbnN0IHIgPVxuICAgICAgICAoKGhlaWdodCAvIDIgLSAzMikgL1xuICAgICAgICAgIChBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YS5sZW5ndGggOiBkYXRhLmRhdGEubGVuZ3RoKSkgKlxuICAgICAgICAgIGkgK1xuICAgICAgICByYWRpdXM7XG4gICAgICByZXR1cm4gUGllKHtcbiAgICAgICAgcixcbiAgICAgICAgUjogcixcbiAgICAgICAgY2VudGVyOiBbMCwgMF0sXG4gICAgICAgIGRhdGE6IFswLjk5OSwgMC4wMDFdLFxuICAgICAgICBhY2Nlc3Nvcih4OiBzdHJpbmcpIHtcbiAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCB3aXRoTGFiZWwgPSAoaTogbnVtYmVyKSA9PlxuICAgICAgKGRhdGEgYXMgYW55KS5sYWJlbHMgJiYgKGRhdGEgYXMgYW55KS5sYWJlbHNbaV07XG5cbiAgICBjb25zdCB3aXRoQ29sb3IgPSAoaTogbnVtYmVyKSA9PlxuICAgICAgKGRhdGEgYXMgYW55KS5jb2xvcnMgJiYgKGRhdGEgYXMgYW55KS5jb2xvcnNbaV07XG5cbiAgICBjb25zdCBsZWdlbmQgPSAhaGlkZUxlZ2VuZCAmJiAoXG4gICAgICA8PlxuICAgICAgICA8Rz5cbiAgICAgICAgICB7cGllcy5tYXAoKF8sIGkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxSZWN0XG4gICAgICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgICAgICAgIHdpZHRoPVwiMTZweFwiXG4gICAgICAgICAgICAgICAgaGVpZ2h0PVwiMTZweFwiXG4gICAgICAgICAgICAgICAgZmlsbD17XG4gICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLndpdGhDdXN0b21CYXJDb2xvckZyb21EYXRhXG4gICAgICAgICAgICAgICAgICAgID8gd2l0aENvbG9yKGkpXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcigwLjIgKiAoaSArIDEpLCBpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByeD17OH1cbiAgICAgICAgICAgICAgICByeT17OH1cbiAgICAgICAgICAgICAgICB4PXt0aGlzLnByb3BzLndpZHRoIC8gMi41IC0gMjR9XG4gICAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgICAtKHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41KSArXG4gICAgICAgICAgICAgICAgICAoKHRoaXMucHJvcHMuaGVpZ2h0ICogMC44KSAvXG4gICAgICAgICAgICAgICAgICAgIChBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YS5sZW5ndGggOiBkYXRhLmRhdGEubGVuZ3RoKSkgKlxuICAgICAgICAgICAgICAgICAgICBpICtcbiAgICAgICAgICAgICAgICAgIDEyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9HPlxuICAgICAgICA8Rz5cbiAgICAgICAgICB7cGllcy5tYXAoKF8sIGkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxUZXh0XG4gICAgICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAyLjV9XG4gICAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgICAtKHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41KSArXG4gICAgICAgICAgICAgICAgICAoKHRoaXMucHJvcHMuaGVpZ2h0ICogMC44KSAvXG4gICAgICAgICAgICAgICAgICAgIChBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YS5sZW5ndGggOiBkYXRhLmRhdGEubGVuZ3RoKSkgKlxuICAgICAgICAgICAgICAgICAgICBpICtcbiAgICAgICAgICAgICAgICAgIDEyICogMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckxhYmVscygpfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3dpdGhMYWJlbChpKVxuICAgICAgICAgICAgICAgICAgPyBgJHsoZGF0YSBhcyBhbnkpLmxhYmVsc1tpXX0gJHtNYXRoLnJvdW5kKFxuICAgICAgICAgICAgICAgICAgICAgIDEwMCAqIChkYXRhIGFzIGFueSkuZGF0YVtpXVxuICAgICAgICAgICAgICAgICAgICApfSVgXG4gICAgICAgICAgICAgICAgICA6IGAke01hdGgucm91bmQoMTAwICogKGRhdGEgYXMgYW55KS5kYXRhW2ldKX0lYH1cbiAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9HPlxuICAgICAgPC8+XG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Vmlld1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAgIC4uLnN0eWxlXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdmdcbiAgICAgICAgICB3aWR0aD17d2lkdGggLSAobWFyZ2luIGFzIG51bWJlcikgKiAyIC0gKG1hcmdpblJpZ2h0IGFzIG51bWJlcil9XG4gICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgID5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJEZWZzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICAuLi50aGlzLnByb3BzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgfSl9XG4gICAgICAgICAgPFJlY3RcbiAgICAgICAgICAgIHdpZHRoPVwiMTAwJVwiXG4gICAgICAgICAgICBoZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0fVxuICAgICAgICAgICAgcng9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIHJ5PXtib3JkZXJSYWRpdXN9XG4gICAgICAgICAgICBmaWxsPVwidXJsKCNiYWNrZ3JvdW5kR3JhZGllbnQpXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxHXG4gICAgICAgICAgICB4PXt0aGlzLnByb3BzLndpZHRoIC8gKGhpZGVMZWdlbmQgPyAyIDogMi41KX1cbiAgICAgICAgICAgIHk9e3RoaXMucHJvcHMuaGVpZ2h0IC8gMn1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3BpZUJhY2tncm91bmRzLm1hcCgocGllLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxQYXRoXG4gICAgICAgICAgICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICAgICAgICAgICAgZD17cGllLmN1cnZlc1swXS5zZWN0b3IucGF0aC5wcmludCgpfVxuICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9XG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZT17dGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcigwLjIsIGkpfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvRz5cbiAgICAgICAgICAgIDxHPlxuICAgICAgICAgICAgICB7cGllcy5tYXAoKHBpZSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8UGF0aFxuICAgICAgICAgICAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBkPXtwaWUuY3VydmVzWzBdLnNlY3Rvci5wYXRoLnByaW50KCl9XG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH1cbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLndpdGhDdXN0b21CYXJDb2xvckZyb21EYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHdpdGhDb2xvcihpKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLmNvbG9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpIC8gcGllcy5sZW5ndGgpICogMC41ICsgMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAge2xlZ2VuZH1cbiAgICAgICAgICA8L0c+XG4gICAgICAgIDwvU3ZnPlxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvZ3Jlc3NDaGFydDtcbiJdfQ==

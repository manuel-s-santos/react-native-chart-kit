import React from "react";
import { View } from "react-native";
import {
  Defs,
  G,
  LinearGradient,
  Rect,
  Stop,
  Svg,
  Text
} from "react-native-svg";
import AbstractChart from "./AbstractChart";
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
var barWidth = 32;
var BarChart = /** @class */ (function(_super) {
  __extends(BarChart, _super);
  function BarChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.getBarPercentage = function() {
      var _a = _this.props.chartConfig.barPercentage,
        barPercentage = _a === void 0 ? 1 : _a;
      return barPercentage;
    };
    _this.renderBars = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        barRadius = _a.barRadius,
        withCustomBarColorFromData = _a.withCustomBarColorFromData;
      var baseHeight = _this.calcBaseHeight(data, height);
      return data.map(function(x, i) {
        if (data[i] < 1) return <></>;
        var barHeight = _this.calcHeight(x, data, height);
        var barWidth = 32 * _this.getBarPercentage();
        return (
          <Rect
            key={Math.random()}
            x={
              paddingRight +
              (i * (width - paddingRight)) / data.length +
              barWidth / 2 -
              10
            }
            y={
              ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
              paddingTop
            }
            rx={barRadius}
            width={barWidth}
            height={(Math.abs(barHeight) / 4) * 3}
            fill={
              withCustomBarColorFromData
                ? "url(#customColor_0_" + i + ")"
                : "url(#fillShadowGradient)"
            }
          />
        );
      });
    };
    _this.renderBarTops = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight;
      var baseHeight = _this.calcBaseHeight(data, height);
      return data.map(function(x, i) {
        if (data[i] < 1) return <></>;
        var barHeight = _this.calcHeight(x, data, height);
        var barWidth = 32 * _this.getBarPercentage();
        return (
          <Rect
            key={Math.random()}
            x={
              paddingRight +
              (i * (width - paddingRight)) / data.length +
              barWidth / 2 -
              10
            }
            y={((baseHeight - barHeight) / 4) * 3 + paddingTop}
            width={barWidth}
            height={2}
            fill={_this.props.chartConfig.color(0.6)}
          />
        );
      });
    };
    _this.renderColors = function(_a) {
      var data = _a.data,
        flatColor = _a.flatColor;
      return data.map(function(dataset, index) {
        var _a, _b;
        return (
          <Defs key={(_a = dataset.key) !== null && _a !== void 0 ? _a : index}>
            {(_b = dataset.colors) === null || _b === void 0
              ? void 0
              : _b.map(function(color, colorIndex) {
                  var highOpacityColor = color(1.0);
                  var lowOpacityColor = color(0.1);
                  return (
                    <LinearGradient
                      id={"customColor_" + index + "_" + colorIndex}
                      key={index + "_" + colorIndex}
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={1}
                    >
                      <Stop
                        offset="0"
                        stopColor={highOpacityColor}
                        stopOpacity="1"
                      />
                      {flatColor ? (
                        <Stop
                          offset="1"
                          stopColor={highOpacityColor}
                          stopOpacity="1"
                        />
                      ) : (
                        <Stop
                          offset="1"
                          stopColor={lowOpacityColor}
                          stopOpacity="0"
                        />
                      )}
                    </LinearGradient>
                  );
                })}
          </Defs>
        );
      });
    };
    _this.renderValuesOnTopOfBars = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        formatValueOnTopBar = _a.formatValueOnTopBar;
      var baseHeight = _this.calcBaseHeight(data, height);
      return data.map(function(x, i) {
        if (data[i] < 1) return <></>;
        var barHeight = _this.calcHeight(x, data, height);
        var barWidth = 32 * _this.getBarPercentage();
        return (
          <Text
            key={Math.random()}
            x={
              paddingRight +
              (i * (width - paddingRight)) / data.length +
              barWidth / 1 -
              10
            }
            y={((baseHeight - barHeight) / 4) * 3 + paddingTop - 1}
            fill={_this.props.chartConfig.color(0.6)}
            fontSize="12"
            textAnchor="middle"
          >
            {formatValueOnTopBar(data[i])}
          </Text>
        );
      });
    };
    return _this;
  }
  BarChart.prototype.render = function() {
    var _a;
    var _b = this.props,
      width = _b.width,
      height = _b.height,
      data = _b.data,
      _c = _b.style,
      style = _c === void 0 ? {} : _c,
      _d = _b.withHorizontalLabels,
      withHorizontalLabels = _d === void 0 ? true : _d,
      _e = _b.withVerticalLabels,
      withVerticalLabels = _e === void 0 ? true : _e,
      _f = _b.verticalLabelRotation,
      verticalLabelRotation = _f === void 0 ? 0 : _f,
      _g = _b.horizontalLabelRotation,
      horizontalLabelRotation = _g === void 0 ? 0 : _g,
      _h = _b.withInnerLines,
      withInnerLines = _h === void 0 ? true : _h,
      _j = _b.showBarTops,
      showBarTops = _j === void 0 ? true : _j,
      _k = _b.withCustomBarColorFromData,
      withCustomBarColorFromData = _k === void 0 ? false : _k,
      _l = _b.showValuesOnTopOfBars,
      showValuesOnTopOfBars = _l === void 0 ? false : _l,
      _m = _b.flatColor,
      flatColor = _m === void 0 ? false : _m,
      _o = _b.segments,
      segments = _o === void 0 ? 4 : _o,
      _p = _b.formatValueOnTopBar,
      formatValueOnTopBar =
        _p === void 0
          ? function(n) {
              return n;
            }
          : _p;

    var _q = style.borderRadius,
      borderRadius = _q === void 0 ? 0 : _q,
      _r = style.paddingTop,
      paddingTop = _r === void 0 ? 16 : _r,
      _s = style.paddingRight,
      paddingRight = _s === void 0 ? 64 : _s,
      _t = style.horizontalOffset,
      horizontalOffset = _t === void 0 ? 0 : _t;

    var config = {
      width: width,
      height: height,
      verticalLabelRotation: verticalLabelRotation,
      horizontalLabelRotation: horizontalLabelRotation,
      barRadius:
        (this.props.chartConfig && this.props.chartConfig.barRadius) || 0,
      decimalPlaces:
        (_a =
          this.props.chartConfig && this.props.chartConfig.decimalPlaces) !==
          null && _a !== void 0
          ? _a
          : 2,
      formatYLabel:
        (this.props.chartConfig && this.props.chartConfig.formatYLabel) ||
        function(label) {
          return label;
        },
      formatXLabel:
        (this.props.chartConfig && this.props.chartConfig.formatXLabel) ||
        function(label) {
          return label;
        }
    };
    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs(
            __assign(__assign({}, config), this.props.chartConfig)
          )}
          {this.renderColors(
            __assign(__assign({}, this.props.chartConfig), {
              flatColor: flatColor,
              data: this.props.data.datasets
            })
          )}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {withInnerLines
              ? this.renderHorizontalLines(
                  __assign(__assign({}, config), {
                    count: segments,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight
                  })
                )
              : null}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels(
                  __assign(__assign({}, config), {
                    count: segments,
                    data: data.datasets[0].data,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight
                  })
                )
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels(
                  __assign(__assign({}, config), {
                    labels: data.labels,
                    paddingRight: paddingRight,
                    paddingTop: paddingTop,
                    horizontalOffset:
                      barWidth * this.getBarPercentage() + horizontalOffset
                  })
                )
              : null}
          </G>
          <G>
            {this.renderBars(
              __assign(__assign({}, config), {
                data: data.datasets[0].data,
                paddingTop: paddingTop,
                paddingRight: paddingRight,
                withCustomBarColorFromData: withCustomBarColorFromData
              })
            )}
          </G>
          <G>
            {showValuesOnTopOfBars &&
              this.renderValuesOnTopOfBars(
                __assign(__assign({}, config), {
                  data: data.datasets[0].data,
                  paddingTop: paddingTop,
                  paddingRight: paddingRight,
                  formatValueOnTopBar: formatValueOnTopBar
                })
              )}
          </G>
          <G>
            {showBarTops &&
              this.renderBarTops(
                __assign(__assign({}, config), {
                  data: data.datasets[0].data,
                  paddingTop: paddingTop,
                  paddingRight: paddingRight
                })
              )}
          </G>
        </Svg>
      </View>
    );
  };
  return BarChart;
})(AbstractChart);
export default BarChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFyQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQmFyQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsSUFBSSxFQUFhLE1BQU0sY0FBYyxDQUFDO0FBQy9DLE9BQU8sRUFDTCxJQUFJLEVBQ0osQ0FBQyxFQUNELGNBQWMsRUFDZCxJQUFJLEVBQ0osSUFBSSxFQUNKLEdBQUcsRUFDSCxJQUFJLEVBQ0wsTUFBTSxrQkFBa0IsQ0FBQztBQUUxQixPQUFPLGFBR04sTUFBTSxpQkFBaUIsQ0FBQztBQUd6QixJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFrQ3BCO0lBQXVCLDRCQUEyQztJQUFsRTtRQUFBLHFFQXFSQztRQXBSQyxzQkFBZ0IsR0FBRztZQUNULElBQUEsS0FBc0IsS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLGNBQTNCLEVBQWpCLGFBQWEsbUJBQUcsQ0FBQyxLQUFBLENBQTRCO1lBQ3JELE9BQU8sYUFBYSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQztRQUVGLGdCQUFVLEdBQUcsVUFBQyxFQWNiO2dCQWJDLElBQUksVUFBQSxFQUNKLEtBQUssV0FBQSxFQUNMLE1BQU0sWUFBQSxFQUNOLFVBQVUsZ0JBQUEsRUFDVixZQUFZLGtCQUFBLEVBQ1osU0FBUyxlQUFBLEVBQ1QsMEJBQTBCLGdDQUFBO1lBUTFCLElBQU0sVUFBVSxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRXJELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNuQixJQUFNLFNBQVMsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ25ELElBQU0sUUFBUSxHQUFHLEVBQUUs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QUMsQ0FDQTtZQUFBLENBQUMsV0FBVztZQUNWLElBQUksQ0FBQyxhQUFhLHVCQUNiLE1BQU0sS0FDVCxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQzNCLFVBQVUsRUFBRSxVQUFvQixFQUNoQyxZQUFZLEVBQUUsWUFBc0IsSUFDcEMsQ0FDTjtVQUFBLEVBQUUsQ0FBQyxDQUNMO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLElBQUksQ0FBQyxDQUNSLENBQUM7SUFDSixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUFyUkQsQ0FBdUIsYUFBYSxHQXFSbkM7QUFFRCxlQUFlLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFZpZXcsIFZpZXdTdHlsZSB9IGZyb20gXCJyZWFjdC1uYXRpdmVcIjtcbmltcG9ydCB7XG4gIERlZnMsXG4gIEcsXG4gIExpbmVhckdyYWRpZW50LFxuICBSZWN0LFxuICBTdG9wLFxuICBTdmcsXG4gIFRleHRcbn0gZnJvbSBcInJlYWN0LW5hdGl2ZS1zdmdcIjtcblxuaW1wb3J0IEFic3RyYWN0Q2hhcnQsIHtcbiAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgQWJzdHJhY3RDaGFydFByb3BzXG59IGZyb20gXCIuL0Fic3RyYWN0Q2hhcnRcIjtcbmltcG9ydCB7IENoYXJ0RGF0YSB9IGZyb20gXCIuL0hlbHBlclR5cGVzXCI7XG5cbmNvbnN0IGJhcldpZHRoID0gMzI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFyQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIGRhdGE6IENoYXJ0RGF0YTtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGZyb21aZXJvPzogYm9vbGVhbjtcbiAgd2l0aElubmVyTGluZXM/OiBib29sZWFuO1xuICB5QXhpc0xhYmVsOiBzdHJpbmc7XG4gIHlBeGlzU3VmZml4OiBzdHJpbmc7XG4gIGNoYXJ0Q29uZmlnOiBBYnN0cmFjdENoYXJ0Q29uZmlnO1xuICBzdHlsZT86IFBhcnRpYWw8Vmlld1N0eWxlPjtcbiAgaG9yaXpvbnRhbExhYmVsUm90YXRpb24/OiBudW1iZXI7XG4gIHZlcnRpY2FsTGFiZWxSb3RhdGlvbj86IG51bWJlcjtcbiAgLyoqXG4gICAqIFNob3cgdmVydGljYWwgbGFiZWxzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG4gIHdpdGhWZXJ0aWNhbExhYmVscz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IGhvcml6b250YWwgbGFiZWxzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG4gIHdpdGhIb3Jpem9udGFsTGFiZWxzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgaG9yaXpvbnRhbCBsaW5lc1xuICAgKi9cbiAgc2VnbWVudHM/OiBudW1iZXI7XG4gIHNob3dCYXJUb3BzPzogYm9vbGVhbjtcbiAgc2hvd1ZhbHVlc09uVG9wT2ZCYXJzPzogYm9vbGVhbjtcbiAgd2l0aEN1c3RvbUJhckNvbG9yRnJvbURhdGE/OiBib29sZWFuO1xuICBmbGF0Q29sb3I/OiBib29sZWFuO1xufVxuXG50eXBlIEJhckNoYXJ0U3RhdGUgPSB7fTtcblxuY2xhc3MgQmFyQ2hhcnQgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0PEJhckNoYXJ0UHJvcHMsIEJhckNoYXJ0U3RhdGU+IHtcbiAgZ2V0QmFyUGVyY2VudGFnZSA9ICgpID0+IHtcbiAgICBjb25zdCB7IGJhclBlcmNlbnRhZ2UgPSAxIH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xuICAgIHJldHVybiBiYXJQZXJjZW50YWdlO1xuICB9O1xuXG4gIHJlbmRlckJhcnMgPSAoe1xuICAgIGRhdGEsXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIGJhclJhZGl1cyxcbiAgICB3aXRoQ3VzdG9tQmFyQ29sb3JGcm9tRGF0YVxuICB9OiBQaWNrPFxuICAgIE9taXQ8QWJzdHJhY3RDaGFydENvbmZpZywgXCJkYXRhXCI+LFxuICAgIFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCIgfCBcImJhclJhZGl1c1wiXG4gID4gJiB7XG4gICAgZGF0YTogbnVtYmVyW107XG4gICAgd2l0aEN1c3RvbUJhckNvbG9yRnJvbURhdGE6IGJvb2xlYW47XG4gIH0pID0+IHtcbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gdGhpcy5jYWxjQmFzZUhlaWdodChkYXRhLCBoZWlnaHQpO1xuXG4gICAgcmV0dXJuIGRhdGEubWFwKCh4LCBpKSA9PiB7XG4gICAgICBjb25zdCBiYXJIZWlnaHQgPSB0aGlzLmNhbGNIZWlnaHQoeCwgZGF0YSwgaGVpZ2h0KTtcbiAgICAgIGNvbnN0IGJhcldpZHRoID0gMzIgKiB0aGlzLmdldEJhclBlcmNlbnRhZ2UoKTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxSZWN0XG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgIHg9e1xuICAgICAgICAgICAgcGFkZGluZ1JpZ2h0ICtcbiAgICAgICAgICAgIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhLmxlbmd0aCArXG4gICAgICAgICAgICBiYXJXaWR0aCAvIDJcbiAgICAgICAgICB9XG4gICAgICAgICAgeT17XG4gICAgICAgICAgICAoKGJhckhlaWdodCA+IDAgPyBiYXNlSGVpZ2h0IC0gYmFySGVpZ2h0IDogYmFzZUhlaWdodCkgLyA0KSAqIDMgK1xuICAgICAgICAgICAgcGFkZGluZ1RvcFxuICAgICAgICAgIH1cbiAgICAgICAgICByeD17YmFyUmFkaXVzfVxuICAgICAgICAgIHdpZHRoPXtiYXJXaWR0aH1cbiAgICAgICAgICBoZWlnaHQ9eyhNYXRoLmFicyhiYXJIZWlnaHQpIC8gNCkgKiAzfVxuICAgICAgICAgIGZpbGw9e1xuICAgICAgICAgICAgd2l0aEN1c3RvbUJhckNvbG9yRnJvbURhdGFcbiAgICAgICAgICAgICAgPyBgdXJsKCNjdXN0b21Db2xvcl8wXyR7aX0pYFxuICAgICAgICAgICAgICA6IFwidXJsKCNmaWxsU2hhZG93R3JhZGllbnQpXCJcbiAgICAgICAgICB9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlckJhclRvcHMgPSAoe1xuICAgIGRhdGEsXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgcGFkZGluZ1JpZ2h0XG4gIH06IFBpY2s8XG4gICAgT21pdDxBYnN0cmFjdENoYXJ0Q29uZmlnLCBcImRhdGFcIj4sXG4gICAgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIlxuICA+ICYge1xuICAgIGRhdGE6IG51bWJlcltdO1xuICB9KSA9PiB7XG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YSwgaGVpZ2h0KTtcblxuICAgIHJldHVybiBkYXRhLm1hcCgoeCwgaSkgPT4ge1xuICAgICAgY29uc3QgYmFySGVpZ2h0ID0gdGhpcy5jYWxjSGVpZ2h0KHgsIGRhdGEsIGhlaWdodCk7XG4gICAgICBjb25zdCBiYXJXaWR0aCA9IDMyICogdGhpcy5nZXRCYXJQZXJjZW50YWdlKCk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UmVjdFxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICB4PXtcbiAgICAgICAgICAgIHBhZGRpbmdSaWdodCArXG4gICAgICAgICAgICAoaSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCkpIC8gZGF0YS5sZW5ndGggK1xuICAgICAgICAgICAgYmFyV2lkdGggLyAyXG4gICAgICAgICAgfVxuICAgICAgICAgIHk9eygoYmFzZUhlaWdodCAtIGJhckhlaWdodCkgLyA0KSAqIDMgKyBwYWRkaW5nVG9wfVxuICAgICAgICAgIHdpZHRoPXtiYXJXaWR0aH1cbiAgICAgICAgICBoZWlnaHQ9ezJ9XG4gICAgICAgICAgZmlsbD17dGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcigwLjYpfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcblxuICByZW5kZXJDb2xvcnMgPSAoe1xuICAgIGRhdGEsXG4gICAgZmxhdENvbG9yXG4gIH06IFBpY2s8QWJzdHJhY3RDaGFydENvbmZpZywgXCJkYXRhXCI+ICYge1xuICAgIGZsYXRDb2xvcjogYm9vbGVhbjtcbiAgfSkgPT4ge1xuICAgIHJldHVybiBkYXRhLm1hcCgoZGF0YXNldCwgaW5kZXgpID0+IChcbiAgICAgIDxEZWZzIGtleT17ZGF0YXNldC5rZXkgPz8gaW5kZXh9PlxuICAgICAgICB7ZGF0YXNldC5jb2xvcnM/Lm1hcCgoY29sb3IsIGNvbG9ySW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBoaWdoT3BhY2l0eUNvbG9yID0gY29sb3IoMS4wKTtcbiAgICAgICAgICBjb25zdCBsb3dPcGFjaXR5Q29sb3IgPSBjb2xvcigwLjEpO1xuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxMaW5lYXJHcmFkaWVudFxuICAgICAgICAgICAgICBpZD17YGN1c3RvbUNvbG9yXyR7aW5kZXh9XyR7Y29sb3JJbmRleH1gfVxuICAgICAgICAgICAgICBrZXk9e2Ake2luZGV4fV8ke2NvbG9ySW5kZXh9YH1cbiAgICAgICAgICAgICAgeDE9ezB9XG4gICAgICAgICAgICAgIHkxPXswfVxuICAgICAgICAgICAgICB4Mj17MH1cbiAgICAgICAgICAgICAgeTI9ezF9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxTdG9wIG9mZnNldD1cIjBcIiBzdG9wQ29sb3I9e2hpZ2hPcGFjaXR5Q29sb3J9IHN0b3BPcGFjaXR5PVwiMVwiIC8+XG4gICAgICAgICAgICAgIHtmbGF0Q29sb3IgPyAoXG4gICAgICAgICAgICAgICAgPFN0b3Agb2Zmc2V0PVwiMVwiIHN0b3BDb2xvcj17aGlnaE9wYWNpdHlDb2xvcn0gc3RvcE9wYWNpdHk9XCIxXCIgLz5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8U3RvcCBvZmZzZXQ9XCIxXCIgc3RvcENvbG9yPXtsb3dPcGFjaXR5Q29sb3J9IHN0b3BPcGFjaXR5PVwiMFwiIC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L0xpbmVhckdyYWRpZW50PlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgICAgPC9EZWZzPlxuICAgICkpO1xuICB9O1xuXG4gIHJlbmRlclZhbHVlc09uVG9wT2ZCYXJzID0gKHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIHBhZGRpbmdSaWdodFxuICB9OiBQaWNrPFxuICAgIE9taXQ8QWJzdHJhY3RDaGFydENvbmZpZywgXCJkYXRhXCI+LFxuICAgIFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcbiAgPiAmIHtcbiAgICBkYXRhOiBudW1iZXJbXTtcbiAgfSkgPT4ge1xuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGEsIGhlaWdodCk7XG5cbiAgICByZXR1cm4gZGF0YS5tYXAoKHgsIGkpID0+IHtcbiAgICAgIGNvbnN0IGJhckhlaWdodCA9IHRoaXMuY2FsY0hlaWdodCh4LCBkYXRhLCBoZWlnaHQpO1xuICAgICAgY29uc3QgYmFyV2lkdGggPSAzMiAqIHRoaXMuZ2V0QmFyUGVyY2VudGFnZSgpO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRleHRcbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgeD17XG4gICAgICAgICAgICBwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgICAgKGkgKiAod2lkdGggLSBwYWRkaW5nUmlnaHQpKSAvIGRhdGEubGVuZ3RoICtcbiAgICAgICAgICAgIGJhcldpZHRoIC8gMVxuICAgICAgICAgIH1cbiAgICAgICAgICB5PXsoKGJhc2VIZWlnaHQgLSBiYXJIZWlnaHQpIC8gNCkgKiAzICsgcGFkZGluZ1RvcCAtIDF9XG4gICAgICAgICAgZmlsbD17dGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcigwLjYpfVxuICAgICAgICAgIGZvbnRTaXplPVwiMTJcIlxuICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICA+XG4gICAgICAgICAge2RhdGFbaV19XG4gICAgICAgIDwvVGV4dD5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgZGF0YSxcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICB3aXRoSG9yaXpvbnRhbExhYmVscyA9IHRydWUsXG4gICAgICB3aXRoVmVydGljYWxMYWJlbHMgPSB0cnVlLFxuICAgICAgdmVydGljYWxMYWJlbFJvdGF0aW9uID0gMCxcbiAgICAgIGhvcml6b250YWxMYWJlbFJvdGF0aW9uID0gMCxcbiAgICAgIHdpdGhJbm5lckxpbmVzID0gdHJ1ZSxcbiAgICAgIHNob3dCYXJUb3BzID0gdHJ1ZSxcbiAgICAgIHdpdGhDdXN0b21CYXJDb2xvckZyb21EYXRhID0gZmFsc2UsXG4gICAgICBzaG93VmFsdWVzT25Ub3BPZkJhcnMgPSBmYWxzZSxcbiAgICAgIGZsYXRDb2xvciA9IGZhbHNlLFxuICAgICAgc2VnbWVudHMgPSA0XG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCB7IGJvcmRlclJhZGl1cyA9IDAsIHBhZGRpbmdUb3AgPSAxNiwgcGFkZGluZ1JpZ2h0ID0gNjQgfSA9IHN0eWxlO1xuXG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICB2ZXJ0aWNhbExhYmVsUm90YXRpb24sXG4gICAgICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbixcbiAgICAgIGJhclJhZGl1czpcbiAgICAgICAgKHRoaXMucHJvcHMuY2hhcnRDb25maWcgJiYgdGhpcy5wcm9wcy5jaGFydENvbmZpZy5iYXJSYWRpdXMpIHx8IDAsXG4gICAgICBkZWNpbWFsUGxhY2VzOlxuICAgICAgICAodGhpcy5wcm9wcy5jaGFydENvbmZpZyAmJiB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLmRlY2ltYWxQbGFjZXMpID8/IDIsXG4gICAgICBmb3JtYXRZTGFiZWw6XG4gICAgICAgICh0aGlzLnByb3BzLmNoYXJ0Q29uZmlnICYmIHRoaXMucHJvcHMuY2hhcnRDb25maWcuZm9ybWF0WUxhYmVsKSB8fFxuICAgICAgICBmdW5jdGlvbihsYWJlbCkge1xuICAgICAgICAgIHJldHVybiBsYWJlbDtcbiAgICAgICAgfSxcbiAgICAgIGZvcm1hdFhMYWJlbDpcbiAgICAgICAgKHRoaXMucHJvcHMuY2hhcnRDb25maWcgJiYgdGhpcy5wcm9wcy5jaGFydENvbmZpZy5mb3JtYXRYTGFiZWwpIHx8XG4gICAgICAgIGZ1bmN0aW9uKGxhYmVsKSB7XG4gICAgICAgICAgcmV0dXJuIGxhYmVsO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8VmlldyBzdHlsZT17c3R5bGV9PlxuICAgICAgICA8U3ZnIGhlaWdodD17aGVpZ2h0fSB3aWR0aD17d2lkdGh9PlxuICAgICAgICAgIHt0aGlzLnJlbmRlckRlZnMoe1xuICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5jaGFydENvbmZpZ1xuICAgICAgICAgIH0pfVxuICAgICAgICAgIHt0aGlzLnJlbmRlckNvbG9ycyh7XG4gICAgICAgICAgICAuLi50aGlzLnByb3BzLmNoYXJ0Q29uZmlnLFxuICAgICAgICAgICAgZmxhdENvbG9yOiBmbGF0Q29sb3IsXG4gICAgICAgICAgICBkYXRhOiB0aGlzLnByb3BzLmRhdGEuZGF0YXNldHNcbiAgICAgICAgICB9KX1cbiAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgICAgcng9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIHJ5PXtib3JkZXJSYWRpdXN9XG4gICAgICAgICAgICBmaWxsPVwidXJsKCNiYWNrZ3JvdW5kR3JhZGllbnQpXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxHPlxuICAgICAgICAgICAge3dpdGhJbm5lckxpbmVzXG4gICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJIb3Jpem9udGFsTGluZXMoe1xuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgY291bnQ6IHNlZ21lbnRzLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIDogbnVsbH1cbiAgICAgICAgICA8L0c+XG4gICAgICAgICAgPEc+XG4gICAgICAgICAgICB7d2l0aEhvcml6b250YWxMYWJlbHNcbiAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlckhvcml6b250YWxMYWJlbHMoe1xuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgY291bnQ6IHNlZ21lbnRzLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0c1swXS5kYXRhLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICA6IG51bGx9XG4gICAgICAgICAgPC9HPlxuICAgICAgICAgIDxHPlxuICAgICAgICAgICAge3dpdGhWZXJ0aWNhbExhYmVsc1xuICAgICAgICAgICAgICA/IHRoaXMucmVuZGVyVmVydGljYWxMYWJlbHMoe1xuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiBkYXRhLmxhYmVscyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbE9mZnNldDogYmFyV2lkdGggKiB0aGlzLmdldEJhclBlcmNlbnRhZ2UoKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIDogbnVsbH1cbiAgICAgICAgICA8L0c+XG4gICAgICAgICAgPEc+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJCYXJzKHtcbiAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzWzBdLmRhdGEsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgIHdpdGhDdXN0b21CYXJDb2xvckZyb21EYXRhOiB3aXRoQ3VzdG9tQmFyQ29sb3JGcm9tRGF0YVxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9HPlxuICAgICAgICAgIDxHPlxuICAgICAgICAgICAge3Nob3dWYWx1ZXNPblRvcE9mQmFycyAmJlxuICAgICAgICAgICAgICB0aGlzLnJlbmRlclZhbHVlc09uVG9wT2ZCYXJzKHtcbiAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0c1swXS5kYXRhLFxuICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlclxuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L0c+XG4gICAgICAgICAgPEc+XG4gICAgICAgICAgICB7c2hvd0JhclRvcHMgJiZcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJCYXJUb3BzKHtcbiAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0c1swXS5kYXRhLFxuICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlclxuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L0c+XG4gICAgICAgIDwvU3ZnPlxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFyQ2hhcnQ7XG4iXX0=

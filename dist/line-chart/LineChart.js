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
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
import React from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from "react-native";
import {
  Circle,
  G,
  Path,
  Polygon,
  Polyline,
  Rect,
  Svg
} from "react-native-svg";
import AbstractChart from "../AbstractChart";
import { LegendItem } from "./LegendItem";
var AnimatedCircle = Animated.createAnimatedComponent(Circle);
var LineChart = /** @class */ (function(_super) {
  __extends(LineChart, _super);
  function LineChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.label = React.createRef();
    _this.state = {
      scrollableDotHorizontalOffset: new Animated.Value(0)
    };
    _this.getColor = function(dataset, opacity) {
      return (dataset.color || _this.props.chartConfig.color)(opacity);
    };
    _this.getStrokeWidth = function(dataset) {
      return dataset.strokeWidth || _this.props.chartConfig.strokeWidth || 3;
    };
    _this.getDatas = function(data) {
      return data.reduce(function(acc, item) {
        return item.data ? __spreadArrays(acc, item.data) : acc;
      }, []);
    };
    _this.getPropsForDots = function(x, i) {
      var _a = _this.props,
        getDotProps = _a.getDotProps,
        chartConfig = _a.chartConfig;
      if (typeof getDotProps === "function") {
        return getDotProps(x, i);
      }
      var _b = chartConfig.propsForDots,
        propsForDots = _b === void 0 ? {} : _b;
      return __assign({ r: "4" }, propsForDots);
    };
    _this.renderDots = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        onDataPointClick = _a.onDataPointClick;
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var _b = _this.props,
        getDotColor = _b.getDotColor,
        _c = _b.hidePointsAtIndex,
        hidePointsAtIndex = _c === void 0 ? [] : _c,
        _d = _b.renderDotContent,
        renderDotContent =
          _d === void 0
            ? function() {
                return null;
              }
            : _d;
      data.forEach(function(dataset) {
        if (dataset.withDots == false) return;
        dataset.data.forEach(function(x, i) {
          if (hidePointsAtIndex.includes(i)) {
            return;
          }
          if (dataset.ignoreValue == x) {
            return;
          }
          var cx =
            paddingRight + (i * (width - paddingRight)) / dataset.data.length;
          var cy =
            ((baseHeight - _this.calcHeight(x, datas, height)) / 4) * 3 +
            paddingTop;
          var onPress = function() {
            if (!onDataPointClick || hidePointsAtIndex.includes(i)) {
              return;
            }
            onDataPointClick({
              index: i,
              value: x,
              dataset: dataset,
              x: cx,
              y: cy,
              getColor: function(opacity) {
                return _this.getColor(dataset, opacity);
              }
            });
          };
          output.push(
            <Circle
              key={Math.random()}
              cx={cx}
              cy={cy}
              fill={
                typeof getDotColor === "function"
                  ? getDotColor(x, i)
                  : _this.getColor(dataset, 0.9)
              }
              onPress={onPress}
              {..._this.getPropsForDots(x, i)}
            />,
            <Circle
              key={Math.random()}
              cx={cx}
              cy={cy}
              r="14"
              fill="#fff"
              fillOpacity={0}
              onPress={onPress}
            />,
            renderDotContent({ x: cx, y: cy, index: i, indexData: x })
          );
        });
      });
      return output;
    };
    _this.renderScrollableDot = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        scrollableDotHorizontalOffset = _a.scrollableDotHorizontalOffset,
        scrollableDotFill = _a.scrollableDotFill,
        scrollableDotStrokeColor = _a.scrollableDotStrokeColor,
        scrollableDotStrokeWidth = _a.scrollableDotStrokeWidth,
        scrollableDotRadius = _a.scrollableDotRadius,
        scrollableInfoViewStyle = _a.scrollableInfoViewStyle,
        scrollableInfoTextStyle = _a.scrollableInfoTextStyle,
        _b = _a.scrollableInfoTextDecorator,
        scrollableInfoTextDecorator =
          _b === void 0
            ? function(x) {
                return "" + x;
              }
            : _b,
        scrollableInfoSize = _a.scrollableInfoSize,
        scrollableInfoOffset = _a.scrollableInfoOffset;
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var vl = [];
      var perData = width / data[0].data.length;
      for (var index = 0; index < data[0].data.length; index++) {
        vl.push(index * perData);
      }
      var lastIndex;
      scrollableDotHorizontalOffset.addListener(function(value) {
        var index = value.value / perData;
        if (!lastIndex) {
          lastIndex = index;
        }
        var abs = Math.floor(index);
        var percent = index - abs;
        abs = data[0].data.length - abs - 1;
        if (index >= data[0].data.length - 1) {
          _this.label.current.setNativeProps({
            text: scrollableInfoTextDecorator(Math.floor(data[0].data[0]))
          });
        } else {
          if (index > lastIndex) {
            // to right
            var base = data[0].data[abs];
            var prev = data[0].data[abs - 1];
            if (prev > base) {
              var rest = prev - base;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base + percent * rest)
                )
              });
            } else {
              var rest = base - prev;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base - percent * rest)
                )
              });
            }
          } else {
            // to left
            var base = data[0].data[abs - 1];
            var next = data[0].data[abs];
            percent = 1 - percent;
            if (next > base) {
              var rest = next - base;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base + percent * rest)
                )
              });
            } else {
              var rest = base - next;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base - percent * rest)
                )
              });
            }
          }
        }
        lastIndex = index;
      });
      data.forEach(function(dataset) {
        if (dataset.withScrollableDot == false) return;
        var perData = width / dataset.data.length;
        var values = [];
        var yValues = [];
        var xValues = [];
        var yValuesLabel = [];
        var xValuesLabel = [];
        for (var index = 0; index < dataset.data.length; index++) {
          values.push(index * perData);
          var yval =
            ((baseHeight -
              _this.calcHeight(
                dataset.data[dataset.data.length - index - 1],
                datas,
                height
              )) /
              4) *
              3 +
            paddingTop;
          yValues.push(yval);
          var xval =
            paddingRight +
            ((dataset.data.length - index - 1) * (width - paddingRight)) /
              dataset.data.length;
          xValues.push(xval);
          yValuesLabel.push(
            yval - (scrollableInfoSize.height + scrollableInfoOffset)
          );
          xValuesLabel.push(xval - scrollableInfoSize.width / 2);
        }
        var translateX = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: xValues,
          extrapolate: "clamp"
        });
        var translateY = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: yValues,
          extrapolate: "clamp"
        });
        var labelTranslateX = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: xValuesLabel,
          extrapolate: "clamp"
        });
        var labelTranslateY = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: yValuesLabel,
          extrapolate: "clamp"
        });
        output.push([
          <Animated.View
            key={Math.random()}
            style={[
              scrollableInfoViewStyle,
              {
                transform: [
                  { translateX: labelTranslateX },
                  { translateY: labelTranslateY }
                ],
                width: scrollableInfoSize.width,
                height: scrollableInfoSize.height
              }
            ]}
          >
            <TextInput
              onLayout={function() {
                _this.label.current.setNativeProps({
                  text: scrollableInfoTextDecorator(
                    Math.floor(data[0].data[data[0].data.length - 1])
                  )
                });
              }}
              style={scrollableInfoTextStyle}
              ref={_this.label}
            />
          </Animated.View>,
          <AnimatedCircle
            key={Math.random()}
            cx={translateX}
            cy={translateY}
            r={scrollableDotRadius}
            stroke={scrollableDotStrokeColor}
            strokeWidth={scrollableDotStrokeWidth}
            fill={scrollableDotFill}
          />
        ]);
      });
      return output;
    };
    _this.renderShadow = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        useColorFromDataset = _a.useColorFromDataset;
      if (_this.props.bezier) {
        return _this.renderBezierShadow({
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop,
          data: data,
          useColorFromDataset: useColorFromDataset
        });
      }
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      return data.map(function(dataset, index) {
        return (
          <Polygon
            key={index}
            points={
              dataset.data
                .map(function(d, i) {
                  var x =
                    paddingRight +
                    (i * (width - paddingRight)) / dataset.data.length;
                  var y =
                    ((baseHeight - _this.calcHeight(d, datas, height)) / 4) *
                      3 +
                    paddingTop;
                  return x + "," + y;
                })
                .join(" ") +
              (" " +
                (paddingRight +
                  ((width - paddingRight) / dataset.data.length) *
                    (dataset.data.length - 1)) +
                "," +
                ((height / 4) * 3 + paddingTop) +
                " " +
                paddingRight +
                "," +
                ((height / 4) * 3 + paddingTop))
            }
            fill={
              "url(#fillShadowGradient" +
              (useColorFromDataset ? "_" + index : "") +
              ")"
            }
            strokeWidth={0}
          />
        );
      });
    };
    _this.renderLine = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        linejoinType = _a.linejoinType;
      if (_this.props.bezier) {
        return _this.renderBezierLine({
          data: data,
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop
        });
      }
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var lastPoint;
      data.forEach(function(dataset, index) {
        var points = dataset.data.map(function(d, i) {
          if (d === null) return lastPoint;
          var x =
            (i * (width - paddingRight)) / dataset.data.length + paddingRight;
          var y =
            ((baseHeight - _this.calcHeight(d, datas, height)) / 4) * 3 +
            paddingTop;
          lastPoint = x + "," + y;
          return x + "," + y;
        });
        output.push(
          <Polyline
            key={index}
            strokeLinejoin={linejoinType}
            points={points.join(" ")}
            fill="none"
            stroke={_this.getColor(dataset, 0.2)}
            strokeWidth={_this.getStrokeWidth(dataset)}
            strokeDasharray={dataset.strokeDashArray}
            strokeDashoffset={dataset.strokeDashOffset}
          />
        );
      });
      return output;
    };
    _this.getBezierLinePoints = function(dataset, _a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data;
      if (dataset.data.length === 0) {
        return "M0,0";
      }
      var datas = _this.getDatas(data);
      var nexti = function(i) {
        //console.log("ignoreValue = " + dataset.ignoreValue);
        for (var j = i; j < dataset.data.length; j++) {
          if (dataset.ignoreValue != dataset.data[j]) {
            //console.log("ignoreValue = " + dataset.data[j]);
            return j;
          }
        }
        return i;
      };
      var x = function(i) {
        var j = nexti(i);
        return Math.floor(
          paddingRight + (j * (width - paddingRight)) / dataset.data.length
        );
      };
      var baseHeight = _this.calcBaseHeight(datas, height);
      var y = function(i) {
        var j = nexti(i);
        var yHeight = _this.calcHeight(dataset.data[j], datas, height);
        return Math.floor(((baseHeight - yHeight) / 4) * 3 + paddingTop);
      };
      return ["M" + x(0) + "," + y(0)]
        .concat(
          dataset.data.slice(0, -1).map(function(_, i) {
            var x_mid = (x(i) + x(i + 1)) / 2;
            var y_mid = (y(i) + y(i + 1)) / 2;
            var cp_x1 = (x_mid + x(i)) / 2;
            var cp_x2 = (x_mid + x(i + 1)) / 2;
            return (
              "Q " +
              cp_x1 +
              ", " +
              y(i) +
              ", " +
              x_mid +
              ", " +
              y_mid +
              (" Q " +
                cp_x2 +
                ", " +
                y(i + 1) +
                ", " +
                x(i + 1) +
                ", " +
                y(i + 1))
            );
          })
        )
        .join(" ");
    };
    _this.renderBezierLine = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop;
      return data.map(function(dataset, index) {
        var result = _this.getBezierLinePoints(dataset, {
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop,
          data: data
        });
        return (
          <Path
            key={index}
            d={result}
            fill="none"
            stroke={_this.getColor(dataset, 0.2)}
            strokeWidth={_this.getStrokeWidth(dataset)}
            strokeDasharray={dataset.strokeDashArray}
            strokeDashoffset={dataset.strokeDashOffset}
          />
        );
      });
    };
    _this.renderBezierShadow = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        useColorFromDataset = _a.useColorFromDataset;
      return data.map(function(dataset, index) {
        var d =
          _this.getBezierLinePoints(dataset, {
            width: width,
            height: height,
            paddingRight: paddingRight,
            paddingTop: paddingTop,
            data: data
          }) +
          (" L" +
            (paddingRight +
              ((width - paddingRight) / dataset.data.length) *
                (dataset.data.length - 1)) +
            "," +
            ((height / 4) * 3 + paddingTop) +
            " L" +
            paddingRight +
            "," +
            ((height / 4) * 3 + paddingTop) +
            " Z");
        return (
          <Path
            key={index}
            d={d}
            fill={
              "url(#fillShadowGradient" +
              (useColorFromDataset ? "_" + index : "") +
              ")"
            }
            strokeWidth={0}
          />
        );
      });
    };
    _this.renderLegend = function(width, legendOffset) {
      var _a = _this.props.data,
        legend = _a.legend,
        datasets = _a.datasets;
      var baseLegendItemX = width / (legend.length + 1);
      return legend.map(function(legendItem, i) {
        return (
          <G key={Math.random()}>
            <LegendItem
              index={i}
              iconColor={_this.getColor(datasets[i], 0.9)}
              baseLegendItemX={baseLegendItemX}
              legendText={legendItem}
              labelProps={__assign({}, _this.getPropsForLabels())}
              legendOffset={legendOffset}
            />
          </G>
        );
      });
    };
    return _this;
  }
  LineChart.prototype.render = function() {
    var _a = this.props,
      width = _a.width,
      height = _a.height,
      data = _a.data,
      _b = _a.withScrollableDot,
      withScrollableDot = _b === void 0 ? false : _b,
      _c = _a.withShadow,
      withShadow = _c === void 0 ? true : _c,
      _d = _a.withDots,
      withDots = _d === void 0 ? true : _d,
      _e = _a.withInnerLines,
      withInnerLines = _e === void 0 ? true : _e,
      _f = _a.withOuterLines,
      withOuterLines = _f === void 0 ? true : _f,
      _g = _a.withHorizontalLines,
      withHorizontalLines = _g === void 0 ? true : _g,
      _h = _a.withVerticalLines,
      withVerticalLines = _h === void 0 ? true : _h,
      _j = _a.withHorizontalLabels,
      withHorizontalLabels = _j === void 0 ? true : _j,
      _k = _a.withVerticalLabels,
      withVerticalLabels = _k === void 0 ? true : _k,
      _l = _a.style,
      style = _l === void 0 ? {} : _l,
      decorator = _a.decorator,
      onDataPointClick = _a.onDataPointClick,
      _m = _a.verticalLabelRotation,
      verticalLabelRotation = _m === void 0 ? 0 : _m,
      _o = _a.horizontalLabelRotation,
      horizontalLabelRotation = _o === void 0 ? 0 : _o,
      _p = _a.formatYLabel,
      formatYLabel =
        _p === void 0
          ? function(yLabel) {
              return yLabel;
            }
          : _p,
      _q = _a.formatXLabel,
      formatXLabel =
        _q === void 0
          ? function(xLabel) {
              return xLabel;
            }
          : _q,
      segments = _a.segments,
      _r = _a.transparent,
      transparent = _r === void 0 ? false : _r,
      chartConfig = _a.chartConfig;
    var scrollableDotHorizontalOffset = this.state
      .scrollableDotHorizontalOffset;
    var _s = data.labels,
      labels = _s === void 0 ? [] : _s;
    var _t = style.borderRadius,
      borderRadius = _t === void 0 ? 0 : _t,
      _u = style.paddingTop,
      paddingTop = _u === void 0 ? 16 : _u,
      _v = style.paddingRight,
      paddingRight = _v === void 0 ? 64 : _v,
      _w = style.margin,
      margin = _w === void 0 ? 0 : _w,
      _x = style.marginRight,
      marginRight = _x === void 0 ? 0 : _x,
      _y = style.paddingBottom,
      paddingBottom = _y === void 0 ? 0 : _y;
    var config = {
      width: width,
      height: height,
      verticalLabelRotation: verticalLabelRotation,
      horizontalLabelRotation: horizontalLabelRotation
    };
    var datas = this.getDatas(data.datasets);
    var count =
      Math.min.apply(Math, datas) === Math.max.apply(Math, datas) ? 1 : 4;
    if (segments) {
      count = segments;
    }
    var legendOffset = this.props.data.legend ? height * 0.15 : 0;
    return (
      <View style={style}>
        <Svg
          height={height + paddingBottom + legendOffset}
          width={width - margin * 2 - marginRight}
        >
          <Rect
            width="100%"
            height={height + legendOffset}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
            fillOpacity={transparent ? 0 : 1}
          />
          {this.props.data.legend &&
            this.renderLegend(config.width, legendOffset)}
          <G x="0" y={legendOffset}>
            {this.renderDefs(
              __assign(__assign(__assign({}, config), chartConfig), {
                data: data.datasets
              })
            )}
            <G>
              {withHorizontalLines &&
                (withInnerLines
                  ? this.renderHorizontalLines(
                      __assign(__assign({}, config), {
                        count: count,
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : withOuterLines
                  ? this.renderHorizontalLine(
                      __assign(__assign({}, config), {
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : null)}
            </G>
            <G>
              {withHorizontalLabels &&
                this.renderHorizontalLabels(
                  __assign(__assign({}, config), {
                    count: count,
                    data: datas,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    formatYLabel: formatYLabel,
                    decimalPlaces: chartConfig.decimalPlaces
                  })
                )}
            </G>
            <G>
              {withVerticalLines &&
                (withInnerLines
                  ? this.renderVerticalLines(
                      __assign(__assign({}, config), {
                        data: data.datasets[0].data,
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : withOuterLines
                  ? this.renderVerticalLine(
                      __assign(__assign({}, config), {
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : null)}
            </G>
            <G>
              {withVerticalLabels &&
                this.renderVerticalLabels(
                  __assign(__assign({}, config), {
                    labels: labels,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    formatXLabel: formatXLabel
                  })
                )}
            </G>
            <G>
              {this.renderLine(
                __assign(__assign(__assign({}, config), chartConfig), {
                  paddingRight: paddingRight,
                  paddingTop: paddingTop,
                  data: data.datasets
                })
              )}
            </G>
            <G>
              {withShadow &&
                this.renderShadow(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingRight: paddingRight,
                    paddingTop: paddingTop,
                    useColorFromDataset: chartConfig.useShadowColorFromDataset
                  })
                )}
            </G>
            <G>
              {withDots &&
                this.renderDots(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    onDataPointClick: onDataPointClick
                  })
                )}
            </G>
            <G>
              {withScrollableDot &&
                this.renderScrollableDot(
                  __assign(__assign(__assign({}, config), chartConfig), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    onDataPointClick: onDataPointClick,
                    scrollableDotHorizontalOffset: scrollableDotHorizontalOffset
                  })
                )}
            </G>
            <G>
              {decorator &&
                decorator(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight
                  })
                )}
            </G>
          </G>
        </Svg>
        {withScrollableDot && (
          <ScrollView
            style={StyleSheet.absoluteFill}
            contentContainerStyle={{ width: width * 2 }}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: { x: scrollableDotHorizontalOffset }
                }
              }
            ])}
            horizontal
            bounces={false}
          />
        )}
      </View>
    );
  };
  return LineChart;
})(AbstractChart);
export default LineChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGluZUNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpbmUtY2hhcnQvTGluZUNoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFvQixNQUFNLE9BQU8sQ0FBQztBQUN6QyxPQUFPLEVBQ0wsUUFBUSxFQUNSLFVBQVUsRUFDVixVQUFVLEVBQ1YsU0FBUyxFQUNULElBQUksRUFFTCxNQUFNLGNBQWMsQ0FBQztBQUN0QixPQUFPLEVBQ0wsTUFBTSxFQUNOLENBQUMsRUFDRCxJQUFJLEVBQ0osT0FBTyxFQUNQLFFBQVEsRUFDUixJQUFJLEVBQ0osR0FBRyxFQUNKLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxhQUdOLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUUxQyxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFvTTlEO0lBQXdCLDZCQUE2QztJQUFyRTtRQUFBLHFFQW94QkM7UUFueEJDLFdBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFhLENBQUM7UUFFckMsV0FBSyxHQUFHO1lBQ04sNkJBQTZCLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNyRCxDQUFDO1FBRUYsY0FBUSxHQUFHLFVBQUMsT0FBZ0IsRUFBRSxPQUFlO1lBQzNDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQztRQUVGLG9CQUFjLEdBQUcsVUFBQyxPQUFnQjtZQUNoQyxPQUFPLE9BQU8sQ0FBQyxXQUFXLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQztRQUN4RSxDQUFDLENBQUM7UUFFRixjQUFRLEdBQUcsVUFBQyxJQUFlO1lBQ3pCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FDaEIsVUFBQyxHQUFHLEVBQUUsSUFBSSxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQUssR0FBRyxFQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUExQyxDQUEwQyxFQUN6RCxFQUFFLENBQ0gsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUVGLHFCQUFlLEdBQUcsVUFBQyxDQUFNLEVBQUUsQ0FBUztZQUM1QixJQUFBLEtBQStCLEtBQUksQ0FBQyxLQUFLLEVBQXZDLFdBQVcsaUJBQUEsRUFBRSxXQUFXLGlCQUFlLENBQUM7WUFFaEQsSUFBSSxPQUFPLFdBQVcsS0FBSyxVQUFVLEVBQUU7Z0JBQ3JDLE9BQU8sV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUMxQjtZQUVPLElBQUEsS0FBc0IsV0FBVyxhQUFoQixFQUFqQixZQUFZLG1CQUFHLEVBQUUsS0FBQSxDQUFpQjtZQUUxQyxrQkFBUyxDQUFDLEVBQUUsR0FBRyxJQUFLLFlBQVksRUFBRztRQUNyQyxDQUFDLENBQUM7UUFFRixnQkFBVSxHQUFHLFVBQUMsRUFZYjtnQkFYQyxJQUFJLFVBQUEsRUFDSixLQUFLLFdBQUEsRUFDTCxNQUFNLFlBQUEsRUFDTixVQUFVLGdCQUFBLEVBQ1YsWUFBWSxrQkFBQSxFQUNaLGdCQUFnQixzQkFBQTtZQU9oQixJQUFNLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO1lBQy9CLElBQU0sS0FBSyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsSUFBTSxVQUFVLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFaEQsSUFBQSxLQU1GLEtBQUksQ0FBQyxLQUFLLEVBTFosV0FBVyxpQkFBQSxFQUNYLHlCQUFzQixFQUF0QixpQkFBaUIsbUJBQUcsRUFBRSxLQUFBLEVBQ3RCLHdCQUVDLEVBRkQsZ0JBQWdCLG1CQUFHO2dCQUNqQixPQUFPLElBQUksQ0FBQztZQUNkLENBQUMsS0FDVyxDQUFDO1lBRWYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87Z0JBQ2xCLElBQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxLQUFLO29CQUFFLE9BQU87Z0JBRXRDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ3hCLElBQUksaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUNqQyxPQUFPO3FCQUNSO29CQUVELElBQUksT0FBTyxDQUFDLFdBQVcsSUFBSSxDQUFDLEVBQUU7d0JBQzVCLE9BQU87cUJBQ1I7b0JBRUQsSUFBTSxFQUFFLEdBQ04sWUFBWSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7b0JBRXBFLElBQU0sRUFBRSxHQUNOLENBQUMsQ0FBQyxVQUFVLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQzt3QkFDMUQsVUFBVSxDQUFDO29CQUViLElBQU0sT0FBTyxHQUFHO3dCQUNkLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7NEJBQ3RELE9BQU87eUJBQ1I7d0JBRUQsZ0JBQWdCLENBQUM7NEJBQ2YsS0FBSyxFQUFFLENBQUM7NEJBQ1IsS0FBSyxFQUFFLENBQUM7NEJBQ1IsT0FBTyxTQUFBOzRCQUNQLENBQUMsRUFBRSxFQUFFOzRCQUNMLENBQUMsRUFBRSxFQUFFOzRCQUNMLFFBQVEsRUFBRSxVQUFBLE9BQU8sSUFBSSxPQUFBLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUEvQixDQUErQjt5QkFDckQsQ0FBQyxDQUFDO29CQUNMLENBQUMsQ0FBQztvQkFFRixNQUFNLENBQUMsSUFBSSxDQUNULENBQUMsTUFBTSxDQUNMLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUNuQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDUCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDUCxJQUFJLENBQUMsQ0FDSCxPQUFPLFdBQVcsS0FBSyxVQUFVO3dCQUMvQixDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ25CLENBQUMsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FDaEMsQ0FDRCxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDakIsSUFBSSxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUMvQixFQUNGLENBQUMsTUFBTSxDQUNMLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUNuQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDUCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDUCxDQUFDLENBQUMsSUFBSSxDQUNOLElBQUksQ0FBQyxNQUFNLENBQ1gsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ2YsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQ2pCLEVBQ0YsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FDM0QsQ0FBQztnQkFDSixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQyxDQUFDO1FBRUYseUJBQW1CLEdBQUcsVUFBQyxFQW1CdEI7Z0JBbEJDLElBQUksVUFBQSxFQUNKLEtBQUssV0FBQSxFQUNMLE1BQU0sWUFBQSxFQUNOLFVBQVUsZ0JBQUEsRUFDVixZQUFZLGtCQUFBLEVBQ1osNkJBQTZCLG1DQUFBLEVBQzdCLGlCQUFpQix1QkFBQSxFQUNqQix3QkFBd0IsOEJBQUEsRUFDeEIsd0JBQXdCLDhCQUFBLEVBQ3hCLG1CQUFtQix5QkFBQSxFQUNuQix1QkFBdUIsNkJBQUEsRUFDdkIsdUJBQXVCLDZCQUFBLEVBQ3ZCLG1DQUF5QyxFQUF6QywyQkFBMkIsbUJBQUcsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFHLENBQUcsRUFBTixDQUFNLEtBQUEsRUFDekMsa0JBQWtCLHdCQUFBLEVBQ2xCLG9CQUFvQiwwQkFBQTtZQUtwQixJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDbEIsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxJQUFNLFVBQVUsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztZQUV0RCxJQUFJLEVBQUUsR0FBYSxFQUFFLENBQUM7WUFFdEIsSUFBTSxPQUFPLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzVDLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDeEQsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUM7YUFDMUI7WUFDRCxJQUFJLFNBQWlCLENBQUM7WUFFdEIsNkJBQTZCLENBQUMsV0FBVyxDQUFDLFVBQUEsS0FBSztnQkFDN0MsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2QsU0FBUyxHQUFHLEtBQUssQ0FBQztpQkFDbkI7Z0JBRUQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxPQUFPLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztnQkFDMUIsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBRXBDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDcEMsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO3dCQUNoQyxJQUFJLEVBQUUsMkJBQTJCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQy9ELENBQUMsQ0FBQztpQkFDSjtxQkFBTTtvQkFDTCxJQUFJLEtBQUssR0FBRyxTQUFTLEVBQUU7d0JBQ3JCLFdBQVc7d0JBRVgsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDL0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ25DLElBQUksSUFBSSxHQUFHLElBQUksRUFBRTs0QkFDZixJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDOzRCQUN2QixLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7Z0NBQ2hDLElBQUksRUFBRSwyQkFBMkIsQ0FDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUNsQzs2QkFDRixDQUFDLENBQUM7eUJBQ0o7NkJBQU07NEJBQ0wsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQzs0QkFDdkIsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO2dDQUNoQyxJQUFJLEVBQUUsMkJBQTJCLENBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FDbEM7NkJBQ0YsQ0FBQyxDQUFDO3lCQUNKO3FCQUNGO3lCQUFNO3dCQUNMLFVBQVU7d0JBRVYsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ25DLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQy9CLE9BQU8sR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO3dCQUN0QixJQUFJLElBQUksR0FBRyxJQUFJLEVBQUU7NEJBQ2YsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQzs0QkFDdkIsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO2dDQUNoQyxJQUFJLEVBQUUsMkJBQTJCLENBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FDbEM7NkJBQ0YsQ0FBQyxDQUFDO3lCQUNKOzZCQUFNOzRCQUNMLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7NEJBQ3ZCLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztnQ0FDaEMsSUFBSSxFQUFFLDJCQUEyQixDQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQ2xDOzZCQUNGLENBQUMsQ0FBQzt5QkFDSjtxQkFDRjtpQkFDRjtnQkFDRCxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87Z0JBQ2xCLElBQUksT0FBTyxDQUFDLGlCQUFpQixJQUFJLEtBQUs7b0JBQUUsT0FBTztnQkFFL0MsSUFBTSxPQUFPLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUM1QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBQ2hCLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFDakIsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUVqQixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7Z0JBQ3RCLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztnQkFFdEIsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO29CQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQztvQkFDN0IsSUFBTSxJQUFJLEdBQ1IsQ0FBQyxDQUFDLFVBQVU7d0JBQ1YsS0FBSSxDQUFDLFVBQVUsQ0FDYixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsRUFDN0MsS0FBSyxFQUNMLE1BQU0sQ0FDUCxDQUFDO3dCQUNGLENBQUMsQ0FBQzt3QkFDRixDQUFDO3dCQUNILFVBQVUsQ0FBQztvQkFDYixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNuQixJQUFNLElBQUksR0FDUixZQUFZO3dCQUNaLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLENBQUM7NEJBQzFELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO29CQUN4QixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUVuQixZQUFZLENBQUMsSUFBSSxDQUNmLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxDQUMxRCxDQUFDO29CQUNGLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDeEQ7Z0JBRUQsSUFBTSxVQUFVLEdBQUcsNkJBQTZCLENBQUMsV0FBVyxDQUFDO29CQUMzRCxVQUFVLEVBQUUsTUFBTTtvQkFDbEIsV0FBVyxFQUFFLE9BQU87b0JBQ3BCLFdBQVcsRUFBRSxPQUFPO2lCQUNyQixDQUFDLENBQUM7Z0JBRUgsSUFBTSxVQUFVLEdBQUcsNkJBQTZCLENBQUMsV0FBVyxDQUFDO29CQUMzRCxVQUFVLEVBQUUsTUFBTTtvQkFDbEIsV0FBVyxFQUFFLE9BQU87b0JBQ3BCLFdBQVcsRUFBRSxPQUFPO2lCQUNyQixDQUFDLENBQUM7Z0JBRUgsSUFBTSxlQUFlLEdBQUcsNkJBQTZCLENBQUMsV0FBVyxDQUFDO29CQUNoRSxVQUFVLEVBQUUsTUFBTTtvQkFDbEIsV0FBVyxFQUFFLFlBQVk7b0JBQ3pCLFdBQVcsRUFBRSxPQUFPO2lCQUNyQixDQUFDLENBQUM7Z0JBRUgsSUFBTSxlQUFlLEdBQUcsNkJBQTZCLENBQUMsV0FBVyxDQUFDO29CQUNoRSxVQUFVLEVBQUUsTUFBTTtvQkFDbEIsV0FBVyxFQUFFLFlBQVk7b0JBQ3pCLFdBQVcsRUFBRSxPQUFPO2lCQUNyQixDQUFDLENBQUM7Z0JBRUgsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDVixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQ1osR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQ25CLEtBQUssQ0FBQyxDQUFDO3dCQUNMLHVCQUF1Qjt3QkFDdkI7NEJBQ0UsU0FBUyxFQUFFO2dDQUNULEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRTtnQ0FDL0IsRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFOzZCQUNoQzs0QkFDRCxLQUFLLEVBQUUsa0JBQWtCLENBQUMsS0FBSzs0QkFDL0IsTUFBTSxFQUFFLGtCQUFrQixDQUFDLE1BQU07eUJBQ2xDO3FCQUNGLENBQUMsQ0FFRjtVQUFBLENBQUMsU0FBUyxDQUNSLFFBQVEsQ0FBQyxDQUFDO3dCQUNSLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQzs0QkFDaEMsSUFBSSxFQUFFLDJCQUEyQixDQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FDbEQ7eUJBQ0YsQ0FBQyxDQUFDO29CQUNMLENBQUMsQ0FBQyxDQUNGLEtBQUssQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQy9CLEdBQUcsQ0FBQyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsRUFFcEI7UUFBQSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQ2hCLENBQUMsY0FBYyxDQUNiLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUNuQixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FDZixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FDZixDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUN2QixNQUFNLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUNqQyxXQUFXLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUN0QyxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUN4QjtpQkFDSCxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUMsQ0FBQztRQUVGLGtCQUFZLEdBQUcsVUFBQyxFQVlmO2dCQVhDLEtBQUssV0FBQSxFQUNMLE1BQU0sWUFBQSxFQUNOLFlBQVksa0JBQUEsRUFDWixVQUFVLGdCQUFBLEVBQ1YsSUFBSSxVQUFBLEVBQ0osbUJBQW1CLHlCQUFBO1lBT25CLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ3JCLE9BQU8sS0FBSSxDQUFDLGtCQUFrQixDQUFDO29CQUM3QixLQUFLLE9BQUE7b0JBQ0wsTUFBTSxRQUFBO29CQUNOLFlBQVksY0FBQTtvQkFDWixVQUFVLFlBQUE7b0JBQ1YsSUFBSSxNQUFBO29CQUNKLG1CQUFtQixxQkFBQTtpQkFDcEIsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxJQUFNLEtBQUssR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xDLElBQU0sVUFBVSxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRXRELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE9BQU8sRUFBRSxLQUFLO2dCQUM3QixPQUFPLENBQ0wsQ0FBQyxPQUFPLENBQ04sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ1gsTUFBTSxDQUFDLENBQ0wsT0FBTyxDQUFDLElBQUk7cUJBQ1QsR0FBRyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ1IsSUFBTSxDQUFDLEdBQ0wsWUFBWTt3QkFDWixDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO29CQUVyRCxJQUFNLENBQUMsR0FDTCxDQUFDLENBQUMsVUFBVSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7d0JBQzFELFVBQVUsQ0FBQztvQkFFYixPQUFVLENBQUMsU0FBSSxDQUFHLENBQUM7Z0JBQ3JCLENBQUMsQ0FBQztxQkFDRCxJQUFJLENBQUMsR0FBRyxDQUFDO3FCQUNaLE9BQUksWUFBWTt3QkFDZCxDQUFDLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOzRCQUM1QyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxXQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7d0JBQy9DLFVBQVUsVUFBSSxZQUFZLFVBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBRSxDQUFBLENBQ2hFLENBQ0QsSUFBSSxDQUFDLENBQUMsNkJBQ0osbUJBQW1CLENBQUMsQ0FBQyxDQUFDLE1BQUksS0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQ3JDLENBQUMsQ0FDSixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDZixDQUNILENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLGdCQUFVLEdBQUcsVUFBQyxFQVViO2dCQVRDLEtBQUssV0FBQSxFQUNMLE1BQU0sWUFBQSxFQUNOLFlBQVksa0JBQUEsRUFDWixVQUFVLGdCQUFBLEVBQ1YsSUFBSSxVQUFBLEVBQ0osWUFBWSxrQkFBQTtZQUtaLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ3JCLE9BQU8sS0FBSSxDQUFDLGdCQUFnQixDQUFDO29CQUMzQixJQUFJLE1BQUE7b0JBQ0osS0FBSyxPQUFBO29CQUNMLE1BQU0sUUFBQTtvQkFDTixZQUFZLGNBQUE7b0JBQ1osVUFBVSxZQUFBO2lCQUNYLENBQUMsQ0FBQzthQUNKO1lBRUQsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLElBQU0sS0FBSyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsSUFBTSxVQUFVLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFdEQsSUFBSSxTQUFpQixDQUFDO1lBRXRCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsS0FBSztnQkFDMUIsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLEtBQUssSUFBSTt3QkFBRSxPQUFPLFNBQVMsQ0FBQztvQkFDakMsSUFBTSxDQUFDLEdBQ0wsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7b0JBQ3BFLElBQU0sQ0FBQyxHQUNMLENBQUMsQ0FBQyxVQUFVLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQzt3QkFDMUQsVUFBVSxDQUFDO29CQUNiLFNBQVMsR0FBTSxDQUFDLFNBQUksQ0FBRyxDQUFDO29CQUN4QixPQUFVLENBQUMsU0FBSSxDQUFHLENBQUM7Z0JBQ3JCLENBQUMsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxJQUFJLENBQ1QsQ0FBQyxRQUFRLENBQ1AsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ1gsY0FBYyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQzdCLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FDekIsSUFBSSxDQUFDLE1BQU0sQ0FDWCxNQUFNLENBQUMsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUNwQyxXQUFXLENBQUMsQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQzFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FDekMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsRUFDM0MsQ0FDSCxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLENBQUM7UUFFRix5QkFBbUIsR0FBRyxVQUNwQixPQUFnQixFQUNoQixFQVNDO2dCQVJDLEtBQUssV0FBQSxFQUNMLE1BQU0sWUFBQSxFQUNOLFlBQVksa0JBQUEsRUFDWixVQUFVLGdCQUFBLEVBQ1YsSUFBSSxVQUFBO1lBTU4sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQzdCLE9BQU8sTUFBTSxDQUFDO2FBQ2Y7WUFFRCxJQUFNLEtBQUssR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWxDLElBQU0sS0FBSyxHQUFHLFVBQUMsQ0FBUztnQkFDdEIsc0RBQXNEO2dCQUN0RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzVDLElBQUksT0FBTyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUMxQyxrREFBa0Q7d0JBQ2xELE9BQU8sQ0FBQyxDQUFDO3FCQUNWO2lCQUNGO2dCQUNELE9BQU8sQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDO1lBRUYsSUFBTSxDQUFDLEdBQUcsVUFBQyxDQUFTO2dCQUNsQixJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FDZixZQUFZLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDbEUsQ0FBQztZQUNKLENBQUMsQ0FBQztZQUVGLElBQU0sVUFBVSxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRXRELElBQU0sQ0FBQyxHQUFHLFVBQUMsQ0FBUztnQkFDbEIsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFNLE9BQU8sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUVoRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFDbkUsQ0FBQyxDQUFDO1lBRUYsT0FBTyxDQUFDLE1BQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFJLENBQUMsQ0FBQyxDQUFDLENBQUcsQ0FBQztpQkFDeEIsTUFBTSxDQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNqQyxJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxJQUFNLEtBQUssR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pDLElBQU0sS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JDLE9BQU8sQ0FDTCxPQUFLLEtBQUssVUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQUssS0FBSyxVQUFLLEtBQU87cUJBQ3pDLFFBQU0sS0FBSyxVQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRyxDQUFBLENBQ3JELENBQUM7WUFDSixDQUFDLENBQUMsQ0FDSDtpQkFDQSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDZixDQUFDLENBQUM7UUFFRixzQkFBZ0IsR0FBRyxVQUFDLEVBU25CO2dCQVJDLElBQUksVUFBQSxFQUNKLEtBQUssV0FBQSxFQUNMLE1BQU0sWUFBQSxFQUNOLFlBQVksa0JBQUEsRUFDWixVQUFVLGdCQUFBO1lBS1YsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUs7Z0JBQzdCLElBQU0sTUFBTSxHQUFHLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUU7b0JBQy9DLEtBQUssT0FBQTtvQkFDTCxNQUFNLFFBQUE7b0JBQ04sWUFBWSxjQUFBO29CQUNaLFVBQVUsWUFBQTtvQkFDVixJQUFJLE1BQUE7aUJBQ0wsQ0FBQyxDQUFDO2dCQUVILE9BQU8sQ0FDTCxDQUFDLElBQUksQ0FDSCxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDWCxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FDVixJQUFJLENBQUMsTUFBTSxDQUNYLE1BQU0sQ0FBQyxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQ3BDLFdBQVcsQ0FBQyxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FDMUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUN6QyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUMzQyxDQUNILENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLHdCQUFrQixHQUFHLFVBQUMsRUFZckI7Z0JBWEMsS0FBSyxXQUFBLEVBQ0wsTUFBTSxZQUFBLEVBQ04sWUFBWSxrQkFBQSxFQUNaLFVBQVUsZ0JBQUEsRUFDVixJQUFJLFVBQUEsRUFDSixtQkFBbUIseUJBQUE7WUFPbkIsT0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUs7Z0JBQ3RCLElBQU0sQ0FBQyxHQUNMLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUU7b0JBQ2hDLEtBQUssT0FBQTtvQkFDTCxNQUFNLFFBQUE7b0JBQ04sWUFBWSxjQUFBO29CQUNaLFVBQVUsWUFBQTtvQkFDVixJQUFJLE1BQUE7aUJBQ0wsQ0FBQztxQkFDRixRQUFLLFlBQVk7d0JBQ2YsQ0FBQyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs0QkFDNUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsV0FBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUMvQyxVQUFVLFdBQUssWUFBWSxVQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLFFBQUksQ0FBQSxDQUFDO2dCQUVyRSxPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQ0gsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ1gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ0wsSUFBSSxDQUFDLENBQUMsNkJBQ0osbUJBQW1CLENBQUMsQ0FBQyxDQUFDLE1BQUksS0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQ3JDLENBQUMsQ0FDSixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDZixDQUNILENBQUM7WUFDSixDQUFDLENBQUM7UUF4QkYsQ0F3QkUsQ0FBQztRQUVMLGtCQUFZLEdBQUcsVUFBQyxLQUFLLEVBQUUsWUFBWTtZQUMzQixJQUFBLEtBQXVCLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFwQyxNQUFNLFlBQUEsRUFBRSxRQUFRLGNBQW9CLENBQUM7WUFDN0MsSUFBTSxlQUFlLEdBQUcsS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUVwRCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxVQUFVLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FDbkMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQ3BCO1FBQUEsQ0FBQyxVQUFVLENBQ1QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ1QsU0FBUyxDQUFDLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FDM0MsZUFBZSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQ2pDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUN2QixVQUFVLENBQUMsY0FBTSxLQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRyxDQUM1QyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFFL0I7TUFBQSxFQUFFLENBQUMsQ0FBQyxDQUNMLEVBWG9DLENBV3BDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQzs7SUE2TUosQ0FBQztJQTNNQywwQkFBTSxHQUFOO1FBQ1EsSUFBQSxLQXVCRixJQUFJLENBQUMsS0FBSyxFQXRCWixLQUFLLFdBQUEsRUFDTCxNQUFNLFlBQUEsRUFDTixJQUFJLFVBQUEsRUFDSix5QkFBeUIsRUFBekIsaUJBQWlCLG1CQUFHLEtBQUssS0FBQSxFQUN6QixrQkFBaUIsRUFBakIsVUFBVSxtQkFBRyxJQUFJLEtBQUEsRUFDakIsZ0JBQWUsRUFBZixRQUFRLG1CQUFHLElBQUksS0FBQSxFQUNmLHNCQUFxQixFQUFyQixjQUFjLG1CQUFHLElBQUksS0FBQSxFQUNyQixzQkFBcUIsRUFBckIsY0FBYyxtQkFBRyxJQUFJLEtBQUEsRUFDckIsMkJBQTBCLEVBQTFCLG1CQUFtQixtQkFBRyxJQUFJLEtBQUEsRUFDMUIseUJBQXdCLEVBQXhCLGlCQUFpQixtQkFBRyxJQUFJLEtBQUEsRUFDeEIsNEJBQTJCLEVBQTNCLG9CQUFvQixtQkFBRyxJQUFJLEtBQUEsRUFDM0IsMEJBQXlCLEVBQXpCLGtCQUFrQixtQkFBRyxJQUFJLEtBQUEsRUFDekIsYUFBVSxFQUFWLEtBQUssbUJBQUcsRUFBRSxLQUFBLEVBQ1YsU0FBUyxlQUFBLEVBQ1QsZ0JBQWdCLHNCQUFBLEVBQ2hCLDZCQUF5QixFQUF6QixxQkFBcUIsbUJBQUcsQ0FBQyxLQUFBLEVBQ3pCLCtCQUEyQixFQUEzQix1QkFBdUIsbUJBQUcsQ0FBQyxLQUFBLEVBQzNCLG9CQUErQixFQUEvQixZQUFZLG1CQUFHLFVBQUEsTUFBTSxJQUFJLE9BQUEsTUFBTSxFQUFOLENBQU0sS0FBQSxFQUMvQixvQkFBK0IsRUFBL0IsWUFBWSxtQkFBRyxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sRUFBTixDQUFNLEtBQUEsRUFDL0IsUUFBUSxjQUFBLEVBQ1IsbUJBQW1CLEVBQW5CLFdBQVcsbUJBQUcsS0FBSyxLQUFBLEVBQ25CLFdBQVcsaUJBQ0MsQ0FBQztRQUVQLElBQUEsNkJBQTZCLEdBQUssSUFBSSxDQUFDLEtBQUssOEJBQWYsQ0FBZ0I7UUFDN0MsSUFBQSxLQUFnQixJQUFJLE9BQVQsRUFBWCxNQUFNLG1CQUFHLEVBQUUsS0FBQSxDQUFVO1FBRTNCLElBQUEsS0FNRSxLQUFLLGFBTlMsRUFBaEIsWUFBWSxtQkFBRyxDQUFDLEtBQUEsRUFDaEIsS0FLRSxLQUFLLFdBTFEsRUFBZixVQUFVLG1CQUFHLEVBQUUsS0FBQSxFQUNmLEtBSUUsS0FBSyxhQUpVLEVBQWpCLFlBQVksbUJBQUcsRUFBRSxLQUFBLEVBQ2pCLEtBR0UsS0FBSyxPQUhHLEVBQVYsTUFBTSxtQkFBRyxDQUFDLEtBQUEsRUFDVixLQUVFLEtBQUssWUFGUSxFQUFmLFdBQVcsbUJBQUcsQ0FBQyxLQUFBLEVBQ2YsS0FDRSxLQUFLLGNBRFUsRUFBakIsYUFBYSxtQkFBRyxDQUFDLEtBQUEsQ0FDVDtRQUVWLElBQU0sTUFBTSxHQUFHO1lBQ2IsS0FBSyxPQUFBO1lBQ0wsTUFBTSxRQUFBO1lBQ04scUJBQXFCLHVCQUFBO1lBQ3JCLHVCQUF1Qix5QkFBQTtTQUN4QixDQUFDO1FBRUYsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFM0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLEVBQVEsS0FBSyxNQUFNLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxFQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RCxJQUFJLFFBQVEsRUFBRTtZQUNaLEtBQUssR0FBRyxRQUFRLENBQUM7U0FDbEI7UUFFRCxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVoRSxPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2pCO1FBQUEsQ0FBQyxHQUFHLENBQ0YsTUFBTSxDQUFDLENBQUMsTUFBTSxHQUFJLGFBQXdCLEdBQUcsWUFBWSxDQUFDLENBQzFELEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBSSxNQUFpQixHQUFHLENBQUMsR0FBSSxXQUFzQixDQUFDLENBRWhFO1VBQUEsQ0FBQyxJQUFJLENBQ0gsS0FBSyxDQUFDLE1BQU0sQ0FDWixNQUFNLENBQUMsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQzlCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUNqQixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDakIsSUFBSSxDQUFDLDBCQUEwQixDQUMvQixXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBRW5DO1VBQUEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FDL0M7VUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUN2QjtZQUFBLENBQUMsSUFBSSxDQUFDLFVBQVUsZ0NBQ1gsTUFBTSxHQUNOLFdBQVcsS0FDZCxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsSUFDbkIsQ0FDRjtZQUFBLENBQUMsQ0FBQyxDQUNBO2NBQUEsQ0FBQyxtQkFBbUI7WUFDbEIsQ0FBQyxjQUFjO2dCQUNiLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLHVCQUNyQixNQUFNLEtBQ1QsS0FBSyxFQUFFLEtBQUssRUFDWixVQUFVLFlBQUE7b0JBQ1YsWUFBWSxjQUFBLElBQ1o7Z0JBQ0osQ0FBQyxDQUFDLGNBQWM7b0JBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLHVCQUNwQixNQUFNLEtBQ1QsVUFBVSxZQUFBO3dCQUNWLFlBQVksY0FBQSxJQUNaO29CQUNKLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDYjtZQUFBLEVBQUUsQ0FBQyxDQUNIO1lBQUEsQ0FBQyxDQUFDLENBQ0E7Y0FBQSxDQUFDLG9CQUFvQjtZQUNuQixJQUFJLENBQUMsc0JBQXNCLHVCQUN0QixNQUFNLEtBQ1QsS0FBSyxFQUFFLEtBQUssRUFDWixJQUFJLEVBQUUsS0FBSyxFQUNYLFVBQVUsRUFBRSxVQUFvQixFQUNoQyxZQUFZLEVBQUUsWUFBc0IsRUFDcEMsWUFBWSxjQUFBLEVBQ1osYUFBYSxFQUFFLFdBQVcsQ0FBQyxhQUFhLElBQ3hDLENBQ047WUFBQSxFQUFFLENBQUMsQ0FDSDtZQUFBLENBQUMsQ0FBQyxDQUNBO2NBQUEsQ0FBQyxpQkFBaUI7WUFDaEIsQ0FBQyxjQUFjO2dCQUNiLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLHVCQUNuQixNQUFNLEtBQ1QsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUMzQixVQUFVLEVBQUUsVUFBb0IsRUFDaEMsWUFBWSxFQUFFLFlBQXNCLElBQ3BDO2dCQUNKLENBQUMsQ0FBQyxjQUFjO29CQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQix1QkFDbEIsTUFBTSxLQUNULFVBQVUsRUFBRSxVQUFvQixFQUNoQyxZQUFZLEVBQUUsWUFBc0IsSUFDcEM7b0JBQ0osQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUNiO1lBQUEsRUFBRSxDQUFDLENBQ0g7WUFBQSxDQUFDLENBQUMsQ0FDQTtjQUFBLENBQUMsa0JBQWtCO1lBQ2pCLElBQUksQ0FBQyxvQkFBb0IsdUJBQ3BCLE1BQU0sS0FDVCxNQUFNLFFBQUEsRUFDTixVQUFVLEVBQUUsVUFBb0IsRUFDaEMsWUFBWSxFQUFFLFlBQXNCLEVBQ3BDLFlBQVksY0FBQSxJQUNaLENBQ047WUFBQSxFQUFFLENBQUMsQ0FDSDtZQUFBLENBQUMsQ0FBQyxDQUNBO2NBQUEsQ0FBQyxJQUFJLENBQUMsVUFBVSxnQ0FDWCxNQUFNLEdBQ04sV0FBVyxLQUNkLFlBQVksRUFBRSxZQUFzQixFQUNwQyxVQUFVLEVBQUUsVUFBb0IsRUFDaEMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLElBQ25CLENBQ0o7WUFBQSxFQUFFLENBQUMsQ0FDSDtZQUFBLENBQUMsQ0FBQyxDQUNBO2NBQUEsQ0FBQyxVQUFVO1lBQ1QsSUFBSSxDQUFDLFlBQVksdUJBQ1osTUFBTSxLQUNULElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUNuQixZQUFZLEVBQUUsWUFBc0IsRUFDcEMsVUFBVSxFQUFFLFVBQW9CLEVBQ2hDLG1CQUFtQixFQUFFLFdBQVcsQ0FBQyx5QkFBeUIsSUFDMUQsQ0FDTjtZQUFBLEVBQUUsQ0FBQyxDQUNIO1lBQUEsQ0FBQyxDQUFDLENBQ0E7Y0FBQSxDQUFDLFFBQVE7WUFDUCxJQUFJLENBQUMsVUFBVSx1QkFDVixNQUFNLEtBQ1QsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQ25CLFVBQVUsRUFBRSxVQUFvQixFQUNoQyxZQUFZLEVBQUUsWUFBc0IsRUFDcEMsZ0JBQWdCLGtCQUFBLElBQ2hCLENBQ047WUFBQSxFQUFFLENBQUMsQ0FDSDtZQUFBLENBQUMsQ0FBQyxDQUNBO2NBQUEsQ0FBQyxpQkFBaUI7WUFDaEIsSUFBSSxDQUFDLG1CQUFtQixnQ0FDbkIsTUFBTSxHQUNOLFdBQVcsS0FDZCxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFDbkIsVUFBVSxFQUFFLFVBQW9CLEVBQ2hDLFlBQVksRUFBRSxZQUFzQixFQUNwQyxnQkFBZ0Isa0JBQUE7Z0JBQ2hCLDZCQUE2QiwrQkFBQSxJQUM3QixDQUNOO1lBQUEsRUFBRSxDQUFDLENBQ0g7WUFBQSxDQUFDLENBQUMsQ0FDQTtjQUFBLENBQUMsU0FBUztZQUNSLFNBQVMsdUJBQ0osTUFBTSxLQUNULElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUNuQixVQUFVLFlBQUE7Z0JBQ1YsWUFBWSxjQUFBLElBQ1osQ0FDTjtZQUFBLEVBQUUsQ0FBQyxDQUNMO1VBQUEsRUFBRSxDQUFDLENBQ0w7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsaUJBQWlCLElBQUksQ0FDcEIsQ0FBQyxVQUFVLENBQ1QsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUMvQixxQkFBcUIsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUM1Qyw4QkFBOEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUN0QyxtQkFBbUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUN4QixRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQ3ZCO2dCQUNFLFdBQVcsRUFBRTtvQkFDWCxhQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUUsNkJBQTZCLEVBQUU7aUJBQ3BEO2FBQ0Y7U0FDRixDQUFDLENBQUMsQ0FDSCxVQUFVLENBQ1YsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQ2YsQ0FDSCxDQUNIO01BQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXB4QkQsQ0FBd0IsYUFBYSxHQW94QnBDO0FBRUQsZUFBZSxTQUFTLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgUmVhY3ROb2RlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge1xuICBBbmltYXRlZCxcbiAgU2Nyb2xsVmlldyxcbiAgU3R5bGVTaGVldCxcbiAgVGV4dElucHV0LFxuICBWaWV3LFxuICBWaWV3U3R5bGVcbn0gZnJvbSBcInJlYWN0LW5hdGl2ZVwiO1xuaW1wb3J0IHtcbiAgQ2lyY2xlLFxuICBHLFxuICBQYXRoLFxuICBQb2x5Z29uLFxuICBQb2x5bGluZSxcbiAgUmVjdCxcbiAgU3ZnXG59IGZyb20gXCJyZWFjdC1uYXRpdmUtc3ZnXCI7XG5cbmltcG9ydCBBYnN0cmFjdENoYXJ0LCB7XG4gIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gIEFic3RyYWN0Q2hhcnRQcm9wc1xufSBmcm9tIFwiLi4vQWJzdHJhY3RDaGFydFwiO1xuaW1wb3J0IHsgQ2hhcnREYXRhLCBEYXRhc2V0IH0gZnJvbSBcIi4uL0hlbHBlclR5cGVzXCI7XG5pbXBvcnQgeyBMZWdlbmRJdGVtIH0gZnJvbSBcIi4vTGVnZW5kSXRlbVwiO1xuXG5sZXQgQW5pbWF0ZWRDaXJjbGUgPSBBbmltYXRlZC5jcmVhdGVBbmltYXRlZENvbXBvbmVudChDaXJjbGUpO1xuXG5leHBvcnQgaW50ZXJmYWNlIExpbmVDaGFydERhdGEgZXh0ZW5kcyBDaGFydERhdGEge1xuICBsZWdlbmQ/OiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaW5lQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIC8qKlxuICAgKiBEYXRhIGZvciB0aGUgY2hhcnQuXG4gICAqXG4gICAqIEV4YW1wbGUgZnJvbSBbZG9jc10oaHR0cHM6Ly9naXRodWIuY29tL2luZGllc3Bpcml0L3JlYWN0LW5hdGl2ZS1jaGFydC1raXQjbGluZS1jaGFydCk6XG4gICAqXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogY29uc3QgZGF0YSA9IHtcbiAgICogICBsYWJlbHM6IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZSddLFxuICAgKiAgIGRhdGFzZXRzOiBbe1xuICAgKiAgICAgZGF0YTogWyAyMCwgNDUsIDI4LCA4MCwgOTksIDQzIF0sXG4gICAqICAgICBjb2xvcjogKG9wYWNpdHkgPSAxKSA9PiBgcmdiYSgxMzQsIDY1LCAyNDQsICR7b3BhY2l0eX0pYCwgLy8gb3B0aW9uYWxcbiAgICogICAgIHN0cm9rZVdpZHRoOiAyIC8vIG9wdGlvbmFsXG4gICAqICAgfV0sXG4gICAqICAgbGVnZW5kOiBbXCJSYWlueSBEYXlzXCIsIFwiU3VubnkgRGF5c1wiLCBcIlNub3d5IERheXNcIl0gLy8gb3B0aW9uYWxcbiAgICogfVxuICAgKiBgYGBcbiAgICovXG4gIGRhdGE6IExpbmVDaGFydERhdGE7XG4gIC8qKlxuICAgKiBXaWR0aCBvZiB0aGUgY2hhcnQsIHVzZSAnRGltZW5zaW9ucycgbGlicmFyeSB0byBnZXQgdGhlIHdpZHRoIG9mIHlvdXIgc2NyZWVuIGZvciByZXNwb25zaXZlLlxuICAgKi9cbiAgd2lkdGg6IG51bWJlcjtcbiAgLyoqXG4gICAqIEhlaWdodCBvZiB0aGUgY2hhcnQuXG4gICAqL1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgLyoqXG4gICAqIFNob3cgZG90cyBvbiB0aGUgbGluZSAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoRG90cz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IHNoYWRvdyBmb3IgbGluZSAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoU2hhZG93PzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNob3cgaW5uZXIgZGFzaGVkIGxpbmVzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG5cbiAgd2l0aFNjcm9sbGFibGVEb3Q/OiBib29sZWFuO1xuICB3aXRoSW5uZXJMaW5lcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IG91dGVyIGRhc2hlZCBsaW5lcyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoT3V0ZXJMaW5lcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IHZlcnRpY2FsIGxpbmVzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG4gIHdpdGhWZXJ0aWNhbExpbmVzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNob3cgaG9yaXpvbnRhbCBsaW5lcyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoSG9yaXpvbnRhbExpbmVzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNob3cgdmVydGljYWwgbGFiZWxzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG4gIHdpdGhWZXJ0aWNhbExhYmVscz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IGhvcml6b250YWwgbGFiZWxzIC0gZGVmYXVsdDogVHJ1ZS5cbiAgICovXG4gIHdpdGhIb3Jpem9udGFsTGFiZWxzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFJlbmRlciBjaGFydHMgZnJvbSAwIG5vdCBmcm9tIHRoZSBtaW5pbXVtIHZhbHVlLiAtIGRlZmF1bHQ6IEZhbHNlLlxuICAgKi9cbiAgZnJvbVplcm8/OiBib29sZWFuO1xuICAvKipcbiAgICogUHJlcGVuZCB0ZXh0IHRvIGhvcml6b250YWwgbGFiZWxzIC0tIGRlZmF1bHQ6ICcnLlxuICAgKi9cbiAgeUF4aXNMYWJlbD86IHN0cmluZztcbiAgLyoqXG4gICAqIEFwcGVuZCB0ZXh0IHRvIGhvcml6b250YWwgbGFiZWxzIC0tIGRlZmF1bHQ6ICcnLlxuICAgKi9cbiAgeUF4aXNTdWZmaXg/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBQcmVwZW5kIHRleHQgdG8gdmVydGljYWwgbGFiZWxzIC0tIGRlZmF1bHQ6ICcnLlxuICAgKi9cbiAgeEF4aXNMYWJlbD86IHN0cmluZztcbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciB0aGUgY2hhcnQsIHNlZSBleGFtcGxlOlxuICAgKlxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IGNoYXJ0Q29uZmlnID0ge1xuICAgKiAgIGJhY2tncm91bmRHcmFkaWVudEZyb206IFwiIzFFMjkyM1wiLFxuICAgKiAgIGJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5OiAwLFxuICAgKiAgIGJhY2tncm91bmRHcmFkaWVudFRvOiBcIiMwODEzMERcIixcbiAgICogICBiYWNrZ3JvdW5kR3JhZGllbnRUb09wYWNpdHk6IDAuNSxcbiAgICogICBjb2xvcjogKG9wYWNpdHkgPSAxKSA9PiBgcmdiYSgyNiwgMjU1LCAxNDYsICR7b3BhY2l0eX0pYCxcbiAgICogICBsYWJlbENvbG9yOiAob3BhY2l0eSA9IDEpID0+IGByZ2JhKDI2LCAyNTUsIDE0NiwgJHtvcGFjaXR5fSlgLFxuICAgKiAgIHN0cm9rZVdpZHRoOiAyLCAvLyBvcHRpb25hbCwgZGVmYXVsdCAzXG4gICAqICAgYmFyUGVyY2VudGFnZTogMC41XG4gICAqIH07XG4gICAqIGBgYFxuICAgKi9cbiAgY2hhcnRDb25maWc/OiBBYnN0cmFjdENoYXJ0Q29uZmlnO1xuXG4gIC8qKlxuICAgKiBEaXZpZGUgYXhpcyBxdWFudGl0eSBieSB0aGUgaW5wdXQgbnVtYmVyIC0tIGRlZmF1bHQ6IDEuXG4gICAqL1xuICB5QXhpc0ludGVydmFsPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIGNoYXJ0IGlzIHRyYW5zcGFyZW50XG4gICAqL1xuICB0cmFuc3BhcmVudD86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgW3dob2xlIGJ1bmNoXShodHRwczovL2dpdGh1Yi5jb20vaW5kaWVzcGlyaXQvcmVhY3QtbmF0aXZlLWNoYXJ0LWtpdC9ibG9iL21hc3Rlci9zcmMvbGluZS1jaGFydC5qcyNMMjY2KVxuICAgKiBvZiBzdHVmZiBhbmQgY2FuIHJlbmRlciBleHRyYSBlbGVtZW50cyxcbiAgICogc3VjaCBhcyBkYXRhIHBvaW50IGluZm8gb3IgYWRkaXRpb25hbCBtYXJrdXAuXG4gICAqL1xuICBkZWNvcmF0b3I/OiBGdW5jdGlvbjtcbiAgLyoqXG4gICAqIENhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIHdoZW4gYSBkYXRhIHBvaW50IGlzIGNsaWNrZWQuXG4gICAqL1xuICBvbkRhdGFQb2ludENsaWNrPzogKGRhdGE6IHtcbiAgICBpbmRleDogbnVtYmVyO1xuICAgIHZhbHVlOiBudW1iZXI7XG4gICAgZGF0YXNldDogRGF0YXNldDtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGdldENvbG9yOiAob3BhY2l0eTogbnVtYmVyKSA9PiBzdHJpbmc7XG4gIH0pID0+IHZvaWQ7XG4gIC8qKlxuICAgKiBTdHlsZSBvZiB0aGUgY29udGFpbmVyIHZpZXcgb2YgdGhlIGNoYXJ0LlxuICAgKi9cbiAgc3R5bGU/OiBQYXJ0aWFsPFZpZXdTdHlsZT47XG4gIC8qKlxuICAgKiBBZGQgdGhpcyBwcm9wIHRvIG1ha2UgdGhlIGxpbmUgY2hhcnQgc21vb3RoIGFuZCBjdXJ2eS5cbiAgICpcbiAgICogW0V4YW1wbGVdKGh0dHBzOi8vZ2l0aHViLmNvbS9pbmRpZXNwaXJpdC9yZWFjdC1uYXRpdmUtY2hhcnQta2l0I2Jlemllci1saW5lLWNoYXJ0KVxuICAgKi9cbiAgYmV6aWVyPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIERlZmluZXMgdGhlIGRvdCBjb2xvciBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gY2FsY3VsYXRlIGNvbG9ycyBvZiBkb3RzIGluIGEgbGluZSBjaGFydC5cbiAgICogVGFrZXMgYChkYXRhUG9pbnQsIGRhdGFQb2ludEluZGV4KWAgYXMgYXJndW1lbnRzLlxuICAgKi9cbiAgZ2V0RG90Q29sb3I/OiAoZGF0YVBvaW50OiBhbnksIGluZGV4OiBudW1iZXIpID0+IHN0cmluZztcbiAgLyoqXG4gICAqIFJlbmRlcnMgYWRkaXRpb25hbCBjb250ZW50IGZvciBkb3RzIGluIGEgbGluZSBjaGFydC5cbiAgICogVGFrZXMgYCh7eCwgeSwgaW5kZXh9KWAgYXMgYXJndW1lbnRzLlxuICAgKi9cbiAgcmVuZGVyRG90Q29udGVudD86IChwYXJhbXM6IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGluZGV4OiBudW1iZXI7XG4gICAgaW5kZXhEYXRhOiBudW1iZXI7XG4gIH0pID0+IFJlYWN0LlJlYWN0Tm9kZTtcbiAgLyoqXG4gICAqIFJvdGF0aW9uIGFuZ2xlIG9mIHRoZSBob3Jpem9udGFsIGxhYmVscyAtIGRlZmF1bHQgMCAoZGVncmVlcykuXG4gICAqL1xuICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbj86IG51bWJlcjtcbiAgLyoqXG4gICAqIFJvdGF0aW9uIGFuZ2xlIG9mIHRoZSB2ZXJ0aWNhbCBsYWJlbHMgLSBkZWZhdWx0IDAgKGRlZ3JlZXMpLlxuICAgKi9cbiAgdmVydGljYWxMYWJlbFJvdGF0aW9uPzogbnVtYmVyO1xuICAvKipcbiAgICogT2Zmc2V0IGZvciBZIGF4aXMgbGFiZWxzLlxuICAgKi9cbiAgeUxhYmVsc09mZnNldD86IG51bWJlcjtcbiAgLyoqXG4gICAqIE9mZnNldCBmb3IgWCBheGlzIGxhYmVscy5cbiAgICovXG4gIHhMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBBcnJheSBvZiBpbmRpY2VzIG9mIHRoZSBkYXRhIHBvaW50cyB5b3UgZG9uJ3Qgd2FudCB0byBkaXNwbGF5LlxuICAgKi9cbiAgaGlkZVBvaW50c0F0SW5kZXg/OiBudW1iZXJbXTtcbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gY2hhbmdlIHRoZSBmb3JtYXQgb2YgdGhlIGRpc3BsYXkgdmFsdWUgb2YgdGhlIFkgbGFiZWwuXG4gICAqIFRha2VzIHRoZSB5IHZhbHVlIGFzIGFyZ3VtZW50IGFuZCBzaG91bGQgcmV0dXJuIHRoZSBkZXNpcmFibGUgc3RyaW5nLlxuICAgKi9cbiAgZm9ybWF0WUxhYmVsPzogKHlWYWx1ZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGNoYW5nZSB0aGUgZm9ybWF0IG9mIHRoZSBkaXNwbGF5IHZhbHVlIG9mIHRoZSBYIGxhYmVsLlxuICAgKiBUYWtlcyB0aGUgWCB2YWx1ZSBhcyBhcmd1bWVudCBhbmQgc2hvdWxkIHJldHVybiB0aGUgZGVzaXJhYmxlIHN0cmluZy5cbiAgICovXG4gIGZvcm1hdFhMYWJlbD86ICh4VmFsdWU6IHN0cmluZykgPT4gc3RyaW5nO1xuICAvKipcbiAgICogUHJvdmlkZSBwcm9wcyBmb3IgYSBkYXRhIHBvaW50IGRvdC5cbiAgICovXG4gIGdldERvdFByb3BzPzogKGRhdGFQb2ludDogYW55LCBpbmRleDogbnVtYmVyKSA9PiBvYmplY3Q7XG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGhvcml6b250YWwgbGluZXNcbiAgICovXG4gIHNlZ21lbnRzPzogbnVtYmVyO1xufVxuXG50eXBlIExpbmVDaGFydFN0YXRlID0ge1xuICBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldDogQW5pbWF0ZWQuVmFsdWU7XG59O1xuXG5jbGFzcyBMaW5lQ2hhcnQgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0PExpbmVDaGFydFByb3BzLCBMaW5lQ2hhcnRTdGF0ZT4ge1xuICBsYWJlbCA9IFJlYWN0LmNyZWF0ZVJlZjxUZXh0SW5wdXQ+KCk7XG5cbiAgc3RhdGUgPSB7XG4gICAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQ6IG5ldyBBbmltYXRlZC5WYWx1ZSgwKVxuICB9O1xuXG4gIGdldENvbG9yID0gKGRhdGFzZXQ6IERhdGFzZXQsIG9wYWNpdHk6IG51bWJlcikgPT4ge1xuICAgIHJldHVybiAoZGF0YXNldC5jb2xvciB8fCB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLmNvbG9yKShvcGFjaXR5KTtcbiAgfTtcblxuICBnZXRTdHJva2VXaWR0aCA9IChkYXRhc2V0OiBEYXRhc2V0KSA9PiB7XG4gICAgcmV0dXJuIGRhdGFzZXQuc3Ryb2tlV2lkdGggfHwgdGhpcy5wcm9wcy5jaGFydENvbmZpZy5zdHJva2VXaWR0aCB8fCAzO1xuICB9O1xuXG4gIGdldERhdGFzID0gKGRhdGE6IERhdGFzZXRbXSk6IG51bWJlcltdID0+IHtcbiAgICByZXR1cm4gZGF0YS5yZWR1Y2UoXG4gICAgICAoYWNjLCBpdGVtKSA9PiAoaXRlbS5kYXRhID8gWy4uLmFjYywgLi4uaXRlbS5kYXRhXSA6IGFjYyksXG4gICAgICBbXVxuICAgICk7XG4gIH07XG5cbiAgZ2V0UHJvcHNGb3JEb3RzID0gKHg6IGFueSwgaTogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgeyBnZXREb3RQcm9wcywgY2hhcnRDb25maWcgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAodHlwZW9mIGdldERvdFByb3BzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHJldHVybiBnZXREb3RQcm9wcyh4LCBpKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHByb3BzRm9yRG90cyA9IHt9IH0gPSBjaGFydENvbmZpZztcblxuICAgIHJldHVybiB7IHI6IFwiNFwiLCAuLi5wcm9wc0ZvckRvdHMgfTtcbiAgfTtcblxuICByZW5kZXJEb3RzID0gKHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICBvbkRhdGFQb2ludENsaWNrXG4gIH06IFBpY2s8XG4gICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICBcImRhdGFcIiB8IFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcbiAgPiAmIHtcbiAgICBvbkRhdGFQb2ludENsaWNrOiBMaW5lQ2hhcnRQcm9wc1tcIm9uRGF0YVBvaW50Q2xpY2tcIl07XG4gIH0pID0+IHtcbiAgICBjb25zdCBvdXRwdXQ6IFJlYWN0Tm9kZVtdID0gW107XG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEpO1xuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xuXG4gICAgY29uc3Qge1xuICAgICAgZ2V0RG90Q29sb3IsXG4gICAgICBoaWRlUG9pbnRzQXRJbmRleCA9IFtdLFxuICAgICAgcmVuZGVyRG90Q29udGVudCA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBkYXRhLmZvckVhY2goZGF0YXNldCA9PiB7XG4gICAgICBpZiAoZGF0YXNldC53aXRoRG90cyA9PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICBkYXRhc2V0LmRhdGEuZm9yRWFjaCgoeCwgaSkgPT4ge1xuICAgICAgICBpZiAoaGlkZVBvaW50c0F0SW5kZXguaW5jbHVkZXMoaSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0YXNldC5pZ25vcmVWYWx1ZSA9PSB4KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3ggPVxuICAgICAgICAgIHBhZGRpbmdSaWdodCArIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhc2V0LmRhdGEubGVuZ3RoO1xuXG4gICAgICAgIGNvbnN0IGN5ID1cbiAgICAgICAgICAoKGJhc2VIZWlnaHQgLSB0aGlzLmNhbGNIZWlnaHQoeCwgZGF0YXMsIGhlaWdodCkpIC8gNCkgKiAzICtcbiAgICAgICAgICBwYWRkaW5nVG9wO1xuXG4gICAgICAgIGNvbnN0IG9uUHJlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKCFvbkRhdGFQb2ludENsaWNrIHx8IGhpZGVQb2ludHNBdEluZGV4LmluY2x1ZGVzKGkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb25EYXRhUG9pbnRDbGljayh7XG4gICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgIHZhbHVlOiB4LFxuICAgICAgICAgICAgZGF0YXNldCxcbiAgICAgICAgICAgIHg6IGN4LFxuICAgICAgICAgICAgeTogY3ksXG4gICAgICAgICAgICBnZXRDb2xvcjogb3BhY2l0eSA9PiB0aGlzLmdldENvbG9yKGRhdGFzZXQsIG9wYWNpdHkpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgb3V0cHV0LnB1c2goXG4gICAgICAgICAgPENpcmNsZVxuICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgICAgY3g9e2N4fVxuICAgICAgICAgICAgY3k9e2N5fVxuICAgICAgICAgICAgZmlsbD17XG4gICAgICAgICAgICAgIHR5cGVvZiBnZXREb3RDb2xvciA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICAgICAgPyBnZXREb3RDb2xvcih4LCBpKVxuICAgICAgICAgICAgICAgIDogdGhpcy5nZXRDb2xvcihkYXRhc2V0LCAwLjkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvblByZXNzPXtvblByZXNzfVxuICAgICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JEb3RzKHgsIGkpfVxuICAgICAgICAgIC8+LFxuICAgICAgICAgIDxDaXJjbGVcbiAgICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICAgIGN4PXtjeH1cbiAgICAgICAgICAgIGN5PXtjeX1cbiAgICAgICAgICAgIHI9XCIxNFwiXG4gICAgICAgICAgICBmaWxsPVwiI2ZmZlwiXG4gICAgICAgICAgICBmaWxsT3BhY2l0eT17MH1cbiAgICAgICAgICAgIG9uUHJlc3M9e29uUHJlc3N9XG4gICAgICAgICAgLz4sXG4gICAgICAgICAgcmVuZGVyRG90Q29udGVudCh7IHg6IGN4LCB5OiBjeSwgaW5kZXg6IGksIGluZGV4RGF0YTogeCB9KVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIHJlbmRlclNjcm9sbGFibGVEb3QgPSAoe1xuICAgIGRhdGEsXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LFxuICAgIHNjcm9sbGFibGVEb3RGaWxsLFxuICAgIHNjcm9sbGFibGVEb3RTdHJva2VDb2xvcixcbiAgICBzY3JvbGxhYmxlRG90U3Ryb2tlV2lkdGgsXG4gICAgc2Nyb2xsYWJsZURvdFJhZGl1cyxcbiAgICBzY3JvbGxhYmxlSW5mb1ZpZXdTdHlsZSxcbiAgICBzY3JvbGxhYmxlSW5mb1RleHRTdHlsZSxcbiAgICBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IgPSB4ID0+IGAke3h9YCxcbiAgICBzY3JvbGxhYmxlSW5mb1NpemUsXG4gICAgc2Nyb2xsYWJsZUluZm9PZmZzZXRcbiAgfTogQWJzdHJhY3RDaGFydENvbmZpZyAmIHtcbiAgICBvbkRhdGFQb2ludENsaWNrOiBMaW5lQ2hhcnRQcm9wc1tcIm9uRGF0YVBvaW50Q2xpY2tcIl07XG4gICAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQ6IEFuaW1hdGVkLlZhbHVlO1xuICB9KSA9PiB7XG4gICAgY29uc3Qgb3V0cHV0ID0gW107XG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEpO1xuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xuXG4gICAgbGV0IHZsOiBudW1iZXJbXSA9IFtdO1xuXG4gICAgY29uc3QgcGVyRGF0YSA9IHdpZHRoIC8gZGF0YVswXS5kYXRhLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZGF0YVswXS5kYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmwucHVzaChpbmRleCAqIHBlckRhdGEpO1xuICAgIH1cbiAgICBsZXQgbGFzdEluZGV4OiBudW1iZXI7XG5cbiAgICBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldC5hZGRMaXN0ZW5lcih2YWx1ZSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHZhbHVlLnZhbHVlIC8gcGVyRGF0YTtcbiAgICAgIGlmICghbGFzdEluZGV4KSB7XG4gICAgICAgIGxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgfVxuXG4gICAgICBsZXQgYWJzID0gTWF0aC5mbG9vcihpbmRleCk7XG4gICAgICBsZXQgcGVyY2VudCA9IGluZGV4IC0gYWJzO1xuICAgICAgYWJzID0gZGF0YVswXS5kYXRhLmxlbmd0aCAtIGFicyAtIDE7XG5cbiAgICAgIGlmIChpbmRleCA+PSBkYXRhWzBdLmRhdGEubGVuZ3RoIC0gMSkge1xuICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xuICAgICAgICAgIHRleHQ6IHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvcihNYXRoLmZsb29yKGRhdGFbMF0uZGF0YVswXSkpXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGluZGV4ID4gbGFzdEluZGV4KSB7XG4gICAgICAgICAgLy8gdG8gcmlnaHRcblxuICAgICAgICAgIGNvbnN0IGJhc2UgPSBkYXRhWzBdLmRhdGFbYWJzXTtcbiAgICAgICAgICBjb25zdCBwcmV2ID0gZGF0YVswXS5kYXRhW2FicyAtIDFdO1xuICAgICAgICAgIGlmIChwcmV2ID4gYmFzZSkge1xuICAgICAgICAgICAgbGV0IHJlc3QgPSBwcmV2IC0gYmFzZTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XG4gICAgICAgICAgICAgIHRleHQ6IHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvcihcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGJhc2UgKyBwZXJjZW50ICogcmVzdClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCByZXN0ID0gYmFzZSAtIHByZXY7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xuICAgICAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihiYXNlIC0gcGVyY2VudCAqIHJlc3QpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyB0byBsZWZ0XG5cbiAgICAgICAgICBjb25zdCBiYXNlID0gZGF0YVswXS5kYXRhW2FicyAtIDFdO1xuICAgICAgICAgIGNvbnN0IG5leHQgPSBkYXRhWzBdLmRhdGFbYWJzXTtcbiAgICAgICAgICBwZXJjZW50ID0gMSAtIHBlcmNlbnQ7XG4gICAgICAgICAgaWYgKG5leHQgPiBiYXNlKSB7XG4gICAgICAgICAgICBsZXQgcmVzdCA9IG5leHQgLSBiYXNlO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcbiAgICAgICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKFxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoYmFzZSArIHBlcmNlbnQgKiByZXN0KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJlc3QgPSBiYXNlIC0gbmV4dDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XG4gICAgICAgICAgICAgIHRleHQ6IHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvcihcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGJhc2UgLSBwZXJjZW50ICogcmVzdClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsYXN0SW5kZXggPSBpbmRleDtcbiAgICB9KTtcblxuICAgIGRhdGEuZm9yRWFjaChkYXRhc2V0ID0+IHtcbiAgICAgIGlmIChkYXRhc2V0LndpdGhTY3JvbGxhYmxlRG90ID09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHBlckRhdGEgPSB3aWR0aCAvIGRhdGFzZXQuZGF0YS5sZW5ndGg7XG4gICAgICBsZXQgdmFsdWVzID0gW107XG4gICAgICBsZXQgeVZhbHVlcyA9IFtdO1xuICAgICAgbGV0IHhWYWx1ZXMgPSBbXTtcblxuICAgICAgbGV0IHlWYWx1ZXNMYWJlbCA9IFtdO1xuICAgICAgbGV0IHhWYWx1ZXNMYWJlbCA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZGF0YXNldC5kYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YWx1ZXMucHVzaChpbmRleCAqIHBlckRhdGEpO1xuICAgICAgICBjb25zdCB5dmFsID1cbiAgICAgICAgICAoKGJhc2VIZWlnaHQgLVxuICAgICAgICAgICAgdGhpcy5jYWxjSGVpZ2h0KFxuICAgICAgICAgICAgICBkYXRhc2V0LmRhdGFbZGF0YXNldC5kYXRhLmxlbmd0aCAtIGluZGV4IC0gMV0sXG4gICAgICAgICAgICAgIGRhdGFzLFxuICAgICAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICAgICkpIC9cbiAgICAgICAgICAgIDQpICpcbiAgICAgICAgICAgIDMgK1xuICAgICAgICAgIHBhZGRpbmdUb3A7XG4gICAgICAgIHlWYWx1ZXMucHVzaCh5dmFsKTtcbiAgICAgICAgY29uc3QgeHZhbCA9XG4gICAgICAgICAgcGFkZGluZ1JpZ2h0ICtcbiAgICAgICAgICAoKGRhdGFzZXQuZGF0YS5sZW5ndGggLSBpbmRleCAtIDEpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgL1xuICAgICAgICAgICAgZGF0YXNldC5kYXRhLmxlbmd0aDtcbiAgICAgICAgeFZhbHVlcy5wdXNoKHh2YWwpO1xuXG4gICAgICAgIHlWYWx1ZXNMYWJlbC5wdXNoKFxuICAgICAgICAgIHl2YWwgLSAoc2Nyb2xsYWJsZUluZm9TaXplLmhlaWdodCArIHNjcm9sbGFibGVJbmZvT2Zmc2V0KVxuICAgICAgICApO1xuICAgICAgICB4VmFsdWVzTGFiZWwucHVzaCh4dmFsIC0gc2Nyb2xsYWJsZUluZm9TaXplLndpZHRoIC8gMik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRyYW5zbGF0ZVggPSBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldC5pbnRlcnBvbGF0ZSh7XG4gICAgICAgIGlucHV0UmFuZ2U6IHZhbHVlcyxcbiAgICAgICAgb3V0cHV0UmFuZ2U6IHhWYWx1ZXMsXG4gICAgICAgIGV4dHJhcG9sYXRlOiBcImNsYW1wXCJcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB0cmFuc2xhdGVZID0gc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQuaW50ZXJwb2xhdGUoe1xuICAgICAgICBpbnB1dFJhbmdlOiB2YWx1ZXMsXG4gICAgICAgIG91dHB1dFJhbmdlOiB5VmFsdWVzLFxuICAgICAgICBleHRyYXBvbGF0ZTogXCJjbGFtcFwiXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbGFiZWxUcmFuc2xhdGVYID0gc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQuaW50ZXJwb2xhdGUoe1xuICAgICAgICBpbnB1dFJhbmdlOiB2YWx1ZXMsXG4gICAgICAgIG91dHB1dFJhbmdlOiB4VmFsdWVzTGFiZWwsXG4gICAgICAgIGV4dHJhcG9sYXRlOiBcImNsYW1wXCJcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBsYWJlbFRyYW5zbGF0ZVkgPSBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldC5pbnRlcnBvbGF0ZSh7XG4gICAgICAgIGlucHV0UmFuZ2U6IHZhbHVlcyxcbiAgICAgICAgb3V0cHV0UmFuZ2U6IHlWYWx1ZXNMYWJlbCxcbiAgICAgICAgZXh0cmFwb2xhdGU6IFwiY2xhbXBcIlxuICAgICAgfSk7XG5cbiAgICAgIG91dHB1dC5wdXNoKFtcbiAgICAgICAgPEFuaW1hdGVkLlZpZXdcbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgc3R5bGU9e1tcbiAgICAgICAgICAgIHNjcm9sbGFibGVJbmZvVmlld1N0eWxlLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0cmFuc2Zvcm06IFtcbiAgICAgICAgICAgICAgICB7IHRyYW5zbGF0ZVg6IGxhYmVsVHJhbnNsYXRlWCB9LFxuICAgICAgICAgICAgICAgIHsgdHJhbnNsYXRlWTogbGFiZWxUcmFuc2xhdGVZIH1cbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgd2lkdGg6IHNjcm9sbGFibGVJbmZvU2l6ZS53aWR0aCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBzY3JvbGxhYmxlSW5mb1NpemUuaGVpZ2h0XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgICAgIG9uTGF5b3V0PXsoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XG4gICAgICAgICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKFxuICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihkYXRhWzBdLmRhdGFbZGF0YVswXS5kYXRhLmxlbmd0aCAtIDFdKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgc3R5bGU9e3Njcm9sbGFibGVJbmZvVGV4dFN0eWxlfVxuICAgICAgICAgICAgcmVmPXt0aGlzLmxhYmVsfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvQW5pbWF0ZWQuVmlldz4sXG4gICAgICAgIDxBbmltYXRlZENpcmNsZVxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICBjeD17dHJhbnNsYXRlWH1cbiAgICAgICAgICBjeT17dHJhbnNsYXRlWX1cbiAgICAgICAgICByPXtzY3JvbGxhYmxlRG90UmFkaXVzfVxuICAgICAgICAgIHN0cm9rZT17c2Nyb2xsYWJsZURvdFN0cm9rZUNvbG9yfVxuICAgICAgICAgIHN0cm9rZVdpZHRoPXtzY3JvbGxhYmxlRG90U3Ryb2tlV2lkdGh9XG4gICAgICAgICAgZmlsbD17c2Nyb2xsYWJsZURvdEZpbGx9XG4gICAgICAgIC8+XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgcmVuZGVyU2hhZG93ID0gKHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgZGF0YSxcbiAgICB1c2VDb2xvckZyb21EYXRhc2V0XG4gIH06IFBpY2s8XG4gICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICBcImRhdGFcIiB8IFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcbiAgPiAmIHtcbiAgICB1c2VDb2xvckZyb21EYXRhc2V0OiBBYnN0cmFjdENoYXJ0Q29uZmlnW1widXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldFwiXTtcbiAgfSkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmJlemllcikge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyQmV6aWVyU2hhZG93KHtcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgICBwYWRkaW5nVG9wLFxuICAgICAgICBkYXRhLFxuICAgICAgICB1c2VDb2xvckZyb21EYXRhc2V0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YSk7XG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YXMsIGhlaWdodCk7XG5cbiAgICByZXR1cm4gZGF0YS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UG9seWdvblxuICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgcG9pbnRzPXtcbiAgICAgICAgICAgIGRhdGFzZXQuZGF0YVxuICAgICAgICAgICAgICAubWFwKChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeCA9XG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgICAgICAgICAgKGkgKiAod2lkdGggLSBwYWRkaW5nUmlnaHQpKSAvIGRhdGFzZXQuZGF0YS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB5ID1cbiAgICAgICAgICAgICAgICAgICgoYmFzZUhlaWdodCAtIHRoaXMuY2FsY0hlaWdodChkLCBkYXRhcywgaGVpZ2h0KSkgLyA0KSAqIDMgK1xuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDtcblxuICAgICAgICAgICAgICAgIHJldHVybiBgJHt4fSwke3l9YDtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmpvaW4oXCIgXCIpICtcbiAgICAgICAgICAgIGAgJHtwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgICAgICAoKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSAvIGRhdGFzZXQuZGF0YS5sZW5ndGgpICpcbiAgICAgICAgICAgICAgICAoZGF0YXNldC5kYXRhLmxlbmd0aCAtIDEpfSwkeyhoZWlnaHQgLyA0KSAqIDMgK1xuICAgICAgICAgICAgICBwYWRkaW5nVG9wfSAke3BhZGRpbmdSaWdodH0sJHsoaGVpZ2h0IC8gNCkgKiAzICsgcGFkZGluZ1RvcH1gXG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbGw9e2B1cmwoI2ZpbGxTaGFkb3dHcmFkaWVudCR7XG4gICAgICAgICAgICB1c2VDb2xvckZyb21EYXRhc2V0ID8gYF8ke2luZGV4fWAgOiBcIlwiXG4gICAgICAgICAgfSlgfVxuICAgICAgICAgIHN0cm9rZVdpZHRoPXswfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcblxuICByZW5kZXJMaW5lID0gKHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgZGF0YSxcbiAgICBsaW5lam9pblR5cGVcbiAgfTogUGljazxcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgIFwiZGF0YVwiIHwgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIiB8IFwibGluZWpvaW5UeXBlXCJcbiAgPikgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmJlemllcikge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyQmV6aWVyTGluZSh7XG4gICAgICAgIGRhdGEsXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIHBhZGRpbmdSaWdodCxcbiAgICAgICAgcGFkZGluZ1RvcFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3V0cHV0ID0gW107XG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEpO1xuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xuXG4gICAgbGV0IGxhc3RQb2ludDogc3RyaW5nO1xuXG4gICAgZGF0YS5mb3JFYWNoKChkYXRhc2V0LCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgcG9pbnRzID0gZGF0YXNldC5kYXRhLm1hcCgoZCwgaSkgPT4ge1xuICAgICAgICBpZiAoZCA9PT0gbnVsbCkgcmV0dXJuIGxhc3RQb2ludDtcbiAgICAgICAgY29uc3QgeCA9XG4gICAgICAgICAgKGkgKiAod2lkdGggLSBwYWRkaW5nUmlnaHQpKSAvIGRhdGFzZXQuZGF0YS5sZW5ndGggKyBwYWRkaW5nUmlnaHQ7XG4gICAgICAgIGNvbnN0IHkgPVxuICAgICAgICAgICgoYmFzZUhlaWdodCAtIHRoaXMuY2FsY0hlaWdodChkLCBkYXRhcywgaGVpZ2h0KSkgLyA0KSAqIDMgK1xuICAgICAgICAgIHBhZGRpbmdUb3A7XG4gICAgICAgIGxhc3RQb2ludCA9IGAke3h9LCR7eX1gO1xuICAgICAgICByZXR1cm4gYCR7eH0sJHt5fWA7XG4gICAgICB9KTtcblxuICAgICAgb3V0cHV0LnB1c2goXG4gICAgICAgIDxQb2x5bGluZVxuICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgc3Ryb2tlTGluZWpvaW49e2xpbmVqb2luVHlwZX1cbiAgICAgICAgICBwb2ludHM9e3BvaW50cy5qb2luKFwiIFwiKX1cbiAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgc3Ryb2tlPXt0aGlzLmdldENvbG9yKGRhdGFzZXQsIDAuMil9XG4gICAgICAgICAgc3Ryb2tlV2lkdGg9e3RoaXMuZ2V0U3Ryb2tlV2lkdGgoZGF0YXNldCl9XG4gICAgICAgICAgc3Ryb2tlRGFzaGFycmF5PXtkYXRhc2V0LnN0cm9rZURhc2hBcnJheX1cbiAgICAgICAgICBzdHJva2VEYXNob2Zmc2V0PXtkYXRhc2V0LnN0cm9rZURhc2hPZmZzZXR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICBnZXRCZXppZXJMaW5lUG9pbnRzID0gKFxuICAgIGRhdGFzZXQ6IERhdGFzZXQsXG4gICAge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBwYWRkaW5nUmlnaHQsXG4gICAgICBwYWRkaW5nVG9wLFxuICAgICAgZGF0YVxuICAgIH06IFBpY2s8XG4gICAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICAgICAgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIiB8IFwiZGF0YVwiXG4gICAgPlxuICApID0+IHtcbiAgICBpZiAoZGF0YXNldC5kYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFwiTTAsMFwiO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGFzID0gdGhpcy5nZXREYXRhcyhkYXRhKTtcblxuICAgIGNvbnN0IG5leHRpID0gKGk6IG51bWJlcikgPT4ge1xuICAgICAgLy9jb25zb2xlLmxvZyhcImlnbm9yZVZhbHVlID0gXCIgKyBkYXRhc2V0Lmlnbm9yZVZhbHVlKTtcbiAgICAgIGZvciAodmFyIGogPSBpOyBqIDwgZGF0YXNldC5kYXRhLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChkYXRhc2V0Lmlnbm9yZVZhbHVlICE9IGRhdGFzZXQuZGF0YVtqXSkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJpZ25vcmVWYWx1ZSA9IFwiICsgZGF0YXNldC5kYXRhW2pdKTtcbiAgICAgICAgICByZXR1cm4gajtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGk7XG4gICAgfTtcblxuICAgIGNvbnN0IHggPSAoaTogbnVtYmVyKSA9PiB7XG4gICAgICB2YXIgaiA9IG5leHRpKGkpO1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoXG4gICAgICAgIHBhZGRpbmdSaWdodCArIChqICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhc2V0LmRhdGEubGVuZ3RoXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gdGhpcy5jYWxjQmFzZUhlaWdodChkYXRhcywgaGVpZ2h0KTtcblxuICAgIGNvbnN0IHkgPSAoaTogbnVtYmVyKSA9PiB7XG4gICAgICB2YXIgaiA9IG5leHRpKGkpO1xuICAgICAgY29uc3QgeUhlaWdodCA9IHRoaXMuY2FsY0hlaWdodChkYXRhc2V0LmRhdGFbal0sIGRhdGFzLCBoZWlnaHQpO1xuXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigoKGJhc2VIZWlnaHQgLSB5SGVpZ2h0KSAvIDQpICogMyArIHBhZGRpbmdUb3ApO1xuICAgIH07XG5cbiAgICByZXR1cm4gW2BNJHt4KDApfSwke3koMCl9YF1cbiAgICAgIC5jb25jYXQoXG4gICAgICAgIGRhdGFzZXQuZGF0YS5zbGljZSgwLCAtMSkubWFwKChfLCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgeF9taWQgPSAoeChpKSArIHgoaSArIDEpKSAvIDI7XG4gICAgICAgICAgY29uc3QgeV9taWQgPSAoeShpKSArIHkoaSArIDEpKSAvIDI7XG4gICAgICAgICAgY29uc3QgY3BfeDEgPSAoeF9taWQgKyB4KGkpKSAvIDI7XG4gICAgICAgICAgY29uc3QgY3BfeDIgPSAoeF9taWQgKyB4KGkgKyAxKSkgLyAyO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBgUSAke2NwX3gxfSwgJHt5KGkpfSwgJHt4X21pZH0sICR7eV9taWR9YCArXG4gICAgICAgICAgICBgIFEgJHtjcF94Mn0sICR7eShpICsgMSl9LCAke3goaSArIDEpfSwgJHt5KGkgKyAxKX1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5qb2luKFwiIFwiKTtcbiAgfTtcblxuICByZW5kZXJCZXppZXJMaW5lID0gKHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgcGFkZGluZ1RvcFxuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgXCJkYXRhXCIgfCBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiXG4gID4pID0+IHtcbiAgICByZXR1cm4gZGF0YS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmdldEJlemllckxpbmVQb2ludHMoZGF0YXNldCwge1xuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICBwYWRkaW5nUmlnaHQsXG4gICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgIGRhdGFcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UGF0aFxuICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgZD17cmVzdWx0fVxuICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICBzdHJva2U9e3RoaXMuZ2V0Q29sb3IoZGF0YXNldCwgMC4yKX1cbiAgICAgICAgICBzdHJva2VXaWR0aD17dGhpcy5nZXRTdHJva2VXaWR0aChkYXRhc2V0KX1cbiAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9e2RhdGFzZXQuc3Ryb2tlRGFzaEFycmF5fVxuICAgICAgICAgIHN0cm9rZURhc2hvZmZzZXQ9e2RhdGFzZXQuc3Ryb2tlRGFzaE9mZnNldH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVyQmV6aWVyU2hhZG93ID0gKHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgZGF0YSxcbiAgICB1c2VDb2xvckZyb21EYXRhc2V0XG4gIH06IFBpY2s8XG4gICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICBcImRhdGFcIiB8IFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcbiAgPiAmIHtcbiAgICB1c2VDb2xvckZyb21EYXRhc2V0OiBBYnN0cmFjdENoYXJ0Q29uZmlnW1widXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldFwiXTtcbiAgfSkgPT5cbiAgICBkYXRhLm1hcCgoZGF0YXNldCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGQgPVxuICAgICAgICB0aGlzLmdldEJlemllckxpbmVQb2ludHMoZGF0YXNldCwge1xuICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICBwYWRkaW5nUmlnaHQsXG4gICAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgICBkYXRhXG4gICAgICAgIH0pICtcbiAgICAgICAgYCBMJHtwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgICgod2lkdGggLSBwYWRkaW5nUmlnaHQpIC8gZGF0YXNldC5kYXRhLmxlbmd0aCkgKlxuICAgICAgICAgICAgKGRhdGFzZXQuZGF0YS5sZW5ndGggLSAxKX0sJHsoaGVpZ2h0IC8gNCkgKiAzICtcbiAgICAgICAgICBwYWRkaW5nVG9wfSBMJHtwYWRkaW5nUmlnaHR9LCR7KGhlaWdodCAvIDQpICogMyArIHBhZGRpbmdUb3B9IFpgO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UGF0aFxuICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgZD17ZH1cbiAgICAgICAgICBmaWxsPXtgdXJsKCNmaWxsU2hhZG93R3JhZGllbnQke1xuICAgICAgICAgICAgdXNlQ29sb3JGcm9tRGF0YXNldCA/IGBfJHtpbmRleH1gIDogXCJcIlxuICAgICAgICAgIH0pYH1cbiAgICAgICAgICBzdHJva2VXaWR0aD17MH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgcmVuZGVyTGVnZW5kID0gKHdpZHRoLCBsZWdlbmRPZmZzZXQpID0+IHtcbiAgICBjb25zdCB7IGxlZ2VuZCwgZGF0YXNldHMgfSA9IHRoaXMucHJvcHMuZGF0YTtcbiAgICBjb25zdCBiYXNlTGVnZW5kSXRlbVggPSB3aWR0aCAvIChsZWdlbmQubGVuZ3RoICsgMSk7XG5cbiAgICByZXR1cm4gbGVnZW5kLm1hcCgobGVnZW5kSXRlbSwgaSkgPT4gKFxuICAgICAgPEcga2V5PXtNYXRoLnJhbmRvbSgpfT5cbiAgICAgICAgPExlZ2VuZEl0ZW1cbiAgICAgICAgICBpbmRleD17aX1cbiAgICAgICAgICBpY29uQ29sb3I9e3RoaXMuZ2V0Q29sb3IoZGF0YXNldHNbaV0sIDAuOSl9XG4gICAgICAgICAgYmFzZUxlZ2VuZEl0ZW1YPXtiYXNlTGVnZW5kSXRlbVh9XG4gICAgICAgICAgbGVnZW5kVGV4dD17bGVnZW5kSXRlbX1cbiAgICAgICAgICBsYWJlbFByb3BzPXt7IC4uLnRoaXMuZ2V0UHJvcHNGb3JMYWJlbHMoKSB9fVxuICAgICAgICAgIGxlZ2VuZE9mZnNldD17bGVnZW5kT2Zmc2V0fVxuICAgICAgICAvPlxuICAgICAgPC9HPlxuICAgICkpO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIGRhdGEsXG4gICAgICB3aXRoU2Nyb2xsYWJsZURvdCA9IGZhbHNlLFxuICAgICAgd2l0aFNoYWRvdyA9IHRydWUsXG4gICAgICB3aXRoRG90cyA9IHRydWUsXG4gICAgICB3aXRoSW5uZXJMaW5lcyA9IHRydWUsXG4gICAgICB3aXRoT3V0ZXJMaW5lcyA9IHRydWUsXG4gICAgICB3aXRoSG9yaXpvbnRhbExpbmVzID0gdHJ1ZSxcbiAgICAgIHdpdGhWZXJ0aWNhbExpbmVzID0gdHJ1ZSxcbiAgICAgIHdpdGhIb3Jpem9udGFsTGFiZWxzID0gdHJ1ZSxcbiAgICAgIHdpdGhWZXJ0aWNhbExhYmVscyA9IHRydWUsXG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgZGVjb3JhdG9yLFxuICAgICAgb25EYXRhUG9pbnRDbGljayxcbiAgICAgIHZlcnRpY2FsTGFiZWxSb3RhdGlvbiA9IDAsXG4gICAgICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbiA9IDAsXG4gICAgICBmb3JtYXRZTGFiZWwgPSB5TGFiZWwgPT4geUxhYmVsLFxuICAgICAgZm9ybWF0WExhYmVsID0geExhYmVsID0+IHhMYWJlbCxcbiAgICAgIHNlZ21lbnRzLFxuICAgICAgdHJhbnNwYXJlbnQgPSBmYWxzZSxcbiAgICAgIGNoYXJ0Q29uZmlnXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCB7IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHsgbGFiZWxzID0gW10gfSA9IGRhdGE7XG4gICAgY29uc3Qge1xuICAgICAgYm9yZGVyUmFkaXVzID0gMCxcbiAgICAgIHBhZGRpbmdUb3AgPSAxNixcbiAgICAgIHBhZGRpbmdSaWdodCA9IDY0LFxuICAgICAgbWFyZ2luID0gMCxcbiAgICAgIG1hcmdpblJpZ2h0ID0gMCxcbiAgICAgIHBhZGRpbmdCb3R0b20gPSAwXG4gICAgfSA9IHN0eWxlO1xuXG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICB2ZXJ0aWNhbExhYmVsUm90YXRpb24sXG4gICAgICBob3Jpem9udGFsTGFiZWxSb3RhdGlvblxuICAgIH07XG5cbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YS5kYXRhc2V0cyk7XG5cbiAgICBsZXQgY291bnQgPSBNYXRoLm1pbiguLi5kYXRhcykgPT09IE1hdGgubWF4KC4uLmRhdGFzKSA/IDEgOiA0O1xuICAgIGlmIChzZWdtZW50cykge1xuICAgICAgY291bnQgPSBzZWdtZW50cztcbiAgICB9XG5cbiAgICBjb25zdCBsZWdlbmRPZmZzZXQgPSB0aGlzLnByb3BzLmRhdGEubGVnZW5kID8gaGVpZ2h0ICogMC4xNSA6IDA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFZpZXcgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgPFN2Z1xuICAgICAgICAgIGhlaWdodD17aGVpZ2h0ICsgKHBhZGRpbmdCb3R0b20gYXMgbnVtYmVyKSArIGxlZ2VuZE9mZnNldH1cbiAgICAgICAgICB3aWR0aD17d2lkdGggLSAobWFyZ2luIGFzIG51bWJlcikgKiAyIC0gKG1hcmdpblJpZ2h0IGFzIG51bWJlcil9XG4gICAgICAgID5cbiAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0ICsgbGVnZW5kT2Zmc2V0fVxuICAgICAgICAgICAgcng9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIHJ5PXtib3JkZXJSYWRpdXN9XG4gICAgICAgICAgICBmaWxsPVwidXJsKCNiYWNrZ3JvdW5kR3JhZGllbnQpXCJcbiAgICAgICAgICAgIGZpbGxPcGFjaXR5PXt0cmFuc3BhcmVudCA/IDAgOiAxfVxuICAgICAgICAgIC8+XG4gICAgICAgICAge3RoaXMucHJvcHMuZGF0YS5sZWdlbmQgJiZcbiAgICAgICAgICAgIHRoaXMucmVuZGVyTGVnZW5kKGNvbmZpZy53aWR0aCwgbGVnZW5kT2Zmc2V0KX1cbiAgICAgICAgICA8RyB4PVwiMFwiIHk9e2xlZ2VuZE9mZnNldH0+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJEZWZzKHtcbiAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAuLi5jaGFydENvbmZpZyxcbiAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0c1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3dpdGhIb3Jpem9udGFsTGluZXMgJiZcbiAgICAgICAgICAgICAgICAod2l0aElubmVyTGluZXNcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJIb3Jpem9udGFsTGluZXMoe1xuICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIDogd2l0aE91dGVyTGluZXNcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJIb3Jpem9udGFsTGluZSh7XG4gICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICA6IG51bGwpfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoSG9yaXpvbnRhbExhYmVscyAmJlxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVySG9yaXpvbnRhbExhYmVscyh7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhcyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgZm9ybWF0WUxhYmVsLFxuICAgICAgICAgICAgICAgICAgZGVjaW1hbFBsYWNlczogY2hhcnRDb25maWcuZGVjaW1hbFBsYWNlc1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoVmVydGljYWxMaW5lcyAmJlxuICAgICAgICAgICAgICAgICh3aXRoSW5uZXJMaW5lc1xuICAgICAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlclZlcnRpY2FsTGluZXMoe1xuICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzWzBdLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICA6IHdpdGhPdXRlckxpbmVzXG4gICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVyVmVydGljYWxMaW5lKHtcbiAgICAgICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICA6IG51bGwpfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoVmVydGljYWxMYWJlbHMgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclZlcnRpY2FsTGFiZWxzKHtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgIGxhYmVscyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgZm9ybWF0WExhYmVsXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyTGluZSh7XG4gICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgIC4uLmNoYXJ0Q29uZmlnLFxuICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzXG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoU2hhZG93ICYmXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJTaGFkb3coe1xuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0cyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgdXNlQ29sb3JGcm9tRGF0YXNldDogY2hhcnRDb25maWcudXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldFxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoRG90cyAmJlxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRG90cyh7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICBvbkRhdGFQb2ludENsaWNrXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3dpdGhTY3JvbGxhYmxlRG90ICYmXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJTY3JvbGxhYmxlRG90KHtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgIC4uLmNoYXJ0Q29uZmlnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0cyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgb25EYXRhUG9pbnRDbGljayxcbiAgICAgICAgICAgICAgICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge2RlY29yYXRvciAmJlxuICAgICAgICAgICAgICAgIGRlY29yYXRvcih7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodFxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgIDwvRz5cbiAgICAgICAgPC9Tdmc+XG4gICAgICAgIHt3aXRoU2Nyb2xsYWJsZURvdCAmJiAoXG4gICAgICAgICAgPFNjcm9sbFZpZXdcbiAgICAgICAgICAgIHN0eWxlPXtTdHlsZVNoZWV0LmFic29sdXRlRmlsbH1cbiAgICAgICAgICAgIGNvbnRlbnRDb250YWluZXJTdHlsZT17eyB3aWR0aDogd2lkdGggKiAyIH19XG4gICAgICAgICAgICBzaG93c0hvcml6b250YWxTY3JvbGxJbmRpY2F0b3I9e2ZhbHNlfVxuICAgICAgICAgICAgc2Nyb2xsRXZlbnRUaHJvdHRsZT17MTZ9XG4gICAgICAgICAgICBvblNjcm9sbD17QW5pbWF0ZWQuZXZlbnQoW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmF0aXZlRXZlbnQ6IHtcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnRPZmZzZXQ6IHsgeDogc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSl9XG4gICAgICAgICAgICBob3Jpem9udGFsXG4gICAgICAgICAgICBib3VuY2VzPXtmYWxzZX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGluZUNoYXJ0O1xuIl19

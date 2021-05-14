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
        if (dataset.withDots === false) return;
        dataset.data.forEach(function(x, i) {
          if (hidePointsAtIndex.includes(i)) {
            return;
          }
          if (dataset.ignoreValue === x) {
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
        //console.log("dataset.withShadow=" + dataset.withShadow);
        if (dataset.withShadow === false) return <></>;

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
          if (dataset.ignoreValue !== dataset.data[j]) {
            //  console.log("ignoreValue = " + dataset.data[j]);
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
        if (dataset.withShadow === false) return <></>;

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
    // console.log('withShadow=' + withShadow);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGluZUNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpbmUtY2hhcnQvTGluZUNoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFvQixNQUFNLE9BQU8sQ0FBQztBQUN6QyxPQUFPLEVBQ0wsUUFBUSxFQUNSLFVBQVUsRUFDVixVQUFVLEVBQ1YsU0FBUyxFQUNULElBQUksRUFFTCxNQUFNLGNBQWMsQ0FBQztBQUN0QixPQUFPLEVBQ0wsTUFBTSxFQUNOLENBQUMsRUFDRCxJQUFJLEVBQ0osT0FBTyxFQUNQLFFBQVEsRUFDUixJQUFJLEVBQ0osR0FBRyxFQUNKLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxhQUdOLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUUxQyxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFvTTlEO0lBQXdCLDZCQUE2QztJQUFyRTtRQUFBLHFFQW94QkM7UUFueEJDLFdBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFhLENBQUM7UUFFckMsV0FBSyxHQUFHO1lBQ04sNkJBQTZCLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNyRCxDQUFDO1FBRUYsY0FBUSxHQUFHLFVBQUMsT0FBZ0IsRUFBRSxPQUFlO1lBQzNDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQztRQUVGLG9CQUFjLEdBQUcsVUFBQyxPQUFnQjtZQUNoQyxPQUFPLE9BQU8sQ0FBQyxXQUFXLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FB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O2lCQUNwRDthQUNGO1NBQ0YsQ0FBQyxDQUFDLENBQ0gsVUFBVSxDQUNWLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUNmLENBQ0gsQ0FDSDtNQUFBLEVBQUUsSUFBSSxDQUFDLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUFweEJELENBQXdCLGFBQWEsR0FveEJwQztBQUVELGVBQWUsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IFJlYWN0Tm9kZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtcbiAgQW5pbWF0ZWQsXG4gIFNjcm9sbFZpZXcsXG4gIFN0eWxlU2hlZXQsXG4gIFRleHRJbnB1dCxcbiAgVmlldyxcbiAgVmlld1N0eWxlXG59IGZyb20gXCJyZWFjdC1uYXRpdmVcIjtcbmltcG9ydCB7XG4gIENpcmNsZSxcbiAgRyxcbiAgUGF0aCxcbiAgUG9seWdvbixcbiAgUG9seWxpbmUsXG4gIFJlY3QsXG4gIFN2Z1xufSBmcm9tIFwicmVhY3QtbmF0aXZlLXN2Z1wiO1xuXG5pbXBvcnQgQWJzdHJhY3RDaGFydCwge1xuICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxuICBBYnN0cmFjdENoYXJ0UHJvcHNcbn0gZnJvbSBcIi4uL0Fic3RyYWN0Q2hhcnRcIjtcbmltcG9ydCB7IENoYXJ0RGF0YSwgRGF0YXNldCB9IGZyb20gXCIuLi9IZWxwZXJUeXBlc1wiO1xuaW1wb3J0IHsgTGVnZW5kSXRlbSB9IGZyb20gXCIuL0xlZ2VuZEl0ZW1cIjtcblxubGV0IEFuaW1hdGVkQ2lyY2xlID0gQW5pbWF0ZWQuY3JlYXRlQW5pbWF0ZWRDb21wb25lbnQoQ2lyY2xlKTtcblxuZXhwb3J0IGludGVyZmFjZSBMaW5lQ2hhcnREYXRhIGV4dGVuZHMgQ2hhcnREYXRhIHtcbiAgbGVnZW5kPzogc3RyaW5nW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUNoYXJ0UHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMge1xuICAvKipcbiAgICogRGF0YSBmb3IgdGhlIGNoYXJ0LlxuICAgKlxuICAgKiBFeGFtcGxlIGZyb20gW2RvY3NdKGh0dHBzOi8vZ2l0aHViLmNvbS9pbmRpZXNwaXJpdC9yZWFjdC1uYXRpdmUtY2hhcnQta2l0I2xpbmUtY2hhcnQpOlxuICAgKlxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IGRhdGEgPSB7XG4gICAqICAgbGFiZWxzOiBbJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnXSxcbiAgICogICBkYXRhc2V0czogW3tcbiAgICogICAgIGRhdGE6IFsgMjAsIDQ1LCAyOCwgODAsIDk5LCA0MyBdLFxuICAgKiAgICAgY29sb3I6IChvcGFjaXR5ID0gMSkgPT4gYHJnYmEoMTM0LCA2NSwgMjQ0LCAke29wYWNpdHl9KWAsIC8vIG9wdGlvbmFsXG4gICAqICAgICBzdHJva2VXaWR0aDogMiAvLyBvcHRpb25hbFxuICAgKiAgIH1dLFxuICAgKiAgIGxlZ2VuZDogW1wiUmFpbnkgRGF5c1wiLCBcIlN1bm55IERheXNcIiwgXCJTbm93eSBEYXlzXCJdIC8vIG9wdGlvbmFsXG4gICAqIH1cbiAgICogYGBgXG4gICAqL1xuICBkYXRhOiBMaW5lQ2hhcnREYXRhO1xuICAvKipcbiAgICogV2lkdGggb2YgdGhlIGNoYXJ0LCB1c2UgJ0RpbWVuc2lvbnMnIGxpYnJhcnkgdG8gZ2V0IHRoZSB3aWR0aCBvZiB5b3VyIHNjcmVlbiBmb3IgcmVzcG9uc2l2ZS5cbiAgICovXG4gIHdpZHRoOiBudW1iZXI7XG4gIC8qKlxuICAgKiBIZWlnaHQgb2YgdGhlIGNoYXJ0LlxuICAgKi9cbiAgaGVpZ2h0OiBudW1iZXI7XG4gIC8qKlxuICAgKiBTaG93IGRvdHMgb24gdGhlIGxpbmUgLSBkZWZhdWx0OiBUcnVlLlxuICAgKi9cbiAgd2l0aERvdHM/OiBib29sZWFuO1xuICAvKipcbiAgICogU2hvdyBzaGFkb3cgZm9yIGxpbmUgLSBkZWZhdWx0OiBUcnVlLlxuICAgKi9cbiAgd2l0aFNoYWRvdz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IGlubmVyIGRhc2hlZCBsaW5lcyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuXG4gIHdpdGhTY3JvbGxhYmxlRG90PzogYm9vbGVhbjtcbiAgd2l0aElubmVyTGluZXM/OiBib29sZWFuO1xuICAvKipcbiAgICogU2hvdyBvdXRlciBkYXNoZWQgbGluZXMgLSBkZWZhdWx0OiBUcnVlLlxuICAgKi9cbiAgd2l0aE91dGVyTGluZXM/OiBib29sZWFuO1xuICAvKipcbiAgICogU2hvdyB2ZXJ0aWNhbCBsaW5lcyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoVmVydGljYWxMaW5lcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IGhvcml6b250YWwgbGluZXMgLSBkZWZhdWx0OiBUcnVlLlxuICAgKi9cbiAgd2l0aEhvcml6b250YWxMaW5lcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBTaG93IHZlcnRpY2FsIGxhYmVscyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoVmVydGljYWxMYWJlbHM/OiBib29sZWFuO1xuICAvKipcbiAgICogU2hvdyBob3Jpem9udGFsIGxhYmVscyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoSG9yaXpvbnRhbExhYmVscz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBSZW5kZXIgY2hhcnRzIGZyb20gMCBub3QgZnJvbSB0aGUgbWluaW11bSB2YWx1ZS4gLSBkZWZhdWx0OiBGYWxzZS5cbiAgICovXG4gIGZyb21aZXJvPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFByZXBlbmQgdGV4dCB0byBob3Jpem9udGFsIGxhYmVscyAtLSBkZWZhdWx0OiAnJy5cbiAgICovXG4gIHlBeGlzTGFiZWw/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBcHBlbmQgdGV4dCB0byBob3Jpem9udGFsIGxhYmVscyAtLSBkZWZhdWx0OiAnJy5cbiAgICovXG4gIHlBeGlzU3VmZml4Pzogc3RyaW5nO1xuICAvKipcbiAgICogUHJlcGVuZCB0ZXh0IHRvIHZlcnRpY2FsIGxhYmVscyAtLSBkZWZhdWx0OiAnJy5cbiAgICovXG4gIHhBeGlzTGFiZWw/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIG9iamVjdCBmb3IgdGhlIGNoYXJ0LCBzZWUgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiBjb25zdCBjaGFydENvbmZpZyA9IHtcbiAgICogICBiYWNrZ3JvdW5kR3JhZGllbnRGcm9tOiBcIiMxRTI5MjNcIixcbiAgICogICBiYWNrZ3JvdW5kR3JhZGllbnRGcm9tT3BhY2l0eTogMCxcbiAgICogICBiYWNrZ3JvdW5kR3JhZGllbnRUbzogXCIjMDgxMzBEXCIsXG4gICAqICAgYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5OiAwLjUsXG4gICAqICAgY29sb3I6IChvcGFjaXR5ID0gMSkgPT4gYHJnYmEoMjYsIDI1NSwgMTQ2LCAke29wYWNpdHl9KWAsXG4gICAqICAgbGFiZWxDb2xvcjogKG9wYWNpdHkgPSAxKSA9PiBgcmdiYSgyNiwgMjU1LCAxNDYsICR7b3BhY2l0eX0pYCxcbiAgICogICBzdHJva2VXaWR0aDogMiwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgM1xuICAgKiAgIGJhclBlcmNlbnRhZ2U6IDAuNVxuICAgKiB9O1xuICAgKiBgYGBcbiAgICovXG4gIGNoYXJ0Q29uZmlnPzogQWJzdHJhY3RDaGFydENvbmZpZztcblxuICAvKipcbiAgICogRGl2aWRlIGF4aXMgcXVhbnRpdHkgYnkgdGhlIGlucHV0IG51bWJlciAtLSBkZWZhdWx0OiAxLlxuICAgKi9cbiAgeUF4aXNJbnRlcnZhbD86IG51bWJlcjtcblxuICAvKipcbiAgICogRGVmaW5lcyBpZiBjaGFydCBpcyB0cmFuc3BhcmVudFxuICAgKi9cbiAgdHJhbnNwYXJlbnQ/OiBib29sZWFuO1xuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiB0YWtlcyBhIFt3aG9sZSBidW5jaF0oaHR0cHM6Ly9naXRodWIuY29tL2luZGllc3Bpcml0L3JlYWN0LW5hdGl2ZS1jaGFydC1raXQvYmxvYi9tYXN0ZXIvc3JjL2xpbmUtY2hhcnQuanMjTDI2NilcbiAgICogb2Ygc3R1ZmYgYW5kIGNhbiByZW5kZXIgZXh0cmEgZWxlbWVudHMsXG4gICAqIHN1Y2ggYXMgZGF0YSBwb2ludCBpbmZvIG9yIGFkZGl0aW9uYWwgbWFya3VwLlxuICAgKi9cbiAgZGVjb3JhdG9yPzogRnVuY3Rpb247XG4gIC8qKlxuICAgKiBDYWxsYmFjayB0aGF0IGlzIGNhbGxlZCB3aGVuIGEgZGF0YSBwb2ludCBpcyBjbGlja2VkLlxuICAgKi9cbiAgb25EYXRhUG9pbnRDbGljaz86IChkYXRhOiB7XG4gICAgaW5kZXg6IG51bWJlcjtcbiAgICB2YWx1ZTogbnVtYmVyO1xuICAgIGRhdGFzZXQ6IERhdGFzZXQ7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBnZXRDb2xvcjogKG9wYWNpdHk6IG51bWJlcikgPT4gc3RyaW5nO1xuICB9KSA9PiB2b2lkO1xuICAvKipcbiAgICogU3R5bGUgb2YgdGhlIGNvbnRhaW5lciB2aWV3IG9mIHRoZSBjaGFydC5cbiAgICovXG4gIHN0eWxlPzogUGFydGlhbDxWaWV3U3R5bGU+O1xuICAvKipcbiAgICogQWRkIHRoaXMgcHJvcCB0byBtYWtlIHRoZSBsaW5lIGNoYXJ0IHNtb290aCBhbmQgY3VydnkuXG4gICAqXG4gICAqIFtFeGFtcGxlXShodHRwczovL2dpdGh1Yi5jb20vaW5kaWVzcGlyaXQvcmVhY3QtbmF0aXZlLWNoYXJ0LWtpdCNiZXppZXItbGluZS1jaGFydClcbiAgICovXG4gIGJlemllcj86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBEZWZpbmVzIHRoZSBkb3QgY29sb3IgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIGNhbGN1bGF0ZSBjb2xvcnMgb2YgZG90cyBpbiBhIGxpbmUgY2hhcnQuXG4gICAqIFRha2VzIGAoZGF0YVBvaW50LCBkYXRhUG9pbnRJbmRleClgIGFzIGFyZ3VtZW50cy5cbiAgICovXG4gIGdldERvdENvbG9yPzogKGRhdGFQb2ludDogYW55LCBpbmRleDogbnVtYmVyKSA9PiBzdHJpbmc7XG4gIC8qKlxuICAgKiBSZW5kZXJzIGFkZGl0aW9uYWwgY29udGVudCBmb3IgZG90cyBpbiBhIGxpbmUgY2hhcnQuXG4gICAqIFRha2VzIGAoe3gsIHksIGluZGV4fSlgIGFzIGFyZ3VtZW50cy5cbiAgICovXG4gIHJlbmRlckRvdENvbnRlbnQ/OiAocGFyYW1zOiB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBpbmRleDogbnVtYmVyO1xuICAgIGluZGV4RGF0YTogbnVtYmVyO1xuICB9KSA9PiBSZWFjdC5SZWFjdE5vZGU7XG4gIC8qKlxuICAgKiBSb3RhdGlvbiBhbmdsZSBvZiB0aGUgaG9yaXpvbnRhbCBsYWJlbHMgLSBkZWZhdWx0IDAgKGRlZ3JlZXMpLlxuICAgKi9cbiAgaG9yaXpvbnRhbExhYmVsUm90YXRpb24/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBSb3RhdGlvbiBhbmdsZSBvZiB0aGUgdmVydGljYWwgbGFiZWxzIC0gZGVmYXVsdCAwIChkZWdyZWVzKS5cbiAgICovXG4gIHZlcnRpY2FsTGFiZWxSb3RhdGlvbj86IG51bWJlcjtcbiAgLyoqXG4gICAqIE9mZnNldCBmb3IgWSBheGlzIGxhYmVscy5cbiAgICovXG4gIHlMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBPZmZzZXQgZm9yIFggYXhpcyBsYWJlbHMuXG4gICAqL1xuICB4TGFiZWxzT2Zmc2V0PzogbnVtYmVyO1xuICAvKipcbiAgICogQXJyYXkgb2YgaW5kaWNlcyBvZiB0aGUgZGF0YSBwb2ludHMgeW91IGRvbid0IHdhbnQgdG8gZGlzcGxheS5cbiAgICovXG4gIGhpZGVQb2ludHNBdEluZGV4PzogbnVtYmVyW107XG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGNoYW5nZSB0aGUgZm9ybWF0IG9mIHRoZSBkaXNwbGF5IHZhbHVlIG9mIHRoZSBZIGxhYmVsLlxuICAgKiBUYWtlcyB0aGUgeSB2YWx1ZSBhcyBhcmd1bWVudCBhbmQgc2hvdWxkIHJldHVybiB0aGUgZGVzaXJhYmxlIHN0cmluZy5cbiAgICovXG4gIGZvcm1hdFlMYWJlbD86ICh5VmFsdWU6IHN0cmluZykgPT4gc3RyaW5nO1xuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBjaGFuZ2UgdGhlIGZvcm1hdCBvZiB0aGUgZGlzcGxheSB2YWx1ZSBvZiB0aGUgWCBsYWJlbC5cbiAgICogVGFrZXMgdGhlIFggdmFsdWUgYXMgYXJndW1lbnQgYW5kIHNob3VsZCByZXR1cm4gdGhlIGRlc2lyYWJsZSBzdHJpbmcuXG4gICAqL1xuICBmb3JtYXRYTGFiZWw/OiAoeFZhbHVlOiBzdHJpbmcpID0+IHN0cmluZztcbiAgLyoqXG4gICAqIFByb3ZpZGUgcHJvcHMgZm9yIGEgZGF0YSBwb2ludCBkb3QuXG4gICAqL1xuICBnZXREb3RQcm9wcz86IChkYXRhUG9pbnQ6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gb2JqZWN0O1xuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBob3Jpem9udGFsIGxpbmVzXG4gICAqL1xuICBzZWdtZW50cz86IG51bWJlcjtcbn1cblxudHlwZSBMaW5lQ2hhcnRTdGF0ZSA9IHtcbiAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQ6IEFuaW1hdGVkLlZhbHVlO1xufTtcblxuY2xhc3MgTGluZUNoYXJ0IGV4dGVuZHMgQWJzdHJhY3RDaGFydDxMaW5lQ2hhcnRQcm9wcywgTGluZUNoYXJ0U3RhdGU+IHtcbiAgbGFiZWwgPSBSZWFjdC5jcmVhdGVSZWY8VGV4dElucHV0PigpO1xuXG4gIHN0YXRlID0ge1xuICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0OiBuZXcgQW5pbWF0ZWQuVmFsdWUoMClcbiAgfTtcblxuICBnZXRDb2xvciA9IChkYXRhc2V0OiBEYXRhc2V0LCBvcGFjaXR5OiBudW1iZXIpID0+IHtcbiAgICByZXR1cm4gKGRhdGFzZXQuY29sb3IgfHwgdGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcikob3BhY2l0eSk7XG4gIH07XG5cbiAgZ2V0U3Ryb2tlV2lkdGggPSAoZGF0YXNldDogRGF0YXNldCkgPT4ge1xuICAgIHJldHVybiBkYXRhc2V0LnN0cm9rZVdpZHRoIHx8IHRoaXMucHJvcHMuY2hhcnRDb25maWcuc3Ryb2tlV2lkdGggfHwgMztcbiAgfTtcblxuICBnZXREYXRhcyA9IChkYXRhOiBEYXRhc2V0W10pOiBudW1iZXJbXSA9PiB7XG4gICAgcmV0dXJuIGRhdGEucmVkdWNlKFxuICAgICAgKGFjYywgaXRlbSkgPT4gKGl0ZW0uZGF0YSA/IFsuLi5hY2MsIC4uLml0ZW0uZGF0YV0gOiBhY2MpLFxuICAgICAgW11cbiAgICApO1xuICB9O1xuXG4gIGdldFByb3BzRm9yRG90cyA9ICh4OiBhbnksIGk6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IHsgZ2V0RG90UHJvcHMsIGNoYXJ0Q29uZmlnIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKHR5cGVvZiBnZXREb3RQcm9wcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXR1cm4gZ2V0RG90UHJvcHMoeCwgaSk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBwcm9wc0ZvckRvdHMgPSB7fSB9ID0gY2hhcnRDb25maWc7XG5cbiAgICByZXR1cm4geyByOiBcIjRcIiwgLi4ucHJvcHNGb3JEb3RzIH07XG4gIH07XG5cbiAgcmVuZGVyRG90cyA9ICh7XG4gICAgZGF0YSxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgb25EYXRhUG9pbnRDbGlja1xuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgXCJkYXRhXCIgfCBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiXG4gID4gJiB7XG4gICAgb25EYXRhUG9pbnRDbGljazogTGluZUNoYXJ0UHJvcHNbXCJvbkRhdGFQb2ludENsaWNrXCJdO1xuICB9KSA9PiB7XG4gICAgY29uc3Qgb3V0cHV0OiBSZWFjdE5vZGVbXSA9IFtdO1xuICAgIGNvbnN0IGRhdGFzID0gdGhpcy5nZXREYXRhcyhkYXRhKTtcbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gdGhpcy5jYWxjQmFzZUhlaWdodChkYXRhcywgaGVpZ2h0KTtcblxuICAgIGNvbnN0IHtcbiAgICAgIGdldERvdENvbG9yLFxuICAgICAgaGlkZVBvaW50c0F0SW5kZXggPSBbXSxcbiAgICAgIHJlbmRlckRvdENvbnRlbnQgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgZGF0YS5mb3JFYWNoKGRhdGFzZXQgPT4ge1xuICAgICAgaWYgKGRhdGFzZXQud2l0aERvdHMgPT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgZGF0YXNldC5kYXRhLmZvckVhY2goKHgsIGkpID0+IHtcbiAgICAgICAgaWYgKGhpZGVQb2ludHNBdEluZGV4LmluY2x1ZGVzKGkpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGFzZXQuaWdub3JlVmFsdWUgPT0geCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN4ID1cbiAgICAgICAgICBwYWRkaW5nUmlnaHQgKyAoaSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCkpIC8gZGF0YXNldC5kYXRhLmxlbmd0aDtcblxuICAgICAgICBjb25zdCBjeSA9XG4gICAgICAgICAgKChiYXNlSGVpZ2h0IC0gdGhpcy5jYWxjSGVpZ2h0KHgsIGRhdGFzLCBoZWlnaHQpKSAvIDQpICogMyArXG4gICAgICAgICAgcGFkZGluZ1RvcDtcblxuICAgICAgICBjb25zdCBvblByZXNzID0gKCkgPT4ge1xuICAgICAgICAgIGlmICghb25EYXRhUG9pbnRDbGljayB8fCBoaWRlUG9pbnRzQXRJbmRleC5pbmNsdWRlcyhpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9uRGF0YVBvaW50Q2xpY2soe1xuICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICB2YWx1ZTogeCxcbiAgICAgICAgICAgIGRhdGFzZXQsXG4gICAgICAgICAgICB4OiBjeCxcbiAgICAgICAgICAgIHk6IGN5LFxuICAgICAgICAgICAgZ2V0Q29sb3I6IG9wYWNpdHkgPT4gdGhpcy5nZXRDb2xvcihkYXRhc2V0LCBvcGFjaXR5KVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIG91dHB1dC5wdXNoKFxuICAgICAgICAgIDxDaXJjbGVcbiAgICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cbiAgICAgICAgICAgIGN4PXtjeH1cbiAgICAgICAgICAgIGN5PXtjeX1cbiAgICAgICAgICAgIGZpbGw9e1xuICAgICAgICAgICAgICB0eXBlb2YgZ2V0RG90Q29sb3IgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgICAgID8gZ2V0RG90Q29sb3IoeCwgaSlcbiAgICAgICAgICAgICAgICA6IHRoaXMuZ2V0Q29sb3IoZGF0YXNldCwgMC45KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25QcmVzcz17b25QcmVzc31cbiAgICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yRG90cyh4LCBpKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgICA8Q2lyY2xlXG4gICAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgICBjeD17Y3h9XG4gICAgICAgICAgICBjeT17Y3l9XG4gICAgICAgICAgICByPVwiMTRcIlxuICAgICAgICAgICAgZmlsbD1cIiNmZmZcIlxuICAgICAgICAgICAgZmlsbE9wYWNpdHk9ezB9XG4gICAgICAgICAgICBvblByZXNzPXtvblByZXNzfVxuICAgICAgICAgIC8+LFxuICAgICAgICAgIHJlbmRlckRvdENvbnRlbnQoeyB4OiBjeCwgeTogY3ksIGluZGV4OiBpLCBpbmRleERhdGE6IHggfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICByZW5kZXJTY3JvbGxhYmxlRG90ID0gKHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldCxcbiAgICBzY3JvbGxhYmxlRG90RmlsbCxcbiAgICBzY3JvbGxhYmxlRG90U3Ryb2tlQ29sb3IsXG4gICAgc2Nyb2xsYWJsZURvdFN0cm9rZVdpZHRoLFxuICAgIHNjcm9sbGFibGVEb3RSYWRpdXMsXG4gICAgc2Nyb2xsYWJsZUluZm9WaWV3U3R5bGUsXG4gICAgc2Nyb2xsYWJsZUluZm9UZXh0U3R5bGUsXG4gICAgc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yID0geCA9PiBgJHt4fWAsXG4gICAgc2Nyb2xsYWJsZUluZm9TaXplLFxuICAgIHNjcm9sbGFibGVJbmZvT2Zmc2V0XG4gIH06IEFic3RyYWN0Q2hhcnRDb25maWcgJiB7XG4gICAgb25EYXRhUG9pbnRDbGljazogTGluZUNoYXJ0UHJvcHNbXCJvbkRhdGFQb2ludENsaWNrXCJdO1xuICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0OiBBbmltYXRlZC5WYWx1ZTtcbiAgfSkgPT4ge1xuICAgIGNvbnN0IG91dHB1dCA9IFtdO1xuICAgIGNvbnN0IGRhdGFzID0gdGhpcy5nZXREYXRhcyhkYXRhKTtcbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gdGhpcy5jYWxjQmFzZUhlaWdodChkYXRhcywgaGVpZ2h0KTtcblxuICAgIGxldCB2bDogbnVtYmVyW10gPSBbXTtcblxuICAgIGNvbnN0IHBlckRhdGEgPSB3aWR0aCAvIGRhdGFbMF0uZGF0YS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGFbMF0uZGF0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZsLnB1c2goaW5kZXggKiBwZXJEYXRhKTtcbiAgICB9XG4gICAgbGV0IGxhc3RJbmRleDogbnVtYmVyO1xuXG4gICAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQuYWRkTGlzdGVuZXIodmFsdWUgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB2YWx1ZS52YWx1ZSAvIHBlckRhdGE7XG4gICAgICBpZiAoIWxhc3RJbmRleCkge1xuICAgICAgICBsYXN0SW5kZXggPSBpbmRleDtcbiAgICAgIH1cblxuICAgICAgbGV0IGFicyA9IE1hdGguZmxvb3IoaW5kZXgpO1xuICAgICAgbGV0IHBlcmNlbnQgPSBpbmRleCAtIGFicztcbiAgICAgIGFicyA9IGRhdGFbMF0uZGF0YS5sZW5ndGggLSBhYnMgLSAxO1xuXG4gICAgICBpZiAoaW5kZXggPj0gZGF0YVswXS5kYXRhLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcbiAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoTWF0aC5mbG9vcihkYXRhWzBdLmRhdGFbMF0pKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpbmRleCA+IGxhc3RJbmRleCkge1xuICAgICAgICAgIC8vIHRvIHJpZ2h0XG5cbiAgICAgICAgICBjb25zdCBiYXNlID0gZGF0YVswXS5kYXRhW2Fic107XG4gICAgICAgICAgY29uc3QgcHJldiA9IGRhdGFbMF0uZGF0YVthYnMgLSAxXTtcbiAgICAgICAgICBpZiAocHJldiA+IGJhc2UpIHtcbiAgICAgICAgICAgIGxldCByZXN0ID0gcHJldiAtIGJhc2U7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xuICAgICAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihiYXNlICsgcGVyY2VudCAqIHJlc3QpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmVzdCA9IGJhc2UgLSBwcmV2O1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcbiAgICAgICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKFxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoYmFzZSAtIHBlcmNlbnQgKiByZXN0KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gdG8gbGVmdFxuXG4gICAgICAgICAgY29uc3QgYmFzZSA9IGRhdGFbMF0uZGF0YVthYnMgLSAxXTtcbiAgICAgICAgICBjb25zdCBuZXh0ID0gZGF0YVswXS5kYXRhW2Fic107XG4gICAgICAgICAgcGVyY2VudCA9IDEgLSBwZXJjZW50O1xuICAgICAgICAgIGlmIChuZXh0ID4gYmFzZSkge1xuICAgICAgICAgICAgbGV0IHJlc3QgPSBuZXh0IC0gYmFzZTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XG4gICAgICAgICAgICAgIHRleHQ6IHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvcihcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGJhc2UgKyBwZXJjZW50ICogcmVzdClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCByZXN0ID0gYmFzZSAtIG5leHQ7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xuICAgICAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihiYXNlIC0gcGVyY2VudCAqIHJlc3QpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGFzdEluZGV4ID0gaW5kZXg7XG4gICAgfSk7XG5cbiAgICBkYXRhLmZvckVhY2goZGF0YXNldCA9PiB7XG4gICAgICBpZiAoZGF0YXNldC53aXRoU2Nyb2xsYWJsZURvdCA9PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBwZXJEYXRhID0gd2lkdGggLyBkYXRhc2V0LmRhdGEubGVuZ3RoO1xuICAgICAgbGV0IHZhbHVlcyA9IFtdO1xuICAgICAgbGV0IHlWYWx1ZXMgPSBbXTtcbiAgICAgIGxldCB4VmFsdWVzID0gW107XG5cbiAgICAgIGxldCB5VmFsdWVzTGFiZWwgPSBbXTtcbiAgICAgIGxldCB4VmFsdWVzTGFiZWwgPSBbXTtcblxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGFzZXQuZGF0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFsdWVzLnB1c2goaW5kZXggKiBwZXJEYXRhKTtcbiAgICAgICAgY29uc3QgeXZhbCA9XG4gICAgICAgICAgKChiYXNlSGVpZ2h0IC1cbiAgICAgICAgICAgIHRoaXMuY2FsY0hlaWdodChcbiAgICAgICAgICAgICAgZGF0YXNldC5kYXRhW2RhdGFzZXQuZGF0YS5sZW5ndGggLSBpbmRleCAtIDFdLFxuICAgICAgICAgICAgICBkYXRhcyxcbiAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICApKSAvXG4gICAgICAgICAgICA0KSAqXG4gICAgICAgICAgICAzICtcbiAgICAgICAgICBwYWRkaW5nVG9wO1xuICAgICAgICB5VmFsdWVzLnB1c2goeXZhbCk7XG4gICAgICAgIGNvbnN0IHh2YWwgPVxuICAgICAgICAgIHBhZGRpbmdSaWdodCArXG4gICAgICAgICAgKChkYXRhc2V0LmRhdGEubGVuZ3RoIC0gaW5kZXggLSAxKSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCkpIC9cbiAgICAgICAgICAgIGRhdGFzZXQuZGF0YS5sZW5ndGg7XG4gICAgICAgIHhWYWx1ZXMucHVzaCh4dmFsKTtcblxuICAgICAgICB5VmFsdWVzTGFiZWwucHVzaChcbiAgICAgICAgICB5dmFsIC0gKHNjcm9sbGFibGVJbmZvU2l6ZS5oZWlnaHQgKyBzY3JvbGxhYmxlSW5mb09mZnNldClcbiAgICAgICAgKTtcbiAgICAgICAgeFZhbHVlc0xhYmVsLnB1c2goeHZhbCAtIHNjcm9sbGFibGVJbmZvU2l6ZS53aWR0aCAvIDIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0cmFuc2xhdGVYID0gc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQuaW50ZXJwb2xhdGUoe1xuICAgICAgICBpbnB1dFJhbmdlOiB2YWx1ZXMsXG4gICAgICAgIG91dHB1dFJhbmdlOiB4VmFsdWVzLFxuICAgICAgICBleHRyYXBvbGF0ZTogXCJjbGFtcFwiXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdHJhbnNsYXRlWSA9IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LmludGVycG9sYXRlKHtcbiAgICAgICAgaW5wdXRSYW5nZTogdmFsdWVzLFxuICAgICAgICBvdXRwdXRSYW5nZTogeVZhbHVlcyxcbiAgICAgICAgZXh0cmFwb2xhdGU6IFwiY2xhbXBcIlxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGxhYmVsVHJhbnNsYXRlWCA9IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LmludGVycG9sYXRlKHtcbiAgICAgICAgaW5wdXRSYW5nZTogdmFsdWVzLFxuICAgICAgICBvdXRwdXRSYW5nZTogeFZhbHVlc0xhYmVsLFxuICAgICAgICBleHRyYXBvbGF0ZTogXCJjbGFtcFwiXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbGFiZWxUcmFuc2xhdGVZID0gc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQuaW50ZXJwb2xhdGUoe1xuICAgICAgICBpbnB1dFJhbmdlOiB2YWx1ZXMsXG4gICAgICAgIG91dHB1dFJhbmdlOiB5VmFsdWVzTGFiZWwsXG4gICAgICAgIGV4dHJhcG9sYXRlOiBcImNsYW1wXCJcbiAgICAgIH0pO1xuXG4gICAgICBvdXRwdXQucHVzaChbXG4gICAgICAgIDxBbmltYXRlZC5WaWV3XG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgIHN0eWxlPXtbXG4gICAgICAgICAgICBzY3JvbGxhYmxlSW5mb1ZpZXdTdHlsZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBbXG4gICAgICAgICAgICAgICAgeyB0cmFuc2xhdGVYOiBsYWJlbFRyYW5zbGF0ZVggfSxcbiAgICAgICAgICAgICAgICB7IHRyYW5zbGF0ZVk6IGxhYmVsVHJhbnNsYXRlWSB9XG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIHdpZHRoOiBzY3JvbGxhYmxlSW5mb1NpemUud2lkdGgsXG4gICAgICAgICAgICAgIGhlaWdodDogc2Nyb2xsYWJsZUluZm9TaXplLmhlaWdodFxuICAgICAgICAgICAgfVxuICAgICAgICAgIF19XG4gICAgICAgID5cbiAgICAgICAgICA8VGV4dElucHV0XG4gICAgICAgICAgICBvbkxheW91dD17KCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xuICAgICAgICAgICAgICAgIHRleHQ6IHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvcihcbiAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoZGF0YVswXS5kYXRhW2RhdGFbMF0uZGF0YS5sZW5ndGggLSAxXSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHN0eWxlPXtzY3JvbGxhYmxlSW5mb1RleHRTdHlsZX1cbiAgICAgICAgICAgIHJlZj17dGhpcy5sYWJlbH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0FuaW1hdGVkLlZpZXc+LFxuICAgICAgICA8QW5pbWF0ZWRDaXJjbGVcbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgY3g9e3RyYW5zbGF0ZVh9XG4gICAgICAgICAgY3k9e3RyYW5zbGF0ZVl9XG4gICAgICAgICAgcj17c2Nyb2xsYWJsZURvdFJhZGl1c31cbiAgICAgICAgICBzdHJva2U9e3Njcm9sbGFibGVEb3RTdHJva2VDb2xvcn1cbiAgICAgICAgICBzdHJva2VXaWR0aD17c2Nyb2xsYWJsZURvdFN0cm9rZVdpZHRofVxuICAgICAgICAgIGZpbGw9e3Njcm9sbGFibGVEb3RGaWxsfVxuICAgICAgICAvPlxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIHJlbmRlclNoYWRvdyA9ICh7XG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIGRhdGEsXG4gICAgdXNlQ29sb3JGcm9tRGF0YXNldFxuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgXCJkYXRhXCIgfCBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiXG4gID4gJiB7XG4gICAgdXNlQ29sb3JGcm9tRGF0YXNldDogQWJzdHJhY3RDaGFydENvbmZpZ1tcInVzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXRcIl07XG4gIH0pID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5iZXppZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckJlemllclNoYWRvdyh7XG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIHBhZGRpbmdSaWdodCxcbiAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgdXNlQ29sb3JGcm9tRGF0YXNldFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEpO1xuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xuXG4gICAgcmV0dXJuIGRhdGEubWFwKChkYXRhc2V0LCBpbmRleCkgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFBvbHlnb25cbiAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgIHBvaW50cz17XG4gICAgICAgICAgICBkYXRhc2V0LmRhdGFcbiAgICAgICAgICAgICAgLm1hcCgoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHggPVxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0ICtcbiAgICAgICAgICAgICAgICAgIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhc2V0LmRhdGEubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgeSA9XG4gICAgICAgICAgICAgICAgICAoKGJhc2VIZWlnaHQgLSB0aGlzLmNhbGNIZWlnaHQoZCwgZGF0YXMsIGhlaWdodCkpIC8gNCkgKiAzICtcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7eH0sJHt5fWA7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5qb2luKFwiIFwiKSArXG4gICAgICAgICAgICBgICR7cGFkZGluZ1JpZ2h0ICtcbiAgICAgICAgICAgICAgKCh3aWR0aCAtIHBhZGRpbmdSaWdodCkgLyBkYXRhc2V0LmRhdGEubGVuZ3RoKSAqXG4gICAgICAgICAgICAgICAgKGRhdGFzZXQuZGF0YS5sZW5ndGggLSAxKX0sJHsoaGVpZ2h0IC8gNCkgKiAzICtcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcH0gJHtwYWRkaW5nUmlnaHR9LCR7KGhlaWdodCAvIDQpICogMyArIHBhZGRpbmdUb3B9YFxuICAgICAgICAgIH1cbiAgICAgICAgICBmaWxsPXtgdXJsKCNmaWxsU2hhZG93R3JhZGllbnQke1xuICAgICAgICAgICAgdXNlQ29sb3JGcm9tRGF0YXNldCA/IGBfJHtpbmRleH1gIDogXCJcIlxuICAgICAgICAgIH0pYH1cbiAgICAgICAgICBzdHJva2VXaWR0aD17MH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVyTGluZSA9ICh7XG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHBhZGRpbmdSaWdodCxcbiAgICBwYWRkaW5nVG9wLFxuICAgIGRhdGEsXG4gICAgbGluZWpvaW5UeXBlXG4gIH06IFBpY2s8XG4gICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICBcImRhdGFcIiB8IFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCIgfCBcImxpbmVqb2luVHlwZVwiXG4gID4pID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5iZXppZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckJlemllckxpbmUoe1xuICAgICAgICBkYXRhLFxuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICBwYWRkaW5nUmlnaHQsXG4gICAgICAgIHBhZGRpbmdUb3BcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG91dHB1dCA9IFtdO1xuICAgIGNvbnN0IGRhdGFzID0gdGhpcy5nZXREYXRhcyhkYXRhKTtcbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gdGhpcy5jYWxjQmFzZUhlaWdodChkYXRhcywgaGVpZ2h0KTtcblxuICAgIGxldCBsYXN0UG9pbnQ6IHN0cmluZztcblxuICAgIGRhdGEuZm9yRWFjaCgoZGF0YXNldCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50cyA9IGRhdGFzZXQuZGF0YS5tYXAoKGQsIGkpID0+IHtcbiAgICAgICAgaWYgKGQgPT09IG51bGwpIHJldHVybiBsYXN0UG9pbnQ7XG4gICAgICAgIGNvbnN0IHggPVxuICAgICAgICAgIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhc2V0LmRhdGEubGVuZ3RoICsgcGFkZGluZ1JpZ2h0O1xuICAgICAgICBjb25zdCB5ID1cbiAgICAgICAgICAoKGJhc2VIZWlnaHQgLSB0aGlzLmNhbGNIZWlnaHQoZCwgZGF0YXMsIGhlaWdodCkpIC8gNCkgKiAzICtcbiAgICAgICAgICBwYWRkaW5nVG9wO1xuICAgICAgICBsYXN0UG9pbnQgPSBgJHt4fSwke3l9YDtcbiAgICAgICAgcmV0dXJuIGAke3h9LCR7eX1gO1xuICAgICAgfSk7XG5cbiAgICAgIG91dHB1dC5wdXNoKFxuICAgICAgICA8UG9seWxpbmVcbiAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgIHN0cm9rZUxpbmVqb2luPXtsaW5lam9pblR5cGV9XG4gICAgICAgICAgcG9pbnRzPXtwb2ludHMuam9pbihcIiBcIil9XG4gICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgIHN0cm9rZT17dGhpcy5nZXRDb2xvcihkYXRhc2V0LCAwLjIpfVxuICAgICAgICAgIHN0cm9rZVdpZHRoPXt0aGlzLmdldFN0cm9rZVdpZHRoKGRhdGFzZXQpfVxuICAgICAgICAgIHN0cm9rZURhc2hhcnJheT17ZGF0YXNldC5zdHJva2VEYXNoQXJyYXl9XG4gICAgICAgICAgc3Ryb2tlRGFzaG9mZnNldD17ZGF0YXNldC5zdHJva2VEYXNoT2Zmc2V0fVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgZ2V0QmV6aWVyTGluZVBvaW50cyA9IChcbiAgICBkYXRhc2V0OiBEYXRhc2V0LFxuICAgIHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgcGFkZGluZ1RvcCxcbiAgICAgIGRhdGFcbiAgICB9OiBQaWNrPFxuICAgICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICAgIFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCIgfCBcImRhdGFcIlxuICAgID5cbiAgKSA9PiB7XG4gICAgaWYgKGRhdGFzZXQuZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBcIk0wLDBcIjtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YSk7XG5cbiAgICBjb25zdCBuZXh0aSA9IChpOiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiaWdub3JlVmFsdWUgPSBcIiArIGRhdGFzZXQuaWdub3JlVmFsdWUpO1xuICAgICAgZm9yICh2YXIgaiA9IGk7IGogPCBkYXRhc2V0LmRhdGEubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKGRhdGFzZXQuaWdub3JlVmFsdWUgIT0gZGF0YXNldC5kYXRhW2pdKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJpZ25vcmVWYWx1ZSA9IFwiICsgZGF0YXNldC5kYXRhW2pdKTtcbiAgICAgICAgICByZXR1cm4gajtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGk7XG4gICAgfTtcblxuICAgIGNvbnN0IHggPSAoaTogbnVtYmVyKSA9PiB7XG4gICAgICB2YXIgaiA9IG5leHRpKGkpO1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoXG4gICAgICAgIHBhZGRpbmdSaWdodCArIChqICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhc2V0LmRhdGEubGVuZ3RoXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gdGhpcy5jYWxjQmFzZUhlaWdodChkYXRhcywgaGVpZ2h0KTtcblxuICAgIGNvbnN0IHkgPSAoaTogbnVtYmVyKSA9PiB7XG4gICAgICB2YXIgaiA9IG5leHRpKGkpO1xuICAgICAgY29uc3QgeUhlaWdodCA9IHRoaXMuY2FsY0hlaWdodChkYXRhc2V0LmRhdGFbal0sIGRhdGFzLCBoZWlnaHQpO1xuXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigoKGJhc2VIZWlnaHQgLSB5SGVpZ2h0KSAvIDQpICogMyArIHBhZGRpbmdUb3ApO1xuICAgIH07XG5cbiAgICByZXR1cm4gW2BNJHt4KDApfSwke3koMCl9YF1cbiAgICAgIC5jb25jYXQoXG4gICAgICAgIGRhdGFzZXQuZGF0YS5zbGljZSgwLCAtMSkubWFwKChfLCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgeF9taWQgPSAoeChpKSArIHgoaSArIDEpKSAvIDI7XG4gICAgICAgICAgY29uc3QgeV9taWQgPSAoeShpKSArIHkoaSArIDEpKSAvIDI7XG4gICAgICAgICAgY29uc3QgY3BfeDEgPSAoeF9taWQgKyB4KGkpKSAvIDI7XG4gICAgICAgICAgY29uc3QgY3BfeDIgPSAoeF9taWQgKyB4KGkgKyAxKSkgLyAyO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBgUSAke2NwX3gxfSwgJHt5KGkpfSwgJHt4X21pZH0sICR7eV9taWR9YCArXG4gICAgICAgICAgICBgIFEgJHtjcF94Mn0sICR7eShpICsgMSl9LCAke3goaSArIDEpfSwgJHt5KGkgKyAxKX1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5qb2luKFwiIFwiKTtcbiAgfTtcblxuICByZW5kZXJCZXppZXJMaW5lID0gKHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgcGFkZGluZ1RvcFxuICB9OiBQaWNrPFxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXG4gICAgXCJkYXRhXCIgfCBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiXG4gID4pID0+IHtcbiAgICByZXR1cm4gZGF0YS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmdldEJlemllckxpbmVQb2ludHMoZGF0YXNldCwge1xuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICBwYWRkaW5nUmlnaHQsXG4gICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgIGRhdGFcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UGF0aFxuICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgZD17cmVzdWx0fVxuICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICBzdHJva2U9e3RoaXMuZ2V0Q29sb3IoZGF0YXNldCwgMC4yKX1cbiAgICAgICAgICBzdHJva2VXaWR0aD17dGhpcy5nZXRTdHJva2VXaWR0aChkYXRhc2V0KX1cbiAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9e2RhdGFzZXQuc3Ryb2tlRGFzaEFycmF5fVxuICAgICAgICAgIHN0cm9rZURhc2hvZmZzZXQ9e2RhdGFzZXQuc3Ryb2tlRGFzaE9mZnNldH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVyQmV6aWVyU2hhZG93ID0gKHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1JpZ2h0LFxuICAgIHBhZGRpbmdUb3AsXG4gICAgZGF0YSxcbiAgICB1c2VDb2xvckZyb21EYXRhc2V0XG4gIH06IFBpY2s8XG4gICAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgICBcImRhdGFcIiB8IFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcbiAgPiAmIHtcbiAgICB1c2VDb2xvckZyb21EYXRhc2V0OiBBYnN0cmFjdENoYXJ0Q29uZmlnW1widXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldFwiXTtcbiAgfSkgPT5cbiAgICBkYXRhLm1hcCgoZGF0YXNldCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGQgPVxuICAgICAgICB0aGlzLmdldEJlemllckxpbmVQb2ludHMoZGF0YXNldCwge1xuICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICBwYWRkaW5nUmlnaHQsXG4gICAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgICBkYXRhXG4gICAgICAgIH0pICtcbiAgICAgICAgYCBMJHtwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgICgod2lkdGggLSBwYWRkaW5nUmlnaHQpIC8gZGF0YXNldC5kYXRhLmxlbmd0aCkgKlxuICAgICAgICAgICAgKGRhdGFzZXQuZGF0YS5sZW5ndGggLSAxKX0sJHsoaGVpZ2h0IC8gNCkgKiAzICtcbiAgICAgICAgICBwYWRkaW5nVG9wfSBMJHtwYWRkaW5nUmlnaHR9LCR7KGhlaWdodCAvIDQpICogMyArIHBhZGRpbmdUb3B9IFpgO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UGF0aFxuICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgZD17ZH1cbiAgICAgICAgICBmaWxsPXtgdXJsKCNmaWxsU2hhZG93R3JhZGllbnQke1xuICAgICAgICAgICAgdXNlQ29sb3JGcm9tRGF0YXNldCA/IGBfJHtpbmRleH1gIDogXCJcIlxuICAgICAgICAgIH0pYH1cbiAgICAgICAgICBzdHJva2VXaWR0aD17MH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgcmVuZGVyTGVnZW5kID0gKHdpZHRoLCBsZWdlbmRPZmZzZXQpID0+IHtcbiAgICBjb25zdCB7IGxlZ2VuZCwgZGF0YXNldHMgfSA9IHRoaXMucHJvcHMuZGF0YTtcbiAgICBjb25zdCBiYXNlTGVnZW5kSXRlbVggPSB3aWR0aCAvIChsZWdlbmQubGVuZ3RoICsgMSk7XG5cbiAgICByZXR1cm4gbGVnZW5kLm1hcCgobGVnZW5kSXRlbSwgaSkgPT4gKFxuICAgICAgPEcga2V5PXtNYXRoLnJhbmRvbSgpfT5cbiAgICAgICAgPExlZ2VuZEl0ZW1cbiAgICAgICAgICBpbmRleD17aX1cbiAgICAgICAgICBpY29uQ29sb3I9e3RoaXMuZ2V0Q29sb3IoZGF0YXNldHNbaV0sIDAuOSl9XG4gICAgICAgICAgYmFzZUxlZ2VuZEl0ZW1YPXtiYXNlTGVnZW5kSXRlbVh9XG4gICAgICAgICAgbGVnZW5kVGV4dD17bGVnZW5kSXRlbX1cbiAgICAgICAgICBsYWJlbFByb3BzPXt7IC4uLnRoaXMuZ2V0UHJvcHNGb3JMYWJlbHMoKSB9fVxuICAgICAgICAgIGxlZ2VuZE9mZnNldD17bGVnZW5kT2Zmc2V0fVxuICAgICAgICAvPlxuICAgICAgPC9HPlxuICAgICkpO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIGRhdGEsXG4gICAgICB3aXRoU2Nyb2xsYWJsZURvdCA9IGZhbHNlLFxuICAgICAgd2l0aFNoYWRvdyA9IHRydWUsXG4gICAgICB3aXRoRG90cyA9IHRydWUsXG4gICAgICB3aXRoSW5uZXJMaW5lcyA9IHRydWUsXG4gICAgICB3aXRoT3V0ZXJMaW5lcyA9IHRydWUsXG4gICAgICB3aXRoSG9yaXpvbnRhbExpbmVzID0gdHJ1ZSxcbiAgICAgIHdpdGhWZXJ0aWNhbExpbmVzID0gdHJ1ZSxcbiAgICAgIHdpdGhIb3Jpem9udGFsTGFiZWxzID0gdHJ1ZSxcbiAgICAgIHdpdGhWZXJ0aWNhbExhYmVscyA9IHRydWUsXG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgZGVjb3JhdG9yLFxuICAgICAgb25EYXRhUG9pbnRDbGljayxcbiAgICAgIHZlcnRpY2FsTGFiZWxSb3RhdGlvbiA9IDAsXG4gICAgICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbiA9IDAsXG4gICAgICBmb3JtYXRZTGFiZWwgPSB5TGFiZWwgPT4geUxhYmVsLFxuICAgICAgZm9ybWF0WExhYmVsID0geExhYmVsID0+IHhMYWJlbCxcbiAgICAgIHNlZ21lbnRzLFxuICAgICAgdHJhbnNwYXJlbnQgPSBmYWxzZSxcbiAgICAgIGNoYXJ0Q29uZmlnXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCB7IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHsgbGFiZWxzID0gW10gfSA9IGRhdGE7XG4gICAgY29uc3Qge1xuICAgICAgYm9yZGVyUmFkaXVzID0gMCxcbiAgICAgIHBhZGRpbmdUb3AgPSAxNixcbiAgICAgIHBhZGRpbmdSaWdodCA9IDY0LFxuICAgICAgbWFyZ2luID0gMCxcbiAgICAgIG1hcmdpblJpZ2h0ID0gMCxcbiAgICAgIHBhZGRpbmdCb3R0b20gPSAwXG4gICAgfSA9IHN0eWxlO1xuXG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICB2ZXJ0aWNhbExhYmVsUm90YXRpb24sXG4gICAgICBob3Jpem9udGFsTGFiZWxSb3RhdGlvblxuICAgIH07XG5cbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YS5kYXRhc2V0cyk7XG5cbiAgICBsZXQgY291bnQgPSBNYXRoLm1pbiguLi5kYXRhcykgPT09IE1hdGgubWF4KC4uLmRhdGFzKSA/IDEgOiA0O1xuICAgIGlmIChzZWdtZW50cykge1xuICAgICAgY291bnQgPSBzZWdtZW50cztcbiAgICB9XG5cbiAgICBjb25zdCBsZWdlbmRPZmZzZXQgPSB0aGlzLnByb3BzLmRhdGEubGVnZW5kID8gaGVpZ2h0ICogMC4xNSA6IDA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFZpZXcgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgPFN2Z1xuICAgICAgICAgIGhlaWdodD17aGVpZ2h0ICsgKHBhZGRpbmdCb3R0b20gYXMgbnVtYmVyKSArIGxlZ2VuZE9mZnNldH1cbiAgICAgICAgICB3aWR0aD17d2lkdGggLSAobWFyZ2luIGFzIG51bWJlcikgKiAyIC0gKG1hcmdpblJpZ2h0IGFzIG51bWJlcil9XG4gICAgICAgID5cbiAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0ICsgbGVnZW5kT2Zmc2V0fVxuICAgICAgICAgICAgcng9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIHJ5PXtib3JkZXJSYWRpdXN9XG4gICAgICAgICAgICBmaWxsPVwidXJsKCNiYWNrZ3JvdW5kR3JhZGllbnQpXCJcbiAgICAgICAgICAgIGZpbGxPcGFjaXR5PXt0cmFuc3BhcmVudCA/IDAgOiAxfVxuICAgICAgICAgIC8+XG4gICAgICAgICAge3RoaXMucHJvcHMuZGF0YS5sZWdlbmQgJiZcbiAgICAgICAgICAgIHRoaXMucmVuZGVyTGVnZW5kKGNvbmZpZy53aWR0aCwgbGVnZW5kT2Zmc2V0KX1cbiAgICAgICAgICA8RyB4PVwiMFwiIHk9e2xlZ2VuZE9mZnNldH0+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJEZWZzKHtcbiAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAuLi5jaGFydENvbmZpZyxcbiAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0c1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3dpdGhIb3Jpem9udGFsTGluZXMgJiZcbiAgICAgICAgICAgICAgICAod2l0aElubmVyTGluZXNcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJIb3Jpem9udGFsTGluZXMoe1xuICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIDogd2l0aE91dGVyTGluZXNcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJIb3Jpem9udGFsTGluZSh7XG4gICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3AsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICA6IG51bGwpfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoSG9yaXpvbnRhbExhYmVscyAmJlxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVySG9yaXpvbnRhbExhYmVscyh7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhcyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgZm9ybWF0WUxhYmVsLFxuICAgICAgICAgICAgICAgICAgZGVjaW1hbFBsYWNlczogY2hhcnRDb25maWcuZGVjaW1hbFBsYWNlc1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoVmVydGljYWxMaW5lcyAmJlxuICAgICAgICAgICAgICAgICh3aXRoSW5uZXJMaW5lc1xuICAgICAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlclZlcnRpY2FsTGluZXMoe1xuICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzWzBdLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICA6IHdpdGhPdXRlckxpbmVzXG4gICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVyVmVydGljYWxMaW5lKHtcbiAgICAgICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICA6IG51bGwpfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoVmVydGljYWxMYWJlbHMgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclZlcnRpY2FsTGFiZWxzKHtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgIGxhYmVscyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgZm9ybWF0WExhYmVsXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyTGluZSh7XG4gICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgIC4uLmNoYXJ0Q29uZmlnLFxuICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzXG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoU2hhZG93ICYmXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJTaGFkb3coe1xuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0cyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgdXNlQ29sb3JGcm9tRGF0YXNldDogY2hhcnRDb25maWcudXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldFxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgICAgPEc+XG4gICAgICAgICAgICAgIHt3aXRoRG90cyAmJlxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRG90cyh7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICBvbkRhdGFQb2ludENsaWNrXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge3dpdGhTY3JvbGxhYmxlRG90ICYmXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJTY3JvbGxhYmxlRG90KHtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgIC4uLmNoYXJ0Q29uZmlnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0cyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgb25EYXRhUG9pbnRDbGljayxcbiAgICAgICAgICAgICAgICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L0c+XG4gICAgICAgICAgICA8Rz5cbiAgICAgICAgICAgICAge2RlY29yYXRvciAmJlxuICAgICAgICAgICAgICAgIGRlY29yYXRvcih7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodFxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9HPlxuICAgICAgICAgIDwvRz5cbiAgICAgICAgPC9Tdmc+XG4gICAgICAgIHt3aXRoU2Nyb2xsYWJsZURvdCAmJiAoXG4gICAgICAgICAgPFNjcm9sbFZpZXdcbiAgICAgICAgICAgIHN0eWxlPXtTdHlsZVNoZWV0LmFic29sdXRlRmlsbH1cbiAgICAgICAgICAgIGNvbnRlbnRDb250YWluZXJTdHlsZT17eyB3aWR0aDogd2lkdGggKiAyIH19XG4gICAgICAgICAgICBzaG93c0hvcml6b250YWxTY3JvbGxJbmRpY2F0b3I9e2ZhbHNlfVxuICAgICAgICAgICAgc2Nyb2xsRXZlbnRUaHJvdHRsZT17MTZ9XG4gICAgICAgICAgICBvblNjcm9sbD17QW5pbWF0ZWQuZXZlbnQoW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmF0aXZlRXZlbnQ6IHtcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnRPZmZzZXQ6IHsgeDogc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSl9XG4gICAgICAgICAgICBob3Jpem9udGFsXG4gICAgICAgICAgICBib3VuY2VzPXtmYWxzZX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGluZUNoYXJ0O1xuIl19

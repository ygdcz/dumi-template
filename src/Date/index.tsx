import React, { useRef, useEffect } from 'react';
import * as ECharts from 'echarts/core';
import { init, getInstanceByDom } from 'echarts';
import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
// 按需引入
ECharts.use([GaugeChart, CanvasRenderer]);
import { clockOption } from './option';

const Clock = () => {
  const clock = useRef(null);
  let walk: NodeJS.Timer;

  useEffect(() => {
    if (clock.current) {
      const instance = init(clock.current, 'light', {
        width: 500,
        height: 500,
      });
      instance.setOption(clockOption);
      // 时钟运作
      walk = setInterval(function() {
        const date = new Date();
        const second = date.getSeconds();
        const minute = date.getMinutes() + second / 60;
        const hour = (date.getHours() % 12) + minute / 60;
        clockOption.animationDurationUpdate = 300;
        const instance = getInstanceByDom(
          (clock.current as unknown) as HTMLDivElement,
        )!;
        instance.setOption({
          series: [
            {
              name: 'hour',
              animation: hour !== 0,
              data: [{ value: hour }],
            },
            {
              name: 'minute',
              animation: minute !== 0,
              data: [{ value: minute }],
            },
            {
              animation: second !== 0,
              name: 'second',
              data: [{ value: second }],
            },
          ],
        });
      }, 1000);
    }

    return () => {
      clearInterval(walk);
    };
  }, []);

  return <div id="clock" ref={clock}></div>;
};

export default Clock;

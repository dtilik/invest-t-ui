import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export function PriceChart({ data, title = "Price Chart", height = 300 }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartContainerRef.current && data?.length) {
      // Clear previous chart if it exists
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }

      // Create a new chart
      const chart = createChart(chartContainerRef.current, {
        height,
        layout: {
          background: { color: 'transparent' },
          textColor: '#D9D9D9',
        },
        grid: {
          vertLines: { color: 'rgba(42, 46, 57, 0.6)' },
          horzLines: { color: 'rgba(42, 46, 57, 0.6)' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: 'rgba(197, 203, 206, 0.8)',
        },
        handleScroll: {
          vertTouchDrag: false,
        },
      });

      // Add candlestick series
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });

      // Format data for the chart
      const formattedData = data.map(item => ({
        time: typeof item.time === 'string' ? item.time : new Date(item.time).toISOString().split('T')[0],
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      candlestickSeries.setData(formattedData);

      // Add volume series as histogram
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      const volumeData = data.map(item => ({
        time: typeof item.time === 'string' ? item.time : new Date(item.time).toISOString().split('T')[0],
        value: item.volume,
        color: item.close >= item.open ? '#22c55e' : '#ef4444',
      }));

      volumeSeries.setData(volumeData);

      // Fit content to container
      chart.timeScale().fitContent();

      // Save chart reference
      chartRef.current = chart;

      // Clean up on unmount
      return () => {
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    }
  }, [data, height]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {data?.length ? (
            <div ref={chartContainerRef} />
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              No price data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

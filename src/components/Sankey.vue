<template>
    <div ref="sankeyChart"></div>
  </template>
  
  <script lang="ts">
  import * as d3 from "d3";
  import { sankey, sankeyLinkHorizontal } from "d3-sankey";
  import axios from 'axios';
  import { isEmpty, debounce } from 'lodash';
  import { Graph, ComponentSize, Margin } from '../types';
  
  export default {
    name: 'SankeyChart',
    data() {
      return {
        rawData: [],
        sankeyData: { nodes: [], links: [] }
      };
    },
    async mounted() {
      await this.loadAndTransformData();
      this.createSankeyChart();
    },
    methods: {
      async loadAndTransformData() {
        try {
          const response = await d3.csv('src/data/vgsales.csv');
          this.rawData = response;
          this.sankeyData = this.transformDataForSankey(this.rawData);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      },
      transformDataForSankey(rawData) {
        const publishersSet = new Set();
        const platformsSet = new Set();
        const genresSet = new Set();
  
        rawData.forEach(row => {
          publishersSet.add(row.Publisher);
          platformsSet.add(row.Platform);
          genresSet.add(row.Genre);
        });
  
        const publishers = Array.from(publishersSet);
        const platforms = Array.from(platformsSet);
        const genres = Array.from(genresSet);
        const nodes = [...publishers, ...platforms, ...genres].map(name => ({ name }));
  
        const findNodeIndex = (name, category) => {
          if (publishers.includes(name)) {
            return publishers.indexOf(name);
          } else if (platforms.includes(name)) {
            return publishers.length + platforms.indexOf(name);
          } else {
            return publishers.length + platforms.length + genres.indexOf(name);
          }
        };
  
        const links = [];
        rawData.forEach(row => {
          const sourceIndex = findNodeIndex(row.Publisher, 'Publisher');
          const targetIndex = findNodeIndex(row.Platform, 'Platform');
          const genreIndex = findNodeIndex(row.Genre, 'Genre');
  
          links.push({
            source: sourceIndex,
            target: genreIndex,
            value: +row.Global_Sales
          });
  
          links.push({
            source: genreIndex,
            target: targetIndex,
            value: +row.Global_Sales
          });
        });
  
        return { nodes, links };
      },
      createSankeyChart() {
        const width = 960;
        const height = 600;
  
        const sankeyGenerator = sankey()
          .nodeWidth(15)
          .nodePadding(10)
          .extent([[1, 1], [width - 1, height - 5]]);
  
        const { nodes, links } = sankeyGenerator(this.sankeyData);
  
        const svg = d3.select(this.$refs.sankeyChart)
          .append("svg")
          .attr("width", width)
          .attr("height", height);
  
        svg.append("g")
          .selectAll("path")
          .data(links)
          .join("path")
          .attr("d", sankeyLinkHorizontal())
          .style("fill", "none")
          .style("stroke-opacity", 0.5)
          .style("stroke", d => d.source.color)
          .style("stroke-width", d => Math.max(1, d.width));
  
        svg.append("g")
          .selectAll("rect")
          .data(nodes)
          .join("rect")
          .attr("x", d => d.x0)
          .attr("y", d => d.y0)
          .attr("height", d => d.y1 - d.y0)
          .attr("width", d => d.x1 - d.x0)
          .style("fill", d => d.color)
          .style("stroke", "black");
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add CSS styles for your Sankey chart here */
  </style>
  
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
// import * as d3 from 'd3';
// import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { GameData, SankeyNode, SankeyLink } from '../types'; // Import the types

export default defineComponent({
  name: 'SankeyChart',
  props: {
    gamesData: Array as PropType<GameData[]>
  },
  setup(props) {
    const sankeyData = ref<{ nodes: SankeyNode[], links: SankeyLink[] } | null>(null);

    const processDataForSankey = (gamesData: GameData[]): { nodes: SankeyNode[], links: SankeyLink[] } => {
      let nodes: SankeyNode[] = [];
      let links: SankeyLink[] = [];

      // First, create nodes for each unique genre and region
      let genres = new Set(gamesData.map(game => game.Genre));
      let regions = ['NA_Sales', 'EU_Sales', 'JP_Sales', 'Other_Sales'];

      genres.forEach(genre => nodes.push({ name: genre }));
      regions.forEach(region => nodes.push({ name: region }));

      // Now create links
      gamesData.forEach(game => {
        regions.forEach(region => {
          const sourceIndex = nodes.findIndex(node => node.name === game.Genre);
          const targetIndex = nodes.findIndex(node => node.name === region);
          const value = parseFloat(game[region as keyof GameData]);

          if (sourceIndex !== -1 && targetIndex !== -1 && !isNaN(value) && value > 0) {
            links.push({
              source: sourceIndex,
              target: targetIndex,
              value: value
            });
          }
        });
      });

      return { nodes, links };
    };

    
      if (props.gamesData) {
        sankeyData.value = processDataForSankey(props.gamesData);
        console.log(sankeyData.value);
      }
  

    return {
      sankeyData
    };
  }
});
</script>

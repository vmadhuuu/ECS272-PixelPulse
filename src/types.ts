// Types for your game data and Sankey nodes/links

export type GameData = {
  Rank: string;
  Name: string;
  Platform: string;
  Year: string;
  Genre: string;
  Publisher: string;
  NA_Sales: string;
  EU_Sales: string;
  JP_Sales: string;
  Other_Sales: string;
  Global_Sales: string;
};

export type SankeyNode = {
  name: string;
};

export type SankeyLink = {
  source: number;
  target: number;
  value: number;
};

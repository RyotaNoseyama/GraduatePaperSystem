import websiteComponents from "./website-components.json";

export type WebsiteComponentEntry = {
  page: string;
  components: string[];
};

export default websiteComponents as WebsiteComponentEntry[];

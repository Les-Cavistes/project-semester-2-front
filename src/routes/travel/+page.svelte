<script lang="ts">
import TravelMapOSM from "$lib/components/TravelMapOSM.svelte";
import type { PageProps } from "./$types";

// Get data from the `+page.ts` file
const { data }: PageProps = $props();
</script>

<div class="travel-page">
  <header>
    <h1>Travel Route Visualization</h1>
    <p>Visualizing a tour through Paris landmarks</p>
  </header>
  
  <div class="map-container">
    <TravelMapOSM
        travelRoute={data.travelRoute}
    />
  </div>
  </div>

<style>
  .travel-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #333;
  }
  
  .map-container {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
  }
</style>
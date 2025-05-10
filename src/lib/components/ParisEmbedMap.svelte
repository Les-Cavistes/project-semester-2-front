<!-- ParisEmbedMap.svelte -->
<script lang="ts">
// Props
export const height = "450px";
export const width = "100%";
export const zoom = 13;
export const mapMode = "place";
export const query = "Paris,France";
export const mapType = "roadmap"; // Changed from let to const

let embedUrl: string;

$: {
  // Retrieve the API key from environment variables
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API key is missing. Check your .env file");
  }

  // Build the URL based on the selected mode
  switch (mapMode) {
    default:
      embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}&zoom=${zoom}&maptype=${mapType}`;
  }
}
</script>

<div class="map-container" style="width: {width}; height: {height};">
  {#if embedUrl}
    <iframe
      width="100%"
      height="100%"
      frameborder="0"
      style="border:0"
      referrerpolicy="no-referrer-when-downgrade"
      src={embedUrl}
      allowfullscreen
      loading="lazy"
      title="Google Maps Embed"
    ></iframe>
  {:else}
    <div class="error-message">
      <p>Incomplete map configuration. Please check your API key.</p>
    </div>
  {/if}
</div>

<style>
  .map-container {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .error-message {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #f8f8f8;
    color: #d32f2f;
    font-size: 14px;
    text-align: center;
  }
</style>
<script>
import TravelMapOSM from "$lib/components/TravelMapOSM.svelte";

// Example travel route through Paris landmarks
const customRoute = [
  { lat: 48.8584, lng: 2.2945, name: "Tour Eiffel" },
  { lat: 48.8738, lng: 2.295, name: "Arc de Triomphe" },
  { lat: 48.8715, lng: 2.3332, name: "Opéra Garnier" },
  { lat: 48.8606, lng: 2.3376, name: "Musée du Louvre" },
  { lat: 48.8599, lng: 2.3442, name: "Centre Pompidou" },
  { lat: 48.853, lng: 2.3499, name: "Notre-Dame" },
];
</script>

<div class="travel-page">
  <header>
    <h1>Travel Route Visualization</h1>
    <p>Visualizing a tour through Paris landmarks</p>
  </header>
  
  <div class="map-container">
      <TravelMapOSM travelRoute={customRoute} height="500px" />
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
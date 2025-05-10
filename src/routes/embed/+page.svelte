<script>
import ParisEmbedMap from "$lib/components/ParisEmbedMap.svelte";
</script>

<div class="embed-page">
  <header>
    <h1>Paris - Carte Gratuite</h1>
    <p class="subtitle">Utilisant l'API Google Maps Embed (sans frais)</p>
  </header>

  <section class="map-examples">
    <div class="map-example">
      <h2>Vue générale de Paris</h2>
      <ParisEmbedMap 
        height="450px" 
        query="Paris,France" 
        zoom={13} 
        mapType="roadmap"
      />
    </div>

  <div class="info-panel">
    <h3>Avantages de l'API Embed</h3>
    <ul>
      <li><strong>Gratuite</strong> - Utilisation illimitée sans coût</li>
      <li><strong>Simple</strong> - Aucun JavaScript complexe requis</li>
      <li><strong>Performante</strong> - Charge rapidement sur tous les appareils</li>
      <li><strong>Responsive</strong> - S'adapte aux différentes tailles d'écran</li>
    </ul>
  </div>
</div>

<style>
  .embed-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  header {
    margin-bottom: 30px;
    text-align: center;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 5px;
    color: #333;
    font-weight: 300;
  }
  
  .subtitle {
    font-size: 1.1rem;
    color: #666;
    margin-top: 0;
  }
  
  .map-examples {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 30px;
    margin-bottom: 30px;
  }
  
  .map-example h2 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.3rem;
    color: #1a73e8;
  }
  
  .info-panel {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-top: 20px;
  }
  
  .info-panel h3 {
    margin-top: 0;
    color: #333;
  }
  
  .info-panel ul {
    padding-left: 20px;
  }
  
  .info-panel li {
    margin-bottom: 10px;
  }
  
  @media (max-width: 768px) {
    .map-examples {
      grid-template-columns: 1fr;
    }
  }
</style>
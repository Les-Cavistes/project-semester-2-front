<script>
import SimpleParisMap from "$lib/components/SimpleParisMap.svelte";
</script>

<div class="openmap-page">
  <h1>Carte de Paris avec OpenStreetMap</h1>
  <p>Une solution entièrement gratuite et open source qui ne nécessite pas de clé API</p>
  
  <div class="map-container">
    <SimpleParisMap height="400px" markerTitle="Paris" />
  </div>
  
  <div class="info-box">
    <h2>Avantages d'OpenStreetMap</h2>
    <ul>
      <li><strong>Gratuit</strong> - Aucun coût ou restriction d'utilisation</li>
      <li><strong>Open source</strong> - Données cartographiques libres et communautaires</li>
      <li><strong>Pas de clé API</strong> - Aucune inscription ou configuration requise</li>
      <li><strong>Contrôle de confidentialité</strong> - Aucune collecte de données utilisateur</li>
      <li><strong>Personnalisable</strong> - Nombreuses options de personnalisation via Leaflet</li>
    </ul>
  </div>
  
  <p class="note">Note: N'oubliez pas d'installer les dépendances requises: <code>npm install leaflet @types/leaflet</code></p>
</div>

<style>
  .openmap-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  h1 {
    color: #333;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    margin-top: 0;
    margin-bottom: 20px;
  }
  
  .map-container {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
  }
  
  .info-box {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .info-box h2 {
    margin-top: 0;
    color: #1e88e5;
    font-size: 1.4rem;
  }
  
  .info-box ul {
    padding-left: 20px;
  }
  
  .info-box li {
    margin-bottom: 10px;
  }
  
  .note {
    background-color: #fff8e1;
    padding: 15px;
    border-radius: 6px;
    border-left: 4px solid #ffc107;
    font-size: 0.9rem;
  }
  
  code {
    background-color: #f1f1f1;
    padding: 2px 5px;
    border-radius: 3px;
    font-family: monospace;
  }
</style>
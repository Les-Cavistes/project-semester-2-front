<script lang="ts">
import { t } from "$lib/translations";
</script>

<div class="home-page">
  <h1>{$t('main.welcome')}</h1>
  
  <h2>Choose Your Map Integration</h2>
  <div class="cards">
    <a href="/embed" class="card">
      <h2>Google Maps</h2>
      <p>Integrate with Google Maps</p>
    </a>
    <a href="/openmap" class="card">
      <h2>OpenStreetMap</h2>
      <p>Integrate with OpenStreetMap</p>
    </a>
    <a href="/travel" class="card">
      <h2>Travel Route</h2>
      <p>Visualize travel routes with OpenStreetMap</p>
    </a>
  </div>
</div>

<style>
  .home-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    text-align: center;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .card {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-decoration: none;
    color: #333;
    background: #f9f9f9;
    transition: background 0.2s;
  }

  .card:hover {
    background: #e9e9e9;
  }

  .card h2 {
    margin: 0 0 5px;
    font-size: 1.2rem;
  }

  .card p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }
</style>
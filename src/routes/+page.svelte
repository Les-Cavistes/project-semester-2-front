<script lang="ts">
import { t } from "$lib/translations";
</script>

<div class="home-page">
  <!-- Header Banner Full Width -->
  <header class="header-banner">
    <h1>Paris GO</h1>
    <p>{$t('main.welcome')}</p>
  </header>

  <!-- Main Content -->
  <div class="container">
    <h2>Choisissez votre intégration cartographique</h2>
    
    <div class="cards">
      <a href="/embed" class="card">
        <h3>🗺️ Google Maps</h3>
        <p>Intégration avec Google Maps</p>
      </a>

      <a href="/openmap" class="card">
        <h3>🌍 OpenStreetMap</h3>
        <p>Cartes libres et communautaires</p>
      </a>

      <a href="/travel" class="card featured">
        <h3>🚀 Travel Route</h3>
        <p>Visualisez vos trajets dans Paris</p>
      </a>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  .home-page {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
  }

  /* Header Banner Full Width */
  .header-banner {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    color: white;
    text-align: center;
    padding: 3rem 1rem;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
  }

  .header-banner h1 {
    font-size: 3rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  .header-banner p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin: 0;
  }

  /* Main Content */
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  h2 {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: #1f2937;
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .card {
    padding: 1.5rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
  }

  .card:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  .card.featured {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #f8faff 0%, #eff6ff 100%);
  }

  .card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .card p {
    margin: 0;
    color: #6b7280;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .header-banner h1 {
      font-size: 2rem;
    }
    
    .container {
      padding: 1rem;
    }
  }
</style>
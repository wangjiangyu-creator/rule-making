const app = document.querySelector('#app');

function route() {
  app.innerHTML = `
    <section class="page-hero">
      <p class="eyebrow">International economic governance</p>
      <h1>Great Powers and Rule-Making</h1>
      <p class="lede">
        A research portal and structured database on how great powers shape rules,
        institutions, and bargaining agendas in the international economic system.
      </p>
      <div class="hero-actions button-row">
        <a class="button button-primary" href="#/topics/digital-trade-ecommerce">
          Open Digital Trade Pilot
        </a>
        <a class="button button-secondary" href="#/database">
          Browse Database
        </a>
      </div>
    </section>
  `;
}

window.addEventListener('hashchange', route);
route();

Hooks.once("preUpdateActor", async (token, changes, options, userId) => {
    const hpChange =  actor.system.attributes.hp.value - changes.system.attributes.hp.value
    console.log(hpChange);
    
    
    let conditions = actor.effects
        .filter(effect => effect.label && !effect.disabled)
        .map(effect => effect.label);
      
    //token took damage
    if(hpChange > 0 && conditions.includes('Concentration')){
        let checkDC = Math.floor(hpChange / 2) > 10 ? Math.floor(hpChange / 2) : 10;
        if(game.user.id === userId)
        {
            createChatCard(token, hpChange, checkDC);
            setButton(actor)
            
        }
            
    }
});
//const actor = canvas.tokens.controlled[0].actor;
//createChatCard(actor, 5, 10);

function setButton(actor){
    //I could get rid of a line of code but it works, okay
    const ownership = actor.ownership;
    const owners = Object.entries(ownership)
    const ownerIds = owners.filter(o => o[1] === 3).map(o => o[0]);
        
    if(ownerIds.includes(game.user.id) ||  game.user.isGM){
        Hooks.once("renderChatMessage", (message, html, data) => {
          html.find(".athena-con-check-prompt").on("click", async (event) => {
           actor.rollSavingThrow("con");
          });
        });
    }
    else{
        Hooks.once("renderChatMessage", (message, html, data) => {
          html.find(".athena-con-check-prompt").on("click", async (event) => {
           ui.notifications.warn("This ain't for you homie");
          });
        });
    }    
}

function createChatCard(actor, damage, checkDC){

    ChatMessage.create({
      user: game.user.id,
      speaker: { alias: "Lil' Reminder" },
      content: `
        <article class="a5e-chat-card__body svelte-18asuq5">
          <header class="a5e-chat-card__body__header a5e-chat-card__body__header--clickable a5e-chat-card__body__header--subtitle" role="button" tabindex="0">
            <img class="a5e-chat-card__body__header__img" src="systems/a5e/assets/icons/concentration.svg" alt="Concentration" style="filter: brightness(0) saturate(70%);">
            <span class="a5e-chat-card__body__header__title-container">
              <h2 class="a5e-chat-card__body__header__title" style="color: black;" >Concentration Check</h2>
              <h3 class="a5e-chat-card__body__header__subtitle">${actor.name} took ${damage} points of damage</h3>
            </span>
          </header>
    
          <hr class="a5e-rule a5e-rule--card">
    
          <section class="prompt-button-wrapper svelte-18asuq5">
            <div style="display: contents;">
              <button class="save-prompt svelte-smxgcg athena-con-check-prompt" value=${actor.id}>
                <div class="icon-wrapper svelte-smxgcg">
                  <i class="die fa-solid fa-dice-d20 svelte-smxgcg" style="filter: brightness(0.7);"></i>
                </div>
                <header class="title-wrapper svelte-smxgcg">
                  <span class="title svelte-smxgcg" style="color: #4b4a44;">Constitution Saving Throw (DC ${checkDC})</span>
                </header>
              </button>
            </div>
          </section>
        </section>
    
          
        </article>
      `
    });
}
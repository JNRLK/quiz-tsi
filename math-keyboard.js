/* ========== MATH KEYBOARD MODULE ========== */

class MathKeyboard {
  constructor(inputElement) {
    this.input = inputElement;
    this.isOpen = false;
    this.currentTab = 'grec';
    
    // Définition des caractères par onglet
    this.chars = {
      grec: {
        label: 'Grec',
        items: ['α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'σ', 'φ', 'ω', 'Δ', 'Σ', 'Π', 'Ω']
      },
      ops: {
        label: 'Opérateurs',
        items: ['+', '−', '×', '÷', '±', '√', '∫', '∑', '∏', '∂', '∞', '!']
      },
      rel: {
        label: 'Relations',
        items: ['=', '≠', '<', '>', '≤', '≥', '≈', '∈', '∉', '⊂', '⊃', '∀', '∃']
      },
      ens: {
        label: 'Ensembles',
        items: ['ℕ', 'ℤ', 'ℚ', 'ℝ', 'ℂ']
      },
      arr: {
        label: 'Flèches',
        items: ['→', '⇒', '⇔', '↦', '←', '⇐']
      },
      tmpl: {
        label: 'Templates',
        items: [
          {text: '^{ }', insert: '^{|}'}, 
          {text: '_{ }', insert: '_{|}'},
          {text: 'frac', insert: '\\frac{|}{}'}, 
          {text: 'sqrt', insert: '\\sqrt{|}'}, 
          {text: 'int', insert: '\\int |d'},
          {text: '|  |', insert: '\\left|\\right|'}
        ]
      }
    };
    
    this.init();
  }
  
  init() {
    // Créer le conteneur du clavier
    const container = document.createElement('div');
    container.style.position = 'relative';
    
    // Bouton toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'math-keyboard-toggle';
    toggleBtn.textContent = '∑';
    toggleBtn.type = 'button';
    toggleBtn.onclick = (e) => { e.preventDefault(); this.toggle(); };
    
    // Conteneur du clavier
    const keyboard = document.createElement('div');
    keyboard.className = 'math-keyboard';
    keyboard.id = 'mathKeyboard';
    
    // Onglets
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'keyboard-tabs';
    
    for (const [key, tab] of Object.entries(this.chars)) {
      const tabBtn = document.createElement('button');
      tabBtn.className = `keyboard-tab ${key === this.currentTab ? 'active' : ''}`;
      tabBtn.textContent = tab.label;
      tabBtn.type = 'button';
      tabBtn.onclick = (e) => { e.preventDefault(); this.switchTab(key); };
      tabsContainer.appendChild(tabBtn);
    }
    
    keyboard.appendChild(tabsContainer);
    
    // Contenu des onglets
    for (const [key, tab] of Object.entries(this.chars)) {
      const content = document.createElement('div');
      content.className = `keyboard-content ${key === this.currentTab ? 'active' : ''}`;
      content.id = `kb-${key}`;
      
      for (const item of tab.items) {
        const btn = document.createElement('button');
        btn.className = `keyboard-btn ${typeof item === 'object' ? 'template' : ''}`;
        btn.type = 'button';
        
        if (typeof item === 'object') {
          btn.textContent = item.text;
          btn.onclick = (e) => { e.preventDefault(); this.insert(item.insert); };
        } else {
          btn.textContent = item;
          btn.onclick = (e) => { e.preventDefault(); this.insert(item); };
        }
        
        content.appendChild(btn);
      }
      
      keyboard.appendChild(content);
    }
    
    // Insérer dans le DOM
    const inputWrapper = this.input.parentElement;
    inputWrapper.style.position = 'relative';
    inputWrapper.appendChild(toggleBtn);
    inputWrapper.appendChild(keyboard);
    
    this.toggleBtn = toggleBtn;
    this.keyboard = keyboard;
  }
  
  toggle() {
    this.isOpen = !this.isOpen;
    this.keyboard.classList.toggle('active', this.isOpen);
    this.toggleBtn.classList.toggle('active', this.isOpen);
    if (this.isOpen) {
      setTimeout(() => this.input.focus(), 100);
    }
  }
  
  switchTab(key) {
    // Désactiver ancien onglet
    document.getElementById(`kb-${this.currentTab}`).classList.remove('active');
    document.querySelectorAll('.keyboard-tab').forEach((t, i) => {
      if (Object.keys(this.chars)[i] === this.currentTab) t.classList.remove('active');
    });
    
    // Activer nouveau
    this.currentTab = key;
    document.getElementById(`kb-${key}`).classList.add('active');
    document.querySelectorAll('.keyboard-tab').forEach((t, i) => {
      if (Object.keys(this.chars)[i] === key) t.classList.add('active');
    });
  }
  
  insert(text) {
    const input = this.input;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const value = input.value;
    
    // Gérer le template avec cursor (|)
    if (text.includes('|')) {
      const parts = text.split('|');
      const newText = value.slice(0, start) + parts[0] + parts[1] + value.slice(end);
      input.value = newText;
      input.setSelectionRange(start + parts[0].length, start + parts[0].length);
    } else {
      input.value = value.slice(0, start) + text + value.slice(end);
      input.setSelectionRange(start + text.length, start + text.length);
    }
    
    input.focus();
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

// Initialiser le clavier quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  // L'initialisation sera faite lors du rendu de renderTyped()
});

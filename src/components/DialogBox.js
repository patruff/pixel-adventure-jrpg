import * as PIXI from 'pixi.js';

export class DialogBox extends PIXI.Container {
  constructor(options = {}) {
    super();
    
    this.options = Object.assign({
      width: 256,
      height: 64,
      padding: 8,
      background: 0x000066,
      backgroundAlpha: 0.8,
      borderColor: 0xFFFFFF,
      borderWidth: 2,
      borderRadius: 8,
      textStyle: {
        fontFamily: 'Arial',
        fontSize: 12,
        fill: 'white',
        wordWrap: true,
      },
      nameStyle: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold',
        fill: 'white',
      },
      portrait: null,
      portraitSize: 48,
      speaker: '',
      text: '',
      onComplete: null,
      autoClose: true,
    }, options);
    
    this.visible = false;
    this.currentPage = 0;
    this.pages = [];
    this.textSpeed = 2;
    this.textIndex = 0;
    this.isTyping = false;
    this.isWaitingForInput = false;
    
    this.init();
  }
  
  init() {
    // Create background
    this.background = new PIXI.Graphics();
    this.background.alpha = this.options.backgroundAlpha;
    this.addChild(this.background);
    
    // Create text container
    this.textContainer = new PIXI.Container();
    this.addChild(this.textContainer);
    
    // Create portrait area
    if (this.options.portrait) {
      this.portrait = new PIXI.Sprite(this.options.portrait);
      this.portrait.width = this.options.portraitSize;
      this.portrait.height = this.options.portraitSize;
      this.portrait.x = this.options.padding;
      this.portrait.y = this.options.padding;
      this.addChild(this.portrait);
    }
    
    // Create name text
    this.nameText = new PIXI.Text('', this.options.nameStyle);
    this.nameText.x = this.options.portrait 
      ? this.options.padding * 2 + this.options.portraitSize 
      : this.options.padding;
    this.nameText.y = this.options.padding;
    this.addChild(this.nameText);
    
    // Create message text
    const textOptions = { ...this.options.textStyle };
    textOptions.wordWrapWidth = this.options.portrait 
      ? this.options.width - (this.options.padding * 3 + this.options.portraitSize)
      : this.options.width - (this.options.padding * 2);
    
    this.messageText = new PIXI.Text('', textOptions);
    this.messageText.x = this.options.portrait 
      ? this.options.padding * 2 + this.options.portraitSize 
      : this.options.padding;
    this.messageText.y = this.options.padding + 20;
    this.addChild(this.messageText);
    
    // Create continue indicator
    this.continueIndicator = new PIXI.Text('▼', {
      fontFamily: 'Arial',
      fontSize: 12,
      fill: 'white',
    });
    this.continueIndicator.x = this.options.width - this.options.padding - this.continueIndicator.width;
    this.continueIndicator.y = this.options.height - this.options.padding - this.continueIndicator.height;
    this.continueIndicator.visible = false;
    this.addChild(this.continueIndicator);
    
    // Redraw background
    this.redrawBackground();
    
    // Setup keyboard input
    this.setupKeyboard();
  }
  
  redrawBackground() {
    this.background.clear();
    this.background.beginFill(this.options.background);
    this.background.lineStyle(this.options.borderWidth, this.options.borderColor);
    this.background.drawRoundedRect(
      0, 
      0, 
      this.options.width, 
      this.options.height, 
      this.options.borderRadius
    );
    this.background.endFill();
  }
  
  setupKeyboard() {
    // Keyboard input for advancing dialog
    this.keyAction = keyboard(' ');
    this.keyAction.press = () => this.handleInput();
    
    this.keyEnter = keyboard('Enter');
    this.keyEnter.press = () => this.handleInput();
  }
  
  handleInput() {
    if (!this.visible) return;
    
    if (this.isTyping) {
      // Fast forward typing
      this.textIndex = this.pages[this.currentPage].length;
      this.messageText.text = this.pages[this.currentPage];
      this.isTyping = false;
      this.isWaitingForInput = true;
      this.continueIndicator.visible = true;
    } else if (this.isWaitingForInput) {
      // Go to next page or close
      if (this.currentPage < this.pages.length - 1) {
        this.currentPage++;
        this.textIndex = 0;
        this.isTyping = true;
        this.isWaitingForInput = false;
        this.continueIndicator.visible = false;
        this.messageText.text = '';
      } else {
        // Dialog complete
        this.close();
        
        if (this.options.onComplete) {
          this.options.onComplete();
        }
      }
    }
  }
  
  setText(text, speaker = '') {
    this.pages = Array.isArray(text) ? text : [text];
    this.currentPage = 0;
    this.textIndex = 0;
    this.isTyping = true;
    this.isWaitingForInput = false;
    this.continueIndicator.visible = false;
    this.messageText.text = '';
    this.nameText.text = speaker;
    
    this.visible = true;
  }
  
  update(delta) {
    if (!this.visible || !this.isTyping) return;
    
    // Update text typing effect
    this.textIndex += this.textSpeed * delta;
    
    if (this.textIndex >= this.pages[this.currentPage].length) {
      this.textIndex = this.pages[this.currentPage].length;
      this.isTyping = false;
      this.isWaitingForInput = true;
      this.continueIndicator.visible = true;
    }
    
    this.messageText.text = this.pages[this.currentPage].substring(0, Math.floor(this.textIndex));
  }
  
  close() {
    this.visible = false;
    this.isTyping = false;
    this.isWaitingForInput = false;
    
    // Call onComplete if set
    if (this.options.onComplete) {
      this.options.onComplete();
    }
  }
  
  destroy() {
    // Remove keyboard listeners
    this.keyAction.unsubscribe();
    this.keyEnter.unsubscribe();
    
    super.destroy({ children: true });
  }
}

// Keyboard helper function
function keyboard(value) {
  const key = {
    value,
    isDown: false,
    isUp: true,
    press: null,
    release: null,
    downHandler: null,
    upHandler: null,
    unsubscribe: null,
  };
  
  // Downhandler
  key.downHandler = (event) => {
    if (event.key === key.value) {
      if (key.isUp && key.press) {
        key.press();
      }
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };
  
  // Uphandler
  key.upHandler = (event) => {
    if (event.key === key.value) {
      if (key.isDown && key.release) {
        key.release();
      }
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };
  
  // Add event listeners
  window.addEventListener('keydown', key.downHandler);
  window.addEventListener('keyup', key.upHandler);
  
  // Unsubscribe function
  key.unsubscribe = () => {
    window.removeEventListener('keydown', key.downHandler);
    window.removeEventListener('keyup', key.upHandler);
  };
  
  return key;
}
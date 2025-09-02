export class LeafSystem {
  private leaves: HTMLElement[] = [];
  private settledLeaves: HTMLElement[] = [];
  private isRunning: boolean = true;
  private leafInterval: NodeJS.Timeout | null = null;
  private leafSpeed: number = 3000; // ms between new leaves

  constructor() {
    this.init();
  }

  private init() {
    this.startLeafGeneration();
  }

  private createLeaf() {
    if (!this.isRunning) return;

    const leaf = document.createElement('div');
    leaf.className = 'floating-leaf rising';
    
    // Random starting position at bottom
    const startX = Math.random() * (window.innerWidth - 20);
    leaf.style.left = startX + 'px';
    leaf.style.bottom = '-20px';
    
    // Random green variations
    const hue = 80 + Math.random() * 40;
    const saturation = 60 + Math.random() * 40;
    const lightness = 40 + Math.random() * 20;
    leaf.style.background = `radial-gradient(ellipse at center, 
      hsl(${hue}, ${saturation}%, ${lightness + 10}%), 
      hsl(${hue}, ${saturation}%, ${lightness}%))`;
    
    // Leaf shape with rounded corners for proper leaf appearance
    leaf.style.borderRadius = '0 100% 0 100%';
    
    // Slightly random size
    const size = 16 + Math.random() * 8;
    leaf.style.width = size + 'px';
    leaf.style.height = size + 'px';
    
    // Ensure leaf is behind content
    leaf.style.zIndex = '-1';
    leaf.style.pointerEvents = 'none';
    
    document.body.appendChild(leaf);
    this.leaves.push(leaf);
    
    // Start collision detection
    this.startCollisionDetection(leaf);
  }

  private startCollisionDetection(leaf: HTMLElement) {
    const checkCollision = () => {
      if (!leaf.parentNode || leaf.classList.contains('settled')) return;
      
      const leafRect = leaf.getBoundingClientRect();
      const leafSize = 20;
      
      // Check collision with settled leaves - only care about leaves above this one
      for (let settledLeaf of this.settledLeaves) {
        const settledRect = settledLeaf.getBoundingClientRect();
        
        // Check if this rising leaf is hitting a settled leaf from below
        if (leafRect.left < settledRect.right &&
            leafRect.right > settledRect.left &&
            leafRect.top <= settledRect.bottom + 2 && // Small buffer
            leafRect.top >= settledRect.bottom - leafSize) {
          
          // Position this leaf just below the blocking leaf
          this.settleLeafBelow(leaf, settledRect.bottom);
          return;
        }
      }
      
      // Check if reached top of screen
      if (leafRect.top <= 0) {
        this.settleLeafAtTop(leaf);
        return;
      }
      
      // Continue checking at next frame
      requestAnimationFrame(checkCollision);
    };
    
    // Start checking immediately
    requestAnimationFrame(checkCollision);
  }

  private settleLeafBelow(leaf: HTMLElement, blockingY: number) {
    if (leaf.classList.contains('settled')) return;
    
    leaf.classList.remove('rising');
    leaf.classList.add('settled');
    
    // Position leaf just below the blocking leaf
    const leafRect = leaf.getBoundingClientRect();
    leaf.style.position = 'fixed';
    leaf.style.top = blockingY + 'px';
    leaf.style.left = leafRect.left + 'px';
    leaf.style.bottom = 'auto';
    leaf.style.animation = 'none';
    leaf.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
    
    // Remove from rising leaves, add to settled
    const index = this.leaves.indexOf(leaf);
    if (index > -1) {
      this.leaves.splice(index, 1);
    }
    this.settledLeaves.push(leaf);
  }

  private settleLeafAtTop(leaf: HTMLElement) {
    if (leaf.classList.contains('settled')) return;
    
    leaf.classList.remove('rising');
    leaf.classList.add('settled');
    
    // Position at top of screen
    const leafRect = leaf.getBoundingClientRect();
    leaf.style.position = 'fixed';
    leaf.style.top = '0px';
    leaf.style.left = leafRect.left + 'px';
    leaf.style.bottom = 'auto';
    leaf.style.animation = 'none';
    leaf.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
    
    // Remove from rising leaves, add to settled
    const index = this.leaves.indexOf(leaf);
    if (index > -1) {
      this.leaves.splice(index, 1);
    }
    this.settledLeaves.push(leaf);
  }

  private startLeafGeneration() {
    if (this.leafInterval) {
      clearInterval(this.leafInterval);
    }
    this.leafInterval = setInterval(() => {
      this.createLeaf();
    }, this.leafSpeed);
  }

  public cleanup() {
    if (this.leafInterval) {
      clearInterval(this.leafInterval);
    }
    
    // Remove all leaves
    [...this.leaves, ...this.settledLeaves].forEach(leaf => {
      leaf.remove();
    });
    
    this.leaves = [];
    this.settledLeaves = [];
  }

  public pause() {
    this.isRunning = false;
    if (this.leafInterval) {
      clearInterval(this.leafInterval);
      this.leafInterval = null;
    }
    
    // Pause all CSS animations by adding paused class
    [...this.leaves].forEach(leaf => {
      leaf.style.animationPlayState = 'paused';
    });
  }

  public resume() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.startLeafGeneration();
    }
    
    // Resume all CSS animations
    [...this.leaves].forEach(leaf => {
      leaf.style.animationPlayState = 'running';
    });
  }
}
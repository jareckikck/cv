class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Swipe {
  constructor(treshhold) {
    this.startPoint;
    this.endPoint;
    this.treshhold = treshhold || 100;
    this.direction;
  }
  getPoint = e => {
    return new Point(e.touches[0].pageX, e.touches[0].pageY);
  };
  startSwipe = e => {
    this.startPoint = this.getPoint(e);
  };
  moveSwipe(e) {
    this.endPoint = this.getPoint(e);
  }
  get swipeDistance() {
    return new Point(
      this.endPoint.x - this.startPoint.x,
      this.endPoint.y - this.startPoint.y
    );
  }
  isSwipedLeft() {
    return this.swipeDistance.x > this.treshhold;
  }
  isSwipedRight() {
    return this.swipeDistance.x < -this.treshhold;
  }
  isSwipedUp() {
    return this.swipeDistance.y > this.treshhold;
  }
  isSwipedDown() {
    return this.swipeDistance.y < -this.treshhold;
  }
}

class Tabs extends Swipe {
  constructor() {
    super(100);
    this.tabContainer = document.getElementById("tab-container");
    this.tabs = [...document.getElementsByClassName("tab")];
    this.tabContents = [...document.getElementsByClassName("tab-content")];
    this.tabContainer.addEventListener("touchstart", e => this.startSwipe(e));
    this.tabContainer.addEventListener("touchmove", e => this.moveSwipe(e));
    this.tabContainer.addEventListener("touchend", () => this.endSwipe());
    this.tabs.forEach(el => {
      el.addEventListener("click", e => this.openTab(e));
    });
    this.currentTabIndex = 0;
    this.maxTabIndex = this.tabContents.length - 1;
    this.lastSwipeDirection;
  }
  endSwipe() {
    let direction;
    if (this.isSwipedLeft() && this.currentTabIndex !== 0) {
      direction = "left";
      this.currentTabIndex--;
    }

    if (this.isSwipedRight() && this.currentTabIndex !== this.maxTabIndex) {
      direction = "right";
      this.currentTabIndex++;
    }

    this.resolveActiveElements(direction);
  }

  resolveActiveElements(direction) {
    if (direction !== undefined) {
      if (this.lastSwipeDirection === direction) {
        this.tabContainer.removeAttribute("swipe-driection", direction);
      }
      this.lastSwipeDirection = direction;
      setTimeout(() => {
        this.tabContainer.setAttribute("swipe-driection", direction);
      }, 50);
    }
    setTimeout(() => {
      this.tabContents.forEach(el => {
        el.classList.remove("tab-content--active");
      });
      this.tabs.forEach(el => {
        el.classList.remove("tab--active");
      });
      this.tabContents[this.currentTabIndex].classList.add(
        "tab-content--active"
      );
    }, 150);
    setTimeout(() => {
      this.tabs[this.currentTabIndex].classList.add("tab--active");
    }, 250);
  }

  openTab(e) {
    const index = Array.from(e.target.parentElement.children).indexOf(e.target);
    if (this.currentTabIndex === index) return;
    let direction = this.currentTabIndex < index ? "right" : "left";
    this.currentTabIndex = index;
    this.resolveActiveElements(direction);
  }
}

window.onload = () => {
  tabs = new Tabs();
};
